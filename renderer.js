class UBCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.memoryIndicator = document.getElementById('memory-indicator');
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
        this.scientificPanel = document.getElementById('scientific-panel');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForNewInput = false;
        this.memory = 0;
        this.calculationHistory = [];
        this.isScientificMode = false;
        this.isHistoryVisible = false;
        
        this.initEventListeners();
        this.updateDisplay();
        this.updateMemoryDisplay();
    }

    initEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.inputNumber(e.target.dataset.number);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.inputOperator(e.target.dataset.operator);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.performAction(e.target.dataset.action);
            });
        });

        // Memory buttons
        document.querySelectorAll('[data-memory]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.memoryOperation(e.target.dataset.memory);
            });
        });

        // Function buttons
        document.querySelectorAll('[data-function]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.performFunction(e.target.dataset.function);
            });
        });

        // Mode toggle
        document.getElementById('mode-btn').addEventListener('click', () => {
            this.toggleScientificMode();
        });

        // History toggle
        document.getElementById('history-btn').addEventListener('click', () => {
            this.toggleHistoryPanel();
        });

        // Close history panel
        document.getElementById('close-history').addEventListener('click', () => {
            this.closeHistoryPanel();
        });

        // Close history when clicking backdrop - Remove this since it's now integrated
        // document.getElementById('history-panel').addEventListener('click', (e) => {
        //     if (e.target.id === 'history-panel') {
        //         this.closeHistoryPanel();
        //     }
        // });

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // History item clicks - Updated to work with new structure
        this.historyList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem && historyItem.dataset.result) {
                const result = historyItem.dataset.result;
                this.currentInput = result;
                this.updateDisplay();
                this.waitingForNewInput = true;
                this.closeHistoryPanel(); // Close history after selection
                
                // Visual feedback
                historyItem.style.background = 'rgba(64, 224, 255, 0.2)';
                setTimeout(() => {
                    historyItem.style.background = '';
                }, 200);
            }
        });

        // IPC listeners for menu actions
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            
            ipcRenderer.on('clear-calculator', () => {
                this.clear();
            });

            ipcRenderer.on('copy-result', () => {
                this.copyResult();
            });

            ipcRenderer.on('paste-value', () => {
                this.pasteValue();
            });

            ipcRenderer.on('toggle-scientific', (event, checked) => {
                this.isScientificMode = checked;
                this.updateScientificMode();
            });
        }

        // Window controls
        const minimizeBtn = document.getElementById('minimize-btn');
        const closeBtn = document.getElementById('close-btn');

        if (minimizeBtn && typeof require !== 'undefined') {
            minimizeBtn.addEventListener('click', async () => {
                const { ipcRenderer } = require('electron');
                await ipcRenderer.invoke('window-minimize');
            });
        }

        if (closeBtn && typeof require !== 'undefined') {
            closeBtn.addEventListener('click', async () => {
                const { ipcRenderer } = require('electron');
                await ipcRenderer.invoke('window-close');
            });
        }
    }

    inputNumber(num) {
        if (num === '.') {
            if (this.currentInput.includes('.')) return;
            if (this.waitingForNewInput) {
                this.currentInput = '0.';
                this.waitingForNewInput = false;
            } else {
                this.currentInput += '.';
            }
        } else {
            if (this.waitingForNewInput) {
                this.currentInput = num;
                this.waitingForNewInput = false;
            } else {
                this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
            }
        }
        this.updateDisplay();
    }

    inputOperator(op) {
        if (op === 'backspace') {
            if (this.currentInput.length > 1) {
                this.currentInput = this.currentInput.slice(0, -1);
            } else {
                this.currentInput = '0';
            }
            this.updateDisplay();
            return;
        }

        if (op === 'negate') {
            this.currentInput = String(-parseFloat(this.currentInput));
            this.updateDisplay();
            return;
        }

        if (this.operator && !this.waitingForNewInput) {
            this.calculate();
        }

        this.operator = op;
        this.previousInput = this.currentInput;
        this.waitingForNewInput = true;
        this.updateHistory();
    }

    performAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'ce':
                this.currentInput = '0';
                this.updateDisplay();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    calculate() {
        if (!this.operator || this.waitingForNewInput) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        try {
            switch (this.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Cannot divide by zero');
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }

            // Handle scientific notation for very large/small numbers
            if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
                result = result.toExponential(10);
            } else {
                result = parseFloat(result.toFixed(10));
            }

            const calculation = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${this.currentInput} = ${result}`;
            this.addToHistory(calculation, result);

            this.currentInput = String(result);
            this.operator = '';
            this.previousInput = '';
            this.waitingForNewInput = true;
            this.updateDisplay();
            this.updateHistory();

        } catch (error) {
            this.currentInput = 'Error';
            this.updateDisplay();
            this.waitingForNewInput = true;
        }
    }

    performFunction(func) {
        const current = parseFloat(this.currentInput);
        let result;

        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(this.toRadians(current));
                    break;
                case 'cos':
                    result = Math.cos(this.toRadians(current));
                    break;
                case 'tan':
                    result = Math.tan(this.toRadians(current));
                    break;
                case 'asin':
                    result = this.toDegrees(Math.asin(current));
                    break;
                case 'acos':
                    result = this.toDegrees(Math.acos(current));
                    break;
                case 'atan':
                    result = this.toDegrees(Math.atan(current));
                    break;
                case 'log':
                    result = Math.log10(current);
                    break;
                case 'ln':
                    result = Math.log(current);
                    break;
                case 'sqrt':
                    result = Math.sqrt(current);
                    break;
                case 'pow':
                    this.operator = '^';
                    this.previousInput = this.currentInput;
                    this.waitingForNewInput = true;
                    this.updateHistory();
                    return;
                case 'exp':
                    result = Math.exp(current);
                    break;
                case 'factorial':
                    result = this.factorial(current);
                    break;
                case 'abs':
                    result = Math.abs(current);
                    break;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                default:
                    return;
            }

            if (func === '^') {
                // Handle power operation
                const base = parseFloat(this.previousInput);
                const exponent = parseFloat(this.currentInput);
                result = Math.pow(base, exponent);
                const calculation = `${this.previousInput}^${this.currentInput} = ${result}`;
                this.addToHistory(calculation, result);
            } else {
                const calculation = `${func}(${current}) = ${result}`;
                this.addToHistory(calculation, result);
            }

            // Handle scientific notation
            if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
                result = result.toExponential(10);
            } else {
                result = parseFloat(result.toFixed(10));
            }

            this.currentInput = String(result);
            this.waitingForNewInput = true;
            this.updateDisplay();

        } catch (error) {
            this.currentInput = 'Error';
            this.updateDisplay();
            this.waitingForNewInput = true;
        }
    }

    memoryOperation(op) {
        const current = parseFloat(this.currentInput);

        switch (op) {
            case 'mc':
                this.memory = 0;
                break;
            case 'mr':
                this.currentInput = String(this.memory);
                this.waitingForNewInput = true;
                this.updateDisplay();
                break;
            case 'ms':
                this.memory = current;
                break;
            case 'mplus':
                this.memory += current;
                break;
            case 'mminus':
                this.memory -= current;
                break;
        }
        this.updateMemoryDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForNewInput = false;
        this.updateDisplay();
        this.updateHistory();
    }

    toggleScientificMode() {
        this.isScientificMode = !this.isScientificMode;
        this.updateScientificMode();
    }

    updateScientificMode() {
        const modeBtn = document.getElementById('mode-btn');
        const calculatorBody = document.getElementById('calculator-body');
        
        console.log('Scientific mode:', this.isScientificMode); // Debug log
        
        if (this.isScientificMode) {
            this.scientificPanel.classList.add('active');
            calculatorBody.classList.add('scientific-mode');
            modeBtn.textContent = 'Basic';
            modeBtn.style.background = 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)';
            console.log('Added scientific-mode class'); // Debug log
        } else {
            this.scientificPanel.classList.remove('active');
            calculatorBody.classList.remove('scientific-mode');
            modeBtn.textContent = 'Scientific';
            modeBtn.style.background = 'linear-gradient(135deg, #40e0ff 0%, #64b5f6 100%)';
            console.log('Removed scientific-mode class'); // Debug log
        }
    }

    toggleHistoryPanel() {
        this.isHistoryVisible = !this.isHistoryVisible;
        this.updateHistoryPanel();
    }

    closeHistoryPanel() {
        this.isHistoryVisible = false;
        this.updateHistoryPanel();
    }

    updateHistoryPanel() {
        const historyBtn = document.getElementById('history-btn');
        const calculatorBody = document.getElementById('calculator-body');
        
        if (this.isHistoryVisible) {
            this.historyPanel.classList.add('active');
            calculatorBody.classList.add('history-mode');
            historyBtn.classList.add('active');
            historyBtn.textContent = 'Close';
        } else {
            this.historyPanel.classList.remove('active');
            calculatorBody.classList.remove('history-mode');
            historyBtn.classList.remove('active');
            historyBtn.textContent = 'History';
        }
    }

    updateDisplay() {
        // Format display value with better number formatting
        let displayValue = this.currentInput;
        
        // Handle error state
        if (displayValue === 'Error') {
            this.display.textContent = displayValue;
            this.display.style.color = '#ff4757';
            return;
        } else {
            this.display.style.color = '#ffffff';
        }
        
        // Add thousand separators for large numbers (but not during input)
        if (!isNaN(displayValue) && !displayValue.includes('e') && this.waitingForNewInput) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1000) {
                displayValue = num.toLocaleString('en-US', {
                    maximumFractionDigits: 10,
                    useGrouping: true
                });
            }
        }
        
        // Adjust font size based on content length
        const length = displayValue.length;
        if (length > 12) {
            this.display.style.fontSize = '2rem';
        } else if (length > 8) {
            this.display.style.fontSize = '2.4rem';
        } else {
            this.display.style.fontSize = '2.8rem';
        }
        
        this.display.textContent = displayValue;
    }

    updateHistory() {
        let historyText = '';
        if (this.previousInput && this.operator) {
            historyText = `${this.previousInput} ${this.getOperatorSymbol(this.operator)}`;
            if (!this.waitingForNewInput) {
                historyText += ` ${this.currentInput}`;
            }
        }
        this.history.textContent = historyText;
    }

    updateMemoryDisplay() {
        if (this.memory !== 0) {
            this.memoryIndicator.textContent = `M: ${this.memory}`;
        } else {
            this.memoryIndicator.textContent = '';
        }
    }

    addToHistory(calculation, result) {
        const historyItem = {
            calculation: calculation,
            result: String(result),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.calculationHistory.unshift(historyItem);
        
        // Limit history to 20 items for better performance
        if (this.calculationHistory.length > 20) {
            this.calculationHistory = this.calculationHistory.slice(0, 20);
        }
        
        this.updateHistoryList();
    }

    updateHistoryList() {
        this.historyList.innerHTML = '';
        
        if (this.calculationHistory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '60px 20px';
            emptyMessage.style.color = '#666';
            emptyMessage.style.fontSize = '1rem';
            emptyMessage.innerHTML = `
                <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;">📊</div>
                <div style="font-size: 1.3rem; margin-bottom: 12px;">No calculations yet</div>
                <div style="font-size: 1rem; opacity: 0.7;">Your calculation history will appear here</div>
                <div style="font-size: 0.9rem; opacity: 0.5; margin-top: 20px;">Perform some calculations to see history</div>
            `;
            this.historyList.appendChild(emptyMessage);
            return;
        }
        
        this.calculationHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${item.calculation}</span>
                    <span style="font-size: 0.8em; color: #666;">${item.timestamp}</span>
                </div>
            `;
            historyItem.dataset.result = item.result;
            historyItem.title = `Click to use result: ${item.result}`;
            
            // Add click handler for individual history items
            historyItem.addEventListener('click', () => {
                this.currentInput = item.result;
                this.updateDisplay();
                this.waitingForNewInput = true;
                this.closeHistoryPanel(); // Close history after selection
                
                // Visual feedback
                historyItem.style.background = 'rgba(64, 224, 255, 0.2)';
                setTimeout(() => {
                    historyItem.style.background = '';
                }, 200);
            });
            
            this.historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.calculationHistory = [];
        this.updateHistoryList();
        
        // Visual feedback
        const clearBtn = document.getElementById('clear-history');
        const originalText = clearBtn.textContent;
        clearBtn.textContent = 'Cleared!';
        clearBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
        
        setTimeout(() => {
            clearBtn.textContent = originalText;
            clearBtn.style.background = '';
        }, 1000);
    }

    getOperatorSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[op] || op;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    factorial(n) {
        if (n < 0 || n !== Math.floor(n)) {
            throw new Error('Invalid input for factorial');
        }
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    handleKeyboard(e) {
        e.preventDefault();
        
        const key = e.key;
        
        // Numbers and decimal point
        if (/[0-9\.]/.test(key)) {
            this.inputNumber(key);
        }
        
        // Operators
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.inputOperator(key);
        }
        
        // Enter or equals
        else if (key === 'Enter' || key === '=') {
            this.calculate();
        }
        
        // Handle Escape key to close history panel
        if (key === 'Escape') {
            if (this.isHistoryVisible) {
                this.closeHistoryPanel();
                return;
            }
            this.clear();
        }
        
        // Backspace
        else if (key === 'Backspace') {
            this.inputOperator('backspace');
        }
        
        // Delete for CE
        else if (key === 'Delete') {
            this.performAction('ce');
        }
        
        // Memory operations
        else if (e.ctrlKey) {
            switch (key.toLowerCase()) {
                case 'm':
                    this.memoryOperation('ms');
                    break;
                case 'r':
                    this.memoryOperation('mr');
                    break;
                case 'l':
                    this.memoryOperation('mc');
                    break;
                case 'p':
                    this.memoryOperation('mplus');
                    break;
            }
        }
        
        // Scientific functions with shortcuts
        else if (e.altKey) {
            switch (key.toLowerCase()) {
                case 's':
                    this.performFunction('sin');
                    break;
                case 'c':
                    this.performFunction('cos');
                    break;
                case 't':
                    this.performFunction('tan');
                    break;
                case 'l':
                    this.performFunction('log');
                    break;
                case 'n':
                    this.performFunction('ln');
                    break;
                case 'r':
                    this.performFunction('sqrt');
                    break;
                case 'p':
                    this.performFunction('pi');
                    break;
                case 'e':
                    this.performFunction('e');
                    break;
            }
        }
    }

    copyResult() {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(this.currentInput).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }

    async pasteValue() {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                const text = await navigator.clipboard.readText();
                const num = parseFloat(text);
                if (!isNaN(num)) {
                    this.currentInput = String(num);
                    this.updateDisplay();
                    this.waitingForNewInput = true;
                }
            } catch (err) {
                console.error('Failed to paste: ', err);
            }
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UBCalculator();
});
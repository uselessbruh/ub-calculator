# 🧮 UB Calculator

<div align="center">

![UB Calculator Logo](assets/icon.png)

### A Beautiful, Modern Desktop Calculator Built with Electron

[![Electron](https://img.shields.io/badge/Electron-27.0.0-9feaf9?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572b6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Windows](https://img.shields.io/badge/Windows-Compatible-0078d4?style=for-the-badge&logo=windows&logoColor=white)](https://www.microsoft.com/windows)

</div>

## ✨ Features

### 🎯 **Core Calculator Functions**
- ➕ **Basic Arithmetic**: Addition, Subtraction, Multiplication, Division
- 🧠 **Memory Operations**: MC, MR, MS, M+, M- with visual indicators
- 🔄 **Clear Functions**: Clear (C) and Clear Entry (CE)
- ⚡ **Real-time Calculations**: Instant results as you type
- 🚫 **Error Handling**: Graceful handling of division by zero and invalid operations

### 🔬 **Scientific Mode**
- 📐 **Trigonometric Functions**: sin, cos, tan, asin, acos, atan
- 📊 **Logarithmic Functions**: log₁₀, ln (natural log)
- 🔢 **Advanced Math**: Power (x^y), Square Root (√), Factorial (x!)
- 📏 **Utility Functions**: Absolute value |x|, Exponential (exp)
- 🎲 **Mathematical Constants**: π (Pi), e (Euler's number)

### 🎨 **Modern UI/UX**
- 🌙 **Dark Theme**: Elegant dark interface with gradient backgrounds
- 🪟 **Frameless Design**: Custom window controls with minimize/close buttons
- 🎭 **Glass Morphism**: Beautiful backdrop blur effects
- 🌈 **Color-Coded Buttons**: Intuitive color scheme for different button types
- 📱 **Responsive Layout**: Optimized button sizing and spacing
- ✨ **Smooth Animations**: Fluid transitions and hover effects

### 📋 **History & Memory**
- 📚 **Calculation History**: Track up to 20 recent calculations with timestamps
- 🔍 **Clickable History**: Click any history item to reuse the result
- 💾 **Persistent Memory**: Memory operations with visual indicators
- 🗑️ **Clear History**: One-click history clearing with visual feedback

### ⌨️ **Keyboard Support**
- 🔢 **Number Input**: Full numeric keypad support
- ➕➖✖️➗ **Operator Keys**: Standard operator key bindings
- ⏎ **Enter/Equals**: Calculate results with Enter or = key
- ⌫ **Backspace**: Delete last entered digit
- 🔄 **Escape**: Clear calculator or close history panel
- 🎛️ **Memory Shortcuts**: Ctrl+M, Ctrl+R, Ctrl+L, Ctrl+P for memory operations
- 🔬 **Scientific Shortcuts**: Alt key combinations for scientific functions

### 📋 **System Integration**
- 📊 **Menu Bar**: Native application menu with shortcuts
- 📋 **Copy/Paste**: Copy results and paste values from clipboard
- 🖼️ **System Icons**: Custom icon integration with taskbar
- 📁 **File Associations**: Support for .ubcalc files

## 🚀 Getting Started

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 💾 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uselessbruh/ub-calculator.git
   cd ub-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

### 🏗️ Building for Distribution

**Build for Windows:**
```bash
npm run build
```

**Create distribution package:**
```bash
npm run dist
```

The built application will be available in the `dist/` directory.

## 🎮 Usage Guide

### 🖱️ **Basic Operations**

1. **Numbers**: Click number buttons or use keyboard
2. **Operations**: Click operator buttons (+, -, ×, ÷)
3. **Calculate**: Press = or Enter key
4. **Clear**: Use C (Clear) or CE (Clear Entry)

### 🔬 **Scientific Mode**

1. Click the **"Scientific"** button in the header
2. Access trigonometric, logarithmic, and advanced math functions
3. Use Alt key combinations for quick access to scientific functions

### 📚 **History Panel**

1. Click the **"History"** button to view calculation history
2. Click any history item to reuse its result
3. Use **"Clear"** button to remove all history
4. Press **Escape** to close the history panel

### 💾 **Memory Operations**

- **MC**: Memory Clear
- **MR**: Memory Recall
- **MS**: Memory Store
- **M+**: Add to memory
- **M-**: Subtract from memory

## ⌨️ Keyboard Shortcuts

| Key Combination | Action |
|-----------------|--------|
| `0-9, .` | Number input |
| `+, -, *, /` | Basic operators |
| `Enter, =` | Calculate result |
| `Backspace` | Delete last digit |
| `Delete` | Clear entry |
| `Escape` | Clear all / Close panels |
| `Ctrl+C` | Copy result |
| `Ctrl+V` | Paste value |
| `Ctrl+M` | Memory store |
| `Ctrl+R` | Memory recall |
| `Ctrl+L` | Memory clear |
| `Alt+S` | Sine function |
| `Alt+C` | Cosine function |
| `Alt+T` | Tangent function |
| `Alt+L` | Logarithm |
| `Alt+N` | Natural log |
| `Alt+R` | Square root |
| `Alt+P` | Pi constant |
| `Alt+E` | Euler's number |

## 🏗️ Project Structure

```
ub-calculator/
├── 📄 main.js              # Electron main process
├── 🎨 renderer.js          # Calculator logic & UI handling
├── 🌐 index.html           # Application layout
├── 🎭 styles.css           # Modern styling & animations
├── 📦 package.json         # Project configuration
├── 🚫 .gitignore          # Git ignore rules
├── 📁 assets/             # Application icons
│   ├── 🖼️ icon.png
│   ├── 🖼️ icon.ico
│   ├── 🖼️ icon.icns
│   └── 🖼️ icon.svg
└── 📁 dist/              # Built application (after build)
```

## 🎨 Design Philosophy

UB Calculator embraces modern design principles:

- **🌙 Dark First**: Designed primarily for dark theme with elegant gradients
- **🎭 Glass Morphism**: Subtle transparency and backdrop blur effects
- **🌈 Color Psychology**: Intuitive color coding for different button functions
- **⚡ Performance**: Optimized animations and smooth interactions
- **♿ Accessibility**: High contrast ratios and keyboard navigation

## 🔧 Technical Details

- **Framework**: Electron 27.0.0
- **Languages**: JavaScript ES6+, HTML5, CSS3
- **Architecture**: Main process + Renderer process
- **UI Framework**: Vanilla JavaScript with modern CSS
- **Build Tool**: electron-builder
- **Target Platform**: Windows (portable executable)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Electron Community** for the amazing framework
- **Modern CSS** techniques for beautiful styling
- **Mathematical Libraries** for calculation accuracy
- **Icon Design** inspiration from modern calculator apps

---

<div align="center">

**Made with ❤️ for productivity and beautiful design**

[⭐ Star this repo](https://github.com/yourusername/ub-calculator) • [🐛 Report Bug](https://github.com/yourusername/ub-calculator/issues) • [💡 Request Feature](https://github.com/yourusername/ub-calculator/issues)

</div>


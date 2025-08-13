const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();

// Set application name
app.setName('UB Calculator');

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  
  mainWindow = new BrowserWindow({
    width: 420,
    height: 800,
    minWidth: 420,
    minHeight: 700,
    maxWidth: 420,
    maxHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'UB Calculator',
    icon: iconPath,
    titleBarStyle: 'hidden',
    resizable: false,
    frame: false,
    backgroundColor: '#1a1a1a',
    show: false,
    vibrancy: 'dark'
  });

  // Set the taskbar icon explicitly
  mainWindow.setIcon(iconPath);

  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Calculation',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('clear-calculator');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Copy Result',
          accelerator: 'CmdOrCtrl+C',
          click: () => {
            mainWindow.webContents.send('copy-result');
          }
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          click: () => {
            mainWindow.webContents.send('paste-value');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Scientific Mode',
          type: 'checkbox',
          checked: false,
          click: (menuItem) => {
            mainWindow.webContents.send('toggle-scientific', menuItem.checked);
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About UB Calculator',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About UB Calculator',
              message: 'UB Calculator v1.0.0',
              detail: 'A full-fledged desktop calculator application built with Electron.\n\nFeatures:\n• Basic arithmetic operations\n• Scientific functions\n• Memory operations\n• Keyboard shortcuts\n• History tracking'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Window control handlers
  ipcMain.handle('window-minimize', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle certificate errors for self-signed certificates
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // For development purposes, ignore certificate errors
  event.preventDefault();
  callback(true);
});
const { BrowserWindow } = require('electron');
const path = require('node:path');
console.log("settings-window.js loaded")
let settingsWindow = null;

function createSettingsWindow(parent) {
  console.log("createSettingsWindow");
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    title: 'DB Settings',
    parent,
    modal: process.platform === 'darwin',
    webPreferences: {
      preload: path.join(__dirname, 'preload-settings.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  settingsWindow.webContents.openDevTools({ mode: 'detach' });

  settingsWindow.loadFile(path.join(__dirname, '../public/settings-window.html'));
  settingsWindow.on('closed', () => { 
    console.log("closed");
    settingsWindow = null; });
}

module.exports = { createSettingsWindow };


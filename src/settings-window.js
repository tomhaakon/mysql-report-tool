const { BrowserWindow } = require('electron');
const path = require('node:path');

let settingsWindow = null;
function createSettingsWindow(parent) {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 360,
    title: 'DB Settings',
    parent,
    modal: process.platform === 'darwin',
    webPreferences: {
      preload: path.join(__dirname, 'preload-settings.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  settingsWindow.loadFile(path.join(__dirname, '../public/settings.html'));
  settingsWindow.on('closed', () => { settingsWindow = null; });
}

module.exports = { createSettingsWindow };


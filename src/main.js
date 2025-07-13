// main.js
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const mysql = require('mysql2/promise');
const store = require('./store');
const { createSettingsWindow } = require('./settings-window');

let mainWindow;
let pool;

function initPool() {
  const cfg = store.get('dbConfig');
  if (
    cfg &&
    cfg.host && cfg.user && cfg.password && cfg.database
  ) {
    pool = mysql.createPool({
      ...cfg,
      waitForConnections: true,
      connectionLimit: 5,
    });
  } else {
    pool = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('public/index.html');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  initPool();

  // minimal menu to open Settings
  ipcMain.on('open-settings', () => {
        createSettingsWindow(mainWindow);
    });

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: '⚙️',
      submenu: [
        {
          label: 'DB Settings…',
          click: () => createSettingsWindow(mainWindow),
        },
        { role: 'reload' },
        { role: 'quit' },
      ]
    }
  ]));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: get / set config
ipcMain.handle('get-db-config', () => {
  return store.get('dbConfig');
});
ipcMain.handle('set-db-config', (_e, cfg) => {
  store.set('dbConfig', cfg);
  initPool();
  return cfg;
});

// IPC: query
ipcMain.handle('db-query', async (_evt, sql, params=[]) => {
  if (!pool) throw new Error('DB not configured – please open Settings first.');
  const [rows] = await pool.query(sql, params);
  return rows;
}); 


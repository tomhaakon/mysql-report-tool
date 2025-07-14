// main.js
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const mysql = require('mysql2/promise');
const store = require('./store');
const { createSettingsWindow } = require('./settings-window');

let mainWindow;
let pool;

if (process.env.NODE_ENV !== 'production') {
  // point at the top of the .webpack folder, not src/
  const buildPath = path.join(__dirname, '..', '.webpack');

  require('electron-reload')(buildPath, {
    // optional: point to the real electron binary
    electron: path.join(
      __dirname, '..', 'node_modules', 'electron', 'dist',
      process.platform === 'win32' ? 'electron.exe' : 'electron'
    ),
    // These help avoid double-reloads while files are still writing:
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100
    },
    // If you want only certain extensions watched:
    // electronReload(buildPath, { ... , extensions: ['js','html','css'] })
  });
}
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

  Menu.setApplicationMenu(null);

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
  if(mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.reload();
  }

  return cfg;
});

// IPC: query
ipcMain.handle('db-query', async (_evt, sql, params=[]) => {
  if (!pool) throw new Error('DB not configured – please open Settings first.');
  const [rows] = await pool.query(sql, params);
  return rows;
}); 


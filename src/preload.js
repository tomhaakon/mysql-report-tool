// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
  query: (sql, params) => ipcRenderer.invoke('db-query', sql, params)
});

contextBridge.exposeInMainWorld('appAPI', {
    openSettings: () => ipcRenderer.send('open-settings')
});

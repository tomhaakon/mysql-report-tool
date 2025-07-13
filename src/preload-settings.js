const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settings', {
  getAll:   () => ipcRenderer.invoke('get-db-config'),
  setAll:   (cfg) => ipcRenderer.invoke('set-db-config', cfg),
});


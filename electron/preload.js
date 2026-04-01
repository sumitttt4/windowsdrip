const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  // Pack operations
  listPacks: () => ipcRenderer.invoke('packs:list'),
  getActivePack: () => ipcRenderer.invoke('packs:getActive'),
  applyPack: (packId) => ipcRenderer.invoke('packs:apply', packId),
  restoreDefaults: () => ipcRenderer.invoke('packs:restoreDefaults'),
  getSoundPath: (packId, soundKey) => ipcRenderer.invoke('packs:getSoundPath', packId, soundKey)
})

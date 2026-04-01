const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// Registry paths for Windows sound schemes
const SOUND_SCHEMES_ROOT = 'HKCU\\AppEvents\\Schemes'
const SOUND_APPS_ROOT = 'HKCU\\AppEvents\\Schemes\\Apps\\.Default'

// Sound event registry key mapping
const SOUND_EVENT_KEYS = {
  '.Default': '.Default',
  'SystemStart': 'SystemStart',
  'SystemExit': 'SystemExit',
  'SystemExclamation': 'SystemExclamation',
  'Notification.Default': 'Notification.Default',
  'SystemAsterisk': 'SystemAsterisk',
  'DeviceConnect': 'DeviceConnect',
  'DeviceDisconnect': 'DeviceDisconnect',
  'EmptyRecycleBin': 'EmptyRecycleBin',
  'MailBeep': 'MailBeep'
}

let mainWindow
let regedit = null

// Only load regedit on Windows
function getRegedit() {
  if (regedit) return regedit
  if (process.platform === 'win32') {
    try {
      regedit = require('regedit')
      // Set the external VBS location for packaged apps
      if (app.isPackaged) {
        regedit.setExternalVBSLocation(
          path.join(path.dirname(app.getPath('exe')), 'resources', 'regedit', 'vbs')
        )
      }
    } catch (err) {
      console.error('Failed to load regedit:', err)
    }
  }
  return regedit
}

function getPacksDirectory() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'packs')
  }
  return path.join(__dirname, '..', 'packs')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Load the Vite dev server in dev, or the built files in production
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── IPC Handlers ──

// Window controls (frameless window)
ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window:close', () => mainWindow?.close())

// Get all available sound packs
ipcMain.handle('packs:list', async () => {
  const packsDir = getPacksDirectory()
  try {
    const dirs = fs.readdirSync(packsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())

    const packs = []
    for (const dir of dirs) {
      const manifestPath = path.join(packsDir, dir.name, 'manifest.json')
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
        packs.push(manifest)
      }
    }
    return { success: true, packs }
  } catch (err) {
    return { success: false, error: err.message, packs: [] }
  }
})

// Get the currently active sound scheme
ipcMain.handle('packs:getActive', async () => {
  const reg = getRegedit()
  if (!reg) {
    return { success: true, activePackId: null }
  }

  try {
    const result = await new Promise((resolve, reject) => {
      reg.list([SOUND_SCHEMES_ROOT], (err, items) => {
        if (err) reject(err)
        else resolve(items)
      })
    })

    const scheme = result[SOUND_SCHEMES_ROOT]
    if (scheme && scheme.values && scheme.values['']) {
      const currentScheme = scheme.values[''].value
      // If it matches one of our pack IDs, return it
      return { success: true, activePackId: currentScheme }
    }
    return { success: true, activePackId: null }
  } catch (err) {
    return { success: false, activePackId: null, error: err.message }
  }
})

// Apply a sound pack
ipcMain.handle('packs:apply', async (_, packId) => {
  const reg = getRegedit()
  const packsDir = getPacksDirectory()
  const manifestPath = path.join(packsDir, packId, 'manifest.json')

  if (!fs.existsSync(manifestPath)) {
    return { success: false, error: 'Pack not found' }
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  if (!reg) {
    // Non-Windows: simulate success for development
    return { success: true, simulated: true }
  }

  try {
    const valuesToPut = {}

    // Set the scheme name
    valuesToPut[SOUND_SCHEMES_ROOT] = {
      '': { value: packId, type: 'REG_SZ' }
    }

    // Set each sound event
    for (const [eventName, wavFile] of Object.entries(manifest.sounds)) {
      const wavPath = path.join(packsDir, packId, wavFile)
      const regKey = `${SOUND_APPS_ROOT}\\${eventName}\\.Current`
      valuesToPut[regKey] = {
        '': { value: wavPath, type: 'REG_EXPAND_SZ' }
      }
    }

    await new Promise((resolve, reject) => {
      reg.putValue(valuesToPut, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Restore default Windows sounds
ipcMain.handle('packs:restoreDefaults', async () => {
  const reg = getRegedit()
  if (!reg) {
    return { success: true, simulated: true }
  }

  try {
    const valuesToPut = {}

    // Reset scheme to .Default
    valuesToPut[SOUND_SCHEMES_ROOT] = {
      '': { value: '.Default', type: 'REG_SZ' }
    }

    // Clear each sound event to use Windows defaults
    for (const eventName of Object.keys(SOUND_EVENT_KEYS)) {
      const regKey = `${SOUND_APPS_ROOT}\\${eventName}\\.Current`
      valuesToPut[regKey] = {
        '': { value: '', type: 'REG_EXPAND_SZ' }
      }
    }

    await new Promise((resolve, reject) => {
      reg.putValue(valuesToPut, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Get the wav file path for previewing a sound
ipcMain.handle('packs:getSoundPath', async (_, packId, soundKey) => {
  const packsDir = getPacksDirectory()
  const manifestPath = path.join(packsDir, packId, 'manifest.json')

  if (!fs.existsSync(manifestPath)) {
    return { success: false, error: 'Pack not found' }
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const wavFile = manifest.sounds[soundKey]

  if (!wavFile) {
    return { success: false, error: 'Sound not found in pack' }
  }

  const wavPath = path.join(packsDir, packId, wavFile)
  return { success: true, path: wavPath }
})

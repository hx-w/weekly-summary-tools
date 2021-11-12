'use strict'
// const electron = require('electron')
// const app = electron.app
// const BrowserWindow = electron.BrowserWindow
// const protocol = electron.protocol
import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// const DEVINSTALLER = require('electron-devtools-installer')
// const installExtension = DEVINSTALLER.installExtension
// const VUEJS_DEVTOOLS = DEVINSTALLER.VUEJS_DEVTOOLS

const isDevelopment = process.env.NODE_ENV === 'development'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 670,
    // titleBarStyle: 'hidden',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security3html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    // win.loadFile('app://./index.html')
    // path = require('path')
    // win.loadFile(path.join(__dirname, 'index.html'))
    win.loadURL(`file://${__dirname}/index.html`)
  }
  win.on('close', () => {
    if (process.platform !== 'darwin') {
      app.quit()
      win.quit()
    }
  })
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS)
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const path = require('path')

let pyProc = null

const createPyProc = () => {
  if (isDevelopment) {
    let script = path.join('py', 'api_server.py')
    let arg = path.join('./', 'config.yml')
    pyProc = require('child_process').exec(`python3 ${script} ${arg}`, function (error, stdout, stderr) {
      if (error) {
        throw error
      }
      console.log(stdout)
    })
  } else {
    // let script = path.join('resources', 'api_server.exe')
    // let script = `file://${__dirname}/`
    let arg = 'config.yml'
    // pyProc = require('child_process').exec(`${script} ${arg}`, function(error, stdout, stderr) {
    pyProc = require('child_process').execFile(`${__dirname}/api_server.exe`, [arg], function (error, stdout, stderr) {
      if (error) {
        throw error
      }
      console.log(stdout)
    })
  }
}

const exitPyProc = () => {
  if (pyProc !== null) {
    pyProc.kill()
  }
  pyProc = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)
app.on('before-quit', exitPyProc)
app.on('window-all-closed', exitPyProc)
'use strict'
import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import axios from 'axios'
// const DEVINSTALLER = require('electron-devtools-installer')
// const installExtension = DEVINSTALLER.installExtension
// const VUEJS_DEVTOOLS = DEVINSTALLER.VUEJS_DEVTOOLS

let pyProc = null
let win = null

const isDevelopment = process.env.NODE_ENV === 'development'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 680,
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
    win.loadURL(`file://${__dirname}/index.html`)
  }
  win.on('close', () => {
    axios
      .get('http://127.0.0.1:54321/exit')
      .then((resp) => { })
      .catch((error) => { })
    if (process.platform !== 'darwin') {
      exitPyProc()
      app.quit()
    }
  })
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  axios
    .get('http://127.0.0.1:54321/exit')
    .then((resp) => { })
    .catch((error) => { })
  app.quit()
  // if (process.platform !== 'darwin') {
  //   exitPyProc()
  //   app.quit()
  // }
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
  createPyProc()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        exitPyProc()
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      exitPyProc()
      app.quit()
    })
  }
}


const path = require('path');


async function createPyProc() {
  if (isDevelopment) {
    let script = path.join('py', 'api_server.py')
    let arg = path.join('./', 'config.yml')
    pyProc = require('child_process').exec(`python3 ${script} ${arg}`, function (error, stdout, stderr) {
      if (error) {
        throw error;
      }
    })
  } else {
    let arg = 'config.yml'
    pyProc = require('child_process').execFile(`${__dirname}/api_server.exe`, [arg], function (error, stdout, stderr) {
      if (error) {
        console.log(error)
      }
    })
  }
}

async function exitPyProc() {
  if (pyProc !== null) {
    pyProc.kill()
  }
  pyProc = null
}

// app.on('ready', createPyProc)
// app.on('will-quit', exitPyProc)

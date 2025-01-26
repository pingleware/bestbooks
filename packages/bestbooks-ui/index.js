"use strict"

const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 900,
      icon: path.join(__dirname, "assets/bestbooks.png"),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js")
      }
    });

    mainWindow.loadFile("views/index.html");

    mainWindow.on("closed", function () {
      mainWindow = null;
    });
    mainWindow.setMenu(null);
    mainWindow.setResizable(true);
}

app.on("ready", createWindow);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Load IPC routines
var ipc = require('./ipc.js');
ipc._mainWindow = mainWindow;

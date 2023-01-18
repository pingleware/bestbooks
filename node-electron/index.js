"use strict"

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const path = require('path');

var argv = yargs(hideBin(process.argv))
.option('host', {
    alias: 'h',
    type: 'string',
    description: 'host name',
    default: 'localhost',
    required: false
})
.option('port', {
    alias: 'p',
    type: 'number',
    description: 'port',
    default: 7777,
    required: false
})
.option('width', {
    alias: 'w',
    type: 'number',
    description: 'width of application',
    default: 1072,
    required: false
})
.option('height', {
    alias: 'g',
    type: 'number',
    description: 'height of application',
    default: 970,
    required: false
})
.option('menu', {
    alias: 'm',
    type: 'boolean',
    description: 'turns menu on or off',
    default: false,
    required: false
})
.parse()

let host = argv.host;
let port = argv.port;

let width = argv.width;
let height = argv.height;

let menu = argv.menu;

const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');

let mainWindow;
let tray = null;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        title: "BestBooks Accounting Application Framework",
        icon: '../assets/bestbooks.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('views/index.html');


    mainWindow.on('closed', function () {
        mainWindow = null
    });

    if (!menu) {
        mainWindow.setMenu(null);
    }

    mainWindow.once('ready-to-show', () => {
        //autoUpdater.checkForUpdatesAndNotify();
    });
    // Setup Tray
    tray = new Tray('../assets/bestbooks.ico');

    const contextMenu = Menu.buildFromTemplate([
    ]);

    tray.setIgnoreDoubleClickEvents(true);
    tray.setToolTip('Corporate Book');
    tray.setContextMenu(contextMenu);  
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// IPC communication between view and node
ipcMain.on('open_browser', function(evt, url){
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
    mainWindow.webContents.send('open_browser','success');
});

ipcMain.on('error', function(evt, data){
    console.log(data);
    mainWindow.webContents.send('error',data);
});

// BESTBOOKS API Server
const {start_server} = require('@pingleware/bestbooks-api');

start_server(host, port);

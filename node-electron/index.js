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
    type: 'string',
    description: 'turns menu on or off',
    default: 'off',
    required: false
})
.option('smtp', {
    type: 'string',
    description: 'specifies the SMTP host name',
    default: 'mail.presspage-entertainment-accounting.systems',
    required: false
})
.parse()

let host = argv.host;
let port = argv.port;

let width = argv.width;
let height = argv.height;

let menu = argv.menu;

const { app, BrowserWindow, Menu, Tray } = require('electron');

let mainWindow;
let tray = null;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        title: "BestBooks Accounting Application Framework",
        icon: path.join(__dirname,'assets/bestbooks.png'),
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

    if (menu !== "on") {
        mainWindow.setMenu(null);
    }

    mainWindow.once('ready-to-show', () => {
        //autoUpdater.checkForUpdatesAndNotify();
    });
    // Setup Tray
    tray = new Tray(path.join(__dirname,'assets/app-icon/icons/win/icon.ico'));

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

// Load IPC routines
var ipc = require('./ipc.js');
ipc.mainWindow = mainWindow;


// BESTBOOKS API Server
const {start_server} = require('@pingleware/bestbooks-api');

start_server(host, port);

// BESTBOOKS SMTP MAIL SERVER
const { start_smtp_server } = require("@pingleware/bestbooks-mailer");

start_smtp_server("mail.presspage-entertainment-accounting.systems",587);

/**
 * Start HTTP Server
 */
const http = require('http');
const PORT = 0;
const http_server = http.createServer(async(req,res)=>{
  var pathname = req.url.split('?')[0]; // url.parse(req.url).pathname;
    
  if( pathname === '/' ) {
    var html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>BestBooks&trade; Accounting Application Framework</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
            <style>
            .header {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
            }
            .footer {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                text-align: center;
            }
            </style>
        </head>
        <body>
             <!-- HEADER -->
             <h2 class="w3-container w3-yellow header">BestBooks&trade; Accounting Application Framework</h2>
             <!-- MAIN PAGE -->
             <div id="main-page" class="w3-container">
                 <br/><br/><br/>
                <div class="w3-panel w3-block">
                    <h1>BestBooks&trade; Accounting Application Framework</h1>
                </div>
                <br/><br/><br/>
            </div>
            <!-- FOOTER -->
            <h5 class="w3-container w3-yellow footer">
                &copy; <span id="year"></span> by <a href="https://presspage.info" target="_system" style="text-decoration: none">PRESSPAGE ENTERTAINMENT INC</a> dba <a href="https://pingleware.work" target="_system" style="text-decoration: none">PINGLEWARE</a>. All rights reserved.
            </h5>
        </body>
    </html>`;
    return res.end(html);
} else if (pathname === '/customer/authenticate') {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            console.log(chunk.toString());
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            console.log(body);
            res.end('ok');
        });
    }
} else if (pathname === '/customer/estimate') {
    var html = ``;
    var query = req.url.split('?')[1];
    console.log(query);
    var estimate_no = query.split('&')[0].split("=")[1];
    var sql = `SELECT  i.id AS invoice_id,i.company_id,i.txdate,i.amount,i.content,c.name,c.email FROM invoice i JOIN customer c ON c.id=i.customer WHERE number='${estimate_no}' AND status='draft'`;
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    model.query(sql,function(rows){
        if (rows.length > 0) {
            var json = atob(rows[0].content)
            var content = JSON.parse(json);
            var _port = req.rawHeaders[1].split(":")[1];
            var url = `http://localhost:${_port}/customer/authenticate/?num=${estimate_no}`;
            html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>BestBooks&trade; Accounting Application Framework</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
                    <style>
                    .header {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                    .footer {
                        position: fixed;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        text-align: center;
                    }
                    </style>
                </head>
                <body>
                <!-- HEADER -->
                <h2 class="w3-container w3-yellow header">BestBooks&trade; Accounting Application Framework</h2>
                <!-- MAIN PAGE -->
                <div id="main-page" class="w3-container">
                    <br/><br/><br/>
                   <div class="w3-panel w3-block">
                        <form method="post" action="${url}">
                            <label for="username">User Name</label>
                            <input type="text" class="w3-input w3-block" id="username" name="username">
                            <label for="password">Password</label>
                            <input type="password" class="w3-input w3-block" id="password" name="password">
                            <input type="submit" class="w3-button w3-block w3-black" value="Log In">
                        </form>
                   </div>
                   <br/><br/><br/>
               </div>
               <!-- FOOTER -->
               <h5 class="w3-container w3-yellow footer">
                   &copy; <span id="year"></span> by <a href="https://presspage.info" target="_system" style="text-decoration: none">PRESSPAGE ENTERTAINMENT INC</a> dba <a href="https://pingleware.work" target="_system" style="text-decoration: none">PINGLEWARE</a>. All rights reserved.
               </h5>
                </body>
            </html>`;
            if (content.estimate_password.length == 0) {
                html = `${json}`;
            }        
        }
        return res.end(html);    
    })
  } else if (pathname === '/vendor/purchaseorder') {
  }
});

http_server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${http_server.address().port}`);
  //localStorage.setItem('http_server_port',server.address().port);
});
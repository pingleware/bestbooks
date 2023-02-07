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

    if (menu !== "on") {
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

ipcMain.on('run_script', function(evt, fullPathname){
    require('child_process').exec(fullPathname);
    mainWindow.webContents.send('run_script','success');
})

ipcMain.on('add_company', async function(evt, json){
    var data = JSON.parse(json);
    console.log(data);
    const {Company} = require('@pingleware/bestbooks-core');
    var company = new Company();
    company.addCompany(data.name,data.note,
        function(lastID, changes){
            var result = {
                lastID: lastID,
                changes: changes
            };
            mainWindow.webContents.send('add_company',JSON.stringify(result));
        });
});

ipcMain.on("add_account", function(evt, json){
    var data = JSON.parse(json);
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    let lastID = coa.add(data.name,data.type,data.company);
    mainWindow.webContents.send('add_account',JSON.stringify(lastID));
});

ipcMain.on("get_accounts_by_company", function(evt, company_id){
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    coa.getList(company_id, function(accounts){
        mainWindow.webContents.send("get_accounts_by_company",JSON.stringify(accounts));
    });
});

ipcMain.on("accounting_budget", function(evt,json){
    var params = JSON.parse(json);
    console.log(params);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `UPDATE accounts SET Bud01=${params.budget_01},
                                      Bud02=${params.budget_02},
                                      Bud03=${params.budget_03},
                                      Bud04=${params.budget_04},
                                      Bud05=${params.budget_05},
                                      Bud06=${params.budget_06},
                                      Bud07=${params.budget_07},
                                      Bud08=${params.budget_08},
                                      Bud09=${params.budget_09},
                                      Bud10=${params.budget_10},
                                      Bud11=${params.budget_11},
                                      Bud12=${params.budget_12},
                                      Bud13=${params.budget_13},
                                      Bud14=${params.budget_14},
                                      Bud15=${params.budget_15},
                                      Bud16=${params.budget_16},
                                      Bud17=${params.budget_17},
                                      Bud18=${params.budget_18},
                                      Bud19=${params.budget_19},
                                      Bud20=${params.budget_20},
                                      Bud21=${params.budget_21},
                                      Bud22=${params.budget_22},
                                      Bud23=${params.budget_23},
                                      Bud24=${params.budget_24} 
                                      WHERE id=${params.account}`;
    var result = model.updateSync(sql);
    mainWindow.webContents.send("accounting_budget",JSON.stringify(result));
});

ipcMain.on("accounting_balance",function(evt,json){
    var params = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `UPDATE accounts SET Bal01=${params.balance_01},
                                      Bal02=${params.balance_02},
                                      Bal03=${params.balance_03},
                                      Bal04=${params.balance_04},
                                      Bal05=${params.balance_05},
                                      Bal06=${params.balance_06},
                                      Bal07=${params.balance_07},
                                      Bal08=${params.balance_08},
                                      Bal09=${params.balance_09},
                                      Bal10=${params.balance_10},
                                      Bal11=${params.balance_11},
                                      Bal12=${params.balance_12},
                                      Bal13=${params.balance_13},
                                      Bal14=${params.balance_14},
                                      Bal15=${params.balance_15},
                                      Bal16=${params.balance_16},
                                      Bal17=${params.balance_17},
                                      Bal18=${params.balance_18},
                                      Bal19=${params.balance_19},
                                      Bal20=${params.balance_20},
                                      Bal21=${params.balance_21},
                                      Bal22=${params.balance_22},
                                      Bal23=${params.balance_23},
                                      Bal24=${params.balance_24} 
                                      WHERE id=${params.account}`;

    
    var result = model.updateSync(sql);
    mainWindow.webContents.send("accounting_balance",JSON.stringify(result));
});

ipcMain.on("account_balances", function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT Bal01,Bal02,Bal03,Bal04,Bal05,Bal06,Bal07,Bal08,Bal09,Bal10,Bal11,Bal12,Bal13,Bal14,Bal15,Bal16,Bal17,Bal18,Bal19,Bal20,Bal21,Bal22,Bal23,Bal24 FROM accounts WHERE id=${id};`;
    model.query(sql, function(data){
        mainWindow.webContents.send('account_balances',JSON.stringify(data));
    })
});

ipcMain.on("account_budgets", function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT Bud01,Bud02,Bud03,Bud04,Bud05,Bud06,Bud07,Bud08,Bud09,Bud10,Bud11,Bud12,Bud13,Bud14,Bud15,Bud16,Bud17,Bud18,Bud19,Bud20,Bud21,Bud22,Bud23,Bud24 FROM accounts WHERE id=${id};`;
    model.query(sql, function(data){
        mainWindow.webContents.send('account_budgets',JSON.stringify(data));
    })
})

ipcMain.on("delete_account", function(evt, name){
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    var status = coa.remove(name);
    mainWindow.webContents.send("delete_account",JSON.stringify(status));
});

ipcMain.on("add_transaction", function(evt, json){
    var data = JSON.parse(json);
    const { addTransaction } = require("@pingleware/bestbooks-helpers");
    var date = new Date(data.date + ' ' + data.time);
    var txdate = date.toISOString();
    if (data.id > 0) {
        const { Model } = require("@pingleware/bestbooks-core");
        var model = new Model();
        var balance = Number(data.debit) - Number(data.credit);
        var sql = `UPDATE ledger SET company_id=${Number(data.company)},account_name='${data.name}',txdate='${txdate}',note='${data.description}',ref=${data.ref},debit=${Number(data.debit)},credit=${Number(data.credit)},balance=${balance} WHERE id=${data.id};`;
        console.log(sql);
        model.insert(sql, function(results){
            mainWindow.webContents.send("add_transaction",JSON.stringify(results));
        });
    } else {
        addTransaction(data.name,data.type,txdate,data.description,data.debit,data.credit,
            function(status){
                mainWindow.webContents.send("add_transaction",JSON.stringify(status));
            },data.company,0);        
    }
});

ipcMain.on("get_transactions", function(evt, company_id){
    // SELECT id,account_name,account_code,note,ref,debit,credit,balance FROM ledger WHERE company_id=1
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT id,txdate AS date,account_name AS name,account_code AS code,note,ref,debit,credit,balance FROM ledger WHERE company_id=${company_id};`;
    model.query(sql, function(results){
        mainWindow.webContents.send("get_transactions",JSON.stringify(results));
    })
});

ipcMain.on('delete_transaction', function(evt, id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `DELETE FROM ledger WHERE id=${id};`;
    model.insert(sql, function(results){
        mainWindow.webContents.send('delete_transaction',JSON.stringify(results));
    });

});

ipcMain.on("add_journal_transaction", function(evt, json){
    var params = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var date = new Date(params.date + ' ' + params.time);
    var txdate = date.toISOString();
    var sql = `INSERT INTO journal (company_id,office_id,txdate,account,ref,debit,credit) 
                VALUES (${params.company},${params.office},'${txdate}','${params.name}',${Number(params.ref)},${Number(params.debit)},${Number(params.credit)});`;

    if (params.id > 0) {
        sql = `UPDATE journal SET txdate='${txdate}',account='${params.name}',ref=${Number(params.ref)},debit=${Number(params.debit)},credit=${Number(params.credit)} WHERE id=${params.id};`
    }
    model.insert(sql,function(results){
        mainWindow.webContents.send('add_journal_transaction',JSON.stringify(results));
    });
});

ipcMain.on("get_journal_transactions", function(evt, company_id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT * FROM journal WHERE company_id=${company_id}`;
    model.query(sql, function(results){
        mainWindow.webContents.send("get_journal_transactions",JSON.stringify(results));
    })
})

ipcMain.on('delete_journal_transaction', function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `DELETE FROM journal WHERE id=${id};`;
    model.insert(sql, function(results){
        mainWindow.webContents.send('delete_journal_transaction',JSON.stringify(results));
    });
});

ipcMain.on("report_balancesheet", function(evt, json){
    try {
        const { BalanceSheet } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = BalanceSheet.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_balancesheet",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_balancesheet",JSON.stringify(error));
    }
});
ipcMain.on("report_incomestatement", function(evt, json){
    try {
        const { IncomeStatement } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = IncomeStatement.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_incomestatement",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_incomestatement",JSON.stringify(error));
    }
});
ipcMain.on("report_trialbalance", function(evt, json){
    try {
        const { TrialBalance } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = TrialBalance.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_trialbalance",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_trialbalance",JSON.stringify(error));
    }
});

// BESTBOOKS API Server
const {start_server} = require('@pingleware/bestbooks-api');

start_server(host, port);

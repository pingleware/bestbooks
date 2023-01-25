const {contextBridge, ipcRenderer} = require("electron");

let validChannels = [
  "error","open_browser","add_company","add_account","get_accounts_by_company","add_transaction","get_transactions"
];

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    try {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }  
    } catch(error) {
    }
  },
  receive: (channel, func) => {
    try {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, function(event, args) {
          func(channel, event, args)
        });
      }
    } catch(error) {
    }
  }
});

var pjson = require('./package.json');
localStorage.setItem('version', pjson.version);

// Create new tables, if needed?
const { AccountTypes, ChartOfAccounts, Journal, Company, Ledger} = require('@pingleware/bestbooks-core');
const company = new Company();
new Journal();
new ChartOfAccounts();
new Ledger('Unknown','Unknown');

company.getCompanies(function(companies){
  console.log(companies)
  localStorage.setItem('companies',JSON.stringify(companies));
});

localStorage.setItem("accountTypes",JSON.stringify(AccountTypes));
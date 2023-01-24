const {contextBridge, ipcRenderer} = require("electron");

let validChannels = [
  "error","open_browser","add_company"
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
const { ChartOfAccounts, Journal, Company} = require('@pingleware/bestbooks-core');
const company = new Company();
new Journal();
new ChartOfAccounts();

company.getCompanies(function(companies){
  console.log(companies)
  localStorage.setItem('companies',JSON.stringify(companies));
})
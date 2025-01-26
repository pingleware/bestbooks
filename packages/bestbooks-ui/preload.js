const {contextBridge, ipcRenderer} = require("electron");

let validChannels = [];

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
localStorage.setItem('version',pjson.version);

const { AccountTypes, ChartOfAccounts, Journal, Company, Ledger, Model} = require('@pingleware/bestbooks-core');
const company = new Company();
new Journal();
new ChartOfAccounts();
new Ledger('Miscellaneous','Unknown');

const model = new Model();
model.query("SELECT c.*,m.address1,m.address2,m.city,m.state,m.zipcode,m.contact,m.email,m.phone,m.fax,m.website FROM company c JOIN company_metadata m ON c.id=m.company_id",function(rows){
  localStorage.setItem('companies',JSON.stringify(rows));
});

// get sales tax jurisdictions
model.query("SELECT * FROM sales_tax",function(rows){
  localStorage.setItem('salestax_jurisdictions',JSON.stringify(rows));
})
// get payment terms
model.query("SELECT * FROM payment_terms",function(rows){
  localStorage.setItem('payment_terms',JSON.stringify(rows));
})
// get resale products
model.query("SELECT * FROM inventory WHERE type='product.resale' ORDER BY description ASC",function(rows){
  localStorage.setItem('resale_products',JSON.stringify(rows));
})
// get resale services
model.query("SELECT * FROM inventory WHERE type='service.resale' ORDER BY description ASC",function(rows){
  localStorage.setItem('resale_services',JSON.stringify(rows));
})


localStorage.setItem("accountTypes",JSON.stringify(AccountTypes));


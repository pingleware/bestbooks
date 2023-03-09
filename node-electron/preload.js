const {contextBridge, ipcRenderer} = require("electron");

let validChannels = [
  "error","open_browser","add_company","add_account","get_accounts_by_company",
  "get_transactions","delete_transaction",
  "get_journal_transactions","delete_journal_transaction",
  "report_balancesheet","report_incomestatement","report_trialbalance",
  "accounting_budget","accounting_balance","delete_account","account_balances","account_budgets",
  "import","export","import_progress",
  "chartofaccount","delete_chartofaccount","add_transaction","edit_transaction","add_journal_transaction","edit_journal_transaction",
  "nonce", "new_invoice_number","new_purchaseorder_number","insert_sql","query_sql","add_salestax_jurisdiction","add_payment_term"
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
const { AccountTypes, ChartOfAccounts, Journal, Company, Ledger, Model} = require('@pingleware/bestbooks-core');
const company = new Company();
new Journal();
new ChartOfAccounts();
new Ledger('Unknown','Unknown');

company.getCompanies(function(companies){
  console.log(companies)
  localStorage.setItem('companies',JSON.stringify(companies));
});

const model = new Model();
//get customers
model.query("SELECT * FROM customer",function(rows){
  localStorage.setItem('customers',JSON.stringify(rows));
})
// get sales tax jurisdictions
model.query("SELECT * FROM sales_tax",function(rows){
  localStorage.setItem('salestax_jurisdictions',JSON.stringify(rows));
})
// get payment terms
model.query("SELECT * FROM payment_terms",function(rows){
  localStorage.setItem('payment_terms',JSON.stringify(rows));
})

localStorage.setItem("accountTypes",JSON.stringify(AccountTypes));
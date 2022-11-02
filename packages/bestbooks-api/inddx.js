"use strict"

const core = require("@patrick-ingle/bestbooks-core");
const express = require("express");
const cors = require("cors");

const rest = express();

rest.use(cors());
rest.use(express.json());
rest.use(express.urlencoded({ extended: true }));

rest.get("bestbooks/v2/version/", function(req, res){

});
rest.get("bestbooks/v2/chartofaccounts/", function(req, res){
    const coa = new core.ChartOfAccounts();
    res.json({status: 'success', chart_of_accounts: coa.getList() });
});
rest.get("bestbooks/v2/account_types/", function(req, res){
    res.json({status: 'success', account_type: core.AccountTypes });
});
rest.post("bestbooks/v2/debit/",async function(req, res){
    const coa = new core.ChartOfAccounts();
    coa.add(req.body.account_name,req.body.account_type);
    const ledger = new core.Ledger(req.body.account_name,req.body.account_type);
    var ids = ledger.addDebit(req.body.date,req.body.description,req.body.amount);
    res.json({status: 'success', refid: ids});
});
rest.post("bestbooks/v2/credit/", function(req, res){
    const coa = new core.ChartOfAccounts();
    coa.add(req.body.account_name,req.body.account_type);
    const ledger = new core.Ledger(req.body.account_name,req.body.account_type);
    var ids = ledger.addCredit(req.body.date,req.body.description,req.body.amount);
    res.json({status: 'success', refid: ids});
});
rest.get("bestbooks/v2/balance/", function(req, res){
    const ledger = new core.Ledger(req.body.account_name,req.body.account_type);
    res.json({status: 'success', balance: ledger.getBalance()});
});
rest.put("bestbooks/v2/add/", function(req, res){
    res.json({status: 'success', sum: Number(req.body.adder) + Number(req.body.addend)});
});
rest.put("bestbooks/v2/subtract/", function(req, res){
    res.json({status: 'success', difference: Number(req.body.subtractor) + Number(req.body.subtractend)});
});


function start_server(host,port) {
    rest.listen(port, host, () => {
        console.log(host + " server running on port " + port);
    });  
}

module.exports = {
    start_server
}
"use strict"

const {
    ChartOfAccounts,
    AccountTypes,
    Ledger } = require("@pingleware/bestbooks-core");
const express = require("express");
const cors = require("cors");

const rest = express();

rest.use(cors());
rest.use(express.json());
rest.use(express.urlencoded({ extended: true }));

rest.get("/bestbooks/v2/version/", function(req, res){
    const pkg = require('./package.json');
    res.json({status: 'success', version: pkg.version});
});
rest.get("/bestbooks/v2/chartofaccounts/:companyId", function(req, res){
    const coa = new ChartOfAccounts();
    coa.getListSync(req.params.companyId, function(accounts){
        res.json({status: 'success', accounts:  accounts});
    });
});
rest.get("/bestbooks/v2/account_types/", function(req, res){
    res.json({status: 'success', account_type: AccountTypes });
});
rest.post("/bestbooks/v2/debit/",async function(req, res){
    const coa = new ChartOfAccounts();
    coa.add(req.body.account_name,req.body.account_type);
    const ledger = new Ledger(req.body.account_name,req.body.account_type);
    var ids = ledger.addDebit(req.body.date,req.body.description,req.body.amount,req.body.company_id,req.body.office_id);
    res.json({status: 'success', refid: ids});
});
rest.post("/bestbooks/v2/credit/", function(req, res){
    const coa = new ChartOfAccounts();
    coa.add(req.body.account_name,req.body.account_type);
    const ledger = new Ledger(req.body.account_name,req.body.account_type);
    var ids = ledger.addCredit(req.body.date,req.body.description,req.body.amount,req.body.company_id,req.body.office_id);
    res.json({status: 'success', refid: ids});
});
rest.get("/bestbooks/v2/balance/", function(req, res){
    const ledger = new Ledger(req.body.account_name,req.body.account_type);
    res.json({status: 'success', balance: ledger.getBalance()});
});
rest.put("/bestbooks/v2/add/", function(req, res){
    res.json({status: 'success', sum: Number(req.body.adder) + Number(req.body.addend)});
});
rest.put("/bestbooks/v2/subtract/", function(req, res){
    res.json({status: 'success', difference: Number(req.body.subtractor) - Number(req.body.subtractend)});
});
rest.get("/bestbooks/v2/headers", function(req, res){
    res.json({status: "error", message: "NOT IMPLEMENTED"});
})

/**
 * Sharing a Customer Invoice
 * 
 * using mod_proxy, setup a proxy redirect from your publicly accessible URL to the /customer/estimate server API
 */
rest.get("/customer/estimate/:num", function(req, res){
    res.send("NOT IMPLEMENTED");
});
rest.get("/customer/invoice/:num", function(req, res){
    res.send("NOT IMPLEMENTED");
});

/**
 * Sharing a Purchase Order
 */
// share a vendor purchase order
rest.get("/vendor/purchase/:num", function(req,res){
    res.send("NOT IMPLEMENTED");
})
// update a vendor purchase order
rest.put("/vendor/purchase/:num", function(req,res){
    res.send("NOT IMPLEMENTED");
})

function start_server(host,port) {
    try {
        rest.listen(port, host, () => {
            console.log(host + " server running on port " + port);
        });      
    } catch(error) {
        console.error(error);
    }
}

function stop_server() {
    rest.close();
}

module.exports = {
    start_server,
    stop_server
}
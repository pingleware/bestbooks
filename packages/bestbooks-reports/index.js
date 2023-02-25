"use strict"

const os = require('os');
const fs = require('fs');
const path = require('path');

function init() {
    
    const xslt_list = [
        "balance-sheet.xslt",
        "customer-estimate.xslt",
        "income-statement.xslt",
        "noted-to-financial-statements.xslt",
        "purchase-order.xslt",
        "statement-in-change-in-equity.xslt",
        "statement-of-cash-flows.xslt",
        "trial-balance.xslt"
    ];
    let copied = 0;

    xslt_list.forEach(function(file){
        if (!fs.existsSync(path.join(os.homedir(),`.bestbooks/${file}`))) {
            try {
                fs.copyFileSync(path.join('xslt',file),path.join(os.homedir(),`.bestbooks/${file}`));
                copied++;    
            } catch(error) {
                console.error(error);
            }
        }    
    });    

    return copied;
}
function copy(src,dest) {
    fs.copyFileSync(path.join('xslt',src),path.join(os.homedir(),`.bestbooks/${dest}`));
}

const BalanceSheet = require('./balance-sheet');
const IncomeStatement = require('./income-statement');
const NoteToFinancialStatements = require('./noteToFinancialStatements');
const StatementCashFlows = require('./statementCashFlows');
const StatementChangeInEquity = require('./statementChangeOfEquity');
const TrialBalance = require('./trial-balance');
const RetainedEarnings = require('./retained-earnings');

module.exports = {
    init,
    copy,
    BalanceSheet,
    IncomeStatement,
    TrialBalance,
    NoteToFinancialStatements,
    StatementCashFlows,
    StatementChangeInEquity,
    RetainedEarnings
}
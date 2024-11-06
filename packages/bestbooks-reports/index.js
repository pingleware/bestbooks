"use strict"

const os = require('os');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');


function init() {
    // TODO: move this INSERT in the Core.Report class per CODING STANDARDS
    const { Model } = require('@pingleware/bestbooks-core');
    const model = new Model();
    model.insertSync(`CREATE TABLE IF NOT EXISTS "report" (
        "id"	INTEGER,
        "txdate"	TIMESTAMP,
        "name"	TEXT,
        "contents"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    )`)
    
    const xslt_list = [
        "account-payables-aging.xslt",
        "account-receivables-aging.xslt",    
        "balance-sheet.xslt",
        "breakeven-analysis.xslt",
        "budget-vs-actual.xslt",
        "customer-estimate.xslt",
        "income-statement.xslt",
        "income-statement-geographic.xslt",
        "note-to-financial-statements.xslt",
        "purchase-order.xslt",
        "statement-in-change-in-equity.xslt",
        "statement-of-cash-flows.xslt",
        "trial-balance.xslt",
        "retained-earnings.xslt"
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

const AccountPayablesAging = require('./account-payables-aging');
const AccountsReceivablesAging = require('./account-receivables-aging');
const BalanceSheet = require('./balance-sheet');
const BreakevenAnalysis = require('./breakeven-analysis');
const BudgetVsActual = require('./budget-vs-actual');
const IncomeStatement = require('./income-statement');
const NoteToFinancialStatements = require('./noteToFinancialStatements');
const StatementCashFlows = require('./statementCashFlows');
const StatementChangeInEquity = require('./statementChangeOfEquity');
const TrialBalance = require('./trial-balance');
const RetainedEarnings = require('./retained-earnings');
const PurchaseOrder = require('./purchase-order');
const CustomerEstimate = require('./customer-estimate');



const parseString = require('xml2js').parseString;
const {
    getReportFileName,
    getReportRootFileName,
    transform_xml_xslt,
    format,
    array2xml
} = require('./formatReport');

module.exports = {
    init,
    copy,
    AccountPayablesAging,
    AccountsReceivablesAging,
    BalanceSheet,
    BreakevenAnalysis,
    BudgetVsActual,
    IncomeStatement,
    TrialBalance,
    NoteToFinancialStatements,
    StatementCashFlows,
    StatementChangeInEquity,
    RetainedEarnings,
    PurchaseOrder,
    CustomerEstimate,
    parseString,
    getReportFileName,
    getReportRootFileName,
    transform_xml_xslt,
    format,
    array2xml
}


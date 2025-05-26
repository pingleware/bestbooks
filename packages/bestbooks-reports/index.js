"use strict"

const os = require('os');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');


async function init() {
    const { Report } = require('@pingleware/bestbooks-core');
    new Report(); // will create table, if needed?
    
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

    xslt_list.forEach(function(file) {
        const sourcePath = path.join('xslt', file);
        const destPath = path.join(os.homedir(), `.bestbooks/${file}`);
        
        // Check if destination file exists
        if (!fs.existsSync(destPath)) {
            // If it doesn't exist, copy the file
            try {
                fs.copyFileSync(sourcePath, destPath);
                copied++;
            } catch (error) {
                console.error(error);
            }
        } else {
            // If the destination file exists, compare modification times
            try {
                const sourceStat = fs.statSync(sourcePath);
                const destStat = fs.statSync(destPath);
                
                // Check if source file is newer than destination file
                if (sourceStat.mtime > destStat.mtime) {
                    fs.copyFileSync(sourcePath, destPath);
                    copied++;
                }
            } catch (error) {
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
const StatementCashFlows = require('./statementCashFlows');
const StatementChangeInEquity = require('./statementChangeOfEquity');
const TrialBalance = require('./trial-balance');
const RetainedEarningsReport = require('./retained-earnings');
const PurchaseOrder = require('./purchase-order');
const CustomerEstimate = require('./customer-estimate');
const NoteToFinancialStatements = require('./noteToFinancialStatements');


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
    StatementCashFlows,
    StatementChangeInEquity,
    RetainedEarningsReport,
    PurchaseOrder,
    CustomerEstimate,
    NoteToFinancialStatements,
    parseString,
    getReportFileName,
    getReportRootFileName,
    transform_xml_xslt,
    format,
    array2xml
}


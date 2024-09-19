"use strict"

/**
 * From: https://www.accountingtools.com/articles/statement-of-changes-in-equity.html
 * 
 * The statement of changes in equity is a reconciliation of the beginning and ending balances in a company’s equity during a reporting period. 
 * It is not considered an essential part of the monthly financial statements, and so is the most likely of all the financial statements 
 * not to be issued. However, it is a common part of the annual financial statements. The statement starts with the beginning equity balance, 
 * and then adds or subtracts such items as profits and dividend payments to arrive at the ending ending balance. The general calculation structure 
 * of the statement is as follows:
 * 
 *          Beginning equity + Net income – Dividends +/- Other changes = Ending equity
 * 
 * Contents of the Statement of Changes in Equity
 * ----------------------------------------------
 * 
 * The transactions most likely to appear on this statement are as follows:
 * 
 *     - Net profit or loss
 *     - Dividend payments
 *     - Proceeds from the sale of stock
 *     - Treasury stock purchases
 *     - Gains and losses recognized directly in equity
 *     - Effects of changes due to errors in prior periods
 *     - Effects of changes in fair value for certain assets
 */

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class StatementChangeInEquity extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,_format,callback,notes="") {
        this.retrieveReportData(startDate, endDate, function(data){
            if (_format == "array") {
                let ending_equity_total = Number(data[0].beginning_equity_total) + Number(data[0].net_income_total) - Number(data[0].dividends_payable_total) + Number(data[0].paidin_capital_total) + Number(data[0].treasury_shares_total).toFixed(2);
                var _data = {
                    date: new Date().toDateString(),
                    beginning_equity: Number(data[0].beginning_equity_total).toFixed(2),
                    net_income: Number(data[0].net_income_total).toFixed(2),
                    dividends: Number(data[0].dividends_payable_total).toFixed(2),
                    other_change: Number(data[0].paidin_capital_total).toFixed(2) + Number(data[0].treasury_shares_total).toFixed(2),
                    ending_equity: ending_equity_total,
                    notes: notes
                };
                var formattedData = array2xml('statementChangeInEquity',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/statement-of-change-in-equity.xml'), formattedData);
                // Save report XML data to report table
                var txdate = new Date().getTime();
                var buffer = require('buffer').Buffer;
                var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','statement-of-change-in-equity','${buffer.from(formattedData).toString('base64')}')`;
                const model = new Model();
                if (callback) {
                    model.insert(sql,function(result){
                        callback(format('statementChangeInEquity',formattedData));
                    });
                } else {
                    model.insertSync(sql);
                    return format('statementChangeInEquity',formattedData);
                }
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        var _startDate = startDate;
        var lastYear, lastStartDate, lastEndDate;
        if (_startDate.length == 0) {
            lastYear = Number(new Date().getFullYear() - 1);
        } else {
            lastYear = Number(new Date(startDate).getFullYear() - 1);
        }
        lastStartDate = new Date(`01-01-${lastYear}`).toISOString().split('T')[0];
        lastEndDate = new Date(`12-31-${lastYear}`).toISOString().split('T')[0];

        var equity_code = `SELECT code FROM accounts WHERE type="Equity" AND NOT name LIKE '%retained%' AND NOT name LIKE '%Paid-in Capital%'`;
        var dividends_payable_code = `SELECT code FROM accounts WHERE name='Dividends Payable'`;
        var paid_in_capital_code = `SELECT code FROM accounts WHERE name LIKE '%Paid-in Capital%'`;
        var treasury_shares_code = `SELECT code FROM accounts WHERE name LIKE '%Treasury%'`;

        var beginning_equity_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.0) FROM ledger WHERE (DATE(txdate) BETWEEN '${lastStartDate}' AND '${lastEndDate}') AND account_code IN (${equity_code})`;
        var net_income_total = `SELECT IFNULL(ROUND(SUM(debit)+SUM(credit),2),0.0) FROM ledger WHERE (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}') AND account_code LIKE '5%'`;
        var dividends_payable_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.0) FROM ledger WHERE (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}') AND account_code IN (${dividends_payable_code})`;
        var paidin_capital_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.0) FROM ledger WHERE (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}') AND account_code IN (${paid_in_capital_code})`;
        var treasury_shares_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.0) FROM ledger WHERE (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}') AND account_code IN (${treasury_shares_code})`;

        var sql = `SELECT (${beginning_equity_total}) AS beginning_equity_total,(${net_income_total}) AS net_income_total,(${dividends_payable_total}) AS dividends_payable_total,(${paidin_capital_total}) AS paidin_capital_total,(${treasury_shares_total}) AS treasury_shares_total`;
        console.log(sql)
        const model = new Model();
        model.query(sql,callback);
    }

    async retrieveReportDataSync(startDate,endDate) {
        return new Promise((resolve, reject) => {
            this.retrieveReportData(startDate, endDate, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = StatementChangeInEquity;
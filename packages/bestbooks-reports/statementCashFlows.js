"use strict"

/**
 * Statement of Cash Flows aka Cash Flow Statement
 * 
 * for Cash and Cash Equivalent accounts
 * 
 * 1. Determine the Starting Balance
 * 2. Calculate Cash Flow from Operating Activities
 * 3. Calculate Cash Flow from Investing Activities
 * 4. Calculate Cash Flow from Financing Activity
 * 5. Determine the Ending Balance
 * 
 */

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class StatementCashFlows extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,_format,callback) {

        this.retrieveReportData(startDate, endDate, function(data){
            if (_format == "array") {
                let ending_balance = Number(data[0].starting_balance) + Number(data[0].operations_cashflow_total) + Number(data[0].investment_cashflow_total) + Number(data[0].financing_cashflow_total);
                var _data = {
                    date: new Date().toDateString(),
                    starting_balance: data[0].starting_balance,
                    operating_total: data[0].operations_cashflow_total,
                    investment_total: data[0].investment_cashflow_total,
                    financing_total: data[0].financing_cashflow_total,
                    ending_balance: ending_balance
                };
                var formattedData = array2xml('statementCashFlows',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/statement-of-cash-flows.xml'), formattedData);
                // Save report XML data to report table
                var txdate = new Date().getTime();
                var buffer = require('buffer').Buffer;
                var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','statement-of-cash-flows','${buffer.from(formattedData).toString('base64')}')`;
                const model = new Model();
                if (callback) {
                    model.insert(sql,function(result){
                        callback(formattedData);
                    });
                } else {
                    model.insertSync(sql);
                    return formattedData;
                }
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        var lastYear, lastStartDate, lastEndDate;
        if (startDate.length == 0) {
            lastYear = Number(new Date().getFullYear() - 1);
        } else {
            lastYear = Number(new Date(startDate).getFullYear() - 1);
        }
        lastStartDate = new Date(`01-01-${lastYear}`).toISOString().split('T')[0];
        lastEndDate = new Date(`12-31-${lastYear}`).toISOString().split('T')[0];

        var starting_balance = `SELECT (SELECT IFNULL(ROUND(SUM(debit)+SUM(credit),2),0.00) FROM ledger WHERE DATE(txdate) BETWEEN '${lastStartDate}' AND '${lastEndDate}' AND account_code LIKE '5%') AS starting_balance`;
        var operations_codes = `SELECT code FROM accounts WHERE (type='Income' OR type='Revenue') AND (NOT name LIKE '%interest%' OR NOT name LIKE '%financing%')`;
        var investment_codes = `SELECT code FROM accounts WHERE type='Investment'`;
        var financing_codes = `SELECT code FROM accounts WHERE (type='Income' OR type='Revenue') AND (name LIKE '%interest%' OR name LIKE '%financing%')`;

        var operations_cashflow_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.00) FROM ledger WHERE account_code IN (${operations_codes}) AND (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}')`;
        var investment_cashflow_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.00) FROM ledger WHERE account_code IN (${investment_codes}) AND (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}')`;
        var financing_cashflow_total = `SELECT IFNULL(ROUND(SUM(debit)-SUM(credit),2),0.00) FROM ledger WHERE account_code IN (${financing_codes}) AND (DATE(txdate) BETWEEN '${startDate}' AND '${endDate}')`;

        var sql = `SELECT (${starting_balance}) AS starting_balance,(${operations_cashflow_total}) AS operations_cashflow_total,(${investment_cashflow_total}) AS investment_cashflow_total, (${financing_cashflow_total}) AS financing_cashflow_total;`;
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

module.exports = StatementCashFlows;
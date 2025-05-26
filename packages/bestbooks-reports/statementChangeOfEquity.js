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

const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class StatementChangeInEquity extends BaseReport {
    constructor() {
        super();
    }

    saveReport(name, contents, type="xml",callback=null){
        const filePath = path.join(os.homedir(),`.bestbooks/${name}.${type}`);
        // the xslt-processor does not support the XSLT syntax xsl:for-each-group, 
        // so the XML generated is returned,
        // using a free tool like https://xslttest.appspot.com/, 
        // to copy the .bestbooks/balance-sheet.xslt and .bestbooks/balance-sheet.xml
        // to render a HTML
        // TODO: implement xsl:for-each-group. callback(format("balanceSheet",formattedData));

        fs.writeFileSync(filePath, contents);
        callback(filePath)
    }

    async saveReportSync(name, html, type) {
        return new Promise((resolve,reject) => {
            try {
                this.saveReport(name, html, type, function(filePath){
                    resolve(filePath);
                })    
            } catch(error) {
                reject(error);
            }
        })
    }

    async formatHtml(formattedData) {
        return format('statementChangeInEquity',formattedData);
    }

    async formatXml(contents) {
        return array2xml('statementChangeInEquity',contents);
    }

    async formatArray(data,notes) {
        var _data = {};

        Object.keys(data).forEach(function(key){
            _data[key] = data[key];
        })

        _data["notes"] = notes;

        return _data;
    }

    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate,endDate));
    }

    async retrieveReportDataSync(startDate,endDate) {
        return this.statementOfChangesInEquitySync(startDate,endDate);
    }
}

module.exports = StatementChangeInEquity;
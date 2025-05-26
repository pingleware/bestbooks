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

const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class StatementCashFlows extends BaseReport {
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
        return format('statementCashFlows',formattedData);
    }

    async formatXml(contents) {
        return array2xml('statementCashFlows',contents);
    }

    async formatArray(data, notes, starting_balance=0) {
        let operations_cashflow_total = 0;
        let investment_cashflow_total = 0;
        let financing_cashflow_total = 0;

        data.forEach(function(item){
            if (item.transaction_type == 'Operating') {
                operations_cashflow_total += item.net_cash_flow;
            } else if (item.transaction_type == 'Investing') {
                investment_cashflow_total += item.net_cash_flow;
            } else if (item.transaction_type == 'Financing') {
                financing_cashflow_total += item.net_cash_flow;
            }
        })
        let ending_balance = Number(starting_balance) + Number(operations_cashflow_total) + Number(investment_cashflow_total) + Number(financing_cashflow_total);
        var _data = {
            date: new Date().toDateString(),
            starting_balance: starting_balance,
            operating_total: operations_cashflow_total,
            investment_total: investment_cashflow_total,
            financing_total: financing_cashflow_total,
            ending_balance: ending_balance,
            notes: notes,
        };

        return _data;
    }

    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate,endDate));
    }
    async retrieveReportDataSync(startDate,endDate) { 
        return this.cashFlowStatementSync(startDate,endDate);
    }
}

module.exports = StatementCashFlows;
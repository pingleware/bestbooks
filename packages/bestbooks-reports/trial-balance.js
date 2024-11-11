"use strict"

const BaseReport = require('./report');

const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class TrialBalance extends BaseReport {
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
        return format('trialBalance',formattedData);
    }

    async formatXml(contents) {
        return array2xml('trialBalance',contents);
    }

    async formatArray(data, notes) {
        let total_debit = 0;
        let total_credit = 0;
    
        data.forEach(function (totalItem) {
            total_debit += Number(totalItem.total_debit);
            total_credit += Number(totalItem.total_credit);
        });
    
        // Format total values to two decimal places
        const total = {
            debit: total_debit.toFixed(2),
            credit: total_credit.toFixed(2)
        };
    
        // Create line items array
        const lineItems = data.map(function (lineItem) {
            return {
                code: lineItem.code,
                name: lineItem.name,
                debit: Number(lineItem.total_debit).toFixed(2),
                credit: Number(lineItem.total_credit).toFixed(2)
            };
        });
    
        // Structure the final data object
        const _data = {
            date: new Date().toDateString(),
            lineItems: lineItems,
            total: total
        };
    
        return _data;
    }
    

    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate,endDate));
    }

    async retrieveReportDataSync(startDate, endDate) {
        return await this.trialBalanceSync(startDate, endDate);
    }
}

module.exports = TrialBalance;
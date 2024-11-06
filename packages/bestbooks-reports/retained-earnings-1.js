"use strict"

const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class RetainedEarnings extends BaseReport {
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
        return format('retainedEarnings',formattedData);
    }

    async formatXml(contents) {
        return array2xml('retainedEarnings',contents);
    }

    async formatArray(data, notes) {
        var _data = {
            date: new Date().toDateString(),
            previous_retained_earnings: Number(data[0].previous_retained_earnings).toFixed(2),
            net_income: Number(data[0].net_income).toFixed(2),
            retained_earnings: Number(data[0].retained_earnings).toFixed(2),
            notes: notes
        };

        return _data;
    }


    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate,endDate));
    }

    async retrieveReportDataSync(startDate,endDate) {
        return this.statementOfRetainedEarningsSync(startDate,endDate);
    }
}

module.exports = RetainedEarnings;
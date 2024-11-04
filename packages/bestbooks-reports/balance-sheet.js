"use strict"

const BaseReport = require('./report');

const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class BalanceSheet extends BaseReport {
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
        return format('balanceSheet',formattedData);
    }

    async formatXml(contents) {
        return array2xml('balanceSheet',contents);
    }

    async formatArray(data,notes) {
        var _data = {
            date: new Date().toDateString(),
            lineItems: [],
            totalAsset: 0,
            totalLiability: 0,
            totalIncome: 0,
            totalExpense: 0,
            totalEquity: 0,
            totalLiabilitiesShareholdersEquity: 0,
            notes: notes
        }
        let totalAsset = 0;
        let totalLiability = 0;
        let totalIncome = 0;
        let totalExpense = 0;
        let totalEquity = 0;

        var lineItems = [];
        var assetLineItems = [];
        var LiabilityLineItems = [];
        var equityLineItems = [];
        var incomeLineItems = [];
        var expenseLineItems = [];

        data.forEach(function(lineItem){
            switch(lineItem.type) {
                case 'Asset':
                    assetLineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        balance: Number(lineItem.balance).toFixed(2),
                        type: lineItem.type    
                    })
                    totalAsset += Number(lineItem.balance);
                    break;
                case 'Liability':
                    LiabilityLineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        balance: Number(lineItem.balance).toFixed(2),
                        type: lineItem.type    
                    })
                    totalLiability += Number(lineItem.balance);
                    break;
                case 'Expense':
                    expenseLineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        balance: Number(lineItem.balance).toFixed(2),
                        type: lineItem.type    
                    })
                    totalExpense += Number(lineItem.balance);
                    break;
                case 'Income':
                    incomeLineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        balance: Number(lineItem.balance).toFixed(2),
                        type: lineItem.type    
                    })
                    totalIncome += Number(lineItem.balance);
                    break;
                case 'Equity':
                    equityLineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        balance: Number(lineItem.balance).toFixed(2),
                        type: lineItem.type    
                    })
                    totalEquity += Number(lineItem.balance);
                    break;
            }
        });

        _data.lineItems = { assets: assetLineItems, liabilities: LiabilityLineItems, expenses: expenseLineItems, income: incomeLineItems, equity: equityLineItems };
        _data.totalAsset = totalAsset.toFixed(2);
        _data.totalLiability = totalLiability.toFixed(2);
        _data.totalIncome = totalIncome.toFixed(2);
        _data.totalExpense = totalExpense.toFixed(2);
        _data.totalEquity = totalEquity.toFixed(2);
        _data.totalLiabilitiesShareholdersEquity = (totalLiability + totalEquity).toFixed(2);

        //const txdate = new Date().getTime();
        //const buffer = require('buffer').Buffer;
        // TODO: move this INSERT in the Core.Report class per CODING STANDARDS
        //const sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','balance-sheet','${buffer.from(formattedData).toString('base64')}')`;
        //const model = new Model();
        //if (callback) {
        //    //model.insert(sql,function(record_id,changes){
        //        callback(format('balanceSheet',formattedData));
        //    //});
        //} else {
        //    //model.insertSync(sql);
        //    return format('balanceSheet'.formattedData);
        //}
        return _data;
    }

    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate,endDate));
    }

    async retrieveReportDataSync(startDate, endDate) {
        return await this.balanceSheetSync(startDate, endDate);
    }
}

module.exports = BalanceSheet;
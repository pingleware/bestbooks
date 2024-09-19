"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class BalanceSheet extends BaseReport {
    constructor() {
        super();
    }

    saveReport(name,contents,callback=null){
    }

    createReport(startDate,endDate,_format,callback,notes="") {
        try {
            this.retrieveReportData(startDate, endDate, function(data){
                if (_format == "array") {
                    //console.log(data);
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


                    //console.log(data);
    
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
                    //console.log(lineItems);
                    _data.lineItems = { assets: assetLineItems, liabilities: LiabilityLineItems, expenses: expenseLineItems, income: incomeLineItems, equity: equityLineItems };
                    _data.totalAsset = totalAsset.toFixed(2);
                    _data.totalLiability = totalLiability.toFixed(2);
                    _data.totalIncome = totalIncome.toFixed(2);
                    _data.totalExpense = totalExpense.toFixed(2);
                    _data.totalEquity = totalEquity.toFixed(2);
                    _data.totalLiabilitiesShareholdersEquity = (totalLiability + totalEquity).toFixed(2);
                    //console.log(_data.lineItems)
                   //console.log(_data);
                    var formattedData = array2xml('balanceSheet',_data);
                    //console.log(formattedData)
                    fs.writeFileSync(path.join(os.homedir(),'.bestbooks/balanceSheet.xml'), formattedData);
                    // the xslt-processor does not support the XSLT syntax xsl:for-each-group, so the XML generated is returned,
                    // using a free tool like https://xslttest.appspot.com/, to copy the .bestbooks/balance-sheet.xslt and .bestbooks/balance-sheet.xml
                    // to render a HTML
                    // TODO: implement xsl:for-each-group. callback(format("balanceSheet",formattedData));
    
                    const txdate = new Date().getTime();
                    const buffer = require('buffer').Buffer;
                    const sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','balance-sheet','${buffer.from(formattedData).toString('base64')}')`;
                    const model = new Model();
                    if (callback) {
                        //model.insert(sql,function(record_id,changes){
                            callback(format('balanceSheet',formattedData));
                        //});
                    } else {
                        //model.insertSync(sql);
                        return format('balanceSheet'.formattedData);
                    }
                } else {
                    // process other formats
                }    
            });    
        } catch(err) {
            console.error(err);
        }
    }

    retrieveReportData(startDate,endDate,callback) {
        var sql = '';
        if (startDate.length == 0 && endDate.length == 0) {
            sql = `SELECT * FROM balance_sheet;`;
        } else {
            sql = `SELECT txdate AS date,
                    account_code AS code,
                    account_name AS name,
                    note AS description,
                    SUM(debit)-SUM(credit) AS balance,
                    accounts.base_type AS type FROM ledger 
                    JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE ledger.txdate BETWEEN ${startDate} AND ${endDate} 
                    GROUP BY account_name ORDER BY accounts.base_type`;
        }
        const model = new Model();
        model.query(sql,callback);
    }

    async retrieveReportDataSync(startDate, endDate) {
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

module.exports = BalanceSheet;
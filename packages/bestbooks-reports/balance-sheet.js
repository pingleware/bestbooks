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

    createReport(startDate,endDate,_format,callback) {
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
                    totalLiabilitiesShareholdersEquity: 0
                }
                let totalAsset = 0;
                let totalLiability = 0;
                let totalIncome = 0;
                let totalExpense = 0;
                let totalEquity = 0;

                data.forEach(function(lineItem){
                    switch(lineItem.type) {
                        case 'Asset':
                            _data.lineItems.push(lineItem);
                            totalAsset += Number(lineItem.balance);
                            break;
                        case 'Liability':
                            _data.lineItems.push(lineItem);
                            totalLiability += Number(lineItem.balance);
                            break;
                        case 'Expense':
                            _data.lineItems.push(lineItem);
                            totalExpense += Number(lineItem.balance);
                            break;
                        case 'Income':
                            _data.lineItems.push(lineItem);
                            totalIncome += Number(lineItem.balance);
                            break;
                        case 'Equity':
                            _data.lineItems.push(lineItem);
                            totalEquity += Number(lineItem.balance);
                            break;
                    }
                });
                _data.totalAsset = totalAsset;
                _data.totalLiability = totalLiability;
                _data.totalIncome = totalIncome;
                _data.totalExpense = totalExpense;
                _data.totalEquity = totalEquity;
                _data.totalLiabilitiesShareholdersEquity = totalLiability + totalEquity;
                //console.log(_data);
                var formattedData = array2xml('balanceSheet',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/balanceSheet.xml'), formattedData);
                // the xslt-processor does not suppot the XSLT syntax xsl:for-each-group, so the XML generated is returned,
                // using a free tool like https://xslttest.appspot.com/, to copy the .bestbooks/balance-sheet.xslt and .bestboos/balance-sheet.xml
                // to render a HTML
                // TODO: implement xsl:for-each-group. callback(format("balanceSheet",formattedData));

                var txdate = new Date().getTime();
                var buffer = require('buffer').Buffer;
                var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','balance-sheet','${buffer.from(formattedData).toString('base64')}')`;
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
        var sql = '';
        if (startDate.length == 0 && endDate.length == 0) {
            sql = `SELECT * FROM balance_sheet;`;
        } else {
            sql = `SELECT account_code AS code,
                    account_name AS name,SUM(debit)-SUM(credit) AS balance,
                    accounts.base_type AS type FROM ledger 
                    JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE ledger.txdate BETWEEN ${startDate} AND ${endDate} 
                    GROUP BY account_name ORDER BY accounts.base_type`;
        }
        const model = new Model();
        model.query(sql,callback);
    }
}

module.exports = BalanceSheet;
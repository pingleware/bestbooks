"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class IncomeStatement extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,_format,callback,notes="") {
        this.retrieveReportData(startDate, endDate, function(data){
            if (_format == "array") {
                var _data = {
                    date: new Date().toDateString(),
                    lineItems: [],
                    totalIncome: 0,
                    totalExpense: 0,
                    netIncome: 0
                };
                let totalIncome = 0;
                let totalExpense = 0;

                var lineItems = [];

                data.forEach(function(lineItem){
                    switch(lineItem.type) {
                        case 'Expense':
                            lineItems.push(lineItem);
                            totalExpense += Number(lineItem.balance);
                            break;
                        case 'Income':
                            lineItems.push(lineItem);
                            totalIncome += Number(lineItem.balance);
                            break;
                        case 'Revenue':
                            lineItem.type = "Income";
                            lineItems.push(lineItem);
                            totalIncome += Number(lineItem.balance);
                            break;
                    }
                });
                let netIncome = Number(totalIncome - totalExpense).toFixed(2);

                _data.lineItems = { lineitem: lineItems };
                _data.totalIncome = totalIncome.toFixed(2);
                _data.totalExpense = totalExpense.toFixed(2);
                _data.netIncome = netIncome;
                _data.notes = notes;

                var formattedData = array2xml('incomeStatement',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/income-statement.xml'), formattedData);

                var txdate = new Date().getTime();
                var buffer = require('buffer').Buffer;
                var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','income-statement','${buffer.from(formattedData).toString('base64')}')`;
                const model = new Model();
                if (callback) {
                    model.insert(sql,function(result){
                        callback(format('incomeStatement', formattedData));
                    });
                } else {
                    model.insertSync(sql);
                    return format('incomeStatement',formattedData);
                }
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        const sql = `SELECT account_code AS code,account_name AS name,
                    ROUND(SUM(debit)-SUM(credit),2) AS balance,accounts.base_type AS type 
                    FROM ledger JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE accounts.type='Income' OR accounts.type='Expense'  OR accounts.type='Revenue'
                    GROUP BY account_name 
                    ORDER BY accounts.type`;
        const model = new Model();
        model.query(sql, function(data){
            callback(data);
        });            
    }
}

module.exports = IncomeStatement;
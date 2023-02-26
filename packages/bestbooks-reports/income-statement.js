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

    createReport(startDate,endDate,format,callback) {
        this.retrieveReportData(startDate, endDate, function(data){
            if (format == "array") {
                var _data = {
                    date: new Date().toDateString(),
                    lineItems: [],
                    totalIncome: 0,
                    totalExpense: 0,
                    netIncome: 0
                };
                let totalIncome = 0;
                let totalExpense = 0;

                data.forEach(function(lineItem){
                    switch(lineItem.type) {
                        case 'Expense':
                            _data.lineItems.push(lineItem);
                            totalExpense += Number(lineItem.balance);
                            break;
                        case 'Income':
                            _data.lineItems.push(lineItem);
                            totalIncome += Number(lineItem.balance);
                            break;
                    }
                });
                _data.totalIncome = totalIncome;
                _data.totalExpense = totalExpense;
                _data.netIncome = Number(totalIncome - totalExpense);
                var formattedData = array2xml('incomeStatement',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/income-statement.xml'), formattedData);

                callback(formattedData);
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        var sql = `SELECT account_code AS code,account_name AS name,
                    ROUND(SUM(debit)-SUM(credit),2) AS balance,accounts.base_type AS type 
                    FROM ledger JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE accounts.type='Income' OR accounts.type='Expense' 
                    GROUP BY account_name 
                    ORDER BY accounts.type`;
        const model = new Model();
        model.query(sql, function(data){
            callback(data);
        });            
    }
}

module.exports = IncomeStatement;
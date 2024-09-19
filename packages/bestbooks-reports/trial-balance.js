"use strict"

const { Report, Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class TrialBalance extends BaseReport {
    constructor() {
        super();
        this.report = new Report();
    }

    createReport(startDate,endDate,_format,callback) {
        this.retrieveReportData(startDate, endDate, function(data){
            if (_format == "array") {
                var totalItems = [];
                data[1].forEach(function(totalItem){
                    totalItems.push({
                        debit: Number(totalItem.debit).toFixed(2),
                        credit: Number(totalItem.credit).toFixed(2)
                    })
                })
                var lineItems = [];
                data[0].forEach(function(lineItem){
                    lineItems.push({
                        code: lineItem.code,
                        name: lineItem.name,
                        debit: lineItem.debit.toFixed(2),
                        credit: lineItem.credit.toFixed(2)
                    })
                })
                var _data = {
                    date: new Date().toDateString(),
                    lineItems: lineItems,
                    total: totalItems
                };
                var formattedData = array2xml('trialBalance',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/trialBalance.xml'), formattedData);
                if (callback) {
                    callback(format("trialBalance",formattedData));
                } else {
                    return format("trialBalance",formattedData);
                }
            } else {
                // process other formats
            }                    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        this.report.trialBalance(startDate, endDate, function(lineItems){
            const model = new Model();
            model.query('SELECT SUM(debit) AS debit,SUM(credit) AS credit FROM trial_balance;',function(totals){
                callback([lineItems,totals]);
            });
        });
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
    }}

module.exports = TrialBalance;
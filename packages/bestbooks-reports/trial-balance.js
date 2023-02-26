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
                var _data = {
                    date: new Date().toDateString(),
                    lineItems: data[0],
                    total: data[1]
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

    async retrieveReportData(startDate,endDate,callback) {
        this.report.trialBalance(startDate, endDate, function(lineItems){
            const model = new Model();
            model.query('SELECT SUM(debit) AS debit,SUM(credit) AS credit FROM trial_balance;',function(totals){
                callback([lineItems,totals]);
            });
        });
    }
}

module.exports = TrialBalance;
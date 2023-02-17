"use strict"

const { Report } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

class TrialBalance extends BaseReport {
    constructor() {
        super();
        this.report = new Report();
    }

    createReport(startDate,endDate,format,callback) {
        this.retrieveReportData(startDate, endDate, function(data){
            if (format == "array") {
                if (callback) {
                    callback(data);
                } else {
                    return data;
                }
            } else {
                // process other formats
            }                    
        });
    }

    async retrieveReportData(startDate,endDate,callback) {
        this.report.trialBalance(startDate, endDate, function(rows){
            callback(rows);
        });
    }
}

module.exports = TrialBalance;
"use strict"

const { Report } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

class TrialBalance extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {
        this.retrieveReportData(startDate, endDate).then(function(data){
            if (format == "array") {
                return data;
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate) {
        var report = new Report();
        report.trialBalance(startDate,endDate,function(results){
            console.log(results);
            return results;
        });
    }
}

module.exports = TrialBalance;
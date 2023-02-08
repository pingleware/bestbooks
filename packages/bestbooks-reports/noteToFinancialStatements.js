"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

class NoteToFinancialStatements extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {
        var data = this.retrieveReportData(startDate, endDate);
        if (format == "array") {
            return data;
        } else {
            // process other formats
        }
    }

    retrieveReportData(startDate,endDate) {

    }
}

module.exports = NoteToFinancialStatements;
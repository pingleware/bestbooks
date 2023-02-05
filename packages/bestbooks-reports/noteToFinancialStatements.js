"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const Report = require('./report');

class NoteToFinancialStatements extends Report {
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
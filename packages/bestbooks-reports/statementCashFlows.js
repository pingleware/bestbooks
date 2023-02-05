"use strict"

/**
 * Statement of Cash Flows aka Cash Flow Statement
 * 
 * for Cash and Cash Equivalent accounts
 * 
 * 1. Determine the Starting Balance
 * 2. Calculate Cash Flow from Operating Activities
 * 3. Calculate Cash Flow from Investing Activities
 * 4. Calculate Cash Flow from FInancing Activity
 * 5. Determine the Ending Balance
 * 
 */

const { Model } = require('@pingleware/bestbooks-core');
const Report = require('./report');

class StatementCashFlows extends Report {
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

module.exports = StatementCashFlows;
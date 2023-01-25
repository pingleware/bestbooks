"use strict"

const core = require('@pingleware/bestbooks-core');
const Report = require('./report');

class StatementCashFlows extends Report {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {

    }

    retrieveReportData(startDate,endDate) {

    }
}

module.exports = StatementCashFlows;
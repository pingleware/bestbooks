"use strict"

const core = require('@patrick-ingle/bestbooks-core');
const Report = require('./report');

class IncomeStatement extends Report {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {

    }

    retrieveReportData(startDate,endDate) {

    }
}

module.exports = IncomeStatement;
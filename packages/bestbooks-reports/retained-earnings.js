"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

class RetainedEarnings extends BaseReport {
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
        var sql = `SELECT ((SELECT SUM(debit)+SUM(credit) as net_income FROM ledger WHERE account_code LIKE '9%') - SUM(debit)+SUM(credit)) AS retained_earnings 
            FROM ledger WHERE account_name='Dividends Payable' AND 
            txdate BETWEEN ${startDate} AND ${endDate}`;
        const model = new Model();
        return model.querySync(sql);
    }
}

module.exports = RetainedEarnings;
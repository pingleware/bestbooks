"use strict"

const core = require('@pingleware/bestbooks-core');
const Report = require('./report');

class TrialBalance extends Report {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {
        var sql = `SELECT SUM(debit) AS debit_total,SUM(credit) AS credit_total,
                    CASE WHEN (SUM(debit)=SUM(credit)) THEN 'in_balance' ELSE 'out_of_balance' END AS trial_balance 
                    FROM ledger;`;
    }

    retrieveReportData(startDate,endDate) {

    }
}

module.exports = TrialBalance;
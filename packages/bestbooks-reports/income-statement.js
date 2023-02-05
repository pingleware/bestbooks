"use strict"

const core = require('@pingleware/bestbooks-core');
const Report = require('./report');

class IncomeStatement extends Report {
    constructor() {
        super();
    }

    createReport(startDate,endDate,format) {
        var sql = `SELECT account_code AS code,account_name AS name,
                    SUM(debit)-SUM(credit) AS balance,accounts.base_type AS type 
                    FROM ledger JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE accounts.base_type='Revenue' OR accounts.base_type='Expense' 
                    GROUP BY account_name 
                    ORDER BY accounts.base_type`;
    }

    retrieveReportData(startDate,endDate) {

    }
}

module.exports = IncomeStatement;
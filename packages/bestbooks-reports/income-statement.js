"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');

class IncomeStatement extends BaseReport {
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
        var sql = `SELECT account_code AS code,account_name AS name,
                    SUM(debit)-SUM(credit) AS balance,accounts.base_type AS type 
                    FROM ledger JOIN accounts ON accounts.name=ledger.account_name 
                    WHERE accounts.base_type='Revenue' OR accounts.base_type='Expense' 
                    GROUP BY account_name 
                    ORDER BY accounts.base_type`;
        const model = new Model();
        return model.querySync(sql);            
    }
}

module.exports = IncomeStatement;
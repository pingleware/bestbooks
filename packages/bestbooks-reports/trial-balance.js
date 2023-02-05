"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const Report = require('./report');

class TrialBalance extends Report {
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
        var sql = `SSELECT account_code AS code, account_name AS name,accounts.base_type AS type,debit,credit,  
                    CASE WHEN (SELECT SUM(debit)=SUM(credit) FROM ledger) 
                        THEN 'in_balance' ELSE 'out_of_balance' END AS trial_balance 
                    FROM ledger JOIN accounts ON accounts.name=ledger.account_name;`;

        const model = new Model();
        return model.querySync(sql);
    }
}

module.exports = TrialBalance;
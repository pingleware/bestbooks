/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Report {

    constructor() {
        // create and open database
        this.model = new Model();
        // create ledger views
        this.createViews();
    }

    trialBalance(start="",end="",callback) {
        try {
            var sql = ``;
            if (start.length == 0 && end.length == 0) {
                sql = `SELECT * FROM trial_balance;`;
            } else if (start.length > 0 && end.length == 0) {
                sql = `SELECT account_code AS code, 
                                account_name AS name,
                                accounts.base_type AS type,
                                SUM(debit) AS debit,
                                SUM(credit) AS credit FROM ledger 
                                JOIN accounts ON accounts.name=ledger.account_name 
                                WHERE txdate >= DATETIME('${start}') 
                                GROUP BY accounts.name 
                                ORDER BY accounts.type`;
            } else if (start.length > 0 && end.length > 0) {
                sql = `SELECT account_code AS code, 
                                account_name AS name,
                                accounts.base_type AS type,
                                SUM(debit) AS debit,
                                SUM(credit) AS credit FROM ledger 
                                JOIN accounts ON accounts.name=ledger.account_name 
                                WHERE txdate >= DATETIME('${start}') AND txdate < DATETIME('${end}') 
                                GROUP BY accounts.name 
                                ORDER BY accounts.type`;
            }
            this.model.query(sql,callback);
        } catch(error) {
            console.error(error);
        }
    }

    createViews() {
        // Trial Balance report data
        var sql = `CREATE VIEW IF NOT EXISTS trial_balance AS 
                    SELECT account_code AS code, 
                            account_name AS name,
                            accounts.base_type AS type,
                            SUM(debit) AS debit,
                            SUM(credit) AS credit FROM ledger 
                        JOIN accounts ON accounts.name=ledger.account_name 
                        GROUP BY accounts.name 
                        ORDER BY accounts.type`;
        this.model.insertSync(sql);
    }
}

module.exports = Report;
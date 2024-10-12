/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const TAccount = require('./taccount');
const Model = require('./model');
const ChartOfAccounts = require('./chartOfAccounts');

const {
    info,
    warn,
    error
} = require('./logger');

class Ledger extends TAccount {
    balance = 0;
	name = null;
	type = null;
	debit = 0;
	credit = 0;

    constructor(name, type) {
        super();
        // initialize instance variables
        this.balance = 0;
        this.name = name;
        this.type = type;
        this.debit = 0;
        this.credit = 0;
        // create and open database
        this.model = new Model();
        // create ledger table if not exist
        this.createLedgerTable();
        //this.getBalance();
        this.coa = new ChartOfAccounts();
        this.coa.add(name,type);
    }

    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }

    async findType(name) {
        const sql = `SELECT type FROM accounts WHERE name='${name}';`;
        info(sql);
        var rows = this.model.querySync(sql);
        return (rows.length > 0 ? rows[0].type : 'not found');
    }

    async getAll() {
        const sql = `SELECT *,(SELECT COUNT(*) FROM ledger ORDER BY txdate DESC) AS total FROM ledger ORDER BY txdate DESC`;
        info(sql);
        var rows = await this.model.querySync(sql);
        if (rows.length > 0) {
            return {
                total: rows[0].total,
                transactions: rows
            };    
        } else {
            return {
                total: 0,
                transactions: []
            };    
        }
    }

    /**
	 * --total balance
	 * SELECT (SUM(debit)*-1) + SUM(credit) AS TotalBalance FROM Transaction
	 *
	 * --daily balance
	 * SELECT TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance * FROM Transaction GROUP BY TransDate
	 * 
	 * --period of time balance
	 * SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalance FROM Transaction WHERE TransDate BETWEEN CURDATE() AND ADDDATE(CURDATE() INTERVAL -30 DAY)
	 * 
	 * --customer balance
	 * SELECT CustId, (SUM(debit)*-1) + SUM(credit) AS CustomerBalance FROM Transaction GROUP BY CustId
	 * 
	 */
    async getDailyBalance(transDate) {
        const sql = `SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ledger WHERE txdate LIKE '${transDate}%' GROUP BY txdate`;
        info(sql);
        return await this.model.querySync(sql);
    }

    async getTransactionsByRange(begin_date, end_date) {
		const sql = `SELECT * FROM ledger WHERE account_name='${this.name}' AND txdate >= '${begin_date}' AND txdate < '${end_date}' ORDER BY txdate ASC;`;
        info(sql);
        console.log(sql);
        return await this.model.querySync(sql);
	}

    async getPeriodOfTimeBalance(begin_date,end_date) {
		const sql = `SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalance FROM ledger WHERE txdate BETWEEN ${begin_date} AND ${end_date};`;
        info(sql);
        return await this.model.querySync(sql);
	}

    async remove(id) {
        const sql = `DELETE FROM ledger WHERE id=${id};`;
        info(sql);
        return await this.model.querySync(sql);
    }

    async createLedgerTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS "ledger" (
                "id" INTEGER,
                "company_id" INTEGER,
                "office_id"	INTEGER,
                "account_code" TEXT,
                "account_name" TEXT,
                "txdate" TIMESTAMP,
                "note" TEXT,
                "ref" INTEGER DEFAULT 0,
                "debit"	REAL DEFAULT 0,
                "credit" REAL DEFAULT 0,
                "balance" REAL DEFAULT 0,
                "action" TEXT DEFAULT 'Record',          -- e.g., 'Authorize', 'Custody', 'Record'
                "performed_by" INTEGER DEFAULT 0,          -- User ID
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY ("performed_by") REFERENCES users("id")
            );`;
            info(sql);
    
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeLedgerTable() {
        try {
            const sql = `DELETE FROM ledger;`;
            info(sql);
            await this.model.insertSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
}

module.exports = Ledger;
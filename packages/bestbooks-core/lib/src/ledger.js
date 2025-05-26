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
	name = null;
	type = null;
    baseType = null;

    constructor(name, type, base="") {
        super();
        // initialize instance variables
        this.name = name;
        this.type = type;
        this.baseType = (base.length == 0 ? type : base);
        // create and open database
        this.model = new Model();
        this.init();
        //this.getBalance();
        this.coa = new ChartOfAccounts();
        this.coa.add(name,type,base);
    }

    async init() {
        // create ledger table if not exist
        await this.createTable();
    }

    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }

    async addBudget(name, month,amount) {
        var sql = `UPDATE accounts SET Bud${month}=? WHERE name=?;`;
        const params = [amount,name];
        return await this.model.updateSync(sql,params);
    }

    async addBalance(name,month,amount) {
        var sql = `UPDATE accounts SET Bal${month}=? WHERE name=?;`;
        const params = [amount,name];
        return await this.model.updateSync(sql,params);
    }

    async findType(name) {
        let sql = `SELECT type FROM accounts WHERE name=?;`;
        const params = [name];
        var rows = this.model.querySync(sql,params);
        return (rows.length > 0 ? rows[0].type : 'not found');
    }

    /**
     * Example invocation of a static class method:
     * Ledger.findAccountType('Cash').then(type => console.log(type));
     * 
     * @param {String} name 
     * @returns account type or "not found"
     */
    static async findAccountType(name) {
        let model = new Model();
        let sql = `SELECT type FROM accounts WHERE name=?`;
        const params = [name];
        var rows = await model.querySync(sql, params);
        return (rows.length > 0 ? rows[0].type : 'not found');
    }

    async getAll() {
        let sql = `SELECT *,(SELECT COUNT(*) FROM ledger ORDER BY txdate DESC) AS total FROM ledger ORDER BY txdate DESC`;
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
    async getBalance() {
       let sql = `SELECT SUM(debit)-SUM(credit) as balance FROM ledger WHERE account_name=?;`
       const params = [this.name];
       const result = await this.model.querySync(sql,params);
       return (!result[0].balance ? 0 : result[0].balance);
   }

    async getDailyBalance(transDate) {
        let sql = `SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ledger WHERE txdate LIKE '$?%' GROUP BY txdate`;
        const params = [transDate];
        return await this.model.querySync(sql,params);
    }

    async getTransactionsByRange(begin_date, end_date) {
		let sql = `SELECT * FROM ledger WHERE account_name=? AND txdate >= ? AND txdate < ? ORDER BY txdate ASC;`;
        const params = [this.name,begin_date,end_date];
        return await this.model.querySync(sql,params);
	}

    async getTransactionsByCompany(company_id,office_id,begin_date,end_date) {
		let sql = `SELECT * FROM ledger WHERE company_id=? AND office_id=? AND txdate >= ? AND txdate < ? ORDER BY txdate ASC;`;
        const params = [company_id,office_id,begin_date,end_date];
        return await this.model.querySync(sql,params);
    }

    async getPeriodOfTimeBalance(begin_date,end_date) {
		let sql = `SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalance FROM ledger WHERE txdate BETWEEN ? AND ?;`;
        const params = [begin_date,end_date];
        return await this.model.querySync(sql,params);
	}

    async remove(id) {
        let sql = `DELETE FROM ledger WHERE id=?;`;
        const params = [id];
        return await this.model.insertSync(sql,params);
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS "ledger" (
                "id"	INTEGER,
                "company_id"	INTEGER,
                "office_id"	INTEGER,
                "account_code"	TEXT,
                "account_name"	TEXT,
                "txdate"	TIMESTAMP,
                "note"	TEXT,
                "ref"	INTEGER DEFAULT 0,
                "debit"	REAL DEFAULT 0,
                "credit"	REAL DEFAULT 0,
                "balance"	REAL DEFAULT 0,
                "action"	TEXT DEFAULT 'Record',
                "performed_by"	INTEGER DEFAULT 0,
                "location"	INTEGER DEFAULT 0,
                "due_date"	TIMESTAMP DEFAULT 0,
                "transaction_type"	TEXT DEFAULT 'Operating',
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY("performed_by") REFERENCES "users"("id")
            )`;
            await this.model.insertSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable(where='') {
        try {
            let sql = `DELETE FROM ledger ?;`;
            const params = [where];
            await this.model.deleteSync(sql, params);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
}

module.exports = Ledger;
/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const TAccount = require('./taccount');
const Model = require('./model');
const Journal = require('./journal');
const localStorage = require('localStorage');

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
    
    async addDebit(date,desc,amount,company_id=0,office_id=0){
        try {
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,debit,balance) VALUES (${company_id},${office_id},'${this.name}',(SELECT code FROM accounts WHERE name='${this.name}'),'${date}','${desc}','${amount}',(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+${amount},${amount}) FROM ledger WHERE account_name='${this.name}'));`;
            info(sql);
            let ledger_insert_id = await this.model.insertSync(sql);

            //let ledger_insert_id = localStorage.getItem('lastID');
            let journal_insert_id = 0;

            if (this.name !== 'Uncategorized') {
                var journal = new Journal('General');
                journal_insert_id = await journal.add(date,ledger_insert_id,this.name,amount,0.00,company_id,office_id);
                sql = `UPDATE ledger SET ref=${journal_insert_id} WHERE id=${ledger_insert_id};`;
                info(sql);
                await this.model.insertSync(sql);
            }            
            return [ledger_insert_id,journal_insert_id];
        } catch(err) {
            console.error(err);
        }
    }
    async addCredit(date,desc,amount,company_id=0,office_id=0){
        try {
            this.credit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,credit,balance) VALUES (${company_id},${office_id},'${this.name}',(SELECT code FROM accounts WHERE name='${this.name}'),'${date}','${desc}','${amount}',(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+${amount},${amount}) FROM ledger WHERE account_name='${this.name}'));`;
            info(sql);

            let ledger_insert_id = await this.model.insertSync(sql);
            //let ledger_insert_id = localStorage.getItem('lastID');
            let journal_insert_id = 0;

            if (this.name !== 'Uncategorized') {
                var journal = new Journal('General');
                journal_insert_id = await journal.add(date,ledger_insert_id,this.name,0.00,amount, company_id, office_id);
                //journal_insert_id = localStorage.getItem('lastID');
                sql = `UPDATE ledger SET ref=${journal_insert_id} WHERE id=${ledger_insert_id};`;
                await this.model.insertSync(sql);
            }
            return [ledger_insert_id,journal_insert_id];
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
    
    getDebit(){
        return this.debit;
    }
    getCredit(){
        return this.credit;
    }
    
    async getBalance(){
        try {
            const sql = `SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='${this.name}';`;
            info(sql);
            var rows = await this.model.querySync(sql);
            this.balance = Number(rows[0].balance);
        } catch(err) {
            error(JSON.stringify(err));
        }
        return this.balance;
    }

    setBalance(balance) {
        this.balance = balance;
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
                "action" TEXT NOT NULL,          -- e.g., 'Authorize', 'Custody', 'Record'
                "performed_by" INTEGER,          -- User ID
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
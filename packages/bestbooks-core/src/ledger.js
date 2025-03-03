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
            let sql = `CREATE TABLE IF NOT EXISTS "ledger" (
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
                "is_conservative"	TEXT DEFAULT 'non-conservative',
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY("performed_by") REFERENCES "users"("id")
            )`;
            await this.model.insertSync(sql);

            // creates a separate audit trable
            sql = `CREATE TABLE IF NOT EXISTS ledger_audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ledger_id INTEGER,
                old_account_code TEXT,
                old_debit REAL,
                old_credit REAL,
                old_balance REAL,
                new_account_code TEXT,
                new_debit REAL,
                new_credit REAL,
                new_balance REAL,
                change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                changed_by INTEGER,
                action TEXT
            );`;
            await this.model.insertSync(sql);

            // log ledger transaction changes. Whenever a transaction is updated, insert the old and new values into ledger_audit.
            sql = `CREATE TRIGGER IF NOT EXISTS log_ledger_update
                    AFTER UPDATE ON ledger
                    FOR EACH ROW
                    BEGIN
                        INSERT INTO ledger_audit (ledger_id, old_account_code, old_debit, old_credit, old_balance, 
                                                new_account_code, new_debit, new_credit, new_balance, 
                                                change_date, changed_by, action)
                        VALUES (OLD.id, OLD.account_code, OLD.debit, OLD.credit, OLD.balance, 
                                NEW.account_code, NEW.debit, NEW.credit, NEW.balance, 
                                CURRENT_TIMESTAMP, NEW.performed_by, 'Update');
                    END;`;
            await this.model.insertSync(sql);

            // create apply_conservatism_principle trigger
            sql = `CREATE TRIGGER IF NOT EXISTS apply_conservatism_principle
                    AFTER INSERT ON ledger
                    FOR EACH ROW
                    BEGIN
                        UPDATE ledger
                        SET is_conservative = 
                            CASE 
                                -- Expenses (4xxx) or Liabilities (2xxx) are always conservative
                                WHEN NEW.account_code LIKE '4%' OR NEW.account_code LIKE '2%' THEN 'conservative'
                                
                                -- Revenues (5xxx) or Assets (1xxx) 
                                WHEN NEW.account_code LIKE '5%' OR NEW.account_code LIKE '1%' THEN 
                                    CASE 
                                        -- If note contains 'certain', mark as non-conservative
                                        WHEN NEW.note LIKE '%certain%' THEN 'non-conservative'
                                        -- Otherwise, assume conservative
                                        ELSE 'conservative'
                                    END
                                
                                -- Default: For other cases, mark as non-conservative
                                ELSE 'non-conservative'
                            END
                        WHERE id = NEW.id;
                    END`;
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
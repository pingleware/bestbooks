/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const Asset = require('./asset');

class Investment extends Asset {
    constructor(name) {
        super(name);
        this.init();
    }

    async init() {
        await this.createTable();
    }

    async contribution(user, amount) {
        var sql = `SELECT * FROM investment_account whERE user=?;`;
        let params = [user];
        const existing = await this.model.querySync(sql,params);
        if (existing.length > 0) {
            sql = `INSERT INTO investment_account (user, deposits, current_value) VALUES (?,?,?);`;
            params = [user, amount, amount];    
        } else {
            sql = `INSERT INTO investment_account (user, initial_investment, current_value) 
                    VALUES (?,?,(
                        SELECT SUM(deposits)+initial_investment-SUM(withdrawals)+? AS current_value 
                        FROM investment_account 
                        WHERE user=?
                    ));`;
            params = [user, amount, amount, user];    
        }
        return await this.model.insertSync(sql,params);
    }

    async disbursement(user, amount) {
        var sql = `INSERT INTO investment_account (user, withdrawals, current_value) 
            VALUES (?,?,(
                SELECT SUM(deposits)+initial_investment-SUM(withdrawals)-? AS current_value 
                FROM investment_account 
                WHERE user=?
            ));`;
        const params = [user, amount, amount, user];
        return await this.model.insertSync(sql,params);
    }

    async dividend(user, amount) {
        var sql = `INSERT INTO investment_account (user, dividends, current_value) 
                    VALUES (?,?,(
                        SELECT SUM(deposits)+initial_investment-SUM(withdrawals)-? AS current_value 
                        FROM investment_account 
                        WHERE user=?
                    ));`;
        const params = [user, amount, amount, user];
        return await this.model.insertSync(sql,params);
    }

    async getContributions(user) {
        var sql = `SELECT IIF(SUM(deposits) + initial_investment,SUM(deposits) + initial_investment,0) AS total 
                        FROM investment_account 
                        WHERE user=?;`;
        const params = [user];
        return await this.model.querySync(sql,params);
    }

    async getDistributions(user) {
        var sql = `SELECT IIF(SUM(withdrawals),SUM(withdrawals),0) AS total FROM investment_account WHERE user=?;`;
        const params = [user];
        return await this.model.querySync(sql,params);
    }

    async getDividends(user) {
        var sql = `SELECT IIF(SUM(dividends),SUM(dividends),0) AS total FROM investment_account WHERE user=?;`;
        const params = [user];
        return await this.model.querySync(sql,params);
    }

    async getCurrentValue(user) {
        var sql = `SELECT 
                        SUM(deposits)+initial_investment-SUM(withdrawals) AS current_value,
                        (
                            (SUM(deposits)+initial_investment-SUM(withdrawals)) = 
                            (SELECT current_value FROM investment_account WHERE user=? ORDER BY created_at DESC LIMIT 1)
                        ) AS inBalance
                    FROM investment_account 
                    WHERE user=?`;
        const params = [user,user];
        return await this.model.querySync(sql,params);
    }

    async createTable() {
        var sql = `CREATE TABLE IF NOT EXISTS investment_account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER DEFAULT 0,
            office_id INTEGER DEFAULT 0,
            user INTEGER,
            initial_investment REAL DEFAULT 0.0,
            current_value REAL DEFAULT 0.0,
            dividends REAL DEFAULT 0.0,
            deposits REAL DEFAULT 0.0,
            withdrawals REAL DEFAULT 0.0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`;
        await this.model.insertSync(sql);
        sql = `CREATE TABLE IF NOT EXISTS inventory_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER DEFAULT 0,
                office_id INTEGER DEFAULT 0,
                item_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                description TEXT,
                transaction_type TEXT NOT NULL,  -- 'purchase', 'sell', 'adjust'
                quantity INTEGER NOT NULL,
                unit_cost REAL,  -- Cost per unit at time of transaction
                price REAL,  -- Price sold for (if selling)
                FOREIGN KEY (item_id) REFERENCES inventory(id)
        )`;
        await this.model.insertSync(sql);
        return true;
    }
}

module.exports = Investment;
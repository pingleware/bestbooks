/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');

const {
    info,
    warn,
    error
} = require('./logger');

class ConservatismPrinciple {
    constructor() {
        // create and open database
        this.model = new Model();
        // create disclosures table if not exist
        this.init();
    }

    async init() {
        await this.createTable();
    }

    applyConservatism(type, amount) {
        // If the type is 'expense' or 'liability', apply conservatism principle
        if (type === 'expense' || type === 'liability') {
            return 1; // Conservative action
        }
        // If the type is 'revenue' or 'asset', delay until certainty is achieved (i.e., return 0)
        return 0; // Non-conservative action for now
    }

    async createConservativeTransaction(transaction) {
        const { description, amount, type, transaction_date } = transaction;
        const is_conservative = this.applyConservatism(type, amount);

        var sql = `INSERT INTO conservative_transactions (description, amount, type, transaction_date, is_conservative) VALUES (?, ?, ?, ?, ?)`;
        const params = [description,amount,type,transaction_date,is_conservative];

        return await this.model.insertSync(sql,params);
    }

    async getTransactions() {
        return await this.model.querySync(`SELECT * FROM conservative_transactions`);
    }

    async getConservativeTransactions() {
        return await this.model.querySync(`SELECT * FROM conservative_transactions WHERE is_conservative = 1`);
    }

    async getTransactionById(id) {
        return await this.model.querySync(`SELECT * FROM conservative_transactions WHERE id=${id}`);
    }

    async updateTransaction(transaction, id) {
        const { description, amount, type, transaction_date } = transaction;
        const is_conservative = this.applyConservatism(type, amount);

        return await this.model.updateSync(`UPDATE conservative_transactions 
            SET description = '${description}', 
                amount = '${amount}', 
                type = '${type}', 
                transaction_date = '${transaction_date}', 
                is_conservative = ${is_conservative}
            WHERE id = ${id}`)
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS conservative_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                amount REAL NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('expense', 'liability', 'revenue', 'asset')),
                transaction_date TEXT NOT NULL,
                is_conservative BOOLEAN DEFAULT 0
            );`;   
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM conservative_transactions ;`;
            await this.model.deleteSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
}

module.exports = ConservatismPrinciple;
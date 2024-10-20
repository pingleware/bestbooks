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

class Materiality {
    constructor() {
        // create and open database
        this.model = new Model();
        // create disclosures table if not exist
        this.createTable();
    }

    // Function to determine if a transaction is material
    isTransactionMaterial(amount, threshold) {
        return Math.abs(amount) >= threshold;
    }

    async addTransaction(materiality) {
        const { description, amount, transaction_date, materiality_threshold } = materiality;
        const is_material = isTransactionMaterial(amount, materiality_threshold) ? 1 : 0;

        return await this.model.insertSync(`INSERT INTO transactions (
            description, 
            amount, 
            transaction_date, 
            is_material, 
            materiality_threshold) 
            VALUES (
            '${description}', 
            '${amount}', 
            '${transaction_date}', 
            ${is_material}, 
            '${materiality_threshold}'
        );`);
    }

    async getTransactions() {
        return await this.model.querySync(`SELECT * FROM transactions;`);
    }

    async getTransactionsById(id) {
        return await this.model.querySync(`SELECT * FROM transactions WHERE id=${id};`);
    }

    async getMaterialTransactions() {
        return await this.model.querySync(`SELECT * FROM transactions WHERE is_material = 1;`);
    }

    async updateTransaction(materiality, id) {
        const { description, amount, transaction_date, materiality_threshold } = materiality;
        const is_material = isTransactionMaterial(amount, materiality_threshold) ? 1 : 0;

        return await this.model.updateSync(`UPDATE transactions 
            SET description = '${description}', 
                amount = '${amount}', 
                transaction_date = '${transaction_date}', 
                is_material = ${is_material}, 
                materiality_threshold = '${materiality_threshold}'
            WHERE id = ${id}`);
    }

    async deleteTransaction(id) {
        return await this.model.updateSync(`DELETE FROM transactions WHERE id = ${id}`);
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                amount REAL NOT NULL,
                transaction_date TEXT NOT NULL,
                is_material BOOLEAN DEFAULT 0,
                materiality_threshold REAL NOT NULL
            );`;
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM transactions;`;
            await this.model.deleteSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
}

module.exports = Materiality;
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

class ConsistencyPrinciple {
    constructor() {
        // create and open database
        this.model = new Model();
        // create disclosures table if not exist
        this.createTable();
    }

    async createConsistency(consistency) {
        const { accounting_method, description, reporting_period, date_changed, is_consistent } = consistency;
        var sql = `INSERT INTO consistency (
                    accounting_method, 
                    description, 
                    reporting_period, 
                    date_changed, 
                    is_consistent
                ) VALUES (?, ?, ?, ?, ?)`;
        const params = [accounting_method, description, reporting_period, date_changed, is_consistent];
        return await this.model.insertSync(sql,params);
    }

    async getConsistency() {
        return this.model.querySync(`SELECT * FROM consistency`);
    }

    async getConsistencyById(id) {
        return this.model.querySync(`SELECT * FROM consistency WHERE id=${id}`);
    }

    async updateConsistency(consistency, id) {
        const { accounting_method, description, reporting_period, date_changed, is_consistent } = consistency;

        return this.model.updateSync(`UPDATE consistency 
            SET accounting_method = '${accounting_method}', 
                description = '${description}', 
                reporting_period = '${reporting_period}', 
                date_changed = '${date_changed}', 
                is_consistent = ${is_consistent} 
                WHERE id = ${id};`);
    }

    async deleteConsistency(id) {
        return this.model.updateSync(`DELETE FROM consistency WHERE id = ${id}`);
    }

    async checkConsistency(accounting_method, reporting_period) {
        return await this.model.querySync(`SELECT * 
            FROM consistency 
            WHERE accounting_method = '${accounting_method}' AND reporting_period = '${reporting_period}'`);
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS consistency (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                accounting_method TEXT NOT NULL,
                description TEXT,
                reporting_period TEXT NOT NULL,
                date_changed TEXT,
                is_consistent BOOLEAN NOT NULL
            );`;
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM consistency;`;
            await this.model.deleteSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
}

module.exports = ConsistencyPrinciple;
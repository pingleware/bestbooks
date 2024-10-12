/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const localStorage = require('localStorage');
const {
    info,
    warn,
    error
} = require('./logger');

class Journal {

    constructor(name) {
        this.name = name;
        this.model = new Model();
        this.createTable();
    }

    async add(date, ref, account, debit, credit, company_id = 0, office_id = 0) {
        try {
            const sql = `INSERT OR IGNORE INTO journal (name, company_id, office_id, txdate, ref, account, debit, credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
            // Use an array for parameters to prevent SQL injection
            const params = [this.name, company_id, office_id, date, ref, account, debit, credit];
            const id = await this.model.insertSync(sql, params); // Pass params here
    
            info(`journal.add.lastID: ${id}`);
            return id;
        } catch (err) {
            error(JSON.stringify(err));
        }
    }
    

    async update(id,date,account,debit,credit,ref=0) {
        try {
            const sql = `UPDATE journal SET txdate='${date}',account='${account}',ref='${ref}',debit=${debit},credit=${credit} WHERE id=${id};`;
            info(sql);
            return await this.model.updateSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async remove(id) {
        try {
            const sql = `DELETE FROM journal WHERE id='${id}';`;
            info(sql);
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async inBalance() {
        try {
            const sql = `SELECT SUM(debit)=SUM(credit) AS INBALANCE FROM journal;'`;
            info(sql);
            const rows = await this.model.querySync(sql);
            return rows[0].INBALANCE;
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async balance() {
        try {
            const sql = `SELECT SUM(credit)-SUM(debit) AS balance FROM journal WHERE account='${this.name}";'`;
            info(sql);
            var rows = await this.model.querySync(sql);
            return Number(rows[0].balance);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    getBalance() {
        return this.balance();
    }

    async transaction(where="") {
        try {
            const sql = `SELECT * FROM journal WHERE account="${this.name}" ${where} ORDER BY txdate ASC;`;
            info(sql);
            return await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS "journal" (
                "id" INTEGER,
                "name" TEXT,
                "company_id" INTEGER,
                "office_id"	INTEGER,
                "txdate" TIMESTAMP,
                "account" TEXT,
                "ref" INTEGER,
                "debit"	REAL,
                "credit" REAL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;
            info(sql);
            await this.model.querySync(sql);    
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM journal;`;
            info(sql);
            await this.model.insertSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async listJournals() {
        const sql = `SELECT name FROM journal GROUP BY name`;
        info(sql);
        var rows = this.model.querySync(sql);
        return rows;
    }

    async getDebitCreditTotals(where='') {
        const sql = `SELECT SUM(debit) AS total_debit,SUM(credit) AS total_credit FROM journal ${where} ORDER BY txdate ASC`;
        info(sql);
        return this.model.querySync(sql);
    }

    async setXRef(id, value) {
        const sql = `UPDATE journal SET ref=${value} WHERE id=${id};`;
        info(sql);
        return this.model.querySync(sql);
    }
}

module.exports = Journal;
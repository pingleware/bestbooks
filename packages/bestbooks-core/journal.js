/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Journal {

    constructor(name) {
        this.name = name;
        this.model = new Model();
        this.createTable();
    }

    async add(date,ref,account,debit,credit,company_id=0,office_id=0) {
        try {
            var sql = `INSERT OR IGNORE INTO  journal (company_id,office_id,txdate,ref,account,debit,credit) VALUES (${company_id},${office_id},'${date}','${ref}','${account}','${debit}','${credit}');`;
            var results = await this.model.insertSync(sql);
            return results[0];
        } catch(error) {
            console.error(error);
        }
    }
    async update(id,date,account,debit,credit,ref=0) {
        try {
            var sql = `UPDATE journal SET txdate='${date}',account='${account}',ref='${ref}',debit=${debit},credit=${credit} WHERE id=${id};`;
            return await this.model.updateSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async remove(id) {
        try {
            var sql = `DELETE FROM journal WHERE id='${id}';`;
            await this.model.querySync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async inBalance() {
        try {
            var sql = `SELECT SUM(debit)=SUM(credit) AS INBALANCE FROM journal WHERE account="${this.name}";'`;
            var rows = await this.model.querySync(sql);
            return rows[0].INBALANCE;
        } catch(error) {
            console.error(error);
        }
    }

    async balance() {
        try {
            var sql = `SELECT SUM(credit)-SUM(debit) AS balance FROM journal WHERE account='${this.name}";'`;
            var rows = await this.model.querySync(sql);
            return Number(rows[0].balance);
        } catch(error) {
            console.error(error);
        }
    }

    getBalance() {
        return this.balance();
    }

    async transaction(where="") {
        try {
            var sql = `SELECT * FROM journal WHERE account="${this.name}" ${where} ORDER BY txdate ASC;`;
            return await this.model.querySync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS "journal" (
                "id" INTEGER,
                "company_id" INTEGER,
                "office_id"	INTEGER,
                "txdate" TIMESTAMP,
                "account" TEXT,
                "ref" INTEGER,
                "debit"	REAL,
                "credit" REAL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;
            await this.model.querySync(sql);    
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Journal;
"use strict"

const Model = require('./model');

class Company {

    constructor(name="") {
        this.model = new Model();
        this.init();

        if (name.length > 0) {
            this.find(name).then(result => {
                if (result.length > 0) {
                    this.name = result[0].name;
                    this.id = result[0].id;
                }
            });
        }
    }

    async init() {
        await this.createTable();
    }
    

    find(name) {
        return new Promise((resolve,reject) => {
            try {
                resolve(this.findSync(name));
            } catch(err) {
                reject(err);
            }
        })
    }

    async findSync(name) {
        var sql = `SELECT * FROM company WHERE name='%${name}%';`;
        return await this.model.querySync(sql);
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    async getAll() {
        const sql = `SELECT * FROM company;`;
        return await this.model.querySync(sql);
    }

    async add(name,note) {
        var sql = `INSERT OR IGNORE INTO company (name,txdate,note) VALUES (?,CURRENT_TIMESTAMP,?)`;
        const params = [name, note];
        return await this.model.insertSync(sql,params);
    }

    async remove(name) {
        /*
        var sql = `DELETE FROM company WHERE name = ? 
            AND NOT EXISTS (
                SELECT 1 FROM accounts WHERE accounts.company_id = company.id
            )
            AND NOT EXISTS (
                SELECT 1 FROM ledger WHERE ledger.company_id = company.id
            )
            AND NOT EXISTS (
                SELECT 1 FROM journal WHERE journal.company_id = company.id
            );
        `;
        */
        var sql = `DELETE FROM company WHERE name = ?;`;
        const params = [name];
        return await this.model.insertSync(sql,params);
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS "company" (
                "id" INTEGER,
                "name" TEXT UNIQUE,
                "txdate" TIMESTAMP,
                "note" TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;

            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async purgeTable() {
        try {
            var sql = `DELETE FROM company;`;
            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Company;
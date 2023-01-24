"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Company {

    constructor(name) {
        try {
            var sql = `SELECT * FROM company WHERE name='${name}';`;
            this.model = new Model();
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.name = result[0].name;
                    this.id = result[0].id;
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
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

            await this.model.querySync(sql);
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Company;
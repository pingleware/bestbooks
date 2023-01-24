"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Company {

    constructor(name) {
        try {
            this.model = new Model();
            this.createTable();
            if (name) {
                var sql = `SELECT * FROM company WHERE name='${name}';`;
                this.model.query(sql, function(result){
                    if (result.length > 0) {
                        this.name = result[0].name;
                        this.id = result[0].id;
                    }
                });    
            }
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

    getCompanies(callback) {
        this.companies = [];
        var sql = `SELECT * FROM company;`;
        this.model.query(sql, function(result){
            if (result.length > 0) {
                this.companies = result;
            }
            callback(this.companies);
        });
    }

    addCompany(name,note,callback) {
        var sql = `INSERT INTO company (name,txdate,note) VALUES ('${name}',CURRENT_TIMESTAMP,'${note}')`;
        this.model.insert(sql, function(lastID, changes){
            callback(lastID, changes);
        })
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
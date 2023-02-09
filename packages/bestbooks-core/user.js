"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class User {
    constructor(name) {
        this.model = new Model();
        this.createTable();

        if (name !== "") {
            var sql = `SELECT * FROM usere WHERE name='${name}';`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.user = result[0];
                    this.name = result[0].name;
                    this.id = result[0].id;
                }
            });
        }
    }

    getUser() {
        return this.user;
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getUsers(callback) {
        try {
            var sql = `SELECT * FROM user;`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.users = result;
                    callback(this.users);
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    getUserRoles(callback) {
        try {
            var sql = `SELECT user_role AS role FROM user GROUP BY user_role ORDER BY user_role;`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    callback(result);
                }
            });    
        } catch(error) {
            console.error(error);
        }
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS "user" (
                "id" INTEGER,
                "name" TEXT UNIQUE,
                "txdate" TIMESTAMP,
                "email" TEXT,
                "user_role" TEXT,
                "password" TEXT
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;

            await this.model.querySync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async purgeTable() {
        try {
            var sql = `DELETE FROM user;`;
            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

}


module.exports = User;
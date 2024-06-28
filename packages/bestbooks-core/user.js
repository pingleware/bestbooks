"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class User {
    constructor(name="") {
        this.model = new Model();
        //this.createTable();

        if (name !== "") {
            var sql = `SELECT * FROM users WHERE name='${name}';`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.user = result[0];
                    this.name = result[0].name;
                    this.id = result[0].id;
                }
            });
        }
    }

    add(usermeta) {
        try {
            var sql = `INSERT INTO users (
                company_id,
                office_id,
                name,
                email,
                firstname,
                lastname,
                phone,
                mobile
            ) VALUES (
                '${usermeta.company_id}',
                '${usermeta.office_id}',
                '${usermeta.name}',
                '${usermeta.email}',
                '${usermeta.firstname}',
                '${usermeta.lastname}',
                '${usermeta.phone}',
                '${usermeta.mobile}'
            );`;
            return this.model.insertSync(sql);        
        } catch(error) {
            console.error(error);
        }
    }

    quickAdd(usermeta) {
        try {
            var sql = `INSERT INTO users (
                user_name,
                user_email,
                user_pass,
                role,
                first_name,
                last_name,
                display_name,
                notify_email,
                phone
            ) VALUES (
                "${usermeta.username}",
                "${usermeta.email}",
                "${usermeta.password}",
                "${usermeta.role}",
                "${usermeta.firstname}",
                "${usermeta.lastname}",
                "${usermeta.firstname} ${usermeta.lastname}",
                "${usermeta.email}",
                "000-000-0000"
            );`;
    
            return this.model.insertSync(sql);    
        } catch(error) {
            console.error(error);
        }
    }

    find(name) {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT id FROM users WHERE username LIKE '%${name}%';`;
                this.model.query(sql, function(results){
                    resolve(results);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
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
            var sql = `SELECT * FROM users;`;
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

    async getUsersSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT * FROM users;`;
                this.model.query(sql, function(result){
                    resolve(result);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    getUserRoles(callback) {
        try {
            var sql = `SELECT user_role AS role FROM users GROUP BY user_role ORDER BY user_role;`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    callback(result);
                }
            });    
        } catch(error) {
            console.error(error);
        }
    }

    async getUserRolesSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT user_role AS role FROM users GROUP BY user_role ORDER BY user_role;`;
                this.model.query(sql, function(result){
                    resolve(result);
                });    
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER,user_name TEXT,
                user_email TEXT,
                user_pass TEXT,
                role TEXT,
                first_name TEXT,
                last_name TEXT,
                display_name TEXT,
                notify_email TEXT,
                phone) PRIMARY KEY(id AUTOINCREMENT)`;

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
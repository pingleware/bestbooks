"use strict"

const Model = require('./model');
const MD5 = require('./md5');

class User {
    id = -1;
    name = '';
    role = '';

    constructor(role,name="") {
        this.model = new Model();
        this.MD5 = new MD5();
        this.name = name;
        this.role = role;
        this.init();
    }

    async init() {
        if (this.name.length > 0) {
            var sql = `SELECT * FROM users WHERE user_name=? LIMIT 1;`;
            const params = [this.name];
            const user = await this.model.querySync(sql,params);    

            this.name = user[0].user_name;
            this.role = user[0].role;
            this.id = user[0].id;
        }

        await this.createTable();
        await this.createSystemUser();
    }

    
    // the system user has an id=0
    async createSystemUser() {
        try {
            var sql = `INSERT OR IGNORE INTO users (id,user_name,role) VALUES (?,?,?);`;
            const params = [0, 'system','system'];
            return await this.model.insertSync(sql,params);
        } catch(err) {
            console.error(err);
        }
    }

    async add(usermeta) {
        try {
            var sql = `INSERT OR IGNORE INTO users (
                company_id,
                office_id,
                user_name,
                user_email,
                user_pass,
                first_name,
                last_name,
                display_name,
                phone,
                mobile,
                role
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
            const fullname = `${usermeta.firstname} ${usermeta.lastname}`;
            const params = [
                usermeta.company_id,
                usermeta.office_id,
                usermeta.name,
                usermeta.email,
                this.MD5.MD5(usermeta.password),
                usermeta.firstname,
                usermeta.lastname,
                fullname,
                usermeta.phone,
                usermeta.mobile,
                this.role
            ];
            return await this.model.insertSync(sql,params);        
        } catch(error) {
            console.error(error);
        }
    }

    quickAdd(usermeta) {
        try {
            var sql = `INSERT OR IGNORE INTO users (
                user_name,
                user_email,
                user_pass,
                role,
                first_name,
                last_name,
                display_name,
                notify_email,
                phone
            ) VALUES (?,?,?,?,?,?,?,?,?);`;
            const fullname = `${usermeta.firstname} ${usermeta.lastname}`;
            const params = [
                usermeta.username,
                usermeta.email,
                this.MD5(usermeta.password),
                usermeta.role,
                usermeta.firstname,
                usermeta.lastname,
                fullname,
                usermeta.email,
                usermeta.phone
            ];
    
            return this.model.insertSync(sql,params);    
        } catch(error) {
            console.error(error);
        }
    }

    // user deletion permitted when NOT IN USE!
    async remove(user_name) {
        try {
            var sql = `DELETE FROM users WHERE user_name=? 
            AND NOT EXISTS (
                SELECT 1 FROM ledger WHERE ledger.performed_by = users.id
            );
            `;
            const params = [user_name];
            await this.model.insertSync(sql,params);
            return `${user_name} removed from users successfully`;
        } catch(err) {
            error(err);
            throw error;  // Optionally rethrow the error to be handled in your tests
        }
    }

    find(name) {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT * FROM users WHERE user_name LIKE '%${name}%';`;
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

    getUsersByRole(callback) {
        try {
            var sql = `SELECT * FROM users WHERE role='${this.role}';`;
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

    async getUsersByRoleSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT * FROM users WHERE role='${this.role}';`;
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

    async updateShares(userid,amount,shares) {
        var sql = `UPDATE users 
                    SET invested_amount = invested_amount + ?, 
                        shares = shares + ? 
                    WHERE id = ?;
                `;
        const params = [amount,shares,userid];
        return await this.model.querySync(sql,params);
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER,
                office_id INTEGER,
                user_name TEXT UNIQUE,
                user_email TEXT UNIQUE,
                user_pass TEXT UNIQUE,
                role TEXT,
                first_name TEXT,
                last_name TEXT,
                display_name TEXT,
                notify_email TEXT,
                mobile TEXT,
                phone TEXT,
                invested_amount REAL DEFAULT 0.0,
                shares NUMBER DEFAULT 0
            );`;

            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async purgeTable() {
        try {
            var sql = `DELETE FROM users;`;
            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

}


module.exports = User;
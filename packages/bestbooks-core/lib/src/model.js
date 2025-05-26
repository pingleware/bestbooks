/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

 const sqlite3 = require('sqlite3').verbose();
 const path = require('path');
 const fs = require('fs');
 const localStorage = require('localStorage');
 const os = require('os');

 const {
    info,
    warn,
    error
} = require('./logger');

 
 class Model {
    constructor() {
        if (fs.existsSync(path.join(os.homedir(),'.bestbooks')) == false) {
            fs.mkdirSync(path.join(os.homedir(),'.bestbooks'));
        }
        this.filePath = path.join(os.homedir(),'.bestbooks/bestbooks.db');
         this.db = new sqlite3.Database(this.filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
            (err) => { 
                // do your thing 
                error(err);
            });         
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    error(err);
                    return reject(err);
                }
                resolve();
            });
        });
    }
 
     getFilePath() {
         return this.filePath;
     }
 
     async deleteDatabaseFile() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.filePath)) {
                fs.rm(this.filePath, { force: true }, (err) => {
                    if (err) return reject(err);
                    resolve(true);
                });
            } else {
                resolve(false); // Return false if the file does not exist
            }
        });
    }
    
 
     query(sql, callback) {
         this.db.all(sql, (err, rows) => {
             if (err) callback([]);
             callback(rows);
         });
     }
 
     querySync(sql,params=[]) {
         return new Promise((resolve, reject) => {
            info(this.getCompletedSQL(sql,params));
            this.db.all(sql, params, (err, rows) => {
                 if (err) {
                    error(err);
                    reject(err);
                 }
                 info(JSON.stringify(rows))
                 resolve(rows);
             });
         });
     }
 
     /**
      * To prevent SQL injection, using parameterized queries.
      * 
      * @param {*} sql       'INSERT INTO your_table (column1, column2) VALUES (?, ?)'
      * @param {*} params   [value1, value2]; // These are your actual values
      * @param {*} callback 
      */
    insert(sql, params, callback) {
        // Log the SQL statement for debugging
        info(this.getCompletedSQL(sql,params));
    
        // Use traditional function syntax for the callback
        this.db.serialize(() => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    throw new Error(err); // Handle error by throwing an error
                }
        
                // Set local storage items using the context from this callback
                localStorage.setItem('lastID', this.lastID);
                localStorage.setItem('changes', this.changes);
        
                // Log the database state for debugging
                info(JSON.stringify(this)); // Log the current state of the database
        
                // Call the callback function with the correct lastID and changes
                if (callback) callback(this.lastID, this.changes);
                else error(`callback is null`);
            });    
        });
    }
    
     /**
      * To prevent SQL injection, using parameterized queries.
      * 
      * @param {*} sql      'INSERT INTO your_table (column1, column2) VALUES (?, ?)'
      * @param {*} params   [value1, value2]; // These are your actual values
      * @returns 
      */
    async insertSync(sql, params) {
        return new Promise((resolve, reject) => {
            // Log the SQL statement for debugging
            info(this.getCompletedSQL(sql,params));

            this.db.serialize(() => {
                this.db.run(sql, params, function(err) { // Use traditional function syntax here
                    if (err) {
                        reject(err); // Reject the promise on error
                        return; // Exit to prevent further execution
                    }
        
                    // Set local storage items using this context from the callback
                    localStorage.setItem('lastID', this.lastID);
                    localStorage.setItem('changes', this.changes);
        
                    // Log rows for debugging
                    resolve(this.lastID); // Use this.lastID from the callback context
                });    
            });

        });
    }
    
    async deleteSync(sql, params) {
        return new Promise((resolve, reject) => {
            // Log the SQL statement for debugging
            info(this.getCompletedSQL(sql,params));
    
            this.db.serialize(() => {
                this.db.run(sql, params, function(err) { // Use traditional function syntax here
                    if (err) {
                        reject(err); // Reject the promise on error
                        return; // Exit to prevent further execution
                    }
        
                    // Set local storage items using this context from the callback
                    localStorage.setItem('lastID', this.lastID);
                    localStorage.setItem('changes', this.changes);
        
                    // Log rows for debugging
                    resolve(this.changes); // Use this.changes from the callback context
                });    
            });
        });
    }
 
    getLastID() {
        return this.LastID;
    }
 
    async updateSync(sql,params=[]) {
        return this.insertSync(sql,params);
    }

    emptyTable(table,callback) {
        this.insert(`DELETE FROM ${table};`,callback);
    }

    async emptyTableSync(table) {
        return await this.insertSync(`DELETE FROM ${table};`)  
    }

    getAllTables(callback) {
        var sql = `SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
        this.query(sql,callback);
    }

    async getAllTablesSync() {
        var sql = `SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
        return await this.querySync(sql);
    }

    async emptyAllTablesSync() {
        var rows = await this.getAllTablesSync();
        rows.forEach(async row => {
            await this.emptyTableSync(row.name);
        })
    }

    async purge(table) {
        await this.emptyTableSync(table);
    }

    getCompletedSQL(query, params) {
        let i = 0;
        return query.replace(/\?/g, () => {
            let param = params[i++];
            if (typeof param === 'string') {
                param = `'${param}'`; // wrap strings in quotes
            }
            return param;
        });
    }
 }
 
 module.exports = Model;
/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

 const sqlite3 = require('sqlite3').verbose();
 const path = require('path');
 const fs = require('fs');
 const localStorage = require('localStorage');
 const os = require('os');
 
 class Model {
     LastID;
 
     constructor() {
        if (fs.existsSync(path.join(os.homedir(),'.bestbooks')) == false) {
            fs.mkdirSync(path.join(os.homedir(),'.bestbooks'));
        }
        this.filePath = path.join(os.homedir(),'.bestbooks/bestbooks.db');
         this.db = new sqlite3.Database(this.filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
            (err) => { 
             // do your thing 
             console.error(err);
            });         
     }
 
     getFilePath() {
         return this.filePath;
     }
 
     deleteDatabaseFile() {
         if (fs.existsSync(this.filePath)) {
             fs.rm(this.filePath);
             return true;
         }
         return false;
     }
 
     query(sql, callback) {
         this.db.all(sql, (err, rows) => {
             if (err) callback([]);
             callback(rows);
         });
     }
 
     querySync(sql) {
         return new Promise((resolve, reject) => {
             this.db.all(sql, (err, rows) => {
                 if (err) reject(err);
                 resolve(rows);
             });
         });
     }
 
     insert(sql, callback) {
         this.db.run(sql, function(err, rows){
             if (err) throw new Error(err);
             localStorage.setItem('lastID',this.lastID);
             localStorage.setItem('changes',this.changes);
             callback(this.lastID,this.changes);
         });
     }
 
     async insertSync(sql) {
         return new Promise((resolve, reject) => {
             this.db.run(sql, function(err, rows){
                 if (err) reject(err);
                 localStorage.setItem('lastID',this.lastID);
                 localStorage.setItem('changes',this.changes);
                 resolve(this.lastID);
             });
         });
     }
 
     getLastID() {
         return this.LastID;
     }
 
     async updateSync(sql) {
         return this.insertSync(sql);
     }
 }
 
 module.exports = Model;
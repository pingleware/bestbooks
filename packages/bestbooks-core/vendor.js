/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Vendor {

    constructor() {
        // create and open database
        this.model = new Model();
        // create ledger table if not exist
        this.createTable();
    }

    /**
     * 
     * @param {object} usermeta {company_id: 0, office_id: 0, name: '', address_1: '', address_2: '', city: '', state: '', postalCode: '', phone: '', email: '', website: '', account_number: ''}
     * @returns 
     */
    add(usermeta) {
        try {
            var sql = `INSERT INTO vendor (company_id,
                                            office_id,
                                            name,
                                            address_1,
                                            address_2,
                                            city,
                                            state,
                                            postalCode,
                                            phone,
                                            email,
                                            website,
                                            account_number) VALUES (
                                                ${usermeta.company_id},
                                                ${usermeta.office_id},
                                                '${usermeta.name}',
                                                '${usermeta.address_1}',
                                                '${usermeta.address_2}',
                                                '${usermeta.city}',
                                                '${usermeta.state}',
                                                '${usermeta.postalCode}',
                                                '${usermeta.phone}',
                                                '${usermeta.email}',
                                                '${usermeta.website}',
                                                '${usermeta.account_number}'
                                            );`;
            return this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    quickAdd(usermeta) {
        try {
            var sql = `INSERT INTO vendor (
                company_id,
                office_id,
                name,
                email
            ) VALUES (
                '${usermeta.company_id}',
                '${usermeta.office_id}',
                '${usermeta.name}',
                '${usermeta.email}'
            );`;

            return this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    find(name) {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT id FROM vendor WHERE name LIKE '%${name}%'`;
                this.model.query(sql, function(results){
                    resolve(results);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS "vendor" (
                "id"	INTEGER,
                "company_id"	INTEGER,
                "office_id"	INTEGER,
                "name"	TEXT,
                "address_1"	TEXT,
                "address_2"	TEXT,
                "city"	TEXT,
                "state"	TEXT,
                "postalCode"	TEXT,
                "country"	TEXT,
                "phone"	TEXT,
                "email"	TEXT,
                "website"	TEXT,
                "account_number"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;

            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async purgeTable() {
        try {
            var sql = `DELETE FROM vendor;`;
            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Vendor;
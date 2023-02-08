/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const localStorage = require('localStorage');

class Customer {

    constructor() {
        // create and open database
        this.model = new Model();
        // create ledger table if not exist
        this.createTable();
    }

    add(usermeta) {
        try {
            var sql = `INSERT INTO customer (
                company_id,
                office_id,
                name,
                email,
                poc_firstname,
                poc_lastname,
                address_1,
                address_2,
                city,
                state,
                postalCode,
                country,
                phone,
                fax,
                mobile,
                website,
                account_number,
                ship_address_1,
                ship_address_2,
                ship_city,
                ship_state,
                ship_postalcode,
                ship_country,
                ship_phone,
                delivery_instructions
            ) VALUES (
                '${usermeta.company_id}',
                '${usermeta.office_id}',
                '${usermeta.name}',
                '${usermeta.email}',
                '${usermeta.poc_firstname}',
                '${usermeta.poc_lastname}',
                '${usermeta.address_1}',
                '${usermeta.address_2}',
                '${usermeta.city}',
                '${usermeta.state}',
                '${usermeta.postalCode}',
                '${usermeta.country}',
                '${usermeta.phone}',
                '${usermeta.fax}',
                '${usermeta.mobile}',
                '${usermeta.website}',
                '${usermeta.account_number}',
                '${usermeta.ship_address_1}',
                '${usermeta.ship_address_2}',
                '${usermeta.ship_city}',
                '${usermeta.ship_state}',
                '${usermeta.ship_postalCode}',
                '${usermeta.ship_country}',
                '${usermeta.ship_phone}',
                '${usermeta.delivery_instructions}',
            );`;
            return this.model.insertSync(sql);        
        } catch(error) {
            console.error(error);
        }
    }

    quickAdd(usermeta) {
        try {
            var sql = `INSERT INTO customer (
                company_id,
                office_id,
                name,
                email,
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

    find(name,callback) {
        try {
            var sql = `SELECT id FROM customer WHERE name LIKE '%${name}%';`;
            this.model.query(sql, function(results){
                if (results.length > 0) {
                    callback(results);
                } else {
                    callback([]);
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS "customer" (
                "id"	INTEGER,
                "company_id"	INTEGER,
                "office_id"	INTEGER,
                "name"	TEXT,
                "email"	TEXT,
                "poc_firstname"	TEXT,
                "poc_lastname"	TEXT,
                "address_1"	TEXT,
                "address_2"	TEXT,
                "city"	TEXT,
                "state"	TEXT,
                "postalCode"	TEXT,
                "country"	TEXT,
                "phone"	TEXT,
                "fax"	TEXT,
                "mobile"	TEXT,
                "website"	TEXT,
                "account_number"	TEXT,
                "ship_address_1"	TEXT,
                "ship_address_2"	TEXT,
                "ship_city"	TEXT,
                "ship_state"	TEXT,
                "ship_postalCode"	TEXT,
                "ship_country"	TEXT,
                "ship_phone"	TEXT,
                "delivery_instructions"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;

            this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Customer;
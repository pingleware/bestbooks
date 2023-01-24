/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use struct"

const promisify = require('util').promisify;
const Model = require('./model');
const localStorage = require('localStorage');

class ChartOfAccounts {

    accounts = [];

    constructor() {
        // create and open database
        this.model = new Model();
        this.createTable();    
        //this.getList();
    }

    async add(name,type,company_id=0) {
        try {
            //if (!this.accounts[name]) {
                this.accounts[name] = type;
                this.count = this.accounts.length;

                //let company_id = localStorage.getItem('company_id') + Number(0);
                var account = this.getAccountTypeCode(type);
                console.log(account);
                var new_code = `SELECT count(id)+${account[1]} AS code FROM accounts WHERE base_type='${account[0]}'`;
                var sql = `INSERT OR IGNORE INTO accounts (company_id,code,name,type,base_type) VALUES (${company_id},(${new_code}),'${name}','${type}','${account[0]}');`;
                await this.model.insertSync(sql);
                return localStorage.getItem("lastID"); //`${name} added to Accounts successfully`;    
            //} else {
            //    return `Account: ${name} already exists`;
            //}
        } catch(error) {
            console.error(error);
        }
    }

    async remove(name) {
        try {
            var sql = `DELETE FROM accounts WHERE name='${name}';`;
            await this.model.querySync(sql);
            return `${name} removed from accounts successfully`;
        } catch(error) {
            console.error(error);
        }
    }

    async in_use(name) {
        try {
            var sql = `SELECT * FROM journal WHERE account='${name}';`;
            var rows = await this.model.querySync(sql);
            if (rows.length > 0) {
                return true;
            }
            return false;
        } catch(error) {
            console.error(error);
        }    
    }

    getCount() {
        return this.count;
    }

    async getList() {
        try {
            var sql = `SELECT name,type FROM accounts;`;
            return await this.model.querySync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    getAccountTypeCode(type) {
        var account_type = '';
        let account_value = 900;
        switch(type) {
          case 'Asset':
          case 'Bank':
          case 'Cash':
            account_type = 'Asset';
            account_value = 100;
            break;
          case 'Liability':
          case 'Credit':
            account_type = 'Liability';
            account_value = 200;
            break;
          case 'OwnersEquity':
          case 'Investment':
          case 'Withdrawals':
            account_type = 'Equity';
            account_value = 300;
            break;
          case 'Expense':
            account_type = 'Expense';
            account_value = 400;
            break;
          case 'Revenue':
            account_type = 'Revenue';
            account_value = 500;
            break;
          default:
            account_type = '';
        }

        return [account_type,account_value];
    }

    async getNextAccountCode(name) {
        try {
            var account_type = '';
            let account_value = 900;
            switch(name) {
              case 'Asset':
              case 'Bank':
              case 'Cash':
                account_type = 'Asset';
                account_value = 100;
                break;
              case 'Liability':
              case 'Credit':
                account_type = 'Liability';
                account_value = 200;
                break;
              case 'OwnersEquity':
              case 'Investment':
              case 'Withdrawals':
                account_type = 'Equity';
                account_value = 300;
                break;
              case 'Expense':
                account_type = 'Expense';
                account_value = 400;
                break;
              case 'Revenue':
                account_type = 'Revenue';
                account_value = 500;
                break;
              default:
                account_type = '';
            }
          
            var sql = `SELECT count(id)+${account_value} AS code FROM accounts WHERE base_type='${account_type}';`;
            var rows = await this.model.querySync(sql);
            return rows[0].code;
        } catch(error) {
            console.error(error);
        }
    }

    async createTable() {
        var sql = `CREATE TABLE IF NOT EXISTS "accounts" (
            "id" INTEGER,
            "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "company_id" INTEGER,
            "code" INTEGER,
            "name" TEXT UNIQUE,
            "type" TEXT,
            "base_type" TEXT,
            "Description" TEXT,
            "Bal01"	NUMERIC,
            "Bal02"	NUMERIC,
            "Bal03"	NUMERIC,
            "Bal04"	NUMERIC,
            "Bal05"	NUMERIC,
            "Bal06"	NUMERIC,
            "Bal07"	NUMERIC,
            "Bal08"	NUMERIC,
            "Bal09"	NUMERIC,
            "Bal10"	NUMERIC,
            "Bal11"	NUMERIC,
            "Bal12"	NUMERIC,
            "Bal13"	NUMERIC,
            "Bal14"	NUMERIC,
            "Bal15"	NUMERIC,
            "Bal16"	NUMERIC,
            "Bal17"	NUMERIC,
            "Bal18"	NUMERIC,
            "Bal19"	NUMERIC,
            "Bal20"	NUMERIC,
            "Bal21"	NUMERIC,
            "Bal22"	NUMERIC,
            "Bal23"	NUMERIC,
            "Bal24"	NUMERIC,
            "Bud01"	NUMERIC,
            "Bud02"	NUMERIC,
            "Bud03"	NUMERIC,
            "Bud04"	NUMERIC,
            "Bud05"	NUMERIC,
            "Bud06"	NUMERIC,
            "Bud07"	NUMERIC,
            "Bud08"	NUMERIC,
            "Bud09"	NUMERIC,
            "Bud10"	NUMERIC,
            "Bud11"	NUMERIC,
            "Bud12"	NUMERIC,
            "Bud13"	NUMERIC,
            "Bud14"	NUMERIC,
            "Bud15"	NUMERIC,
            "Bud16"	NUMERIC,
            "Bud17"	NUMERIC,
            "Bud18"	NUMERIC,
            "Bud19"	NUMERIC,
            "Bud20"	NUMERIC,
            "Bud21"	NUMERIC,
            "Bud22"	NUMERIC,
            "Bud23"	NUMERIC,
            "Bud24"	NUMERIC,
            "Budget" NUMERIC,
            PRIMARY KEY("id")
        );`;
        try {
            var result = await this.model.querySync(sql);
            console.log(result);
        } catch(error) {
            console.error(error);
        }
    }
}


module.exports = ChartOfAccounts;
/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const AccountTypes = require('./accountTypes');
const Ledger = require('./ledger');
const Journal = require('./journal');

const {
    info,
    warn,
    error
} = require('./logger');

class Asset extends Ledger {
    group = 0;
    balance = 0;
	debit = 0;
	credit = 0;

    constructor(name,type=AccountTypes.Asset) {
        super(name,type);
        this.group = 100;
    }

    async addDebit(date,desc,amount,company_id=0,office_id=0){
        try {
            // SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+100,100) FROM ledger WHERE account_name='Cash'
            // SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='Cash'
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,debit,balance) VALUES (?,?,?,(SELECT code FROM accounts WHERE name=?),?,?,?,(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+?,?) FROM ledger WHERE account_name=?));`;
            const params = [company_id,office_id,super.getName(),super.getName(),date,desc,amount,amount,amount,super.getName()];
            const ledger_insert_id = await this.model.insertSync(sql,params);
            info(`addDebit: ${ledger_insert_id}`)
            let journal_insert_id = 0;

            if (super.getName() !== 'Uncategorized') {
                var journal = new Journal('General');
                journal_insert_id = await journal.add(date,ledger_insert_id,super.getName(),amount,0.00,company_id,office_id);
                if (typeof journal_insert_id !== "undefined") {
                    sql = `UPDATE ledger SET ref=${journal_insert_id} WHERE id=${ledger_insert_id};`;
                    await this.model.insertSync(sql);    
                }
            }            
            return [ledger_insert_id,journal_insert_id];
        } catch(err) {
            console.error(err);
        }
    }
    async addCredit(date,desc,amount,company_id=0,office_id=0){
        try {
            this.credit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,credit,balance) VALUES (${company_id},${office_id},'${super.getName()}',(SELECT code FROM accounts WHERE name='${super.getName()}'),'${date}','${desc}','${Math.abs(amount)}',(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)-${amount},${amount}) FROM ledger WHERE account_name='${super.getName()}'));`;
            info(sql);

            let ledger_insert_id = await this.model.insertSync(sql);
            let journal_insert_id = 0;

            if (super.getName() !== 'Uncategorized') {
                var journal = new Journal('General');
                journal_insert_id = await journal.add(date,ledger_insert_id,super.getName(),0.00,amount, company_id, office_id);

                sql = `UPDATE ledger SET ref=${journal_insert_id} WHERE id=${ledger_insert_id};`;
                await this.model.insertSync(sql);
            }
            return [ledger_insert_id,journal_insert_id];
        } catch(err) {
            error(JSON.stringify(err));
        }
    }
    
    getDebit(){
        return this.debit;
    }
    getCredit(){
        return this.credit;
    }

    
    async getBalance(){
        try {
            const sql = `SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='${super.getName()}';`;
            info(sql);
            var rows = await this.model.querySync(sql);
            this.balance = Number(rows[0].balance);
        } catch(err) {
            error(JSON.stringify(err));
        }
        return this.balance;
    }

    getGroup() {
        return this.group;
    }

    increase(date,desc,amount) {
        return this.addDebit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    decrease(date,desc,amount) {
        return this.addCredit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Asset;
    }
}

module.exports = Asset;
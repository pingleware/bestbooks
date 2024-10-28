/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Asset = require('./asset');
const Journal = require('./journal');

const {
    info,
    warn,
    error
} = require('./logger');

class AccountsReceivable extends Asset {
    constructor(name) {
        super(name,"Accounts Receivable");
    }

    async addDebit(date,desc,amount,due_date,company_id=0,office_id=0,transaction_type="Operating"){
        try {
            // SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+100,100) FROM ledger WHERE account_name='Cash'
            // SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='Cash'
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,debit,balance,transaction_type,due_date) VALUES (?,?,?,(SELECT code FROM accounts WHERE name=?),?,?,?,(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+?,?) FROM ledger WHERE account_name=?),?,?);`;
            const params = [
                company_id,
                office_id,
                super.getName(),
                super.getName(),
                date,
                desc,
                amount,
                amount,
                amount,
                super.getName(),
                transaction_type,
                due_date
            ];
            const ledger_insert_id = await this.model.insertSync(sql,params);
            info(`addDebit.ledger.id: ${ledger_insert_id}`);
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
    async addCredit(date,desc,amount,due_date,company_id=0,office_id=0,transaction_type="Operating"){
        try {
            this.credit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (
                        company_id,
                        office_id,
                        account_name,
                        account_code,
                        txdate,
                        note,
                        credit,
                        balance,
                        transaction_type,
                        due_date
                    ) VALUES (
                        ?,?,?,
                        (SELECT code FROM accounts WHERE name=?),
                        ?,?,?,
                        (SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)-?,?) FROM ledger WHERE account_name=?),
                        ?,?
                    );`;
            const params = [
                company_id,
                office_id,
                super.getName(),
                super.getName(),
                date,
                desc,
                Math.abs(amount),
                amount,
                amount,
                super.getName(),
                transaction_type,
                due_date
            ];

            const ledger_insert_id = await this.model.insertSync(sql,params);
            info(`addCredit.ledger.id: ${ledger_insert_id}`);
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
}

module.exports = AccountsReceivable;
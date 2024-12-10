/**
 * State of Florida
 * BestBooks Accounting Application Framework Trademark
 * All Rights Reserved © 2021
 * 
 * This file is part of bestbooks-core project.
 * Copyright © 2021 PRESSPAGE ENTERTAINMENT INC.
 * 
 * Licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * You may use, share, and adapt this file, provided you give appropriate credit, indicate
 * if changes were made, and distribute any derivatives under the same license.
 *  
 * You can view the full license at https://creativecommons.org/licenses/by/4.0/
 */

 "use strict"

/**
 * Here's a summary of how increases and decreases are recorded in terms of debit and credit 
 * balances for the five main account types:
 * 
 * ### 1. **Assets** (e.g., Cash, Accounts Receivable, Equipment)
 *    - **Increase**: Debit
 *    - **Decrease**: Credit
 * 
 * ### 2. **Liabilities** (e.g., Loans, Accounts Payable)
 *    - **Increase**: Credit
 *    - **Decrease**: Debit
 * 
 * ### 3. **Equity** (e.g., Owner’s Capital, Retained Earnings)
 *    - **Increase**: Credit
 *    - **Decrease**: Debit
 * 
 * ### 4. **Expenses** (e.g., Salaries, Rent, Utilities)
 *    - **Increase**: Debit
 *    - **Decrease**: Credit
 * 
 * ### 5. **Revenue** (e.g., Sales, Service Income)
 *    - **Increase**: Credit
 *    - **Decrease**: Debit
 * 
 * In summary:
 * - **Debit to increase**: Assets, Expenses
 * - **Credit to increase**: Liabilities, Equity, Revenue
 * 
 */
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

    constructor(name,type=AccountTypes.Asset,base=AccountTypes.Asset) {
        super(name,type,base);
        this.group = 100;
    }

    async addDebit(date,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
        try {
            // SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+100,100) FROM ledger WHERE account_name='Cash'
            // SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='Cash'
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger 
                (company_id,office_id,account_name,account_code,txdate,note,debit,balance,location,transaction_type) 
            VALUES 
                (?,?,?,
                (SELECT code FROM accounts WHERE name=?),
                ?,?,?,
                (SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+?,
                ?) 
            FROM ledger WHERE account_name=?),?,?);`;
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
                location,
                transaction_type
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
    async addCredit(date,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
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
                        location,
                        transaction_type
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
                location,
                transaction_type
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
    
    getDebit(){
        return this.debit;
    }
    getCredit(){
        return this.credit;
    }

    
    async getBalance(){
        try {
            var sql = `SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name=?;`;
            const params = [super.getName()];
            var rows = await this.model.querySync(sql,params);
            this.balance = Number(rows[0].balance);
            return this.balance;
        } catch(err) {
            error(JSON.stringify(err));
        }
        return this.balance;
    }

    getGroup() {
        return this.group;
    }

    async increase(date,desc,amount) {
        return await this.addDebit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    async decrease(date,desc,amount) {
        return await this.addCredit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Asset;
    }
}

module.exports = Asset;
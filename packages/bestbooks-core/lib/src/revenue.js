/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

/**
 * See: http://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 * 
 * Liabilities, Equity, and Revenue
 * --------------------------------
 * Liability, Equity, and Revenue accounts usually receive credits, 
 * so they maintain negative balances. They are called credit accounts. 
 * Accounting books will say “Accounts that normally maintain a negative balance 
 * are increased with a Credit and decreased with a Debit.” 
 * Again, look at the number line. 
 * If you add a negative number (credit) to a negative number, 
 * you get a larger negative number! (moving left on the number line). 
 * But if you start with a negative number and add a positive number to it (debit), 
 * you get a smaller negative number because you move to the right on the number line.
 * 
 */

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

class Revenue extends Ledger {
    group = 0;
    balance = 0;
	debit = 0;
	credit = 0;

    constructor(name,type=AccountTypes.Revenue,base=AccountTypes.Revenue) {
        super(name,type,base);
        this.group = 500;
    }

    async addDebit(date,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
        try {
            // SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+100,100) FROM ledger WHERE account_name='Cash'
            // SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='Cash'
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,debit,balance,location,transaction_type) VALUES (?,?,?,(SELECT code FROM accounts WHERE name=?),?,?,?,(SELECT IIF(SUM(credit)-SUM(debit),SUM(credit)-SUM(debit)-?,?) FROM ledger WHERE account_name=?),?,?);`;
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
    async addCredit(date,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
        try {
            this.credit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,credit,balance,location,transaction_type) VALUES (?,?,?,(SELECT code FROM accounts WHERE name=?),?,?,?,(SELECT IIF(SUM(credit)-SUM(debit),SUM(credit)-SUM(debit)+?,?) FROM ledger WHERE account_name=?),?,?);`;
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
                
            let ledger_insert_id = await this.model.insertSync(sql,params);
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
            let sql = `SELECT SUM(credit)-SUM(debit) AS balance FROM ledger WHERE account_name=?;`;
            const params = [super.getName()];
            var rows = await this.model.querySync(sql,params);
            this.balance = Number(rows[0].balance);
        } catch(err) {
            error(JSON.stringify(err));
        }
        return this.balance;
    }

    getGroup() {
        return this.group;
    }

    /**
    * A credit is an accounting entry that either increases a liability or equity account, 
    * or decreases an asset or expense account. It is positioned to the right in an accounting entry.
    */
    increase(date,desc,amount) {
        return this.addCredit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    /**
    * A debit is an accounting entry that either increases an asset or expense account, 
    * or decreases a liability or equity account. It is positioned to the left in an accounting entry.
    */
    decrease(date,desc,amount) {
        return this.addDebit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Revenue;
    }
}

module.exports = Revenue;
/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

/**
 * Contra accounts are used in accounting to reduce the value of related accounts. 
 * For example, a contra asset account reduces the balance of a related asset, 
 * while a contra equity account reduces the equity balance. 
 * 
 * Here's a breakdown of debits and credits for typical contra accounts:
 * 
 * ### Contra Asset Accounts
 * - **Accumulated Depreciation (contra to assets like Property, Plant, and Equipment)**
 *   - **Debit**: When an asset is disposed of or when depreciation is reversed.
 *   - **Credit**: When depreciation is recorded, reducing the book value of the asset.
 * 
 * - **Allowance for Doubtful Accounts (contra to Accounts Receivable)**
 *   - **Debit**: When bad debts are written off, reducing the allowance.
 *   - **Credit**: When an estimate of uncollectible accounts is made, increasing the allowance.
 * 
 * ### Contra Liability Accounts
 * - **Discount on Bonds Payable**
 *   - **Debit**: When bond discount is amortized over time.
 *   - **Credit**: Initial recording of the bond discount.
 * 
 * ### Contra Equity Accounts
 * - **Treasury Stock (contra to equity)**
 *   - **Debit**: When a company repurchases its own shares.
 *   - **Credit**: If the shares are later reissued at a lower price or sold back into the market.
 * 
 * ### Contra Revenue Accounts
 * - **Sales Returns and Allowances (contra to sales revenue)**
 *   - **Debit**: When goods are returned or allowances are granted to customers.
 *   - **Credit**: Reversal or adjustment of previous sales returns/allowances.
 * 
 * In all of these cases, contra accounts usually carry the opposite balance to the main account 
 * type (e.g., asset, liability, equity) they are associated with, thereby reducing the overall 
 * account balance.
 */

const AccountTypes = require('./accountTypes');
const Liability = require('./liability');
const Journal = require('./journal');

const {
    info,
    warn,
    error
} = require('./logger');


class ContraLiability extends Liability {

    constructor(name,type=AccountTypes.ContraLiability) {
        super(name,type);
        this.group = 200;
    }

    async addDebit(date,desc,amount,company_id=0,office_id=0,location=0){
        try {
            // SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+100,100) FROM ledger WHERE account_name='Cash'
            // SELECT SUM(debit)-SUM(credit) AS balance FROM ledger WHERE account_name='Cash'
            this.debit = amount;
            var sql = `INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,debit,balance) VALUES (?,?,?,(SELECT code FROM accounts WHERE name=?),?,?,?,(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+?,?) FROM ledger WHERE account_name=?));`;
            const params = [company_id,office_id,super.getName(),super.getName(),date,desc,amount,amount,amount,super.getName()];
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
    async addCredit(date,desc,amount,company_id=0,office_id=0){
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
                        balance
                    ) VALUES (
                        ?,?,?,
                        (SELECT code FROM accounts WHERE name=?),
                        ?,?,?,
                        (SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)-?,?) FROM ledger WHERE account_name=?)
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
                super.getName()
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

    /**
    * A credit is an accounting entry that either increases a liability or equity account, 
    * or decreases an asset or expense account. It is positioned to the right in an accounting entry.
    */
    increase(date,desc,amount) {
        return this.addDebit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    /**
    * A debit is an accounting entry that either increases an asset or expense account, 
    * or decreases a liability or equity account. It is positioned to the left in an accounting entry.
    */
    decrease(date,desc,amount) {
        return this.addCredit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Liability;
    }
}

module.exports = ContraLiability;
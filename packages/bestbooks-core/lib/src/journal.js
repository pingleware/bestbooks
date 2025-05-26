/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

/**
 * In an accounting system, several types of journals are typically used to record financial 
 * transactions. Here’s a list of common journals:
 * 
 * 1. **General Journal**  
 *    - Used to record non-specialized or infrequent transactions that do not fit into other 
 *      specialized journals. Examples include corrections and adjustments.
 * 
 * 2. **Sales Journal**  
 *    - Records all credit sales of goods or services. Cash sales are generally recorded in the 
 *      cash receipts journal.
 * 
 * 3. **Purchases Journal**  
 *    - Records all credit purchases of goods or services. Cash purchases are usually recorded 
 *      in the cash payments journal.
 * 
 * 4. **Cash Receipts Journal**  
 *    - Tracks all receipts of cash, including cash sales and payments received from debtors.
 * 
 * 5. **Cash Payments (Disbursements) Journal**  
 *    - Tracks all cash payments, such as payments to creditors, cash purchases, 
 *      and operating expenses.
 * 
 * 6. **Sales Returns and Allowances Journal**  
 *    - Used to record returns of goods sold on credit or sales allowances granted to customers.
 * 
 * 7. **Purchase Returns and Allowances Journal**  
 *    - Used to record returns of goods purchased on credit or allowances received from suppliers.
 * 
 * 8. **Payroll Journal**  
 *    - Records all payroll-related transactions, including wages, taxes withheld, 
 *      and employee benefits.
 * 
 * 9. **Petty Cash Journal**  
 *    - Used to track small cash expenditures made from a petty cash fund.
 * 
 * 10. **Fixed Asset Journal**  
 *     - Records transactions related to the purchase, sale, or depreciation of fixed assets 
 *       like machinery, buildings, and equipment.
 * 
 * 11. **Inventory Journal**  
 *     - Records adjustments to inventory such as stock purchases, sales, and inventory write-downs 
 *       or losses.
 * 
 * These journals serve as primary sources for entering transaction data before the entries are 
 * posted to the general ledger.
 */

const Model = require('./model');
const {
    info,
    warn,
    error
} = require('./logger');

class Journal {

    constructor(name) {
        this.name = name;
        this.model = new Model();
        this.init();
    }

    async init() {
        await this.createTable();
    }

    async add(date, ref, account, debit, credit, company_id = 0, office_id = 0) {
        try {
            const sql = `INSERT OR IGNORE INTO journal (name, company_id, office_id, txdate, ref, account, debit, credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
            // Use an array for parameters to prevent SQL injection
            const params = [this.name, company_id, office_id, date, ref, account, debit, credit];
            const id = await this.model.insertSync(sql, params); // Pass params here
    
            info(`journal.add.lastID: ${id}`);
            return id;
        } catch (err) {
            error(JSON.stringify(err));
        }
    }
    

    async update(id,date,account,debit,credit,ref=0) {
        try {
            const sql = `UPDATE journal SET txdate='${date}',account='${account}',ref='${ref}',debit=${debit},credit=${credit} WHERE id=${id};`;
            return await this.model.updateSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async remove(id) {
        try {
            const sql = `DELETE FROM journal WHERE id='${id}';`;
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async inBalance() {
        try {
            const sql = `SELECT SUM(debit)=SUM(credit) AS INBALANCE FROM journal WHERE name="${this.name}";`;
            const rows = await this.model.querySync(sql);
            return (rows[0].INBALANCE==1);
        } catch(err) {
            error(JSON.stringify(err));
        }
        return false;
    }

    async balance() {
        try {
            const sql = `SELECT SUM(credit)-SUM(debit) AS balance FROM journal WHERE name="${this.name}";`;
            var rows = await this.model.querySync(sql);
            return Number(rows[0].balance);
        } catch(err) {
            error(JSON.stringify(err));
        }
        return 0;
    }

    getBalance() {
        return this.balance();
    }

    async transaction(account="",where="") {
        try {
            var sql = `SELECT * FROM journal WHERE account=? AND name=? ${where} ORDER BY txdate ASC;`;
            let params = [account,this.name];
            if (account.length == 0) {
                sql = `SELECT * FROM journal WHERE name=? ${where} ORDER BY txdate ASC;`;
                params = [this.name];
            }
            return await this.model.querySync(sql,params);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS "journal" (
                "id" INTEGER,
                "name" TEXT,
                "company_id" INTEGER,
                "office_id"	INTEGER,
                "txdate" TIMESTAMP,
                "account" TEXT,
                "ref" INTEGER,
                "debit"	REAL,
                "credit" REAL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;
            await this.model.updateSync(sql);    
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM journal;`;
            await this.model.insertSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async listJournals() {
        const sql = `SELECT name FROM journal GROUP BY name`;
        var rows = this.model.querySync(sql);
        return rows;
    }

    async getDebitCreditTotals(where='') {
        const sql = `SELECT SUM(debit) AS total_debit,SUM(credit) AS total_credit FROM journal ${where} ORDER BY txdate ASC`;
        return this.model.querySync(sql);
    }

    async setXRef(id, value) {
        let sql = `UPDATE journal SET ref=? WHERE id=?;`;
        const params = [value, id];
        return this.model.updateSync(sql,params);
    }
}

module.exports = Journal;
/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

/**
 * A **Petty Cash Journal** is used to track small, everyday cash expenses in a business. It helps ensure accountability for minor expenses and provides a record for financial reporting. Here's how to use a Petty Cash Journal effectively:
 * 
 * ### Steps to Use a Petty Cash Journal
 * 
 * 1. **Set Up the Petty Cash Fund**
 *    - Establish a fixed amount of cash to be held in the petty cash fund, e.g., $200.
 *    - The fund is replenished when it runs low or at the end of a reporting period.
 * 
 * 2. **Record the Opening Balance**
 *    - At the beginning of a new period, note the starting balance in the journal.
 * 
 * 3. **Track Every Expense**
 *    - Each time cash is withdrawn from the petty cash fund, record the transaction in the petty cash journal. Include:
 *      - **Date**: When the expense occurred.
 *      - **Description**: What the money was spent on (e.g., office supplies, postage, travel, etc.).
 *      - **Amount**: The cost of the item or service.
 *      - **Recipient or Payee**: Who received the cash.
 *      - **Voucher or Receipt Number**: Attach the receipts or vouchers to the journal entry to maintain proof.
 * 
 * 4. **Replenish the Fund**
 *    - When the petty cash runs low, replenish it to the original amount by writing a check from the main business account. The amount of the replenishment should match the total of expenses recorded in the journal.
 *    - Record the replenishment in both the petty cash journal and the main ledger.
 * 
 * 5. **Periodically Reconcile**
 *    - At regular intervals (monthly, quarterly, etc.), reconcile the petty cash fund. Ensure the cash left in the fund plus the recorded expenses equals the original petty cash amount.
 *    - Investigate any discrepancies and ensure all expenses are accounted for.
 * 
 * ### Format of a Petty Cash Journal
 * 
 * | Date       | Account          | Credit (Amount Spend)  | Debit (Amount Replenished)  | Balance |
 * |------------|------------------|------------------------|-----------------------------|---------|
 * | 01-Oct-24  | Office supplies  | $25.00                 |                             | $175.00 |
 * | 05-Oct-24  | Postage          | $10.00                 |                             | $165.00 |
 * | 10-Oct-24  | Replenishment    |                        | $35.00                      | $200.00 |
 * 
 * ### Key Points
 * - Ensure that the journal and receipts match the actual cash in the petty cash box.
 * - Petty cash should be used for small, incidental purchases, not large expenses.
 * - Always document expenses clearly to maintain transparency and accountability.
 * 
 */

const Journal = require('./journal'); // Assuming the Journal class is in the same directory

class PettyCashJournal extends Journal {
    constructor() {
        super("PettyCash"); // Sets the name of the journal to 'PettyCash'
    }

    /**
     * Records a petty cash transaction.
     * @param {Object} record - The petty cash record with properties: date, ref, account, debit, credit, company_id, office_id.
     */
    async recordPettyCashTransaction(record) {
        const { date, ref, account, debit, credit, company_id = 0, office_id = 0 } = record;
        await super.add(date, ref, account, debit, credit, company_id, office_id);
    }

    /**
     * Calculates the balance for the petty cash journal.
     * @returns {Promise<number>} The balance of the petty cash journal.
     */
    async getJournalBalance() {
        return await this.getBalance();
    }

    /**
     * Retrieves all transactions in the petty cash journal.
     * @param {string} [where] - Optional WHERE clause to filter the transactions.
     * @returns {Promise<Object[]>} Array of transactions.
     */
    async getTransactions(account = "",where = "") {
        return await this.transaction(account,where);
    }

    /**
     * Checks if the journal is in balance (debits equal credits).
     * @returns {Promise<boolean>} True if in balance, false otherwise.
     */
    async checkInBalance() {
        return await this.inBalance();
    }

    /**
     * Updates an existing petty cash transaction.
     * @param {number} id - The ID of the transaction to update.
     * @param {Object} record - The updated transaction record with properties: date, account, debit, credit, ref.
     * @returns {Promise<void>}
     */
    async updateTransaction(id, record) {
        const { date, account, debit, credit, ref = 0 } = record;
        await this.update(id, date, account, debit, credit, ref);
    }

    /**
     * Removes a petty cash transaction by ID.
     * @param {number} id - The ID of the transaction to remove.
     * @returns {Promise<void>}
     */
    async removeTransaction(id) {
        await this.remove(id);
    }
}

module.exports = PettyCashJournal;

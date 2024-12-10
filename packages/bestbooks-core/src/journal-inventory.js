/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal'); // Assuming the Journal class is in the same directory

class InventoryJournal extends Journal {
    constructor() {
        super("Inventory"); // Sets the name of the journal to 'Inventory'
    }

    /**
     * Records a transaction related to inventory.
     * @param {Object} record - The inventory record with properties: date, ref, account, debit, credit, company_id, office_id.
     */
    async recordInventoryTransaction(record) {
        const { date, ref, account, debit, credit, company_id = 0, office_id = 0 } = record;
        await super.add(date, ref, account, debit, credit, company_id, office_id);
    }

    /**
     * Calculates the balance for the inventory journal.
     * @returns {Promise<number>} The balance of the inventory journal.
     */
    async getJournalBalance() {
        return await this.getBalance();
    }

    /**
     * Retrieves all transactions in the inventory journal.
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
     * Updates an existing inventory transaction.
     * @param {number} id - The ID of the transaction to update.
     * @param {Object} record - The updated transaction record with properties: date, account, debit, credit, ref.
     * @returns {Promise<void>}
     */
    async updateTransaction(id, record) {
        const { date, account, debit, credit, ref = 0 } = record;
        await this.update(id, date, account, debit, credit, ref);
    }

    /**
     * Removes an inventory transaction by ID.
     * @param {number} id - The ID of the transaction to remove.
     * @returns {Promise<void>}
     */
    async removeTransaction(id) {
        await this.remove(id);
    }
}

module.exports = InventoryJournal;
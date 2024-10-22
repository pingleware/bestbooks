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

const Journal = require('./journal'); // Assuming the Journal class is in the same directory

class CashReceiptsJournal extends Journal {
    constructor() {
        super("CashReceipts"); // Sets the name of the journal to 'CashReceipts'
    }

    /**
     * Records a cash receipt in the Cash Receipts Journal.
     * @param {Object} record - The receipt record with properties: date, ref, account, debit, credit, company_id, office_id.
     */
    async recordReceipt(record) {
        const { date, ref, account, debit, credit, company_id = 0, office_id = 0 } = record;
        await super.add(date, ref, account, debit, credit, company_id, office_id);
    }

    /**
     * Calculates the balance for the cash receipts journal.
     * @returns {Promise<number>} The balance of the cash receipts journal.
     */
    async getJournalBalance() {
        return await this.getBalance();
    }

    /**
     * Retrieves all transactions in the cash receipts journal.
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
     * Updates an existing transaction.
     * @param {number} id - The ID of the transaction to update.
     * @param {Object} record - The updated transaction record with properties: date, account, debit, credit, ref.
     * @returns {Promise<void>}
     */
    async updateTransaction(id, record) {
        const { date, account, debit, credit, ref = 0 } = record;
        await this.update(id, date, account, debit, credit, ref);
    }

    /**
     * Removes a transaction by ID.
     * @param {number} id - The ID of the transaction to remove.
     * @returns {Promise<void>}
     */
    async removeTransaction(id) {
        await this.remove(id);
    }
}

module.exports = CashReceiptsJournal;

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

const Journal = require('./journal.js');

class PettyCashJournal extends Journal {

    constructor() {
        super("PettyCash");
    }

    async spend(record) {
        await super.add(record.date,record.ref,record.account,0,record.credit);
    }

    async replinish(record) {
        await super.add(record.date,record.ref,record.account,record.debit,0);
    }

}

module.exports = PettyCashJournal;
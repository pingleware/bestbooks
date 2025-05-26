/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

/**
 * To create a bookkeeping account for **Shareholder**, you'll need to decide the nature of the 
 * account (equity, liability, or asset) depending on your bookkeeping system and what it represents 
 * in your specific context. Typically, a **Shareholder** account would be an equity account 
 * representing the ownership interest in the company.
 * 
 * Here's a general approach using double-entry bookkeeping principles:
 * 
 * ### Steps:
 * 1. **Determine the Account Type**: A Shareholder account is usually classified under **Equity**. It reflects ownership and any capital contributions made by shareholders.
 * 
 * 2. **Chart of Accounts**: Add the **Shareholder** account under the Equity section in your chart of accounts. For example:
 *    - Account name: **Shareholder Capital**
 *    - Account type: **Equity**
 *    - Account number: Choose a unique number for this account, e.g., 3000 for Equity accounts.
 * 
 * 3. **Record Initial Entries**: If you're setting up a shareholder account for tracking initial investments or future distributions, you'd record the transaction like this:
 *    - **For Capital Contributions**:
 *      - **Debit**: Cash (Asset)
 *      - **Credit**: Shareholder Capital (Equity)
 * 
 *    - **For Dividend Payments**:
 *      - **Debit**: Shareholder Capital (Equity)
 *      - **Credit**: Cash (Asset)
 * 
 * Once set up, you can use this account to track capital contributions, withdrawals, dividends, 
 * and other shareholder-related financial activities.
 * 
 */

const Equity = require('./equity');
const RetainedEarnings = require('./equity-retainedearnings');
const Cash = require('./cash');
const User = require('./user');
const Investment = require('./investment');
const Journal = require('./journal');

class ShareholderEquity extends Equity {
    constructor() {
        super("ShareholderCapital");
        this.cash = new Cash();
        this.user = new User();
        this.Investment = new Investment("ShareholderCapital");
        this.init();
    }

    async init() {
    }

    async contribution(date, description, price, numberOfShares, user = 0, parValue = 5) {
        let amount = Number(price * numberOfShares);  // Total amount paid by the investor
        let apic = 0;  // Additional Paid-In Capital
        
        // Check if price is greater than par value to calculate APIC
        if (price > parValue) {
            apic = (price - parValue) * numberOfShares;  // Calculate APIC
            const parValueAmount = parValue * numberOfShares;  // Par value contribution
    
            // Make entry in the Share Capital (par value) and APIC
            const [ledger_id,journal_id] = await super.addCredit(date, description, parValueAmount);  // Credit for par value
            // await this.addApicEntry(date, description, apic);  // Handle APIC entry
            const _apic = new Journal("APIC");
            await _apic.add(date, ledger_id, 'APIC', 0, apic);
        } else {
            await super.addCredit(date, description, amount);  // If no APIC, credit entire amount
        }
    
        // Debit cash for the total amount paid by the investor
        const [ledger_id, journal_id] = await this.cash.addDebit(date, description, amount);
    
        // Optional: log the user who made the contribution and update their shares
        if (user) {
            await this.user.updateShares(user, amount, numberOfShares);
            console.log(`Contribution by User ID: ${user}, Amount: ${amount}, Shares: ${numberOfShares}, APIC: ${apic}, Ledger: ${ledger_id}`);
        }

        await this.Investment.contribution(user,amount);
    }
    

    async disbursement(date, description, amount, numberOfShares, retainedearnings = false, user = 0) {
        const totalDividend = Number(amount * numberOfShares);
        if (retainedearnings) {
            this.retainedearnings = new RetainedEarnings();
            await this.retainedearnings.addDebit(date, description, totalDividend);
        } else {
            await super.addDebit(date, description, totalDividend);
        }
        const [ledger_id, journal_id] = await this.cash.addCredit(date, description, totalDividend);
        // Optional: log the user who received the disbursement
        if (user) {
            console.log(`Dividend to User ID: ${user}, Amount: ${totalDividend}, Shares: ${numberOfShares}. Ledger: ${ledger_id}`);
        }
        await this.Investment.disbursement(user,totalDividend);
        await this.Investment.dividend(user,totalDividend);
    }

}

module.exports = ShareholderEquity;
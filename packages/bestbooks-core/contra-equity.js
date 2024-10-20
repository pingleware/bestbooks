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

/**
 * Yes, a **contra-equity account** like a **treasury stock account** has a **debit balance**, 
 * which is opposite to the normal **credit balance** of regular equity accounts.
 * 
 * ### Key Characteristics of Contra-Equity Accounts:
 * - **Treasury Stock**: This represents shares that a company has repurchased from shareholders and is held by the company. It reduces the total equity available to shareholders.
 * - **Debit Balance**: Since treasury stock reduces total equity, it is recorded as a debit on the balance sheet.
 *   
 * ### Relationship to Equity:
 * - Contra-equity accounts **reduce** the total equity, which is why they carry a debit balance.
 * - For example, when a company buys back its own stock, it debits (increases) the treasury stock 
 *      account and credits (decreases) cash or another equity account, lowering the total equity.
 * 
 * ### Summary:
 * - **Regular Equity Accounts**: Credit balance.
 * - **Contra-Equity Accounts (e.g., Treasury Stock)**: Debit balance, reducing total equity.
 * 
 */
const AccountTypes = require('./accountTypes');
const ContraLiability = require('./contra-liability');

class ContraEquity extends ContraLiability {
    constructor(name) {
        super(name,AccountTypes.Equity);
        this.group = 300;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = ContraEquity;
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
const ContraLiability = require('./contra-liability');

class ContraRevenue extends ContraLiability {
    constructor(name) {
        super(name,AccountTypes.Revenue);
        this.group = 500;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = ContraRevenue;
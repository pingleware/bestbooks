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

const AccountTypes = {
    Unknown: "Unknown",
    Asset: "Asset",
    ContraAsset: "ContraAsset",
    Liability: "Liability",
    ContraLiability: "ContraLiability",
    Equity: "Equity",
    ContraEquity: "ContraEquity",
    OwnersEquity: "OwnersEquity",
    Revenue: "Revenue",
    ContraRevenue: "ContraRevenue",
    Expense: "Expense",
    ContraExpense: "ContraExpense",
    Withdrawals: "Withdrawals",
    Journal: "Journal",
    Bank: "Bank",
    Cash: "Cash",
    DigitalCurrency: "Cash",
    Credit: "Credit",
    Investment: "Investment",
    Inventory: "Asset"
};

module.exports = AccountTypes;
"use strict"
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
.option('server', {
    type: 'boolean',
    description: 'Start standalone server',
    default: false,
    required: false
})
.option('host', {
    type: 'string',
    description: 'standalone server host name to bind',
    default: 'localhost',
    required: false
})
.option('port', {
    type: 'number',
    description: 'standalone server port to bind',
    default: 5000,
    required: false
})
.parse()


const {
    ChartOfAccounts,
    AccountTypes,
    Ledger } = require("@pingleware/bestbooks-core");
const {
    createAccount,
    createNewUser,
    getUsersByType,
    addCredit,
    addDebit,
    getTransactions,
    addTransactionSync,
    editTransaction,
    addJournalTransaction,
    editJournalTransaction,
    asset,
    expense,
    liability,
    equity,
    revenue,
    isJournalInbalance,
    investment,
    encumber,
    bankfee,
    loanPayment,
    payAssetsByCheck,
    payAssetsByCredit,
    payExpenseByCheck,
    payExpenseByCard,
    cardPayment,
    cashPayment,
    salesCash,
    salesCard,
    salesViaPaypal,
    accountsReceivablePayment,
    distribution,
    COGS,
    unearnedRevenue,
    badDebt,
    accruedIncome,
    accruedIncomePayment,
    accruedExpense,
    dividendDeclared,
    dividendPaid,
    securityDepositReceived,
    securityDepositPaid,
    deferredRevenue,
    recognizeDeferredRevenue,
    deferredExpense,
    recognizeDeferredExpense,
    prepaidSubscriptions,
    recognizePrepaidSubscription,
    paidInCapitalStock,
    stockDividend,
    cashDividendDeclared,
    cashDividendPayable,
    stocksIssuedOtherThanCash,
    workingHours,
    payrollPayable,
    accruedInterest,
    interestExpense,
    bondsIssuedWOAccruedInterest,
    bondsIssuedWithAccruedInteres,
    bondPremium,
    bondPremiumInterestPayment,
    bondDiscount,
    inventoryPurchase,
    inventorySold,
    inventoryShrinkage,
    inventoryShrinkageReserve,
    initializeEquity,
    inventoryRawMaterials,
    inventoryWIP,
    inventoryFinishedGoods,
    commissionPayable,
    commissionPaid,
    allocateFundingAccount,
    spendFundingAccount,
    softwareLicense,
    exchangeCryptocurrencyToUSD,
    exchangeUSDToCryptocurrency,
    googleAdsenseEarning,
    googleAdsensePayout,
    googleAdsenseReceivePayout,
    addFundsToPostageDebitAccount,
    postageExpense,
} = require("@pingleware/bestbooks-helpers");
const {
    start_smtp_server,
    base64_encode,
    base64_decode,
    SendEMail,
    SaveToDatabase,
    ReadFromDatabase
} = require('@pingleware/bestbooks-mailer');
const express = require("express");
const cors = require("cors");

const rest = express();
const { JSONRPCServer } = require("json-rpc-2.0");

// Create a JSON-RPC server
const rpcServer = new JSONRPCServer();


var server = null;

rest.use(cors());
rest.use(express.json());
rest.use(express.urlencoded({ extended: true }));

rest.post('/', async (req, res) => {
    const jsonRPCRequest = req.body;
    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
    // It can also receive an array of requests, in which case it may return an array of responses.
    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
    rpcServer.receive(jsonRPCRequest).then((jsonRPCResponse) => {
      if (jsonRPCResponse) {
        res.json(jsonRPCResponse);
      } else {
        // If response is absent, it was a JSON-RPC notification method.
        // Respond with no content status (204).
        res.sendStatus(204);
      }
    });
})

rpcServer.addMethod('total', async ([]) => {
    try {
        const methodCount = Object.keys(rpcServer.nameToMethodDictionary).length;
       return({success: true, total: methodCount})    
    } catch(err) {
        return({success: false, message: err.message});
    }
})

rpcServer.addMethod('list', async ([]) => {
    try {
        const methods = Object.keys(rpcServer.nameToMethodDictionary).slice().sort();
       return({success: true, methods: methods, total: methods.length})    
    } catch(err) {
        return({success: false, message: err.message});
    }
})

// Define a sample method
rpcServer.addMethod('version', ([]) => {
    const pkg = require('./package.json');
    return({success: true, version: pkg.version});
});

rpcServer.addMethod('chartofaccounts', ({companyId}) => {
    const coa = new ChartOfAccounts();
    coa.getListSync(req.params.companyId, function(accounts){
        return({success: true, accounts:  accounts});
    });
})
rpcServer.addMethod('account_types', () => {
    return({success: true, account_type: AccountTypes });
});
rpcServer.addMethod('debit', ([account_name,account_type,date,description,amount,company_id,office_id]) => {
    const coa = new ChartOfAccounts();
    coa.add(account_name,account_type);
    const ledger = new Ledger(account_name,account_type);
    var ids = ledger.addDebit(date,description,amount,company_id,office_id);
    return({success: true, refid: ids});
});
rpcServer.addMethod('credit', ([account_name,account_type,date,description,amount,company_id,office_id]) => {
    const coa = new ChartOfAccounts();
    coa.add(account_name,account_type);
    const ledger = new Ledger(account_name,account_type);
    var ids = ledger.addCredit(date,description,amount,company_id,office_id);
    return({success: true, refid: ids});
});
rpcServer.addMethod('balance', ([account_name,account_type]) => {
    const ledger = new Ledger(account_name,account_type);
    return({success: true, balance: ledger.getBalance()});
});
rpcServer.addMethod('add', ([adder,addend]) => {
    return({success: true, sum: Number(adder) + Number(addend)});
});
rpcServer.addMethod('subtract', ([subtractor,subtractend]) => {
    return({success: true, difference: Number(subtractor) - Number(subtractend)});
});
rpcServer.addMethod('headers', async ([]) => {
    return({success: false, message: "NOT IMPLEMENTED"});
})

/**
 * Sharing a Customer Invoice
 * 
 * using mod_proxy, setup a proxy redirect from your publicly accessible URL to the /customer/estimate server API
 */
rpcServer.addMethod('customer_estimate', ([num]) => {
    return({success: false, message: "NOT IMPLEMENTED"});
});
rpcServer.addMethod('customer_invoice', ([num]) => {
    return({success: false, message: "NOT IMPLEMENTED"});
});

/**
 * Sharing a Purchase Order
 */
// share a vendor purchase order
rpcServer.addMethod('vendor_new_purchase', ([num]) => {
    return({success: false, message: "NOT IMPLEMENTED"});
})
// update a vendor purchase order
rpcServer.addMethod('vendor_update_purchase', ([num]) => {
    return({success: false, message: "NOT IMPLEMENTED"});
})


rpcServer.addMethod('createAccount', async ([name,type]) => {
    try {
        const status = await createAccount(name,type);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
})
rpcServer.addMethod('createNewUser', async ([userType,userMeta]) => {
    try {
        const status = await createNewUser(userType,userMeta);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('getUsersByType', async ([userType]) => {
    try {
        const users = await getUsersByType(userType);
        return({success: true, users: users});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('addCredit', async([account,date,description,amount,company_id,office_id]) => {
    try {
        const status = await addCredit(account,date,description,amount,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('addDebit', async ([account,date,description,amount,company_id,office_id]) => {
    try {
        const status = await addDebit(account,date,description,amount,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
/**
 * Get Transactions
 * 
 * returns
 * {
 *     "jsonrpc": "2.0",
 *     "id": 2,
 *     "result": {
 *         "success": true,
 *         "transactions": [
 *             {
 *                 "id": 10370,
 *                 "company_id": 0,
 *                 "office_id": 0,
 *                 "account_code": "103",
 *                 "account_name": "Cash",
 *                 "txdate": "2023-12-14",
 *                 "note": "Buttery Croissant Roll",
 *                 "ref": 10377,
 *                 "debit": 0,
 *                 "credit": 5.67,
 *                 "balance": 5.67
 *             }
 *         ]
 *     }
 * }
 */
rpcServer.addMethod('getTransactions', async ([account, type, begin_date, end_date]) => {
    try {
        const transactions = await getTransactions(account, type, begin_date, end_date);
        return({success: true, transactions: transactions});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('addTransaction', async([name,type,date,description,debit,credit,company_id,office_id]) => {
    try {
        const status = await addTransactionSync(name,type,date,description,debit,credit,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('editTransaction', async ([id,type,account,date,description,debit,credit]) => {
    try {
        const status = await editTransaction(id,type,account,date,description,debit,credit);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('addJournalTransaction', async ([account,date,reference,debit,credit,company_id,office_id]) => {
    try {
        const status = await addJournalTransaction(account,date,reference,debit,credit,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('editJournalTransaction', async ([id,account,date,description,debit,credit]) => {
    try {
        const status = await editJournalTransaction(id,account,date,description,debit,credit);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('asset', async ([account,date,description,amount]) => {
    try {
        const status = await asset(account,date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('expense', async ([account,date,description,amount]) => {
    try {
        const status = await expense(account,date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('liability', async ([account,date,description,amount]) => {
    try {
        const status = await liability(account,date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('equity', async ([account,date,description,amount]) => {
    try {
        const status = await equity(account,date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('revenue', async ([account,date,description,amount]) => {
    try {
        const status = await revenue(account,date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('isJournalInbalance',async ([]) => {
    try {
        return ({success: true, inBalance: await isJournalInbalance()});
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('investment', async ([date,description,amount,_equity]) => {
    try {
        const status = await investment(date,description,amount,_equity);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('encumber', async ([date,description,amount]) => {
    try {
        const status = await encumber(date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }            
});
rpcServer.addMethod('bankfee', async ([date,description,amount]) => {
    try {
        const status = await bankfee(date,description,amount);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }            
});
rpcServer.addMethod('loanPayment', async ([date,description,amount,interest]) => {
    try {
        const status = await loanPayment(date,description,amount,interest);
    } catch(err) {
        return({success: false, error: err.message});
    }
});
rpcServer.addMethod('payAssetsByCheck', async ([date,description,amount,account]) => {
    try {
        const status = await payAssetsByCheck(date,description,amount,account);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('payAssetsByCredit', async ([date,description,amount,account]) => {
    try {
        const status = await payAssetsByCredit(date,description,amount,account);
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('payExpenseByCheck', async ([date,description,amount,account]) => {    
    try {
        const status = await payExpenseByCheck(date,description,amount,account);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('payExpenseByCard', async ([date,description,amount,account]) => {    
    try {
        const status = await payExpenseByCard(date,description,amount,account);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('cardPayment', async ([date,description,amount]) => {    
    try {
        const status = await cardPayment(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('cashPayment', async ([date,description,amount]) => {    
    try {
        const status = await cashPayment(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('salesCash', async ([date,description,amount]) => {    
    try {
        const status = await salesCash(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('salesCard', async ([date,description,amount]) => {    
    try {
        const status = await salesCard(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('salesViaPaypal', async ([date,description,amount,fee,account]) => {    
    try {
        const status = await salesViaPaypal(date,description,amount,fee,account);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('accountsReceivablePayment', async ([date,description,amount]) => {    
    try {
        const status = await accountsReceivablePayment(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('distribution', async ([date,description,amount]) => {    
    try {
        const status = await distribution(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('cogs', async ([date,description,amount,cogs,purchase,inventory]) => {
    try {
        const status = await COGS(date,description,amount,cogs,purchase,inventory);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }                        
});
rpcServer.addMethod('unearnedRevenue', async ([date,description,amount]) => {    
    try {
        const status = await unearnedRevenue(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('badDebt', async ([date,description,amount]) => {    
    try {
        const status = await badDebt(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('accruedIncome', async ([date,description,amount]) => {    
    try {
        const status = await accruedIncome(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('accruedIncomePayment', async ([]) => {    
    try {
        const status = await accruedIncomePayment();
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('accruedExpense', async ([expenseAccount,payableAccount,date,description,amount]) => {    
    try {
        const status = await accruedExpense(expenseAccount,payableAccount,date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('dividendDeclared', async ([date,description,amount]) => {    
    try {
        const status = await dividendDeclared(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('dividendPaid', async ([date,description,amount]) => {    
    try {
        const status = await dividendPaid(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('securityDepositReceived', async ([date,description,amount]) => {    
    try {
        const status = await securityDepositReceived(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('securityDepositPaid', async ([date,description,amount]) => {    
    try {
        const status = await securityDepositPaid(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('deferredRevenue', async ([date,description,amount]) => {    
    try {
        const status = await deferredRevenue(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('recognizeDeferredRevenue', async ([date,description,amount]) => {    
    try {
        const status = await recognizeDeferredRevenue(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('deferredExpense', async ([assetAccount,date,description,amount]) => {    
    try {
        const status = await deferredExpense(assetAccount,date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('recognizeDeferredExpense', async ([assetAccount,expenseAccount,date,description,amount]) => {   
    try {
        const status = await recognizeDeferredExpense(assetAccount,expenseAccount,date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('prepaidSubscriptions', async ([date,description,amount]) => {    
    try {
        const status = await prepaidSubscriptions(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('recognizePrepaidSubscription', async ([date,description,amount]) => {    
    try {
        const status = await recognizePrepaidSubscription(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('paidInCapitalStock', async ([date,description,amount,shares,assetClass,parValue]) => {    
    try {
        const status = await paidInCapitalStock(date,description,amount,shares,assetClass,parValue);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('stockDividend', async ([date,description,amount,shares,assetClass,parValue]) => {    
    try {
        const status = await stockDividend(date,description,amount,shares,assetClass,parValue);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('cashDividendDeclared', async ([date,description,amount]) => {    
    try {
        const status = await cashDividendDeclared(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('cashDividendPayable', async ([date,description,amount]) => {    
    try {
        const status = await cashDividendPayable(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('stocksIssuedOtherThanCash', async ([date,description,amount,assetAccount,shares,assetClass,parValue]) => {    
    try {
        const status = await stocksIssuedOtherThanCash(date,description,amount,assetAccount,shares,assetClass,parValue);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('workingHours', async ([hoursPerWeek]) => {
    try {
        const status = await workingHours(hoursPerWeek);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }                    
});
rpcServer.addMethod('payrollPayable', async ([date,description,amount]) => {    
    try {
        const status = await payrollPayable(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('accruedInterest', async ([date,description,amount]) => {    
    try {
        const status = await accruedInterest(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('interestExpense', async ([date,description,amount]) => {    
    try {
        const status = await interestExpense(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('bondsIssuedWOAccruedInterest', async ([date,description,amount]) => {    
    try {
        const status = await bondsIssuedWOAccruedInterest(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('bondsIssuedWithAccruedInteres', async ([date,description,amount]) => {    
    try {
        const status = await bondsIssuedWithAccruedInteres(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('bondPremium', async ([date,description,amount,premium]) => {    
    try {
        const status = await bondPremium(date,description,amount,premium);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('bondPremiumInterestPayment', async ([date,description,amount,premium]) => {    
    try {
        const status = await bondPremiumInterestPayment(date,description,amount,premium);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('bondDiscount', async ([date,description,amount,discount]) => {    
    try {
        const status = await bondDiscount(date,description,amount,discount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryPurchase', async ([date,description,amount,inventory]) => {    
    try {
        const status = await inventoryPurchase(date,description,amount,inventory);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventorySold', async ([date,description,amount,inventory]) => {    
    try {
        const status = await inventorySold(date,description,amount,inventory);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryShrinkage', async ([date,description,amount,assetClass,contraAsset]) => {    
    try {
        const status = await inventoryShrinkage(date,description,amount,assetClass,contraAsset);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryShrinkageReserve', async ([date,description,amount,expenseAccount,contraAsset]) => {    
    try {
        const status = await inventoryShrinkageReserve(date,description,amount,expenseAccount,contraAsset);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('initializeEquity', async ([]) => {    
    try {
        const status = await initializeEquity();
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryRawMaterials', async ([date,description,amount]) => {    
    try {
        const status = await inventoryRawMaterials(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryWIP', async ([date,description,amount]) => {    
    try {
        const status = await inventoryWIP(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('inventoryFinishedGoods', async ([date,description,amount]) => {    
    try {
        const status = await inventoryFinishedGoods(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('commissionPayable', async ([date,description,amount]) => {    
    try {
        const status = await commissionPayable(date,description,amount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('commissionPaid', async ([date,description,amount,assetAccount]) => {    
    try {
        const status = await commissionPaid(date,description,amount,assetAccount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('allocateFundingAccount', async ([date,description,amount,assetAccount,equityAccount,expenseAccount]) => {    
    try {
        const status = await allocateFundingAccount(date,description,amount,assetAccount,equityAccount,expenseAccount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('spendFundingAccount', async ([date,description,amount,payableAccount,equityAccount,expenseAccount]) => {    
    try {
        const status = await spendFundingAccount(date,description,amount,payableAccount,equityAccount,expenseAccount);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('softwareLicense', async ([date,description,amount,fee,company_id,office_id]) => {
    try {
        const status = await softwareLicense(date,description,amount,fee,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }                
});
rpcServer.addMethod('exchangeCryptocurrencyToUSD', async ([date,description,amount,fee,gainLoss,account,company_id,office_id]) => {    
    try {
        const status = await exchangeCryptocurrencyToUSD(date,description,amount,fee,gainLoss,account,company_id,office_id);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('exchangeUSDToCryptocurrency', async ([date,description,amount,fee,account,company_id,office_id]) => {    
    try {
        const status = await exchangeUSDToCryptocurrency(date,description,amount,fee,account,company_id,office_id);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('googleAdsenseEarning', async ([date,description,amount,account,company_id,office_id]) => {    
    try {
        const status = await googleAdsenseEarning(date,description,amount,account,company_id,office_id);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('googleAdsensePayout', async ([date,description,amount,account,company_id,office_id]) => {    
    try {
        const status = await googleAdsensePayout(date,description,amount,account,company_id,office_id);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('googleAdsenseReceivePayout', async ([date,description,amount,account,company_id,office_id]) => {    
    try {
        const status = await googleAdsenseReceivePayout(date,description,amount,account,company_id,office_id);
    } catch(err) {
        return({success: false, error: err.message});
    }    
});
rpcServer.addMethod('addFundsToPostageDebitAccount', async ([date,description,amount,account,company_id,office_id]) => {
    try {
        const status = await addFundsToPostageDebitAccount(date,description,amount,account,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }            
});
rpcServer.addMethod('postageExpense', async ([date,description,amount,account,company_id,office_id]) => {
    try {
        const status = await postageExpense(date,description,amount,account,company_id,office_id);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});

// @pingleware/bestbooks-mailer
rpcServer.addMethod('start_smtp_server', async ([hostname,port]) => {
    try {
        const status = start_smtp_server(hostname,port);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('base64_encode', async ([contents]) => {
    try {
        const status = await base64_encode(contents);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('base64_decode', async ([contents]) => {
    try {
        const status = await base64_decode(contents);
        return({success: true, status: status});
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('SendEMail', async ([sender,recipient,subject,message,smpt_port]) => {
    try {
        SendEMail(sender,recipient,subject,message,smpt_port,async(err,status) => {
            if (err) {
                return({success: false, error: err.message});
            }
            return({success: true, status: status});
        })
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('SaveToDatabase', async ([location,from,email,date,subject,html,envelop]) => {
    try {
        SaveToDatabase(location,from,email,date,subject,html,envelop,async (err,status) => {
            if (err) {
                return({success: false, error: err.message});
            }
            return({success: true, status: status});
        })
    } catch(err) {
        return({success: false, error: err.message});
    }        
});
rpcServer.addMethod('ReadFromDatabas', async ([email]) => {
    try {
        const status = await ReadFromDatabase(email,async (err,status) => {
            if (err) {
                return({success: false, error: err.message});
            }
            return({success: true, status: status});
        })
    } catch(err) {
        return({success: false, error: err.message});
    }        
});


function start_server(host,port) {
    try {
        server = rest.listen(port, host, () => {
            console.log(host + " server running on port " + port);
        });      
    } catch(error) {
        console.error(error);
    }
}

function stop_server() {
    server.close();
}

if (argv.server) {
    start_server(argv.host,argv.port);

    // Hook into the exit event
    process.on('exit', () => {
        stop_server();
    });

    // Handle Ctrl+C (SIGINT) event
    process.on('SIGINT', () => {
        console.log('Ctrl+C pressed, exiting...');
        process.exit(0);
    });    
} else {
    module.exports = {
        start_server,
        stop_server
    }    
}


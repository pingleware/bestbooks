const assert = require('assert');
const {
    AccountTypes,
    ChartOfAccounts,
    Bitcoin
} = require('../index');

describe("Bitcoin Class", async function(){
    let bitcoin, coa;

    before(function(){
        coa = new ChartOfAccounts();
        bitcoin = new Bitcoin("1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9"); // Bitcoin Wallet Address with CashApp for the framework creator
    })

    after(async function(){
        await coa.model.insertSync(`DELETE FROM accounts;`);
        await coa.model.insertSync(`DELETE FROM ledger;`);
        await coa.model.insertSync(`DELETE FROM journal`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Bitcoin", async function(){
        assert.ok(bitcoin instanceof Bitcoin);
    })
    it("create new account for bitcoin",async function(){
        await coa.add("Bitcoin",AccountTypes.DigitalCurrency,1);
    })
    it("make a deposit to bitcoin",async function(){
        try {
            await bitcoin.addDebit("2021-10-24 18:24","CashApp Bitcoin Boost paid to 1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9",1.15,1,1);
            await bitcoin.addDebit("2021-10-26 22:46","CashApp Bitcoin Boost paid to 1FjvkiYbcFiNJdM57z7Bj8LJcKRCjUqrM9",0.53,1,1);    
        } catch(error) {
            console.error(error)
        }
    })
})

const assert = require('assert');
var ChartOfAccounts = require("../chartOfAccounts");
var AccountTypes = require("../accountTypes");

describe("DigitialCurrency Class",function(){
    let coa;

    before(function(){
        coa = new ChartOfAccounts();
    })

    after(async function(){
        coa.purgeTable();
        await coa.model.insertSync(`DELETE FROM ledger;`);
        await coa.model.insertSync(`DELETE FROM journal`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("create new account for bitcoin",async function(){
        await coa.add("Bitcoin",AccountTypes.DigitalCurrency,1);

        const accounts = await coa.getListSync();
        assert.strictEqual(accounts[0].name,'Bitcoin');
        assert.strictEqual(accounts[0].code,100);
    })
    it("create new account for ether",async function(){
        await coa.add("Ethereum",AccountTypes.DigitalCurrency,1);
        const accounts = await coa.getListSync();
        assert.strictEqual(accounts[1].name,'Ethereum');
        assert.strictEqual(accounts[1].code,101);
    })
    it("create an account for multiple ethereum wallets",async function(){
        // Add the wallet address with the currency type
        await coa.add("Ethereum 0x50542cF0903152E1761cffF01d2928C6F229D678",AccountTypes.DigitalCurrency,1);
        const accounts = await coa.getListSync();
        assert.strictEqual(accounts[2].name,'Ethereum 0x50542cF0903152E1761cffF01d2928C6F229D678');
        assert.strictEqual(accounts[2].code,102)
    })
})
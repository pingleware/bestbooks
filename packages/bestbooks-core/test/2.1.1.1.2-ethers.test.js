const assert = require('assert');
const {
    AccountTypes,
    ChartOfAccounts,
    Ether
} = require('../index');

describe("Ether Class", async function(){
    let ethers, coa;

    before(function(){
        coa = new ChartOfAccounts();
        ethers = new Ether();
    })

    after(async function(){
        await coa.model.insertSync(`DELETE FROM accounts;`);
        await coa.model.insertSync(`DELETE FROM ledger;`);
        await coa.model.insertSync(`DELETE FROM journal`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await coa.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Ether", async function(){
        assert.ok(ethers instanceof Ether);
    })
    it("create new account for ether",async function(){
        await coa.add("Ethereum",AccountTypes.DigitalCurrency,1);
    })
    it("make a deposit to ether",async function(){
        var ethereum = new Ether("0x50542cF0903152E1761cffF01d2928C6F229D678"); // Ethereum wallet for the framework creator
        await ethereum.addDebit("2022-11-06 17:04:11","Transfer from Coinbase to 0x50542cF0903152E1761cffF01d2928C6F229D678",2.40)
        // verify on etherscan.io at https://etherscan.io/address/0x50542cF0903152E1761cffF01d2928C6F229D678
    })
})

const assert = require('assert');
const {
    ContraAsset
} = require('../index');

describe("ContraAsset Class", async function(){
    let asset;

    before(function(){
        asset = new ContraAsset("Test Contra Asset");
    })

    after(async function(){
        await asset.model.insertSync(`DELETE FROM accounts;`);
        await asset.model.insertSync(`DELETE FROM ledger;`);
        await asset.model.insertSync(`DELETE FROM journal`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of ContraAsset", async function(){
        assert.ok(asset instanceof ContraAsset);
    })

    it('should create a ContraAsset instance with the correct name and type', () => {
        assert.strictEqual(asset.name, 'Test Contra Asset');
        assert.strictEqual(asset.type, "ContraAsset");
    });

    it('should set the group to 100', () => {
        assert.strictEqual(asset.getGroup(), 100);
    });

    it('should increase the account balance',async () => {
        const date = new Date();
        const desc = 'Increase Credit';
        const amount = 100;

        // Assume addCredit returns the new balance
        await asset.increase(date, desc, amount);
        const balance = await asset.getBalance();
        // You need to define how addCredit works in the Asset class
        assert.strictEqual(balance, -100);
    });

    it('should debit the account',async () => {
        const date = new Date();
        const desc = 'Debit Account';
        const amount = 50;

        await asset.addDebit(date, desc, amount);
        const balance = await asset.getBalance();
        // You need to define how decrease works in the Asset class
        assert.strictEqual(balance, -50);
    });

    it('should credit the account',async () => {
        const date = new Date();
        const desc = 'Credit Account';
        const amount = 75;

        await asset.addCredit(date, desc, amount);
        const balance = await asset.getBalance();
        // You need to define how addCredit works in the Asset class
        assert.strictEqual(balance, -125);
    });

    it('should decrease the account balance',async () => {
        const date = new Date();
        const desc = 'Decrease Debit';
        const amount = 25;

        await asset.decrease(date, desc, amount);
        const balance = await asset.getBalance();
        // You need to define how addDebit works in the Asset class
        assert.strictEqual(balance, -100);
    });

    it('should return the correct account base type',async () => {
        assert.strictEqual(await asset.getAccountBaseType(), "Asset");
    });
})

const assert = require('assert');
const Asset = require('../asset'); // Adjust the path as necessary
const Journal = require('../journal');

describe('Asset Class', function () {
    let asset, journal;

    beforeEach(async function () {
        // Create a new Asset instance before each test
        asset = new Asset('Cash');
        journal = new Journal("General");
    });
    
    after(async function(){
        await ledger.model.insertSync(`DELETE FROM accounts;`);
        await ledger.model.insertSync(`DELETE FROM ledger;`);
        await ledger.model.insertSync(`DELETE FROM journal;`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
    })
    

    it("should create an instance of Asset", async function(){
        assert.ok(asset instanceof Asset);
    })

    it('should add a debit and return the correct ledger ID', async function () {
        const [ledgerId, journalId] = await asset.addDebit('2024-01-01', 'Initial Deposit', 500);
        assert.ok(ledgerId, 'Ledger ID should be returned');
        assert.ok(journalId, 'Journal ID should be returned');
    });

    it('should add a credit and return the correct ledger ID', async function () {
        const [ledgerId, journalId] = await asset.addCredit('2024-01-02', 'Withdrawal', 200);
        assert.ok(ledgerId, 'Ledger ID should be returned');
        assert.ok(journalId, 'Journal ID should be returned');
    });

    it('should retrieve the balance', async function () {
        const balance = await asset.getBalance();
        assert.strictEqual(balance, 300, 'Balance should be 300 after debit and credit');
    });

    it('should increase balance correctly', async function () {
        await asset.increase('2024-01-01', 'Deposit Three', 500);
        assert.strictEqual(await asset.getBalance(), 800, 'Balance should be 800 after debit');
    });

    it('should decrease balance correctly', async function () {
        await asset.decrease('2024-01-02', 'Withdrawal', 200);
        assert.strictEqual(await asset.getBalance(), 600, 'Balance should be 600 after credit');
    });
});
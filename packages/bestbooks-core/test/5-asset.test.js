// asset.test.js
const assert = require('assert');
const Asset = require('../asset'); // Adjust the path as necessary
const Journal = require('../journal');
const Model = require('../model');

describe('Asset Class', function () {
    let asset;

    beforeEach(async function () {
        // Create a new Asset instance before each test
        asset = new Asset('Cash');
    });

    after(async function(){
        await asset.purgeTable();

        const journal = new Journal();
        await journal.purgeTable()

        const model = new Model();
        await model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='journal';");
        await model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';");
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

// Run tests with: mocha asset.test.js

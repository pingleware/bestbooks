"use strict";

const assert = require('assert');
const {
    Ledger,
    ChartOfAccounts
} = require('../lib/index');

describe('Ledger Class', function() {
    let ledger, coa;

    before(async function() {
        // This is run before any tests to set up the environment
        // Here you might want to clear the ledger table or initialize the database
        ledger = new Ledger('Test Account', 'Asset');
        coa = new ChartOfAccounts();
    });

    after(async function() {
        await ledger.model.insertSync(`DELETE FROM accounts;`);
        await ledger.model.insertSync(`DELETE FROM ledger;`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
    });

    it('should create an instance of Ledger', function() {
        assert.ok(ledger instanceof Ledger);
    });

    it('should identify account name as Test Account', function() {
        assert.strictEqual(ledger.getName(), 'Test Account');
    });

    it('should identify account type as an Asset', function() {
        assert.strictEqual(ledger.getType(), 'Asset');
    });

    it('should identify account type as an Asset for the Test Account',async function() {
        assert.strictEqual(await Ledger.findAccountType('Test Account'), 'Asset');
    });

    it('should create ledger table if it does not exist', async function() {
        await ledger.createTable();
        
        // You might want to check if the table was created successfully
        const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='ledger';`;
        const result = await ledger.model.querySync(sql);
        
        assert.strictEqual(result.length > 0, true);
    });

});

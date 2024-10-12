"use strict";

const assert = require('assert');
const Ledger = require('../ledger');
const Model = require('../model');

describe('Ledger Class', function() {
    let ledger;

    before(async function() {
        // This is run before any tests to set up the environment
        // Here you might want to clear the ledger table or initialize the database
        ledger = new Ledger('Test Account', 'Asset');
    });

    it('should create an instance of Ledger', function() {
        assert.ok(ledger instanceof Ledger);
        assert.strictEqual(ledger.getName(), 'Test Account');
        assert.strictEqual(ledger.getType(), 'Asset');
        assert.strictEqual(ledger.balance, 0);
    });

    it('should create ledger table if it does not exist', async function() {
        await ledger.createLedgerTable();
        
        // You might want to check if the table was created successfully
        const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='ledger';`;
        const result = await ledger.model.querySync(sql);
        
        assert.strictEqual(result.length > 0, true);
    });

    it('should be able to remove an entry', async function() {
        // You might want to add a test entry first
        const insertSql = `INSERT INTO ledger (account_name, txdate, debit, credit) VALUES ('Test Account', datetime('now'), 100, 0);`;
        await ledger.model.querySync(insertSql);

        // Check if entry is there
        let rows = await ledger.getAll();
        assert.strictEqual(rows.total, 1);

        // Now remove it
        const deleteId = 1; // Assuming the ID of the inserted entry is 1
        await ledger.remove(deleteId);

        // Check if entry is removed
        rows = await ledger.getAll();
        assert.strictEqual(rows.total, 0);
    });

    after(async function() {
        // Cleanup if necessary, like purging the ledger table
        await ledger.purgeLedgerTable();
    });
});

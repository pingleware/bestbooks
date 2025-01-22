"use strict";

const assert = require('assert');
const Ledger = require('../src/ledger');
const ChartOfAccounts = require('../src/chartOfAccounts');

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
        await ledger.model.insertSync(`DELETE FROM ledger_audit;`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await ledger.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
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

    //it('should identify account balance as zero',async function() {
    //    const balance = await ledger.getBalance();
    //    assert.strictEqual(balance, 0);
    //});

    it('should create ledger table if it does not exist', async function() {
        await ledger.createTable();
        
        // You might want to check if the table was created successfully
        const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='ledger';`;
        const result = await ledger.model.querySync(sql);
        
        assert.strictEqual(result.length > 0, true);
    });

    it("should retrieve the audit log",async() => {
        const rows = await ledger.model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
                a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
                a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
                a.change_date, a.changed_by, a.action
            FROM ledger_audit a
            JOIN ledger l ON a.ledger_id = l.id
            ORDER BY a.change_date DESC;`);
    
        const expected = [];
        assert.deepStrictEqual(rows, expected);
    });
});

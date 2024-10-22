// journal.test.js

"use strict";

const assert = require('assert');
const {Journal} = require('../index'); // Adjust the path as needed

describe('Journal Class', function () {
    let journal, id;

    before(async function () {
        journal = new Journal('General');
    });

    after(async function () {
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    });

    it('should create the journal table', async function () {
        const result = await journal.listJournals();
        assert(Array.isArray(result)); // Check that the result is an array
    });

    it('should add a journal entry', async function () {
        id = await journal.add('2024-10-12', 1, 'TestAccount', 100, 0);
        assert.strictEqual(typeof id, 'number'); // Check that an ID was returned
    });

    it('should update a journal entry', async function () {
        const updatedRows = await journal.update(id, '2024-10-12', 'TestAccount', 150, 50, 1);
        assert.strictEqual(updatedRows, 1); // Check that the number of updated rows is returned
    });

    it('should calculate the balance', async function () {
        const balance = await journal.balance();
        assert.strictEqual(typeof balance, 'number'); // Check that the balance is a number
    });

    it('should check if the journal is in balance', async function () {
        const isInBalance = await journal.inBalance();
        assert.strictEqual(isInBalance, false); 
    });

    it('should remove a journal entry', async function () {
        await journal.remove(id);
        const result = await journal.transaction();
        assert(!result.some(entry => entry.id === id)); // Check that the entry is no longer present
    });
});

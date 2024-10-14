// journal.test.js

"use strict";

const Journal = require('../journal'); // Adjust the path as needed
const Model = require('../model'); // Mock or adjust according to your needs
const assert = require('assert');

describe('Journal Class', function () {
    let journal, id;

    before(async function () {
        journal = new Journal('General');
    });

    after(async function () {
        await journal.purgeTable();
        await resetSequence();
    });

    async function resetSequence() {
        const sql = `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'journal';`;
        await journal.model.querySync(sql); // Assuming you have a querySync method to execute SQL
    }


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
        assert.strictEqual(updatedRows, 4); // Check that the number of updated rows is returned
    });

    it('should calculate the balance', async function () {
        const balance = await journal.balance();
        assert.strictEqual(typeof balance, 'number'); // Check that the balance is a number
    });

    it('should check if the journal is in balance', async function () {
        const isInBalance = await journal.inBalance();
        assert.strictEqual(isInBalance, 0); // Check if in balance (1 means true in SQLite)
    });

    it('should remove a journal entry', async function () {
        await journal.remove(id);
        const result = await journal.transaction();
        assert(!result.some(entry => entry.id === id)); // Check that the entry is no longer present
    });
});

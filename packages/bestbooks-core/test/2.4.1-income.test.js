const assert = require('assert');
const {
    Income
} = require('../index');

describe("Income Class", async function(){
    let income;

    before(function(){
        income = new Income("Sales Income");
    })

    after(async function(){
        await income.model.insertSync(`DELETE FROM accounts;`);
        await income.model.insertSync(`DELETE FROM ledger;`);
        await income.model.insertSync(`DELETE FROM journal`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Income", async function(){
        assert.ok(income instanceof Income);
    })

    it('should have initial group and balance values', async function () {
        assert.strictEqual(income.getGroup(), 500, 'Group should be initialized to 500');
        const balance = await income.getBalance();
        assert.strictEqual(balance, 0, 'Initial balance should be 0');
    });

    it('should correctly add a debit', async function () {
        const date = '2024-10-20';
        const description = 'Service Fee';
        const amount = 200;

        const result = await income.addDebit(date, description, amount);
        assert(Array.isArray(result), 'Result should be an array');
        assert.strictEqual(result.length, 2, 'Result array should have two elements');
        assert.strictEqual(await income.getDebit(), amount, 'Debit should be set to the correct amount');
    });

    it('should correctly add a credit', async function () {
        const date = '2024-10-20';
        const description = 'Sales Income';
        const amount = 500;

        const result = await income.addCredit(date, description, amount);
        assert(Array.isArray(result), 'Result should be an array');
        assert.strictEqual(result.length, 2, 'Result array should have two elements');
        assert.strictEqual(await income.getCredit(), amount, 'Credit should be set to the correct amount');
    });

    it('should calculate balance after credit and debit', async function () {
        const date = '2024-10-20';

        await income.addCredit(date, 'Sales', 500);
        await income.addDebit(date, 'Service Fee', 200);
        const balance = await income.getBalance();
        
        assert.strictEqual(balance, 600, 'Balance should be Credit - Debit = 500 - 200 = 300');
    });    
})

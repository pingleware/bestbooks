const assert = require('assert');
const {RetainedEarnings} = require('../index');

describe("RetainedEarnings Class", async function(){
    let retainedEarnings;

    before(function(){
        retainedEarnings = new RetainedEarnings();
    })

    after(async function(){
        await retainedEarnings.model.insertSync(`DELETE FROM accounts;`);
        await retainedEarnings.model.insertSync(`DELETE FROM ledger;`);
        await retainedEarnings.model.insertSync(`DELETE FROM journal`);
        await retainedEarnings.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await retainedEarnings.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await retainedEarnings.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of RetainedEarnings", async function(){
        assert.ok(retainedEarnings instanceof RetainedEarnings);
    })

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(retainedEarnings.getName(), 'RetainedEarnings');
        assert.strictEqual(retainedEarnings.getGroup(), 300);
    });

    it('should correctly distribute earnings (debit) and update balance', async function() {
        await retainedEarnings.distributeEarnings('2024-10-21', 'Dividend Distribution', 500);
        const debitAmount = await retainedEarnings.getDebit();
        const balance = await retainedEarnings.getBalance();

        assert.strictEqual(debitAmount, 500);
        assert.strictEqual(balance, -500); // Assuming initial balance is 0
    });

    it('should correctly retain earnings (credit) and update balance', async function() {
        await retainedEarnings.retainEarnings('2024-10-21', 'Profit Retained', 1000);
        const creditAmount = await retainedEarnings.getCredit();
        const balance = await retainedEarnings.getBalance();

        assert.strictEqual(creditAmount, 1000);
        assert.strictEqual(balance, 500); // Assuming initial balance is 0
    });

    it('should correctly adjust balance with both retained and distributed earnings', async function() {
        await retainedEarnings.retainEarnings('2024-10-21', 'Profit Retained', 1200);
        await retainedEarnings.distributeEarnings('2024-10-21', 'Dividend Distribution', 200);

        const balance = await retainedEarnings.getBalance();
        assert.strictEqual(balance, 1500); 
    });

    it('should return the correct base account type',async function() {
        assert.strictEqual(await retainedEarnings.getAccountBaseType(), "Equity");
    });    
})

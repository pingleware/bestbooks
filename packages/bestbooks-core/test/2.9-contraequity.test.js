const assert = require('assert');
const {ContraEquity} = require('../index');

describe("ContraEquity Class", async function(){
    let equity;

    before(function(){
        equity = new ContraEquity('Treasury Stock');
    })

    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of ContraEquity", async function(){
        assert.ok(equity instanceof ContraEquity);
    })

    it('should create an instance of ContraEquity with correct name and type', function() {
        assert.strictEqual(equity.name, 'Treasury Stock');
        assert.strictEqual(equity.type, "Equity");
    });

    it('should have the correct group (300) for equity accounts', function() {
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should add a debit entry and update balance correctly', async function() {
        const date = '2024-10-21';
        const desc = 'Repurchased shares';
        const amount = 5000;

        const [ledgerId, journalId] = await equity.addDebit(date, desc, amount);

        assert.strictEqual(await equity.getDebit(), amount);
        const balance = await equity.getBalance();
        assert.strictEqual(balance, amount); 
    });

    it('should add a credit entry and update balance correctly', async function() {
        const date = '2024-10-21';
        const desc = 'Sold treasury shares';
        const amount = 2000;

        const [ledgerId, journalId] = await equity.addCredit(date, desc, amount);

        assert.strictEqual(await equity.getCredit(), amount);
        const balance = await equity.getBalance();
        assert.strictEqual(balance, 3000); // Assuming starting balance is 0
    });

    it('should increase debit and decrease credit using the increase/decrease methods', async function() {
        const date = '2024-10-21';
        const descDebit = 'Repurchased shares';
        const descCredit = 'Sold shares';
        const debitAmount = 2000;
        const creditAmount = 1500;

        await equity.increase(date, descDebit, debitAmount);
        await equity.decrease(date, descCredit, creditAmount);

        assert.strictEqual(await equity.getDebit(), debitAmount);
        assert.strictEqual(await equity.getCredit(), creditAmount);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 3500); // Expecting 500
    });

    it('should return the correct base account type (Equity)', function() {
        assert.strictEqual(equity.getAccountBaseType(), "Equity");
    });    
})

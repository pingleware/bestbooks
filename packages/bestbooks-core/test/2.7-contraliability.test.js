const assert = require('assert');
const {ContraLiability} = require('../index');

describe("ContraLiability Class", async function(){
    let liability;

    before(function(){
        liability = new ContraLiability('Discount on Bonds Payable');
    })

    after(async function(){
        await liability.model.insertSync(`DELETE FROM accounts;`);
        await liability.model.insertSync(`DELETE FROM ledger;`);
        await liability.model.insertSync(`DELETE FROM journal`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of ContraLiability", async function(){
        assert.ok(liability instanceof ContraLiability);
    })

    it('should create an instance of ContraLiability with the correct properties', function() {
        assert.strictEqual(liability.getName(), 'Discount on Bonds Payable');
        assert.strictEqual(liability.getGroup(), 200);
        assert.strictEqual(liability.getAccountBaseType(), "Liability");
    });

    it('should correctly add a debit entry', async function() {
        const date = '2024-10-21';
        const desc = 'Amortization of bond discount';
        const amount = 500;

        const [ledger_id, journal_id] = await liability.addDebit(date, desc, amount);

        assert.ok(ledger_id > 0, 'Ledger ID should be greater than 0');
        assert.ok(journal_id > 0, 'Journal ID should be greater than 0');
        assert.strictEqual(await liability.getDebit(), amount);
    });

    it('should correctly add a credit entry', async function() {
        const date = '2024-10-22';
        const desc = 'Initial bond discount';
        const amount = 1000;

        const [ledger_id, journal_id] = await liability.addCredit(date, desc, amount);

        assert.ok(ledger_id > 0, 'Ledger ID should be greater than 0');
        assert.ok(journal_id > 0, 'Journal ID should be greater than 0');
        assert.strictEqual(await liability.getCredit(), amount);
    });

    it('should correctly calculate the balance', async function() {
        const balance = await liability.getBalance();

        // Assuming the balance is the sum of debits and credits
        // Adjust the expected balance based on your test data
        const expectedBalance = 500 - 1000;
        assert.strictEqual(balance, expectedBalance);
    });
})

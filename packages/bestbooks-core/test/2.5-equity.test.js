const assert = require('assert');
const {Equity} = require('../index');

describe("Equity Class", async function(){
    let equity;

    before(function(){
        equity = new Equity("TestEquity");
    })

    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Equity", async function(){
        assert.ok(equity instanceof Equity);
    })

    it('should initialize with correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'TestEquity');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should correctly add a debit and update debit balance', async function() {
        await equity.addDebit('2024-10-21', 'Test Debit', 500);
        const debitAmount = await equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 500);
        assert.strictEqual(balance, -500); // Assuming initial balance is 0
    });

    it('should correctly add a credit and update credit balance', async function() {
        await equity.addCredit('2024-10-21', 'Test Credit', 300);
        const creditAmount = await equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 300);
        assert.strictEqual(balance, -200); // Assuming initial balance is 0
    });

    it('should increase balance on credit and decrease on debit', async function() {
        await equity.addCredit('2024-10-21', 'Credit Transaction', 1000);
        await equity.addDebit('2024-10-21', 'Debit Transaction', 200);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 600);
    });

    it('should return the correct base account type',async function() {
        const baseType = await equity.getAccountBaseType();
        assert.strictEqual(baseType, "Equity");
    });    
})

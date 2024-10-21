const assert = require('assert');
const {OwnersEquity} = require('../index');

describe("OwnersEquity Class", async function(){
    let equity;

    before(function(){
        equity = new OwnersEquity("FounderEquity");
    })

    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of OwnersEquity", async function(){
        assert.ok(equity instanceof OwnersEquity);
    })

    // Additional test cases can be added below
    it("should have a name property set to 'FounderEquity'", function() {
        assert.strictEqual(equity.name, "FounderEquity");
    });

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'FounderEquity');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should distribute dividends (debit) and update balance', async function() {
        await equity.distributeDividends('2024-10-21', 'Dividend Distribution', 2000);
        const debitAmount = await equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 2000);
        assert.strictEqual(balance, -2000);  // Assuming initial balance is 0
    });

    it('should add investment (credit) and update balance', async function() {
        await equity.addInvestment('2024-10-21', 'Owner Investment', 5000);
        const creditAmount = await equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 5000);
        assert.strictEqual(balance, 3000);  // Assuming initial balance is 0
    });

    it('should correctly adjust balance with investment and dividend distribution', async function() {
        await equity.addInvestment('2024-10-21', 'Owner Investment', 10000);
        await equity.distributeDividends('2024-10-21', 'Dividend Distribution', 3000);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 10000);
    });

    it('should return the correct base account type', async function() {
        assert.strictEqual(await equity.getAccountBaseType(), "Equity");
    });
})

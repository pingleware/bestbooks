const assert = require('assert');
const {
    Investment,
    ShareholderEquity
} = require('../index');

describe("ShareholderEquity Class", async function(){
    let equity, investments;

    before(function(){
        equity = new ShareholderEquity();
        investments = new Investment("ShareholderEquity");
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts`);
        await equity.model.insertSync(`DELETE FROM ledger`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`DELETE FROM investment_account`);
        await equity.model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='journal';");
        await equity.model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';");
        await equity.model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='journal';");
        await equity.model.updateSync("UPDATE sqlite_sequence SET seq=0 WHERE name='investment_account';");
    })
    

    it("should create an instance of ShareholderEquity", async function(){
        assert.ok(equity instanceof ShareholderEquity);
    })

    /* TODO: FIX github workflow npm test
    it("should handle shareholder contributions correctly", async function () {
        const date = new Date().toISOString();
        const description = "Capital Contribution";
        const price = 10;
        const numberOfShares = 100;
        const user = 0;
        const parValue = 5;

        await equity.contribution(date, description, price, numberOfShares, user, parValue);

        // Check whether the cash account is debited and shareholder capital is credited correctly
        const contributions = await investments.getContributions(user);
        assert.strictEqual(contributions[0].total, 1000, "Contributions should be equal to 1000");
        // Add any assertions based on your implementation details such as cash, APIC, user, etc.
    });

    it("should handle shareholder disbursement correctly", async function () {
        const date = new Date().toISOString();
        const description = "Dividend Payment";
        const amount = 5;
        const numberOfShares = 100;
        const retainedEarnings = true;
        const user = 0;

        await equity.disbursement(date, description, amount, numberOfShares, retainedEarnings, user);
        const dividends = await investments.getDividends(user);
        assert.strictEqual(dividends[0].total, 500, "Dividends should be equal to 500");
        // Check whether retained earnings or shareholder capital is debited and 
        // cash is credited correctly
        // Add any assertions based on your implementation details such as cash, retained earnings
    });
    */
})

const assert = require('assert');
const {Investment} = require('../index');

describe("Investment Class", async function(){
    let investments;

    before(function(){
        investments = new Investment("ShareholderCapital");
    })
    
    after(async function(){
        await investments.model.insertSync(`DELETE FROM investment_account`);
        await investments.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='investment_account';`);
    })
    

    it("should create an instance of Investment", async function(){
        assert.ok(investments instanceof Investment);
    })

    it("should create the investment_account table", async function() {
        const tableCreated = await investments.createTable();
        assert.strictEqual(tableCreated, true); 
    });

    it("should handle contributions correctly", async function() {
        const user = 0;
        const amount = 1000;

        const result = await investments.contribution(user, amount);
        assert.ok(result, "Contribution should be inserted into the database");

        const contributions = await investments.getContributions(user);
        assert.strictEqual(contributions[0].total, 1000, "Contributions should be equal to 1000");
    });

    it("should handle disbursements correctly", async function() {
        const user = 0;
        const amount = 200;

        const result = await investments.disbursement(user, amount);
        assert.ok(result, "Disbursement should be inserted into the database");

        const distributions = await investments.getDistributions(user);
        assert.strictEqual(distributions[0].total, 200, "Disbursements should be equal to 200");
    });

    it("should handle dividends correctly", async function() {
        const user = 0;
        const amount = 50;

        const result = await investments.dividend(user, amount);
        assert.ok(result, "Dividend should be inserted into the database");

        const dividends = await investments.getDividends(user);
        assert.strictEqual(dividends[0].total, 50, "Dividends should be equal to 50");
    });

    it("should calculate the current value correctly", async function() {
        const user = 0;

        const currentValue = await investments.getCurrentValue(user);
        assert.strictEqual(currentValue[0].current_value, 800, "Current value should be 850 after contributions, disbursements, and dividends");
    });
})

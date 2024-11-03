const assert = require('assert');
const {
    Report,
    Asset,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Budget vs Actual View',async function(){
    let report, asset, rows;

    before(async() => {
        report = new Report();
        asset = new Asset("Account A","Asset","Asset");
    })

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Report", async function(){
        assert.ok(report instanceof Report);
    })

    it('should prepare table',async () => {
        await asset.addBalance("Account A","01",100);
        await asset.addBalance("Account A","02",150);
        await asset.addBalance("Account A","03",120);
        await asset.addBalance("Account A","04",130);
        await asset.addBalance("Account A","05",110);
        await asset.addBalance("Account A","06",140);
        await asset.addBalance("Account A","07",160);
        await asset.addBalance("Account A","08",180);
        await asset.addBalance("Account A","09",200);
        await asset.addBalance("Account A","10",170);
        await asset.addBalance("Account A","11",190);
        await asset.addBalance("Account A","12",210);
        await asset.addBalance("Account A","13",220);
        await asset.addBalance("Account A","14",230);
        await asset.addBalance("Account A","15",240);
        await asset.addBalance("Account A","16",250);
        await asset.addBalance("Account A","17",260);
        await asset.addBalance("Account A","18",270);
        await asset.addBalance("Account A","19",280);
        await asset.addBalance("Account A","20",290);
        await asset.addBalance("Account A","21",300);
        await asset.addBalance("Account A","22",310);
        await asset.addBalance("Account A","23",320);
        await asset.addBalance("Account A","24",330);
        await asset.addBudget("Account A","01",90);
        await asset.addBudget("Account A","02",140);
        await asset.addBudget("Account A","03",110);
        await asset.addBudget("Account A","04",120);
        await asset.addBudget("Account A","05",100);
        await asset.addBudget("Account A","06",130);
        await asset.addBudget("Account A","07",150);
        await asset.addBudget("Account A","08",170);
        await asset.addBudget("Account A","09",190);
        await asset.addBudget("Account A","10",160);
        await asset.addBudget("Account A","11",180);
        await asset.addBudget("Account A","12",200);
        await asset.addBudget("Account A","13",210);
        await asset.addBudget("Account A","14",220);
        await asset.addBudget("Account A","15",230);
        await asset.addBudget("Account A","16",240);
        await asset.addBudget("Account A","17",250);
        await asset.addBudget("Account A","18",260);
        await asset.addBudget("Account A","19",270);
        await asset.addBudget("Account A","20",280);
        await asset.addBudget("Account A","21",290);
        await asset.addBudget("Account A","22",300);
        await asset.addBudget("Account A","23",310);
        await asset.addBudget("Account A","24",320);
    })

    it('should calculate actual, budget, and variance for each year correctly',async () => {
        rows = await report.budgetVsActualSync();
        assert.equal(rows[0].account_name,"Account A");
    })

    it('should verufy the budget vs balance report',async() => {
        const expected = [
            {
              account_code: 100,
              account_name: 'Account A',
              account_type: 'Asset',
              actual_year_1: 1860,
              budget_year_1: 1740,
              variance_year_1: 120,
              actual_year_2: 3300,
              budget_year_2: 3180,
              variance_year_2: 120
            }
        ];
        delete(rows[0]['txdate']);
        assert.deepStrictEqual(rows,expected);
    })
});
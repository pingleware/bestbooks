const assert = require('assert');
const {
    Report,
    FixedCost,
    VariableCost,
    Revenue,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Breakeven Report View',async function(){
    let report, rent, supplies, sales, rows;

    before(async() => {
        report = new Report();
        rent = new FixedCost("Rent");
        supplies = new VariableCost("Supplies");
        sales = new Revenue("Sales");
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

    it('should add a rent entry',async() => {
        const [ledger_id,journal_id] = await rent.addDebit(new Date().toISOString().split("T")[0],"Rent",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add a supplies entry',async() => {
        const [ledger_id,journal_id] = await supplies.addDebit(new Date().toISOString().split("T")[0],"Supplies",500);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add a sales entry',async() => {
        const [ledger_id,journal_id] = await sales.addCredit(new Date().toISOString().split("T")[0],"Sales",2000);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should return correct break-even analysis report',async function() {
        rows = await report.breakevenAnalysisReportSync();
        assert.equal(rows.length,1);
    });

    it('should verify the breakeven report',async() => {
        const expected = [
            {
                total_fixed_costs: 1000,
                total_variable_costs: 500,
                total_revenue: 2000,
                net_profit_loss: 500,
                txdate: new Date().toISOString().split("T")[0]
            }
        ];
        assert.deepStrictEqual(rows, expected);
    })
});
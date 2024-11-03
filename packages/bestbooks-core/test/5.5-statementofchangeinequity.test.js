const assert = require('assert');
const {
    Report,
    Equity,
    Expense,
    Revenue,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Statement of Change in Equity View',async function(){
    let report, expense, equity, revenue, rows;

    before(async() => {
        report = new Report();
        equity = new Equity("Equity");
        expense = new Expense("Expense");
        revenue = new Revenue("Revenue");
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

    it('should add opening balance to equity',async () => {
        equity.addCredit('2023-01-01','Opening Balance',1000.0);
    })

    it('should add owner contribution to equity',async () => {
        equity.addCredit('2023-02-01','Owner Contribution',500.0);
    })

    it('should add dividends to equity',async () => {
        equity.addDebit('2023-03-01','Dividends',200.0);
    })

    it('should add other adjustments to equity',async () => {
        equity.addCredit('2023-04-01','Other Adjustment',300.0)
    })

    it('should add credit entry to revenue',async () => {
        revenue.addCredit('2023-05-01','Revenue Account',2000.0);
    })

    it('should add debit entry to expense',async () => {
        expense.addDebit('2023-06-01','Expense Account',1500.0);
    })

    it('should return the statement of changes in equity',async function(){
        rows = await report.statementOfChangesInEquitySync();
        assert.equal(rows.length,1);
    })

    it('should verify the statement of changes in equity',async () => {
        const expected = [
            {
              equity_component: 'Equity',
              type: 'Equity',
              beginning_balance: 0,
              net_income: null,
              owner_contributions: 0,
              dividends: 0,
              other_adjustments: 0,
              ending_balance: null,
              txdate: '2023-01-01'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    })

});
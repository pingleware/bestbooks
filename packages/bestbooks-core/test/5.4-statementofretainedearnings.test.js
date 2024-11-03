const assert = require('assert');
const {
    Report,
    RetainedEarnings,
    Equity,
    Revenue,
    Expense,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Statement of Retained Earnings View',async function(){
    let report, retainedEarnings, commonStock, revenue, expense, rows;

    before(async() => {
        report = new Report();
        retainedEarnings = new RetainedEarnings("Retained Earnings");
        commonStock = new Equity("Common Stock");
        revenue = new Revenue("Revenue");
        expense = new Expense("Expense");
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

    it('should add opening balance entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-01","Opening Balance",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add owner contributions entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-02","Owner Contribution",200);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add dividends entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addDebit("2024-10-03","Dividends",300);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add other adjustment entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-04","Other Adjustment",100);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should add revenue credit entry',async() => {
        const [ledger_id,journal_id] = await revenue.addCredit("2024-10-05","Revenue",500);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    })

    it('should add expense debit entry',async() => {
        const [ledger_id,journal_id] = await expense.addDebit("2024-10-05","Expense",100);
        assert.equal(ledger_id,6);
        assert.equal(journal_id,6);
    })

    it('should add common stock entry for owner contributions',async() => {
        const [ledger_id,journal_id] = await commonStock.addDebit("2024-10-02","Owner Contribution",200);
        assert.equal(ledger_id,7);
        assert.equal(journal_id,7);
    })

    it('should return the statement of changes in equity',async function(){
        rows = await report.statementOfChangesInEquitySync();
        assert.equal(rows.length,2);
    })

    it('should verify the statement of changes in equity',async () => {
        const expected = [
            {
              equity_component: 'Common Stock',
              type: 'Equity',
              beginning_balance: 0,
              net_income: null,
              owner_contributions: 0,
              dividends: 0,
              other_adjustments: 0,
              ending_balance: null,
              txdate: '2024-10-02'
            },
            {
              equity_component: 'RetainedEarnings',
              type: 'Equity',
              beginning_balance: 0,
              net_income: null,
              owner_contributions: 0,
              dividends: 0,
              other_adjustments: 0,
              ending_balance: null,
              txdate: '2024-10-01'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    })

});
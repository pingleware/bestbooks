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
    let report, retainedEarnings, dividends, revenue, expense, rows, total_revenue, total_expense;

    before(async() => {
        report = new Report();
        retainedEarnings = new RetainedEarnings();
        dividends = new Equity("Dividends");
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
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-01","Retained Earnings",50000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add dividends entry',async() => {
        const [ledger_id,journal_id] = await dividends.addDebit("2024-10-03","Dividends",5000);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add revenue credit entry',async() => {
        const [ledger_id,journal_id] = await revenue.addCredit("2024-10-05","Revenue Account",30000);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add expense debit entry',async() => {
        const [ledger_id,journal_id] = await expense.addDebit("2024-10-05","Expense Account",10000);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should get beginning_retained_earnings',async function(){
        const expected = [ { beginning_retained_earnings: 50000 } ];
        var sql = `SELECT COALESCE((SELECT SUM(credit - debit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.name = 'RetainedEarnings'
                ), 0) AS beginning_retained_earnings`;
        const results = await report.model.querySync(sql);
        assert.deepStrictEqual(results,expected);
    })

    it('should get total revenue',async function(){
        var sql = `SELECT SUM(credit - debit) AS total_revenue
                        FROM ledger 
                        JOIN accounts ON accounts.name = ledger.account_name
                        WHERE accounts.base_type = 'Revenue'`;
        const results = await report.model.querySync(sql);
        total_revenue = results[0].total_revenue;
        assert.strictEqual(total_revenue,30000);
    })

    it('should get total expense',async function(){
        var sql = `SELECT SUM(debit - credit) AS total_expense
                        FROM ledger 
                        JOIN accounts ON accounts.name = ledger.account_name
                        WHERE accounts.base_type = 'Expense'`;
        const results = await report.model.querySync(sql);
        total_expense = results[0].total_expense;
        assert.strictEqual(total_expense,10000);
    })

    it('should get net_income',async function(){
        const expected = [ { net_income: 20000 } ];
        var sql = `SELECT 
            (COALESCE((SELECT SUM(credit - debit) 
                        FROM ledger 
                        JOIN accounts ON accounts.name = ledger.account_name
                        WHERE accounts.base_type = 'Revenue'), 0) 
            - 
            COALESCE((SELECT SUM(debit - credit) 
                        FROM ledger 
                        JOIN accounts ON accounts.name = ledger.account_name
                        WHERE accounts.base_type = 'Expense'), 0)) AS net_income
        `;
        const results = await report.model.querySync(sql);
        const net_income = results[0].net_income;
        assert.deepStrictEqual(results,expected);
        assert.strictEqual(net_income,total_revenue - total_expense);
    })

    it('should return the statement of retained earnings',async function(){
        rows = await report.statementOfRetainedEarningsSync();
    })

    it('should verify the statement of retained earnings',async () => {
        const expected = [
            {
              beginning_retained_earnings: 50000,
              net_income: 20000,        // Revenue (30000) - Expense (10000)
              dividends_paid: 5000,
              ending_retained_earnings: 65000   // Beginning + Net Income - Dividends Paid
            }
        ];
        assert.deepStrictEqual(rows,expected);
    })

});
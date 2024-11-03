const assert = require('assert');
const {
    Report,
    Revenue,
    Expense,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Income Statement View',async function(){
    let report, sales, expense, rows;

    async function createSales() {
        sales = new Revenue("Sales");
    }

    async function createExpense() {
        expense = new Expense("Expense");
    }

    before(async() => {
        report = new Report();
        await createSales();
        await createExpense();
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

    it("should add first debit sales entry",async function(){
        const [ledger_id,journal_id] = await sales.addDebit("2024-01-01","Sales",500,0,0,3);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    });

    it("should add second debit sales entry",async function(){
        const [ledger_id,journal_id] = await sales.addDebit("2024-02-01","Sales",300,0,0,3);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    });

    it("should add first credit expense entry",async function(){
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-15","Expenses",200,0,0,3);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    });

    it("should add second credit expense entry",async function(){
        const [ledger_id,journal_id] = await expense.addCredit("2024-02-10","Expenses",150,0,0,3);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it('should return the income statement',async function(){
        rows = await report.incomeStatementSync();
        assert.equal(rows.length,2);
    })
    it("should verify income statement",async() => {
        const expected = [
            {
                account_code: 500,
                account_name: 'Sales',
                type: 'Revenue',
                total_revenue: 500,
                total_expense: 0,
                txdate: '2024-01-01'
              },
              {
                account_code: 500,
                account_name: 'Sales',
                type: 'Revenue',
                total_revenue: 300,
                total_expense: 0,
                txdate: '2024-02-01'
              }
        ];
        assert.deepStrictEqual(rows,expected);
    })
});
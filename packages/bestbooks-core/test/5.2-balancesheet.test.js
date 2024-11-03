const assert = require('assert');
const {
    Report,
    Cash,
    Revenue,
    Expense,
    User,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Balance Sheet View',async function(){
    let report, sales, expense, cash, rows;

    async function createSales() {
        sales = new Revenue("Sales","Income","Asset");
    }

    async function createExpense() {
        expense = new Expense("Expense","Expense","Liability");
    }

    async function createCash() {
        cash = new Cash("Cash","Asset","Asset");
    }

    before(async() => {
        report = new Report();
        await createCash();
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

    it("should add debit cash entry",async function(){
        const [ledger_id,journal_id] = await cash.addDebit("2024-01-01","Deposit",1000,0,0,3);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it("should add first debit sales entry",async() => {
        const [ledger_id,journal_id] = await sales.addDebit("2024-01-01","Sales",500,0,0,3);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it("should add second debit sales entry",async() => {
        const [ledger_id,journal_id] = await sales.addDebit("2024-02-01","Sales",300,0,0,3);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it("should add first credit expense entry",async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-15","Expenses",200,0,0,3);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it("should add second credit expense entry",async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-02-10","Expenses",150,0,0,3);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    });

    it("should verify the balance sheet was created",async() => {
        const rows = await report.balanceSheetSync();
        assert.equal(rows.length,3);
    })

    it("should validate cash entry",async function(){
        assert.equal(cash.name,"Cash","account name should be Cash");
        assert.equal(cash.baseType,"Asset","base type should be Asset");
        const balance = await cash.getBalance();
        assert.equal(balance,1000,"balance should be $1000");
    })

    it("should create a balance sheet report", async function(){
        rows = await report.balanceSheetSync();
        assert.equal(rows.length,3);
    })

    it('should verify the balance sheet contents', async() => {
        const expected = [
            {
              code: '100',
              name: 'Cash',
              type: 'Asset',
              debit: 1000,
              credit: 0,
              balance: 1000,
              txdate: '2024-01-01'
            },
            {
              code: '101',
              name: 'Sales',
              type: 'Asset',
              debit: 800,
              credit: 0,
              balance: 800,
              txdate: '2024-01-01'
            },
            {
              code: '200',
              name: 'Expense',
              type: 'Liability',
              debit: 0,
              credit: 350,
              balance: 350,
              txdate: '2024-01-15'
            }
        ];

        assert.deepStrictEqual(rows,expected);
    })
});
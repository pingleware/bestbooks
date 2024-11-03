const assert = require('assert');
const {
    Report,
    Cash,
    Revenue,
    Expense,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Trial Balance View',async function(){
    let report, cash, expense, revenue, rows;

    before(async() => {
        report = new Report();
        cash = new Cash('Cash');
        revenue = new Revenue('Sales');
        expense = new Expense('COGS');
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

    it('should add a cash opening deposit entry',async () => {
        const [ledger_id,journal_id] = await cash.increase("2024-01-01", "Opening Deposit", 1000.0);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add a revenue credit entry',async () => {
        const [ledger_id,journal_id] = await revenue.addCredit("2024-01-01", "Sales", 500.0);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add an expense credit entry', async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-01", "COGS", 500.0);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should return correct debit and credit totals for each account', async function() {    
        rows = await report.trialBalanceSync();
        assert.strictEqual(rows.length, 3);    
    });  
    
    it('should verify the trial balance',async() => {
        // Check the first row (Cash - Asset)
        assert.strictEqual(Number(rows[0].code), 100);
        assert.strictEqual(rows[0].name, 'Cash');
        assert.strictEqual(rows[0].type, 'Asset');
        assert.strictEqual(rows[0].total_debit, 1000);
        assert.strictEqual(rows[0].total_credit, 0);
    
        // Check the third row (Expense - Expense)
        assert.strictEqual(Number(rows[1].code), 200);
        assert.strictEqual(rows[1].name, 'COGS'); // Fix: name should be 'Expense'
        assert.strictEqual(rows[1].type, 'Expense'); // Fix: type should be 'Expense'
        assert.strictEqual(rows[1].total_debit, 0);
        assert.strictEqual(rows[1].total_credit, 500);
    })
});
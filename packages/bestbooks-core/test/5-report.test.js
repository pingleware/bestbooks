const assert = require('assert');
const {
    Cash,
    Expense,
    Revenue,
    Report,
    User
} = require('../index');

describe("Report Class", async function(){
    let report, user, cash, revenue, expense;

    before(async function(){
        report = new Report();
        user = new User();
        // IMPORTANT! (DO NOT REMOVE) comment
        // move this statement here, corrected the account_code being udnefined in the cash.increase function
        cash = new Cash("Cash"); 
        revenue = new Revenue("Revenue");
        expense = new Expense("Expense");
    })
    
    after(async function(){
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
    /* TODO: FIX github workflow
    it('should return correct debit and credit totals for each account',async function() {
        // IMPORTANT! (DO NOT REMOVE)
        // when creating instance, the account_code was undefined in the cash.increase function
        // const cash = new Cash('Cash');

        await cash.increase("2024-01-01","Opening Deposit",1000.0);
        await revenue.addCredit("2024-01-01","Sales",500.0);
        await expense.addCredit("2024-01-01","COGS",500.0);

        const rows = await report.trialBalanceSync();

        // We expect 3 rows in the trial_balance for Cash, Revenue, and Expense
        assert.strictEqual(rows.length, 3);

        // Check the first row (Cash - Asset)
        assert.strictEqual(Number(rows[0].code), 100);
        assert.strictEqual(rows[0].name, 'Cash');
        assert.strictEqual(rows[0].type, 'Asset');
        assert.strictEqual(rows[0].debit, 1000);
        assert.strictEqual(rows[0].credit, 0);

        // Check the second row (Revenue - Revenue)
        assert.strictEqual(Number(rows[1].code), 400);
        assert.strictEqual(rows[1].name, 'Expense');
        assert.strictEqual(rows[1].type, 'Expense');
        assert.strictEqual(rows[1].debit, 0);
        assert.strictEqual(rows[1].credit, 500);

        // Check the third row (Expense - Expense)
        assert.strictEqual(Number(rows[2].code), 500);
        assert.strictEqual(rows[2].name, 'Revenue');
        assert.strictEqual(rows[2].type, 'Revenue');
        assert.strictEqual(rows[2].debit, 0);
        assert.strictEqual(rows[2].credit, 500);
    });   
    */ 
})

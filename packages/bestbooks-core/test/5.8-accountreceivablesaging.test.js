const assert = require('assert');
const {
    Report,
    AccountsReceivable,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Account Receivables Aging View',async function(){
    let report, customerOne, customerTwo, rows;
    let due15DaysAgo, due20DaysAgo, due45DaysAgo, due50DaysAgo, due75DaysAgo, due80DaysAgo, due95DaysAgo, due135DaysAgo; 

    before(async() => {
        report = new Report();
        // Calculate dates for aging
        due15DaysAgo = new Date();
        due20DaysAgo = new Date();
        due45DaysAgo = new Date();
        due50DaysAgo = new Date();
        due75DaysAgo = new Date();
        due80DaysAgo = new Date();
        due95DaysAgo = new Date();
        due135DaysAgo = new Date();

        due15DaysAgo.setDate(due15DaysAgo.getDate() - 15);
        due20DaysAgo.setDate(due20DaysAgo.getDate() - 20);
        due45DaysAgo.setDate(due45DaysAgo.getDate() - 45);
        due50DaysAgo.setDate(due50DaysAgo.getDate() - 50);
        due75DaysAgo.setDate(due75DaysAgo.getDate() - 75);
        due80DaysAgo.setDate(due80DaysAgo.getDate() - 80);
        due95DaysAgo.setDate(due95DaysAgo.getDate() - 95);
        due135DaysAgo.setDate(due135DaysAgo.getDate() - 135);
        
        customerOne = new AccountsReceivable("Customer One");
        customerTwo = new AccountsReceivable("Customer Two");
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

    it('add an aged debit 500 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(new Date().toISOString().split("T")[0], "", 500, due15DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('add an aged debit 200 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(new Date().toISOString().split("T")[0], "", 200, due45DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    });

    it('add an aged debit 100 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(new Date().toISOString().split("T")[0], "", 100, due75DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    });

    it('add an aged debit 50 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(new Date().toISOString().split("T")[0], "", 50, due95DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it('add an aged debit 25 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(new Date().toISOString().split("T")[0], "", 25, due135DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    });

    it('add an aged debit 1000 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(new Date().toISOString().split("T")[0], "", 1000, due20DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,6);
        assert.equal(journal_id,6);
    });

    it('add an aged debit 300 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(new Date().toISOString().split("T")[0], "", 300, due50DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,7);
        assert.equal(journal_id,7);
    });

    it('add an aged debit 150 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(new Date().toISOString().split("T")[0], "", 150, due80DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,8);
        assert.equal(journal_id,8);
    });

    it('should return the account receivables aging report', async function() {
        rows = await report.accountReceivablesAgingReportSync();
        assert.equal(rows.length,2);
    });

    it('should verify the account receivables aging report',async() => {
        const expected = [
            {
                account_code: 100,
                account_name: 'Customer One',
                current: 500,
                past_due_1_30: 200,
                past_due_31_60: 100,
                past_due_61_90: 50,
                past_due_over_90: 25,
                total_outstanding: 875,
                txdate: new Date().toISOString().split("T")[0]
            },
            {
                account_code: 101,
                account_name: 'Customer Two',
                current: 1000,
                past_due_1_30: 300,
                past_due_31_60: 150,
                past_due_61_90: 0,
                past_due_over_90: 0,
                total_outstanding: 1450,
                txdate: new Date().toISOString().split("T")[0]
            }
        ];
        assert.deepStrictEqual(rows, expected);
    })
});
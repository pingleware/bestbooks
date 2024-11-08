const assert = require('assert');
const {
    Report,
    AccountsPayable,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Account Payables Aging View',async function(){
    let report, vendorOne, vendorTwo, rows;
    let due15DaysAgo, due45DaysAgo, due75DaysAgo, due95DaysAgo, due135DaysAgo;

    before(async() => {
        report = new Report();
        vendorOne = new AccountsPayable("Vendor 1");
        vendorTwo = new AccountsPayable("Vendor 2");

        due15DaysAgo = new Date();
        due45DaysAgo = new Date();
        due75DaysAgo = new Date();
        due95DaysAgo = new Date();
        due135DaysAgo = new Date();

        due15DaysAgo.setDate(due15DaysAgo.getDate() - 15);
        due45DaysAgo.setDate(due15DaysAgo.getDate() - 45);
        due75DaysAgo.setDate(due15DaysAgo.getDate() - 75);
        due95DaysAgo.setDate(due15DaysAgo.getDate() - 95);
        due135DaysAgo.setDate(due135DaysAgo.getDate() - 135);
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

    it('should add an aged debit 100 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",100,due15DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add an aged debit 50 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",50,due45DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    });

    it('should add an aged debit 200 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",200,due75DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    });

    it('should add an aged debit 300 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",300,due95DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it('should add an aged debit 150 days ago for vendor two',async() => {
        const [ledger_id,journal_id] = await vendorTwo.addDebit(new Date().toISOString().split("T")[0],"",150,due135DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    });

    it('should return the account payables aging report',async function(){
        rows = await report.accountsPayableAgingReportSync();
        assert.equal(rows.length,2);
    })

    it('should verify the account payables aging report',async() => {
        assert.strictEqual(rows[0].current,-150);
        assert.strictEqual(rows[0].past_due_1_30, -200);
        assert.strictEqual(rows[0].past_due_31_60, -300);
        assert.strictEqual(rows[0].past_due_61_90, 0);
        assert.strictEqual(rows[0].past_due_over_90, 0);
        assert.strictEqual(rows[0].total_outstanding, -650);

        assert.strictEqual(rows[1].current, 0);
        assert.strictEqual(rows[1].past_due_1_30, 0);
        assert.strictEqual(rows[1].past_due_31_60, 0);
        assert.strictEqual(rows[1].past_due_61_90, 0);
        assert.strictEqual(rows[1].past_due_over_90, -150);
        assert.strictEqual(rows[1].total_outstanding, -150);

    })
});
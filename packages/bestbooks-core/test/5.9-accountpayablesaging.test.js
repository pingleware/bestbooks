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
        await report.model.insertSync(`DELETE FROM ledger_audit;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
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
        assert.strictEqual(rows[0].current,-100);
        assert.strictEqual(rows[0].past_due_1_30, -50);
        assert.strictEqual(rows[0].past_due_31_60, -200);
        assert.strictEqual(rows[0].past_due_61_90, -300);
        assert.strictEqual(rows[0].past_due_over_90, 0);
        assert.strictEqual(rows[0].total_outstanding, -650);

        assert.strictEqual(rows[1].current, 0);
        assert.strictEqual(rows[1].past_due_1_30, 0);
        assert.strictEqual(rows[1].past_due_31_60, 0);
        assert.strictEqual(rows[1].past_due_61_90, 0);
        assert.strictEqual(rows[1].past_due_over_90, -150);
        assert.strictEqual(rows[1].total_outstanding, -150);

    })

    it("should retrieve the audit log",async() => {
        const rows = await report.model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
                a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
                a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
                a.change_date, a.changed_by, a.action
            FROM ledger_audit a
            JOIN ledger l ON a.ledger_id = l.id
            ORDER BY a.change_date DESC;`);
        const expected = [
            {
                txdate: '2025-01-22',
                account_code: '201',
                account_name: 'Vendor 2',
                debit: 150,
                credit: 0,
                balance: 150,
                old_account_code: '201',
                old_debit: 150,
                old_credit: 0,
                old_balance: 150,
                new_account_code: '201',
                new_debit: 150,
                new_credit: 0,
                new_balance: 150,
                change_date: rows[0].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '200',
                account_name: 'Vendor 1',
                debit: 300,
                credit: 0,
                balance: -650,
                old_account_code: '200',
                old_debit: 300,
                old_credit: 0,
                old_balance: -650,
                new_account_code: '200',
                new_debit: 300,
                new_credit: 0,
                new_balance: -650,
                change_date: rows[1].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '200',
                account_name: 'Vendor 1',
                debit: 200,
                credit: 0,
                balance: -350,
                old_account_code: '200',
                old_debit: 200,
                old_credit: 0,
                old_balance: -350,
                new_account_code: '200',
                new_debit: 200,
                new_credit: 0,
                new_balance: -350,
                change_date: rows[2].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '200',
                account_name: 'Vendor 1',
                debit: 50,
                credit: 0,
                balance: -150,
                old_account_code: '200',
                old_debit: 50,
                old_credit: 0,
                old_balance: -150,
                new_account_code: '200',
                new_debit: 50,
                new_credit: 0,
                new_balance: -150,
                change_date: rows[3].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '200',
                account_name: 'Vendor 1',
                debit: 100,
                credit: 0,
                balance: 100,
                old_account_code: '200',
                old_debit: 100,
                old_credit: 0,
                old_balance: 100,
                new_account_code: '200',
                new_debit: 100,
                new_credit: 0,
                new_balance: 100,
                change_date: rows[4].change_date,
                changed_by: 0,
                action: 'Update'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    });
});
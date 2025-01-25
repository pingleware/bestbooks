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
        await report.model.insertSync(`DELETE FROM ledger_audit;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
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
        assert.strictEqual(rows[0].current,500);
        assert.strictEqual(rows[0].past_due_1_30, 200);
        assert.strictEqual(rows[0].past_due_31_60, 100);
        assert.strictEqual(rows[0].past_due_61_90, 50);
        assert.strictEqual(rows[0].past_due_over_90, 25);
        assert.strictEqual(rows[0].total_outstanding, 875);

        assert.strictEqual(rows[1].current,1000);
        assert.strictEqual(rows[1].past_due_1_30, 300);
        assert.strictEqual(rows[1].past_due_31_60, 150);
        assert.strictEqual(rows[1].past_due_61_90, 0);
        assert.strictEqual(rows[1].past_due_over_90, 0);
        assert.strictEqual(rows[1].total_outstanding, 1450);
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
                account_code: '101',
                account_name: 'Customer Two',
                debit: 150,
                credit: 0,
                balance: 1450,
                old_account_code: '101',
                old_debit: 150,
                old_credit: 0,
                old_balance: 1450,
                new_account_code: '101',
                new_debit: 150,
                new_credit: 0,
                new_balance: 1450,
                change_date: rows[0].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '101',
                account_name: 'Customer Two',
                debit: 300,
                credit: 0,
                balance: 1300,
                old_account_code: '101',
                old_debit: 300,
                old_credit: 0,
                old_balance: 1300,
                new_account_code: '101',
                new_debit: 300,
                new_credit: 0,
                new_balance: 1300,
                change_date: rows[1].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '101',
                account_name: 'Customer Two',
                debit: 1000,
                credit: 0,
                balance: 1000,
                old_account_code: '101',
                old_debit: 1000,
                old_credit: 0,
                old_balance: 1000,
                new_account_code: '101',
                new_debit: 1000,
                new_credit: 0,
                new_balance: 1000,
                change_date: rows[2].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '100',
                account_name: 'Customer One',
                debit: 25,
                credit: 0,
                balance: 875,
                old_account_code: '100',
                old_debit: 25,
                old_credit: 0,
                old_balance: 875,
                new_account_code: '100',
                new_debit: 25,
                new_credit: 0,
                new_balance: 875,
                change_date: rows[3].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '100',
                account_name: 'Customer One',
                debit: 50,
                credit: 0,
                balance: 850,
                old_account_code: '100',
                old_debit: 50,
                old_credit: 0,
                old_balance: 850,
                new_account_code: '100',
                new_debit: 50,
                new_credit: 0,
                new_balance: 850,
                change_date: rows[4].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '100',
                account_name: 'Customer One',
                debit: 100,
                credit: 0,
                balance: 800,
                old_account_code: '100',
                old_debit: 100,
                old_credit: 0,
                old_balance: 800,
                new_account_code: '100',
                new_debit: 100,
                new_credit: 0,
                new_balance: 800,
                change_date: rows[5].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '100',
                account_name: 'Customer One',
                debit: 200,
                credit: 0,
                balance: 700,
                old_account_code: '100',
                old_debit: 200,
                old_credit: 0,
                old_balance: 700,
                new_account_code: '100',
                new_debit: 200,
                new_credit: 0,
                new_balance: 700,
                change_date: rows[6].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '100',
                account_name: 'Customer One',
                debit: 500,
                credit: 0,
                balance: 500,
                old_account_code: '100',
                old_debit: 500,
                old_credit: 0,
                old_balance: 500,
                new_account_code: '100',
                new_debit: 500,
                new_credit: 0,
                new_balance: 500,
                change_date: rows[7].change_date,
                changed_by: 0,
                action: 'Update'
            }
        ];
        //assert.deepStrictEqual(rows,expected);
        assert.equal(rows.length,expected.length);
    });    
});
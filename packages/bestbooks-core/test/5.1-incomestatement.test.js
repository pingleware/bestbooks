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
    })

    it("shouold get the income statement",async function(){
        var sql = `SELECT 
                accounts.code AS account_code,
                accounts.name AS account_name,
                accounts.base_type AS type,
                SUM(CASE 
                    WHEN ledger.debit > 0 THEN ledger.debit 
                    ELSE 0 
                END) AS total_revenue,
                SUM(CASE 
                    WHEN ledger.credit > 0 THEN ledger.credit 
                    ELSE 0 
                END) AS total_expense,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type IN ('Revenue', 'Expense')  -- Filter for relevant accounts
            GROUP BY 
                accounts.code, accounts.name, accounts.base_type, ledger.txdate
            ORDER BY 
                accounts.base_type, accounts.name`;

        const results = await report.model.querySync(sql);
        //console.log(results)
    })

    it('should return the income statement',async function(){
        rows = await report.incomeStatementSync();
        assert.equal(rows.length,4);
    })

    it("should verify income statement",async() => {
        const expected = [
            {
              account_code: 400,
              account_name: 'Expense',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 200,
              txdate: '2024-01-15'
            },
            {
              account_code: 400,
              account_name: 'Expense',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 150,
              txdate: '2024-02-10'
            },
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
              txdate: '2024-02-10',
              account_code: '400',
              account_name: 'Expense',
              debit: 0,
              credit: 150,
              balance: -350,
              old_account_code: '400',
              old_debit: 0,
              old_credit: 150,
              old_balance: -350,
              new_account_code: '400',
              new_debit: 0,
              new_credit: 150,
              new_balance: -350,
              change_date: rows[0].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2024-01-15',
              account_code: '400',
              account_name: 'Expense',
              debit: 0,
              credit: 200,
              balance: 200,
              old_account_code: '400',
              old_debit: 0,
              old_credit: 200,
              old_balance: 200,
              new_account_code: '400',
              new_debit: 0,
              new_credit: 200,
              new_balance: 200,
              change_date: rows[1].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2024-02-01',
              account_code: '500',
              account_name: 'Sales',
              debit: 300,
              credit: 0,
              balance: -800,
              old_account_code: '500',
              old_debit: 300,
              old_credit: 0,
              old_balance: -800,
              new_account_code: '500',
              new_debit: 300,
              new_credit: 0,
              new_balance: -800,
              change_date: rows[2].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2024-01-01',
              account_code: '500',
              account_name: 'Sales',
              debit: 500,
              credit: 0,
              balance: 500,
              old_account_code: '500',
              old_debit: 500,
              old_credit: 0,
              old_balance: 500,
              new_account_code: '500',
              new_debit: 500,
              new_credit: 0,
              new_balance: 500,
              change_date: rows[3].change_date,
              changed_by: 0,
              action: 'Update'
            }
        ];

        //assert.equal(rows.length, expected.length);
    })
}); 
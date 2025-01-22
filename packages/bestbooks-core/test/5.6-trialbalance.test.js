const assert = require('assert');
const {
    Report,
    Cash,
    Revenue,
    Expense,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Trial Balance View',async function(){
    let report, cash, expense, revenue, rows, trialBalance;

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

    it('should get trial balance directly via query',async function(){
        const expected = [
            {
              code: 100,
              name: 'Cash',
              type: 'Asset',
              base_type: 'Asset',
              total_debit: 1000,
              total_credit: 0,
              txdate: '2024-01-01'
            },
            {
              code: 400,
              name: 'COGS',
              type: 'Expense',
              base_type: 'Expense',
              total_debit: 0,
              total_credit: 500,
              txdate: '2024-01-01'
            },
            {
              code: 500,
              name: 'Sales',
              type: 'Revenue',
              base_type: 'Revenue',
              total_debit: 0,
              total_credit: 500,
              txdate: '2024-01-01'
            }
        ];
        var sql = `SELECT 
                code, 
                name,
                type,
                base_type,
                SUM(debit) AS total_debit,
                SUM(credit) AS total_credit,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            GROUP BY 
                accounts.code, accounts.name, accounts.base_type
            ORDER BY 
                accounts.base_type, accounts.name;`;

        trialBalance = await report.model.querySync(sql);
        assert.deepStrictEqual(trialBalance,expected);
    })

    it('should return correct debit and credit totals for each account', async function() {    
        rows = await report.trialBalanceSync();
        assert.deepStrictEqual(rows,trialBalance);    
    });  
    
    it('should verify the trial balance',async() => {
        // Check the first row (Cash - Asset)
        assert.strictEqual(Number(rows[0].code), 100);
        assert.strictEqual(rows[0].name, 'Cash');
        assert.strictEqual(rows[0].type, 'Asset');
        assert.strictEqual(rows[0].total_debit, 1000);
        assert.strictEqual(rows[0].total_credit, 0);
    
        // Check the third row (Expense - Expense)
        assert.strictEqual(Number(rows[1].code), 400);
        assert.strictEqual(rows[1].name, 'COGS'); // Fix: name should be 'Expense'
        assert.strictEqual(rows[1].type, 'Expense'); // Fix: type should be 'Expense'
        assert.strictEqual(rows[1].total_debit, 0);
        assert.strictEqual(rows[1].total_credit, 500);
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
              txdate: '2024-01-01',
              account_code: '400',
              account_name: 'COGS',
              debit: 0,
              credit: 500,
              balance: 500,
              old_account_code: '400',
              old_debit: 0,
              old_credit: 500,
              old_balance: 500,
              new_account_code: '400',
              new_debit: 0,
              new_credit: 500,
              new_balance: 500,
              change_date: rows[0].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2024-01-01',
              account_code: '500',
              account_name: 'Sales',
              debit: 0,
              credit: 500,
              balance: 500,
              old_account_code: '500',
              old_debit: 0,
              old_credit: 500,
              old_balance: 500,
              new_account_code: '500',
              new_debit: 0,
              new_credit: 500,
              new_balance: 500,
              change_date: rows[1].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2024-01-01',
              account_code: '100',
              account_name: 'Cash',
              debit: 1000,
              credit: 0,
              balance: 1000,
              old_account_code: '100',
              old_debit: 1000,
              old_credit: 0,
              old_balance: 1000,
              new_account_code: '100',
              new_debit: 1000,
              new_credit: 0,
              new_balance: 1000,
              change_date: rows[2].change_date,
              changed_by: 0,
              action: 'Update'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    });
});
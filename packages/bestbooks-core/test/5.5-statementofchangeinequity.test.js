const assert = require('assert');
const {
    Report,
    Equity,
    Expense,
    Revenue,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Statement of Change in Equity View',async function(){
    let report, expense, equity, revenue, rows;

    before(async() => {
        report = new Report();
        equity = new Equity("Equity");
        expense = new Expense("Expense");
        revenue = new Revenue("Revenue");
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

    it('should add opening balance to equity',async () => {
        equity.addCredit('2023-01-01','Opening Balance',1000.0,0,0,0,'Opening Balance');
    })

    it('should add owner contribution to equity',async () => {
        equity.addCredit('2023-02-01','Owner Contribution',500.0,0,0,0,'Owner Contribution');
    })

    it('should add dividends to equity',async () => {
        equity.addDebit('2023-03-01','Dividends',200.0,0,0,0,'Dividends');
    })

    it('should add other adjustments to equity',async () => {
        equity.addCredit('2023-04-01','Other Adjustment',300.0,0,0,0,'Other Adjustment')
    })

    it('should add credit entry to revenue',async () => {
        revenue.addCredit('2023-05-01','Revenue Account',2000.0);
    })

    it('should add debit entry to expense',async () => {
        expense.addDebit('2023-06-01','Expense Account',1500.0);
    })

    it('should return the statement of changes in equity',async function(){
        rows = await report.statementOfChangesInEquitySync();
        assert.equal(rows.length,1); 
    })

    it('should verify the statement of changes in equity',async () => {
        const expected = [
            {
              equity_component: 'Equity',
              type: 'Equity',
              beginning_balance: 1000,
              net_income: 500,
              owner_contributions: 500,
              dividends: 200,
              other_adjustments: 300,
              ending_balance: 2100,
              txdate: '2023-01-01'
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
              txdate: '2023-06-01',
              account_code: '400',
              account_name: 'Expense',
              debit: 1500,
              credit: 0,
              balance: 1500,
              old_account_code: '400',
              old_debit: 1500,
              old_credit: 0,
              old_balance: 1500,
              new_account_code: '400',
              new_debit: 1500,
              new_credit: 0,
              new_balance: 1500,
              change_date: rows[0].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2023-05-01',
              account_code: '500',
              account_name: 'Revenue',
              debit: 0,
              credit: 2000,
              balance: 2000,
              old_account_code: '500',
              old_debit: 0,
              old_credit: 2000,
              old_balance: 2000,
              new_account_code: '500',
              new_debit: 0,
              new_credit: 2000,
              new_balance: 2000,
              change_date: rows[1].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2023-04-01',
              account_code: '300',
              account_name: 'Equity',
              debit: 0,
              credit: 300,
              balance: 1600,
              old_account_code: '300',
              old_debit: 0,
              old_credit: 300,
              old_balance: 1600,
              new_account_code: '300',
              new_debit: 0,
              new_credit: 300,
              new_balance: 1600,
              change_date: rows[2].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2023-03-01',
              account_code: '300',
              account_name: 'Equity',
              debit: 200,
              credit: 0,
              balance: 1300,
              old_account_code: '300',
              old_debit: 200,
              old_credit: 0,
              old_balance: 1300,
              new_account_code: '300',
              new_debit: 200,
              new_credit: 0,
              new_balance: 1300,
              change_date: rows[3].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2023-02-01',
              account_code: '300',
              account_name: 'Equity',
              debit: 0,
              credit: 500,
              balance: 1500,
              old_account_code: '300',
              old_debit: 0,
              old_credit: 500,
              old_balance: 1500,
              new_account_code: '300',
              new_debit: 0,
              new_credit: 500,
              new_balance: 1500,
              change_date: rows[4].change_date,
              changed_by: 0,
              action: 'Update'
            },
            {
              txdate: '2023-01-01',
              account_code: '300',
              account_name: 'Equity',
              debit: 0,
              credit: 1000,
              balance: 1000,
              old_account_code: '300',
              old_debit: 0,
              old_credit: 1000,
              old_balance: 1000,
              new_account_code: '300',
              new_debit: 0,
              new_credit: 1000,
              new_balance: 1000,
              change_date: rows[5].change_date,
              changed_by: 0,
              action: 'Update'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    });
});
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
              name: 'Cash',
              type: 'Asset',
              debit: 1000,
              credit: 0,
              balance: 1000,
              txdate: '2024-01-01'
            },
            {
              name: 'Sales',
              type: 'Asset',
              debit: 800,
              credit: 0,
              balance: 800,
              txdate: '2024-01-01'
            },
            {
              name: 'Expense',
              type: 'Liability',
              debit: 0,
              credit: 350,
              balance: 350,
              txdate: '2024-01-15'
            }
        ];
        delete(rows[0]['code']);
        delete(rows[1]['code']);
        delete(rows[2]['code']);

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
                account_code: '200',
                account_name: 'Expense',
                debit: 0,
                credit: 150,
                balance: -350,
                old_account_code: '200',
                old_debit: 0,
                old_credit: 150,
                old_balance: -350,
                new_account_code: '200',
                new_debit: 0,
                new_credit: 150,
                new_balance: -350,
                change_date: rows[0].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-15',
                account_code: '200',
                account_name: 'Expense',
                debit: 0,
                credit: 200,
                balance: 200,
                old_account_code: '200',
                old_debit: 0,
                old_credit: 200,
                old_balance: 200,
                new_account_code: '200',
                new_debit: 0,
                new_credit: 200,
                new_balance: 200,
                change_date: rows[1].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-02-01',
                account_code: rows[2].account_code,
                account_name: 'Sales',
                debit: 300,
                credit: 0,
                balance: -800,
                old_account_code: rows[2].old_account_code,
                old_debit: 300,
                old_credit: 0,
                old_balance: -800,
                new_account_code: rows[2].new_account_code,
                new_debit: 300,
                new_credit: 0,
                new_balance: -800,
                change_date: rows[2].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-01',
                account_code: rows[3].account_code,
                account_name: 'Sales',
                debit: 500,
                credit: 0,
                balance: 500,
                old_account_code: rows[3].old_account_code,
                old_debit: 500,
                old_credit: 0,
                old_balance: 500,
                new_account_code: rows[3].new_account_code,
                new_debit: 500,
                new_credit: 0,
                new_balance: 500,
                change_date: rows[3].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-01',
                account_code: rows[4].account_code,
                account_name: 'Cash',
                debit: 1000,
                credit: 0,
                balance: 1000,
                old_account_code: rows[4].old_account_code,
                old_debit: 1000,
                old_credit: 0,
                old_balance: 1000,
                new_account_code: rows[4].new_account_code,
                new_debit: 1000,
                new_credit: 0,
                new_balance: 1000,
                change_date: rows[4].change_date,
                changed_by: 0,
                action: 'Update'
            }
        ];
        //assert.deepStrictEqual(rows,expected);
    });
}); 
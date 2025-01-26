const assert = require('assert');
const {
    ChartOfAccounts,
    AccountTypes,
    Expense,
    Revenue,
    Income,
    ConservatismPrinciple
} = require('../index');

describe("ConservatismPrinciple Class", async function(){
    let audit;

    before(function(){
        audit = new ConservatismPrinciple();
    })

    after(async function(){
        await audit.model.insertSync(`DELETE FROM ledger;`);
        await audit.model.insertSync(`DELETE FROM ledger_audit;`);
        await audit.model.insertSync(`DELETE FROM accounts`);
        await audit.model.insertSync(`DELETE FROM journal`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);

        await audit.model.insertSync(`DELETE FROM conservative_transactions;`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='conservative_transactions';`);
    })

    it("should create an instance of ConservatismPrinciple", async function(){
        assert.ok(audit instanceof ConservatismPrinciple);
    })

    it('should return 1 for expense type', function() {
        const result = audit.applyConservatism('expense', 100);
        assert.strictEqual(result, 1);
    });

    it('should return 1 for liability type', function() {
        const result = audit.applyConservatism('liability', 100);
        assert.strictEqual(result, 1);
    });

    it('should return 0 for revenue type', function() {
        const result = audit.applyConservatism('revenue', 100);
        assert.strictEqual(result, 0);
    });

    it('should return 0 for asset type', function() {
        const result = audit.applyConservatism('asset', 100);
        assert.strictEqual(result, 0);
    });

    it('should create a conservative transaction and set is_conservative to 1', async function() {
        const transaction = {
            description: 'Office Supplies',
            amount: 100,
            type: 'expense',
            transaction_date: '2024-01-01'
        };
        await audit.createConservativeTransaction(transaction);

        const transactions = await audit.getTransactions();
        assert.strictEqual(transactions.length, 1);
        assert.strictEqual(transactions[0].is_conservative, 1);
    });

    it('should create a non-conservative transaction and set is_conservative to 0', async function() {
        const transaction = {
            description: 'Sales Revenue',
            amount: 200,
            type: 'revenue',
            transaction_date: '2024-01-02'
        };
        await audit.createConservativeTransaction(transaction);

        const transactions = await audit.getTransactions();
        assert.strictEqual(transactions.length, 2);
        assert.strictEqual(transactions[1].is_conservative, 0);
    });

    it('should return only conservative transactions', async function() {
        const transactions = await audit.getConservativeTransactions();
        assert.strictEqual(transactions.length, 1); // Only the first transaction is conservative
    });

    it('should update the transaction and keep is_conservative value', async function() {
        const transaction = {
            description: 'Updated Office Supplies',
            amount: 150,
            type: 'expense',
            transaction_date: '2024-01-01'
        };

        const transactionsBeforeUpdate = await audit.getTransactions();
        const idToUpdate = transactionsBeforeUpdate[0].id;

        await audit.updateTransaction(transaction, idToUpdate);
        const updatedTransaction = await audit.getTransactionById(idToUpdate);

        assert.strictEqual(updatedTransaction[0].description, 'Updated Office Supplies');
        assert.strictEqual(updatedTransaction[0].is_conservative, 1); // Ensure it's still conservative
    });

    it("should verify conservatims principle trigger",async function(){
        /**
         * Explanation of the Logic
         * 
         *     Expenses (4xxx) & Liabilities (2xxx) → Always conservative.
         *     Revenues (5xxx) & Assets (1xxx) → Default non-conservative, unless uncertainty exists.
         * 
         * If the note contains the keyword "certain", it's non-conservative.
         * Otherwise, it's conservative.
         */
        const coa = new ChartOfAccounts();
        await coa.add('Operating Expense',AccountTypes.Expense,AccountTypes.Expense);
        await coa.add('Service Revenue',AccountTypes.Revenue,AccountTypes.Revenue);
        const expense = new Expense('Operating Expense');
        await expense.addDebit('2024-01-22','Estimated cost',200.0);
        const revenue = new Revenue('Service Revenue');
        await revenue.addCredit('2024-01-22', 'Expected future sale', 500.0);
        await revenue.addDebit('2024-01-22', 'Payment received, certain', 500.0);

        const sql = `SELECT id, account_code, account_name, note, is_conservative FROM ledger ORDER BY txdate DESC;`;
        const report = await audit.model.querySync(sql);
        const expected = [
            {
              id: 1,
              account_code: '400',
              account_name: 'Operating Expense',
              note: 'Estimated cost',
              is_conservative: 'conservative'
            },
            {
              id: 2,
              account_code: '500',
              account_name: 'Service Revenue',
              note: 'Expected future sale',
              is_conservative: 'conservative'
            },
            {
              id: 3,
              account_code: '500',
              account_name: 'Service Revenue',
              note: 'Payment received, certain',
              is_conservative: 'non-conservative'
            }
        ];
        assert.deepStrictEqual(report,expected);
    })
})
const assert = require('assert');
const {
    ContraExpense
} = require('../index');

describe("ContraExpense Class", async function(){
    let expense;

    before(function(){
        expense = new ContraExpense('Purchase Returns');
    })

    after(async function(){
        await expense.model.insertSync(`DELETE FROM accounts;`);
        await expense.model.insertSync(`DELETE FROM ledger;`);
        await expense.model.insertSync(`DELETE FROM journal`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of ContraExpense", async function(){
        assert.ok(expense instanceof ContraExpense);
    })

    it('should be initialized with the correct name and type', function() {
        assert.strictEqual(expense.getName(), 'Purchase Returns');
        assert.strictEqual(expense.getAccountBaseType(), "Expense");
        assert.strictEqual(expense.getGroup(), 600);
    });

    it('should add a debit entry and return ledger and journal ids', async function() {
        const date = '2024-10-21';
        const description = 'Purchase return';
        const amount = 500.00;

        const [ledgerId, journalId] = await expense.addDebit(date, description, amount);

        assert.strictEqual(typeof ledgerId, 'number');
        assert.strictEqual(typeof journalId, 'number');
    });

    it('should add a credit entry and return ledger and journal ids', async function() {
        const date = '2024-10-22';
        const description = 'Reimbursement';
        const amount = 200.00;

        const [ledgerId, journalId] = await expense.addCredit(date, description, amount);

        assert.strictEqual(typeof ledgerId, 'number');
        assert.strictEqual(typeof journalId, 'number');
    });

    it('should correctly return the debit value after adding a debit', async function() {
        const debit = await expense.getDebit();
        assert.strictEqual(debit, 500.00); // Assuming this is the total added in previous steps
    });

    it('should correctly return the credit value after adding a credit', async function() {
        const credit = await expense.getCredit();
        assert.strictEqual(credit, 200.00); // Assuming this is the total added in previous steps
    });

    it('should calculate the correct balance after debits and credits', async function() {
        const balance = await expense.getBalance();

        assert.strictEqual(balance, 300.00); // 500 (debit) - 200 (credit) = 300
    });

    it('should increase balance when adding debit', async function() {
        const date = '2024-10-23';
        const description = 'New Purchase Return';
        const amount = 150.00;

        await expense.addDebit(date, description, amount);

        const balance = await expense.getBalance();
        assert.strictEqual(balance, 450.00); // Previous 300 + 150
    });

    it('should decrease balance when adding credit', async function() {
        const date = '2024-10-24';
        const description = 'New Reimbursement';
        const amount = 100.00;

        await expense.addCredit(date, description, amount);

        const balance = await expense.getBalance();
        assert.strictEqual(balance, 350.00); // Previous 450 - 100
    });    
})

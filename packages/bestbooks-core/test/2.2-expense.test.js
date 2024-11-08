const assert = require('assert');
const {
    AccountTypes,
    Expense
} = require('../index');

describe("Expense Class", async function(){
    let expense;
 
    before(function(){
        expense = new Expense('TestExpense');
    })

    after(async function(){
        await expense.model.insertSync(`DELETE FROM accounts;`);
        await expense.model.insertSync(`DELETE FROM ledger;`);
        await expense.model.insertSync(`DELETE FROM journal`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await expense.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Expense", async function(){
        assert.ok(expense instanceof Expense);
    })

    it('should create an expense with correct account type', function() {
        assert.strictEqual(expense.getAccountBaseType(), AccountTypes.Expense);
    });

    it('should add a debit entry', async function() {
        const [ledgerId, journalId] = await expense.addDebit('2024-10-10', 'Test debit', 100);

        assert.strictEqual(ledgerId, 1);
        assert.strictEqual(journalId, 1);
        assert.strictEqual(expense.getDebit(), 100);
    });

    it('should add a credit entry', async function() {
        const [ledgerId, journalId] = await expense.addCredit('2024-10-10', 'Test credit', 50);

        assert.strictEqual(ledgerId, 2);
        assert.strictEqual(journalId, 2);
        assert.strictEqual(expense.getCredit(), 50);
    });

    it('should calculate the correct balance', async function() {
        const balance = await expense.getBalance();

        assert.strictEqual(balance, 50);
    });

})

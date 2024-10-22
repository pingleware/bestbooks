const assert = require('assert');
const {ConservatismPrinciple} = require('../index');

describe("ConservatismPrinciple Class", async function(){
    let audit;

    before(function(){
        audit = new ConservatismPrinciple();
    })

    after(async function(){
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
})
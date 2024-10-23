const assert = require('assert');
const {Materiality} = require('../index');

describe("Materiality Class", async function(){
    let audit;

    before(function(){
        audit = new Materiality();
    })

    after(async function(){
        await audit.model.insertSync(`DELETE FROM transactions;`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='transactions';`);
    })

    it("should create an instance of Materiality", async function(){
        assert.ok(audit instanceof Materiality);
    })

    // Test if the transaction is material
    it('should correctly identify a material transaction', function () {
        const amount = 1000;
        const threshold = 500;

        const result = audit.isTransactionMaterial(amount, threshold);
        assert.strictEqual(result, true); // Transaction should be material since 1000 >= 500
    });

    // Test if the transaction is not material
    it('should correctly identify a non-material transaction', function () {
        const amount = 300;
        const threshold = 500;

        const result = audit.isTransactionMaterial(amount, threshold);
        assert.strictEqual(result, false); // Transaction should not be material since 300 < 500
    });

    // Test adding a material transaction
    it('should add a material transaction', async function () {
        const transaction = {
            description: 'Material Transaction',
            amount: 1000,
            transaction_date: new Date().toISOString(),
            audit_threshold: 500,
            materiality_threshold: 1000 // for material, amount >= materiality_threshold, otherwise non-material
        };

        await audit.addTransaction(transaction);

        const transactions = await audit.getTransactions();
        assert.strictEqual(transactions.length, 1);
        assert.strictEqual(transactions[0].description, 'Material Transaction');
        assert.strictEqual(transactions[0].is_material, 1); // 1 indicates true (material)
    });

    // Test adding a non-material transaction
    it('should add a non-material transaction', async function () {
        const transaction = {
            description: 'Non-Material Transaction',
            amount: 300,
            transaction_date: new Date().toISOString(),
            audit_threshold: 500,
            materiality_threshold: 301 // non-material
        };

        await audit.addTransaction(transaction);

        const transactions = await audit.getTransactions();
        assert.strictEqual(transactions.length, 2);
        assert.strictEqual(transactions[1].description, 'Non-Material Transaction');
        assert.strictEqual(transactions[1].is_material, 0); // 0 indicates false (not material)
    });

    // Test fetching all material transactions
    it('should fetch only material transactions', async function () {
        const transactions = [
            {
                description: 'Material Transaction 1',
                amount: 1000,
                transaction_date: new Date().toISOString(),
                audit_threshold: 500,
                materiality_threshold: 1000 // material
            },
            {
                description: 'Non-Material Transaction',
                amount: 300,
                transaction_date: new Date().toISOString(),
                audit_threshold: 500,
                materiality_threshold: 301 // non-material
            },
            {
                description: 'Material Transaction 2',
                amount: 700,
                transaction_date: new Date().toISOString(),
                audit_threshold: 500,
                materiality_threshold: 700 // material
            }
        ];

        for (const transaction of transactions) {
            await audit.addTransaction(transaction);
        }

        const materialTransactions = await audit.getMaterialTransactions();
        assert.strictEqual(materialTransactions.length, 3);
        assert.strictEqual(materialTransactions[1].description, 'Material Transaction 1');
        assert.strictEqual(materialTransactions[2].description, 'Material Transaction 2');
    });

    // Test deleting a transaction
    it('should delete a transaction', async function () {
        const transaction = {
            description: 'Transaction to Delete',
            amount: 500,
            transaction_date: new Date().toISOString(),
            audit_threshold: 400,
            materiality_threshold: 0 // non-material
        };

        await audit.addTransaction(transaction);
        const transactions = await audit.getTransactions();
        const transactionId = transactions[5].id;

        await audit.deleteTransaction(transactionId);

        const remainingTransactions = await audit.getTransactions();
        assert.strictEqual(remainingTransactions.length, 5);
    });
})
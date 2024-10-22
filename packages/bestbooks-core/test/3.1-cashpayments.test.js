const assert = require('assert');
const {CashPaymentsJournal} = require('../index');

describe("CashPaymentsJournal Class", async function(){
    let journal;

    before(function(){
        journal = new CashPaymentsJournal('CashPayments');
    })
    
    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of CashPaymentsJournal", async function(){
        assert.ok(journal instanceof CashPaymentsJournal);
    })

    it('should have the name CashPayments', function() {
        assert.strictEqual(journal.name, 'CashPayments', 'Name is not correctly set to CashPayments');
    });
    
    it('should record a cash payment', async () => {
        const record = { date: '2024-10-22', ref: 1, account: 'Cash', debit: 100, credit: 0 };
        await journal.recordPayment(record);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 1, 'Transaction should be recorded');
        assert.strictEqual(transactions[0].account, 'Cash', 'Account should be Cash');
    });
    

    it('should calculate the correct balance', async () => {
        await journal.recordPayment({ date: '2024-10-22', ref: 2, account: 'Supplies', debit: 0, credit: 50 });
        const balance = await journal.getJournalBalance();
        assert.strictEqual(balance, -50, 'Balance should be -50');
    });

    it('should update an existing transaction', async () => {
        await journal.updateTransaction(1, { date: '2024-10-23', account: 'Cash', debit: 50, credit: 0, ref: 1 });
        const transactions = await journal.getTransactions("Cash");
        assert.strictEqual(transactions[0].debit, 50, 'Debit should be updated to 50');
    });

    it('should check if the journal is in balance', async () => {
        const inBalance = await journal.checkInBalance();
        assert.strictEqual(inBalance, true, 'Journal should be in balance');
    });

    it('should retrieve transactions with a filter', async () => {
        const filteredTransactions = await journal.getTransactions('Supplies');
        assert.strictEqual(filteredTransactions.length, 1, 'There should be one filtered transaction');
        assert.strictEqual(filteredTransactions[0].account, 'Supplies', 'Filtered account should be Supplies');
    });

    it('should remove a transaction by ID', async () => {
        await journal.recordPayment({ date: '2024-10-22', ref: 1, account: 'Cash', debit: 100, credit: 0 });
        await journal.removeTransaction(3);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 2, 'Transaction should be removed');
    });
})

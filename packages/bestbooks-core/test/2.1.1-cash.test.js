const assert = require('assert');
const Cash = require('../cash');
const CashReceiptsJournal = require('../journal-cashreceipts');
const CashPaymentsJournal = require('../journal-cashpayments');

describe("Cash Class", async function(){
    let cash, cashReceipts, cashPayments;

    before(function(){
        cash = new Cash("Cash");
        cashReceipts = new CashReceiptsJournal();
        cashPayments = new CashPaymentsJournal();
    })

    after(async function(){
        await cash.model.insertSync(`DELETE FROM accounts;`);
        await cash.model.insertSync(`DELETE FROM ledger;`);
        await cash.model.insertSync(`DELETE FROM journal`);
        await cash.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await cash.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await cash.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of Cash", async function(){
        assert.ok(cash instanceof Cash);
        assert.strictEqual(cash.name,'Cash');
    })
    it("should create an instance of CashReceiptsJournal", async function(){
        assert.ok(cashReceipts instanceof CashReceiptsJournal);
        assert.strictEqual(cashReceipts.name,'CashReceipts');
    })
    it("should create an instance of CashPaymentsJournal", async function(){
        assert.ok(cashPayments instanceof CashPaymentsJournal);
        assert.strictEqual(cashPayments.name,'CashPayments');
    })
    it("should record a cash receipt and update cash balance", async function () {
        const initialBalance = await cash.getBalance();
        const receiptAmount = 500;

        const result = await cash.increase('2024-10-11','Test cash receipt',receiptAmount);
        // returns as ledger_id,journal_id but as comma-separated numbers
        const ledger_id = result.toString().split(',')[0];

        await cashReceipts.recordReceipt({
            date: '2024-10-11',
            ref: ledger_id,
            account: 'Cash',
            debit: receiptAmount,
            credit: 0,
            description: 'Test cash receipt'
        });

        const newBalance = await cash.getBalance();
        assert.strictEqual(newBalance, initialBalance + receiptAmount);
    });

    it("should record a cash payment and update cash balance", async function () {
        const initialBalance = await cash.getBalance();
        const paymentAmount = 300;

        const result = await cash.decrease('2024-10-11','Test cash payment',paymentAmount);
        // returns as ledger_id,journal_id but as comma-separated numbers
        const ledger_id = result.toString().split(',')[0];

        await cashPayments.recordPayment({
            date: '2024-10-15',
            ref: ledger_id,
            account: 'Cash',
            debit: 0,
            credit: paymentAmount,
            description: 'Test cash payment'
        });

        const newBalance = await cash.getBalance();
        assert.strictEqual(newBalance, initialBalance - paymentAmount);
    });
})
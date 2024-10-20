const assert = require('assert');
const {
    AccountTypes,
    Revenue
} = require('../index');

describe("Revenue Class", async function(){
    let revenue;

    before(function(){
        revenue = new Revenue('Sales');
    })

    after(async function(){
        await revenue.model.insertSync(`DELETE FROM accounts;`);
        await revenue.model.insertSync(`DELETE FROM ledger;`);
        await revenue.model.insertSync(`DELETE FROM journal`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Revenue", async function(){
        assert.ok(revenue instanceof Revenue);
    })

    it('should initialize with group 500 and type Revenue', () => {
        assert.strictEqual(revenue.getGroup(), 500);
        assert.strictEqual(revenue.getAccountBaseType(), AccountTypes.Revenue);
    });

    it('should add a debit and return ledger and journal IDs', async () => {
        const [ledgerId, journalId] = await revenue.increase('2024-10-15', 'Sale', 1000);

        assert.strictEqual(ledgerId, 1);
        assert.strictEqual(journalId, 1);
    });

    it('should add a credit and return ledger and journal IDs', async () => {
        const [ledgerId, journalId] = await revenue.decrease('2024-10-15', 'Refund', 500);

        assert.strictEqual(ledgerId, 2);
        assert.strictEqual(journalId, 2);
    });

    it('should get the correct debit and credit values', () => {
        revenue.debit = 1000;
        revenue.credit = 500;

        assert.strictEqual(revenue.getDebit(), 1000);
        assert.strictEqual(revenue.getCredit(), 500);
    });

    it('should calculate the balance correctly', async () => {
        const balance = await revenue.getBalance();

        assert.strictEqual(balance, 500);
    });    
})

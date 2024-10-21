const assert = require('assert');
const {
    ContraRevenue
} = require('../index');

describe("ContraRevenue Class", async function(){
    let revenue;

    before(function(){
        revenue = new ContraRevenue("Sales Returns");
    })

    after(async function(){
        await revenue.model.insertSync(`DELETE FROM accounts;`);
        await revenue.model.insertSync(`DELETE FROM ledger;`);
        await revenue.model.insertSync(`DELETE FROM journal`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await revenue.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of ContraRevenue", async function(){
        assert.ok(revenue instanceof ContraRevenue);
    })

    it('should create a ContraRevenue account with the correct name and type', () => {
        assert.strictEqual(revenue.getName(), 'Sales Returns');
        assert.strictEqual(revenue.getAccountBaseType(), "Revenue");
    });

    it('should have the correct group set for ContraRevenue', () => {
        assert.strictEqual(revenue.getGroup(), 400); // Assuming the group is 400 for revenue accounts
    });

    it('should correctly add a debit and update the balance', async () => {
        await revenue.addDebit('2024-10-01', 'Sales Return', 500);
        const balance = await revenue.getBalance();
        assert.strictEqual(balance, 500);  // The balance should be 500 after adding debit
    });

    it('should correctly add a credit and update the balance', async () => {
        // First add a debit
        await revenue.addDebit('2024-10-01', 'Sales Return', 500);
        // Then add a credit
        await revenue.addCredit('2024-10-02', 'Reversal', 200);

        const balance = await revenue.getBalance();
        assert.strictEqual(balance, 300);  // 500 debit - 200 credit = 300 balance
    });

    it('should handle multiple debits and credits and calculate the correct balance', async () => {
        await revenue.addDebit('2024-10-01', 'Sales Return', 1000);
        await revenue.addCredit('2024-10-02', 'Reversal', 300);
        await revenue.addDebit('2024-10-03', 'Additional Return', 500);
        await revenue.addCredit('2024-10-04', 'Further Reversal', 200);

        const balance = await revenue.getBalance();
        assert.strictEqual(balance, 1000);  // (1000 - 300 + 500 - 200 = 1000)
    });

    it('should increase the balance when debit is called', async () => {
        await revenue.addDebit('2024-10-05', 'Sales Adjustment', 300);
        const balance = await revenue.getBalance();
        assert.strictEqual(balance, 300);
    });

    it('should decrease the balance when credit is called', async () => {
        await revenue.addDebit('2024-10-05', 'Sales Adjustment', 500);
        await revenue.addCredit('2024-10-06', 'Adjustment Reversal', 200);
        const balance = await revenue.getBalance();
        assert.strictEqual(balance, 300);  // (500 - 200 = 300)
    });    
})

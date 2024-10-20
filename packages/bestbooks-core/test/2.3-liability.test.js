const assert = require('assert');
const {Liability} = require('../index');

describe("Liability Class", async function(){
    let liability;

    before(function(){
        liability = new Liability('Loan');
    })

    after(async function(){
        await liability.model.insertSync(`DELETE FROM accounts;`);
        await liability.model.insertSync(`DELETE FROM ledger;`);
        await liability.model.insertSync(`DELETE FROM journal`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Liability", async function(){
        assert.ok(liability instanceof Liability);
    })

    it('should initialize with correct account name and type', function () {
        assert.strictEqual(liability.getName(), 'Loan');
        assert.strictEqual(liability.getAccountBaseType(), 'Liability');
    });

    it('should increase balance on credit (addCredit)', async function () {
        const [ledgerId, journalId] = await liability.addCredit('2024-10-15', 'Payment received', 1000);
        assert.strictEqual(liability.getCredit(), 1000);
        assert.strictEqual(ledgerId, 1);
        assert.strictEqual(journalId, 1);
    });

    it('should decrease balance on debit (addDebit)', async function () {
        const [ledgerId, journalId] = await liability.addDebit('2024-10-15', 'Payment made', 500);
        assert.strictEqual(liability.getDebit(), 500);
        assert.strictEqual(ledgerId, 2);
        assert.strictEqual(journalId, 2);
    });

    it('should return correct balance', async function () {
        const balance = await liability.getBalance();
        assert.strictEqual(balance, 500);
    });

    it('should have correct group value', function () {
        assert.strictEqual(liability.getGroup(), 200);
    });    
})

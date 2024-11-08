const assert = require('assert');

const {Withdrawals} = require('../index');

describe("Withdrawals Class", async function(){
    let account;

    before(function(){ 
        account = new Withdrawals("TestExpense");
    })

    after(async function(){
        await account.model.insertSync(`DELETE FROM accounts;`);
        await account.model.insertSync(`DELETE FROM ledger;`);
        await account.model.insertSync(`DELETE FROM journal`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })


    it("should create an instance of Withdrawals", async function(){
        assert.ok(account instanceof Withdrawals);
    })

    it('should have a balance of 0 initially',async function () {
        assert.strictEqual(await account.getBalance(), 0);
    });

    it('should increase the balance after a deposit',async function () {
        await account.deposit(new Date().toISOString().split("T")[0],"Deposit $100",100.0);
        assert.strictEqual(await account.getBalance(), 100);
    });

    it('should throw an error when depositing zero or negative amount',async function () {
        try {
            await account.deposit(new Date().toISOString().split("T")[0],"Deposit $0",0)
        } catch(err) {
            assert.strictEqual(err.message,"Deposit amount must be positive");
        }
        try {
            await account.deposit(new Date().toISOString().split("T")[0],"Deposit -$50",-50)
        } catch(err) {
            assert.strictEqual(err.message,"Deposit amount must be positive");
        }
    });
    
    it('should decrease the balance after a withdrawal',async function () {
        await account.deposit(new Date().toISOString().split("T")[0],"Deposit $200",200);
        await account.withdraw(new Date().toISOString().split("T")[0],"Withdraw $100",100);
        assert.strictEqual(await account.getBalance(), 200);
    });

    it('should throw an error if withdrawal amount is greater than balance',async function () {
        try {
            await account.withdraw(new Date().toISOString().split("T")[0],"Withdraw $300",300)
        } catch(err) {
            assert.strictEqual(err.message,"Insufficient balance");
        }
    });

    it('should throw an error when withdrawing zero or negative amount',async function () {
        try {
            await account.withdraw(new Date().toISOString().split("T")[0],"Withdraw $0",0)
        } catch(err) {
            assert.strictEqual(err.message,"Withdrawal amount must be positive");
        }
        try {
            await account.withdraw(new Date().toISOString().split("T")[0],"Withdraw -$20",-20)
        } catch(err) {
            assert.strictEqual(err.message,"Withdrawal amount must be positive");
        }
    });
})

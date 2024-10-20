const assert = require('assert');
const Bank = require('../bank');

describe("Bank Class", async function(){
    let bank;

    before(function(){
        bank = new Bank();
    })

    after(async function(){
        await bank.model.insertSync(`DELETE FROM accounts;`);
        await bank.model.insertSync(`DELETE FROM ledger;`);
        await bank.model.insertSync(`DELETE FROM journal`);
        await bank.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await bank.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await bank.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Bank", async function(){
        assert.ok(bank instanceof Bank);
    })

    it("it should create a new bank account", async function(){});
    it("it should rejection of invalid account details", async function(){});
    it("it should accept a deposit to a bank account", async function(){});
    it("it should deposit of zero or negative values (should fail or be rejected)", async function(){});
    it("it should a deposit updates the account balance correctly", async function(){});
    it("it should accept a withdrawal from a bank account", async function(){});
    it("it should withdrawal amount greater than available balance (overdraft protection)", async function(){});
    it("it should withdrawal updates the account balance correctly", async function(){});
    it("it should insufficient funds handling (with and without overdraft protection)", async function(){});
    it("it should get the balance from a bank account", async function(){});
    it("it should balance consistency after a series of transactions", async function(){});
    it("it should transfer  transfer of funds between two accounts", async function(){});
    it("it should both source and target account balances are updated correctly", async function(){});
    it("it should accept maintenance or service fees.", async function(){});
    it("it should show logging of all transactions", async function(){});
    it("it should retrieve transaction history for a specific period", async function(){});
    it("it should reflect transaction history reflects accurate details", async function(){});
    it("it should test all changes to the account are logged", async function(){});
    it("it should prevention of unauthorized access or modification of account data", async function(){});
    it("it should  retrieval of audit logs for compliance or reconciliation purposes", async function(){});
    it("it should successfully close of an account with zero balance", async function(){});
    it("it should reject of account closure when there is a non-zero balance or active transactions", async function(){});
    it("it should ensure that closed accounts cannot accept new transactions", async function(){});
})
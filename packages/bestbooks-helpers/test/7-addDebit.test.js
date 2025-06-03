const assert = require('assert');
    const {addDebit} = require('../index');
    const {
      Model,
      Cash,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('addDebit Testing', () => {
      let model, date, dateString, account;

      before(async()=>{
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        model = new Model();
        account = new Cash("Cash in Hand");
      })

      beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
      });

      after(async()=>{
        await model.insertSync("DELETE FROM ledger;");
        await model.insertSync("DELETE FROM accounts");
        await model.insertSync("DELETE FROM journal");
        await model.insertSync("DELETE FROM company");
        await model.insertSync("DELETE FROM users");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='users';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='company';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='journal';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';");
      })

      it('should verify addDebit does exist', () => {
        // Sample test
        assert.ok(addDebit, 'addDebit should be defined');
      });

      it('should call account.addDebit with the correct parameters', async () => {
        const description = 'Cash Sale';
        const amount = 500.00;

        await addDebit(account, date, description, amount, 0, 0);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].debit,500,`the ${result[0].name} should have a debit entry`);
        assert.equal(result[0].account_name,'Cash in Hand',`account should be an 'Cash in Hand'`);
        assert.equal(result[0].note,'Cash Sale',`the ${result[0].account_name} should have a note of 'Cash Sale'`);
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].debit,500,`the ${result[0].name} should have a debit entry`);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].name,'Cash in Hand',`account should be an 'Cash in Hand'`);
        assert.equal(result[0].type,'Asset',`the ${result[0].name} account should be a Asset account type`)
      })
    });
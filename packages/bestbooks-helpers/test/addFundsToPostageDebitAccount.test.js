const assert = require('assert');
    const {addFundsToPostageDebitAccount} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('addFundsToPostageDebitAccount Testing', () => {
      let model, date, dateString;

      before(async()=>{
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        model = new Model();
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

      it('should verify addFundsToPostageDebitAccount does exist', () => {
        // Sample test
        assert.ok(addFundsToPostageDebitAccount, 'addFundsToPostageDebitAccount should be defined');
      });

      it('should add funds to the postage debit account', async () => {
        await addFundsToPostageDebitAccount(date, "Deposit for Postage", 100, "Bank", 0, 0);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        if (result[0].account_name === 'Postage Debit Account') {
          assert.equal(result[0].debit,100,`the ${result[0].account_name} should have a debit entry`);
        } else if (result[0].account_name === 'Bank') {
          assert.equal(result[0].credit,100,`the ${result[0].account_name} should have a credit entry`);
        }
        assert.equal(result[0].note,'Deposit for Postage',`the ${result[0].account_name} should have a note of 'Deposit for Postage'`);
        if (result[1].account_name === 'Postage Debit Account') {
          assert.equal(result[1].debit,100,`the ${result[1].account_name} should have a debit entry`);
        } else if (result[1].account_name === 'Bank') {
          assert.equal(result[1].credit,100,`the ${result[1].account_name} should have a credit entry`);
        }
        assert.equal(result[1].note,'Deposit for Postage',`the ${result[1].account_name} should have a note of 'Cash Sale'`);
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        if (result[0].account === 'Postage Debit Account') {
          assert.equal(result[0].debit,100,`the ${result[0].account} should have a debit entry`);
        } else if (result[0].account === 'Bank') {
          assert.equal(result[0].credit,100,`the ${result[0].account} should have a credit entry`);
        }
        if (result[1].account === 'Postage Debit Account') {
          assert.equal(result[1].debit,100,`the ${result[1].account} should have a debit entry`);
        } else if (result[1].account === 'Bank') {
          assert.equal(result[1].credit,100,`the ${result[1].account} should have a credit entry`);
        }
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].base_type,'Asset',`the ${result[0].name} account should be a Asset account type`);
        assert.equal(result[1].base_type,'Asset',`the ${result[1].name} account should be a Asset account type`);
        if (result[0].name === 'Bank') {
          assert.equal(result[0].type,'Bank',`the ${result[0].name} account should be a Bank account type`);
          assert.equal(result[1].type,'Asset',`the ${result[1].name} account should be a Asset account type`);
        } else if (result[0].name === 'Postage Debit Account') {
          assert.equal(result[0].type,'Asset',`the ${result[0].name} account should be a Asset account type`);
          assert.equal(result[1].type,'Bank',`the ${result[1].name} account should be a Bank account type`);
        }
        assert.equal(result[0].code, 100, `the ${result[0].name} account should have a code of 100`);
        assert.equal(result[1].code, 101, `the ${result[1].name} account should have a code of 101`);
      })
    });
const assert = require('assert');
    const {accruedInterest} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('accruedInterest Testing', () => {
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

      it('should verify accruedInterest does exist', () => {
        // Sample test
        assert.ok(accruedInterest, 'accruedInterest should be defined');
      });

      it('should record a debit to Interest Expense and credit to Interest Payable', async () => {
          const description = 'Monthly loan interest';
          const amount = 100.00;
          await accruedInterest(date, description, amount, 0, 0);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        if (result[0].account_name === 'Interest Expense') {
          assert.equal(result[0].debit, 100, `${result[0].account_name} should have a credit amount`)
          assert.equal(result[1].credit, 100, `${result[1].account_name} should have a debit amount`);
        } else if (result[0].account_name === 'Interest Payable') {
          assert.equal(result[0].credit, 100, `${result[0].account_name} should have a credit amount`);
          assert.equal(result[1].debit, 100, `${result[1].account_name} should have a debit amount`)
        }
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        if (result[0].account === 'Interest Payable') {
          assert.equal(result[0].credit,100,`${result[0].account} should have a credit entry`);
        } else if (result[0].account === 'Interest Expense') {
          assert.equal(result[0].debit,100,`${result[0].account} should have a debit entry`);
        }
        if (result[1].account === 'Interest Payable') {
          assert.equal(result[1].credit,100,`${result[1].account} should have a credit entry`);
        } else if (result[1].account === 'Interest Expense') {
          assert.equal(result[1].debit,100,`${result[1].account} should have a debit entry`);
        }
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        if (result[0].account_name === 'Interest Expense') {
          assert.equal(result[0].type, 'Expense', `${result[0].account_name} should be an Expense account`);
        } else if (result[0].account_name === 'Interest Payable') {
          assert.equal(result[0].type, 'Liability', `${result[0].account_name} should be an Liability account`);
        }
        if (result[1].account_name === 'Interest Expense') {
          assert.equal(result[1].type, 'Expense', `${result[1].account_name} should be an Expense account`);
        } else if (result[1].account_name === 'Interest Payable') {
          assert.equal(result[1].type, 'Liability', `${result[1].account_name} should be an Liability account`);
        }
      })
    });
const assert = require('assert');
    const {addCredit} = require('../index');
    const {
      Model,
      ContraAsset,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('addCredit Testing', () => {
      let model, date, dateString, account;

      before(async()=>{
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        model = new Model();
        account = new ContraAsset("Allowance for Doubtful Accounts");
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

      it('should verify addCredit does exist', () => {
        // Sample test
        assert.ok(addCredit, 'addCredit should be defined');
      });

      it('should call account.addCredit with the correct parameters', async () => {
        const description = 'Bad Debt';
        const amount = 200.00;

        await addCredit(account, date, description, amount, 0, 0);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].credit,200,`the ${result[0].name} should have a credit entry`);
        assert.equal(result[0].account_name,'Allowance for Doubtful Accounts',`account should be an 'Allowance for Doubtful Accounts'`);
        assert.equal(result[0].note,'Bad Debt',`the ${result[0].account_name} should have a note of 'Bad Debt'`);
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].credit,200,`the ${result[0].name} should have a credit entry`);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].name,'Allowance for Doubtful Accounts',`account should be an 'Allowance for Doubtful Accounts'`);
        assert.equal(result[0].type,'ContraAsset',`the ${result[0].name} aka 'Bad Debt' account should be a ContraAsset account type`)
      })
    });
const assert = require('assert');
    const {initializeEquity} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('initializeEquity Testing', () => {
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

      it('should verify initializeEquity does exist', () => {
        // Sample test
        assert.ok(initializeEquity, 'initializeEquity should be defined');
      });

      it('should initialize equity accounts', async () => {
        // Call the initializeEquity function
        await initializeEquity();
      });

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 300);
        assert.strictEqual(result[0].name, 'Common Shares Par Value');
        assert.strictEqual(result[0].type, 'Equity');
        assert.strictEqual(result[1].code, 301);
        assert.strictEqual(result[1].name, 'Additional Paid-in Capital');
        assert.strictEqual(result[1].type, 'Equity');
        assert.strictEqual(result[2].code, 302);
        assert.strictEqual(result[2].name, 'Retained Earnings');
        assert.strictEqual(result[2].type, 'Equity');
        assert.strictEqual(result[3].code, 303);
        assert.strictEqual(result[3].name, 'Treasury Shares');
        assert.strictEqual(result[3].type, 'Equity');
      })
    });
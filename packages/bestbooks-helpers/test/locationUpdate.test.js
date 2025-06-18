const assert = require('assert');
    const {
      locationAdd,
      locationUpdate
    } = require('../index');
    const {
      ChartOfAccounts,
      Model,
      Cash,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('locationUpdate Testing', () => {
      let model, date, dateString, location_id, account_code;

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

      it('should verify locationUpdate does exist', () => {
        // Sample test
        assert.ok(locationUpdate, 'locationUpdate should be defined');
      });

      it("should update the NY cash account",async()=>{
        const coa = new ChartOfAccounts();
        const cash_id = await coa.add("Cash","Cash","Asset");
        const cash = new Cash("Cash");
        location_id = await locationAdd("NY","USA");
        await cash.addDebit(date,"deposit",100,0,0,location_id);
        const result = await model.querySync(`SELECT * FROM ledger WHERE id=?;`,[cash_id]);
        account_code = result[0].account_code;
        assert.strictEqual(result[0].location,location_id,"location does not match");
        await locationUpdate("Cash",account_code,1);
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].location,1);
        assert.strictEqual(result[0].location != location_id,true);
      })

      it("should delete the NY in USA region",async()=>{
        await model.insertSync("DELETE FROM locations WHERE location=? AND region=?;",["NY","USA"]);
      })
    });
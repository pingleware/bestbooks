const assert = require('assert');
    const {
      locationAdd,
      locationDelete
    } = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('locationDelete Testing', () => {
      let model, date, dateString, location_id;

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

      it('should verify locationDelete does exist', () => {
        // Sample test
        assert.ok(locationDelete, 'locationDelete should be defined');
      });

      it("should add a new location for NY in the USA region",async()=>{
        await locationAdd("NY","USA");
      })

      it("should verify NY in USA region exists",async()=>{
        const result = await model.querySync("SELECT * FROM locations WHERE location=? AND region=?;",["NY","USA"]);
        assert.strictEqual(result[0].location,"NY");
        assert.strictEqual(result[0].region,"USA");
        location_id = result[0].id;
      })

      it("should delete the NY in USA region",async()=>{
        await locationDelete(location_id);
      })

      it("should verify NY in USA region was deleted",async()=>{
        const result = await model.querySync("SELECT * FROM locations WHERE location=? AND region=?;",["NY","USA"]);
        assert.strictEqual(result.length,0);
      })
    });
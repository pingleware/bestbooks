const assert = require('assert');
    const {workingHours} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('workingHours Testing', () => {
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

      it('should verify workingHours does exist', () => {
        // Sample test
        assert.ok(workingHours, 'workingHours should be defined');
      });

      it('should show total working hours for a 40 hour work week', async()=>{
        const hours = await workingHours(40);
        assert.strictEqual(hours.workHoursInYear, 2080);
        assert.strictEqual(hours.workHoursInMonth, 173);
      })

      it('should show total working hours for a 4-day work week of 8 hours per day', async()=>{
        const hours = await workingHours(Number(4 * 8));
        assert.strictEqual(hours.workHoursInYear, 1664);
        assert.strictEqual(hours.workHoursInMonth, 139);
      })

      it('should show total working hours for a 60 hour work week', async()=>{
        const hours = await workingHours(60);
        assert.strictEqual(hours.workHoursInYear, 3120);
        assert.strictEqual(hours.workHoursInMonth, 260);
      })

    });
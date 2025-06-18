const assert = require('assert');
    const {COGS} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('COGS Testing', () => {
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

      it('should verify COGS does exist', () => {
        // Sample test
        assert.ok(COGS, 'COGS should be defined');
      });

      it("should add a product",async()=>{
        await COGS(date, "Product A - Addition", 1500.00);
      });

      it("should remove a product portion",async()=>{
        await COGS(date, "Product A - Removal", -500.00);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].debit == 1500, true);
        assert.strictEqual(result[0].credit == 0, true);
        assert.strictEqual(result[0].balance == 1500, true);
        assert.strictEqual(result[1].debit == 1500, true);
        assert.strictEqual(result[1].credit == 0, true);
        assert.strictEqual(result[1].balance == 1500, true);
        assert.strictEqual(result[2].debit == 1500, true);
        assert.strictEqual(result[2].credit == 0, true);
        assert.strictEqual(result[2].balance == 1500, true);
        assert.strictEqual(result[3].debit == -500, true);
        assert.strictEqual(result[3].credit == 0, true);
        assert.strictEqual(result[3].balance == 1000, true);
        assert.strictEqual(result[4].debit == -500, true);
        assert.strictEqual(result[4].credit == 0, true);
        assert.strictEqual(result[4].balance == -1000, true);
        assert.strictEqual(result[5].debit == 0, true);
        assert.strictEqual(result[5].credit == 500, true);
        assert.strictEqual(result[5].balance == 1000, true);
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'COGS',
            ref: 1,
            debit: 1500,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Purchases',
            ref: 2,
            debit: 1500,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Inventory',
            ref: 3,
            debit: 1500,
            credit: 0
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'COGS',
            ref: 4,
            debit: -500,
            credit: 0
          },
          {
            id: 5,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Purchases',
            ref: 5,
            debit: -500,
            credit: 0
          },
          {
            id: 6,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Inventory',
            ref: 6,
            debit: 0,
            credit: 500
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 400);
        assert.strictEqual(result[0].name, 'COGS');
        assert.strictEqual(result[0].type, 'Expense');
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Purchases');
        assert.strictEqual(result[1].type, 'Liability');
        assert.strictEqual(result[2].code, 100);
        assert.strictEqual(result[2].name, 'Inventory');
        assert.strictEqual(result[2].type, 'Asset');
      })
    });
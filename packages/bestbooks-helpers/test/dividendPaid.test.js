const assert = require('assert');
    const {
      dividendPaid,
      dividendDeclared,
    } = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('dividendPaid Testing', () => {
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

      it('should verify dividendPaid does exist', () => {
        // Sample test
        assert.ok(dividendPaid, 'dividendPaid should be defined');
      });

      it("should create a dividend declared entry", async () => {
        await dividendDeclared(date, "Test Dividend Declared", 1000);
      });

      it("should create a dividend paid entry", async () => {
        await dividendPaid(date, "Test Dividend Paid", 500);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].balance, 1000, 'Should have a balance of 1000 after declaring dividend');
        assert.strictEqual(result[1].balance, 1000, 'Should have a balance of 1000 after declaring dividend');
        assert.strictEqual(result[2].balance, 500, 'Should have a balance of 500 after declaring dividend');
        assert.strictEqual(result[3].balance, 500, 'Should have a balance of 500 after paying dividend');
        assert.strictEqual(result[3].debit, 500, 'Debit should be 500 for dividend paid');
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
            account: 'Retained Earnings',
            ref: 1,
            debit: 1000,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Dividends Payable',
            ref: 2,
            debit: 0,
            credit: 1000
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 3,
            debit: 0,
            credit: 500
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Dividends Payable',
            ref: 4,
            debit: 500,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 300);
        assert.strictEqual(result[0].name, 'Retained Earnings');
        assert.strictEqual(result[0].type, 'Equity');
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Dividends Payable');
        assert.strictEqual(result[1].type, 'Liability');
        assert.strictEqual(result[2].code, 100);
        assert.strictEqual(result[2].name, 'Cash');
        assert.strictEqual(result[2].type, 'Asset');
      })
    });
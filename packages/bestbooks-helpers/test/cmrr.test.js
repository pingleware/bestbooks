const assert = require('assert');
    const {cmrr, asset} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('cmrr Testing', () => {
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

      it('should verify cmrr does exist', () => {
        // Sample test
        assert.ok(cmrr, 'cmrr should be defined');
      });

      it("should calculate cmrr for expansions",async()=>{
        await cmrr("Expansions", date, "CMRR calculation test", 1000.00);
      });

      it("should calculate cmrr for contractions",async()=>{
        await cmrr("Contractions", date, "CMRR calculation test", 500.00);
      });

      it("should calculate cmrr for churns",async()=>{
        await cmrr("Churn", date, "CMRR calculation test", 200.00);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        result.forEach(row => {
          switch (row.note) {
            case "CMRR calculation test - Upsell":
              assert.strictEqual(row.debit, 0);
              assert.strictEqual(row.credit, 1000);
              assert.strictEqual(row.balance, 1000);
              break;
            case "CMRR calculation test - Downgrade":
              assert.strictEqual(row.debit, 500);
              assert.strictEqual(row.credit, 0);
              assert.strictEqual(row.balance, 500);
              break;
            case "CMRR calculation test - Cancellation":
              assert.strictEqual(row.debit, 200);
              assert.strictEqual(row.credit, 0);
              assert.strictEqual(row.balance, 300);
              break;
            default:
              assert.fail(`Unexpected note: ${row.note}`);
          }
        });
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
            account: 'Revenue',
            ref: 1,
            debit: 0,
            credit: 1000
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Revenue',
            ref: 2,
            debit: 500,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Revenue',
            ref: 3,
            debit: 200,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 500);
        assert.strictEqual(result[0].name, 'Revenue');
        assert.strictEqual(result[0].type, 'Revenue');
      })
    });
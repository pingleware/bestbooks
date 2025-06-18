const assert = require('assert');
    const {commissionPayable} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('commissionPayable Testing', () => {
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

      it('should verify commissionPayable does exist', () => {
        // Sample test
        assert.ok(commissionPayable, 'commissionPayable should be defined');
      });

      it("should add commission payable entry",async()=>{
        await commissionPayable(date, "Add a commission", 500.00);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(row => {
          if (row.account_name === "Commission Payable") {
            assert.strictEqual(row.debit, 0);
            assert.strictEqual(row.credit, 500);
            assert.strictEqual(row.balance, 500);
          } else if (row.account_name === "Commission Expense") {
            assert.strictEqual(row.debit, 500);
            assert.strictEqual(row.credit, 0);
            assert.strictEqual(row.balance, 500);
          }
        });
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        result.forEach(row => {
          if (row.account === "Commission Expense") {
            assert.strictEqual(row.debit, 500);
            assert.strictEqual(row.credit, 0);
          } else if (row.account === "Commission Payable") {
            assert.strictEqual(row.debit, 0);
            assert.strictEqual(row.credit, 500);
          }
        });
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 400);
        assert.strictEqual(result[0].name, 'Commission Expense');
        assert.strictEqual(result[0].type, 'Expense');
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Commission Payable');
        assert.strictEqual(result[1].type, 'Liability');
      })
    });
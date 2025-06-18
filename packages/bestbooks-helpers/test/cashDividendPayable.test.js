const assert = require('assert');
    const {
      cashDividendPayable,
      cashDividendDeclared,
    } = require('../index');
    const {
      Model,
      ChartOfAccounts,
      Cash,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('cashDividendPayable Testing', () => {
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

      it("should make a deposit to cash",async()=>{
        const coa = new ChartOfAccounts();
        await coa.add("Cash", "Cash");
        const cash = new Cash("Cash");
        await cash.addDebit(date, "Initial cash deposit", 5000.00);
      });

      it('should verify cashDividendPayable does exist', () => {
        // Sample test
        assert.ok(cashDividendPayable, 'cashDividendPayable should be defined');
      });

      it("should declare a cash dividend",async()=>{
        await cashDividendDeclared(date, "Dividend declared", 5000.00);
      });

      it("should declare a cash dividend payable",async()=>{
        await cashDividendPayable(date, "Dividend payable", 5000.00);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(row => {
          if (row.account_name === "Cash") {
            switch (row.id) {
              case 1:
                assert.strictEqual(row.debit, 5000);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 5000);
                break;
              case 5:
                assert.strictEqual(row.debit, 0);
                assert.strictEqual(row.credit, 5000);
                assert.strictEqual(row.balance, 0);
                break;
            }
          } else if (row.account_name === "Retained Earnings") {
            switch (row.id) {
              case 2:
                assert.strictEqual(row.debit, 5000);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 5000);
                break;
            }
          } else if (row.account_name === "Dividends Payable") {
            switch (row.id) {
              case 3:
                assert.strictEqual(row.debit, 0);
                assert.strictEqual(row.credit, 5000);
                assert.strictEqual(row.balance, 5000);
                break;
              case 4:
                assert.strictEqual(row.debit, 5000);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 0);
                break;
            }
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
            account: 'Cash',
            ref: 1,
            debit: 5000,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Retained Earnings',
            ref: 2,
            debit: 5000,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Dividends Payable',
            ref: 3,
            debit: 0,
            credit: 5000
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 5,
            debit: 0,
            credit: 5000
          },
          {
            id: 5,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Dividends Payable',
            ref: 4,
            debit: 5000,
            credit: 0
          }
        ];
        assert.strictEqual(result.length, expected.length);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Cash');
        assert.strictEqual(result[0].type,'Cash');
        assert.strictEqual(result[1].code, 300);
        assert.strictEqual(result[1].name, 'Retained Earnings');
        assert.strictEqual(result[1].type,'Equity');
        assert.strictEqual(result[2].code, 200);
        assert.strictEqual(result[2].name, 'Dividends Payable');
        assert.strictEqual(result[2].type,'Liability');
      })
    });
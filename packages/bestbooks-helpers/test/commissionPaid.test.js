const assert = require('assert');
    const {
      commissionPaid,
      commissionPayable,
    } = require('../index');
    const {
      Model,
      ChartOfAccounts,
      Cash,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('commissionPaid Testing', () => {
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

      it('should verify commissionPaid does exist', () => {
        // Sample test
        assert.ok(commissionPaid, 'commissionPaid should be defined');
      });

            it("should make a deposit to cash",async()=>{
        const coa = new ChartOfAccounts();
        await coa.add("Cash", "Cash");
        const cash = new Cash("Cash");
        await cash.addDebit(date, "Initial cash deposit", 500.00);
      });

      it("should add commission payable entry",async()=>{
        await commissionPayable(date, "Commission Payable Test", 500.00);
      });

      it("should pay a commission",async()=>{
        await commissionPaid(date, "Pay the Commission", 500.00); 
      });
      
      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(row => {
          if (row.account_name === "Commission Payable") {
            switch (row.id) {
              case 3:
                assert.strictEqual(row.debit, 0);
                assert.strictEqual(row.credit, 500);
                assert.strictEqual(row.balance, 500);
                break;
              case 4:
                assert.strictEqual(row.debit, 500);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 0);
                break;
            }
          } else if (row.account_name === "Commission Expense") {
            switch (row.id) {
              case 2:
                assert.strictEqual(row.debit, 500);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 500);
                break;
              case 5:
                assert.strictEqual(row.debit, 500);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 1000);
                break;
            }
          } else if (row.account_name === "Cash") {
            switch (row.id) {
              case 1:
                assert.strictEqual(row.debit, 500);
                assert.strictEqual(row.credit, 0);
                assert.strictEqual(row.balance, 500);
                break;
              case 6:
                assert.strictEqual(row.debit, 0);
                assert.strictEqual(row.credit, 500);
                assert.strictEqual(row.balance, 0);
                break;
            }
          }
        });
      });

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
            debit: 500,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Commission Expense',
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
            account: 'Commission Payable',
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
            account: 'Commission Payable',
            ref: 4,
            debit: 500,
            credit: 0
          },
          {
            id: 5,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Commission Expense',
            ref: 5,
            debit: 500,
            credit: 0
          },
          {
            id: 6,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
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
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Cash');
        assert.strictEqual(result[0].type,'Cash');
        assert.strictEqual(result[1].code, 400);
        assert.strictEqual(result[1].name, 'Commission Expense');
        assert.strictEqual(result[1].type, 'Expense');
        assert.strictEqual(result[2].code, 200);
        assert.strictEqual(result[2].name, 'Commission Payable');
        assert.strictEqual(result[2].type, 'Liability');
      })
    });
const assert = require('assert');
    const {cardPayment} = require('../index');
    const {
      Model,
      ChartOfAccounts,
      Cash,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('cardPayment Testing', () => {
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

      it('should verify cardPayment does exist', () => {
        // Sample test
        assert.ok(cardPayment, 'cardPayment should be defined');
      });

      it("should make a deposit to cash",async()=>{
        const coa = new ChartOfAccounts();
        await coa.add("Cash", "Cash");
        const cash = new Cash("Cash");
        await cash.addDebit(date, "Initial cash deposit", 1000.00);
      });

      it("should make a payment on a credit card",async()=>{
        await cardPayment(date, "Payment for office supplies", 317.89);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(row => {
          if (row.account_name === "Cash") {
            switch (row.id) {
              case 1:
                assert.strictEqual(row.debit, 1000);
                assert.strictEqual(row.balance, 1000);
                break;
              case 2:
                assert.strictEqual(row.credit, 317.89);
                assert.strictEqual(row.balance, 682.11);
                break;
            }
          } else if (row.account_name === "Accounts Payable") {
            assert.strictEqual(row.debit, 317.89);
            assert.strictEqual(row.balance, 317.89);
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
            account: 'Cash',
            ref: 2,
            debit: 0,
            credit: 317.89
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Accounts Payable',
            ref: 3,
            debit: 317.89,
            credit: 0
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
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Accounts Payable');
        assert.strictEqual(result[1].type,'Liability');
      })
    });
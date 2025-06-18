const assert = require('assert');
    const {salesViaPaypal} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('salesViaPaypal Testing', () => {
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

      it('should verify salesViaPaypal does exist', () => {
        // Sample test
        assert.ok(salesViaPaypal, 'salesViaPaypal should be defined');
      });

      it("should record a payment from PayPal",async()=>{
        await salesViaPaypal(date,"Sales from PayPal",110.39,3.43);
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '500',
            account_name: 'Sales',
            txdate: date,
            note: 'Sales from PayPal',
            ref: 1,
            debit: 0,
            credit: 113.82000000000001,
            balance: 113.82000000000001,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          },
          {
            id: 2,
            company_id: 0,
            office_id: 0,
            account_code: '100',
            account_name: 'Paypal',
            txdate: date,
            note: 'Sales from PayPal',
            ref: 2,
            debit: 110.39,
            credit: 0,
            balance: 110.39,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          },
          {
            id: 3,
            company_id: 0,
            office_id: 0,
            account_code: '400',
            account_name: 'Bank Fee',
            txdate: date,
            note: 'Paypal fee for: Sales from PayPal',
            ref: 3,
            debit: 3.43,
            credit: 0,
            balance: 3.43,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          }
        ];
        assert.deepStrictEqual(result,expected);
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
            account: 'Sales',
            ref: 1,
            debit: 0,
            credit: 113.82000000000001
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Paypal',
            ref: 2,
            debit: 110.39,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Bank Fee',
            ref: 3,
            debit: 3.43,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 500);
        assert.strictEqual(result[0].name, 'Sales');
        assert.strictEqual(result[0].type, 'Revenue');
        assert.strictEqual(result[1].code, 100);
        assert.strictEqual(result[1].name, 'Paypal');
        assert.strictEqual(result[1].type, 'Bank');
        assert.strictEqual(result[2].code, 400);
        assert.strictEqual(result[2].name, 'Bank Fee');
        assert.strictEqual(result[2].type, 'Expense');
      })
    });
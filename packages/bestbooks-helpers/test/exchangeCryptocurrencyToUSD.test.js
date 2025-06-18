const assert = require('assert');
    const {exchangeCryptocurrencyToUSD} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('exchangeCryptocurrencyToUSD Testing', () => {
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

      it('should verify exchangeCryptocurrencyToUSD does exist', () => {
        // Sample test
        assert.ok(exchangeCryptocurrencyToUSD, 'exchangeCryptocurrencyToUSD should be defined');
      });

      it('should exchange cryptocurrency to USD', async () => {
        await exchangeCryptocurrencyToUSD(date, "Exchange ETH to USD", 10, 1);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '101',
            account_name: 'Cash',
            txdate: date,
            note: 'Exchange ETH to USD',
            ref: 1,
            debit: 10,
            credit: 0,
            balance: 10,
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
            account_name: 'Cryptocurrency',
            txdate: date,
            note: 'Exchange ETH to USD',
            ref: 2,
            debit: 0,
            credit: 10,
            balance: 10,
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
            account_name: 'Transaction Fee',
            txdate: date,
            note: 'fee for Exchange ETH to USD',
            ref: 3,
            debit: 1,
            credit: 0,
            balance: 1,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          },
          {
            id: 4,
            company_id: 0,
            office_id: 0,
            account_code: '101',
            account_name: 'Cash',
            txdate: date,
            note: 'fee for Exchange ETH to USD',
            ref: 4,
            debit: 0,
            credit: 1,
            balance: 9,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          }
        ];
        assert.deepStrictEqual(result, expected);
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
            debit: 10,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cryptocurrency',
            ref: 2,
            debit: 0,
            credit: 10
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Transaction Fee',
            ref: 3,
            debit: 1,
            credit: 0
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 4,
            debit: 0,
            credit: 1
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Cryptocurrency');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 101);
        assert.strictEqual(result[1].name, 'Cash');
        assert.strictEqual(result[1].type, 'Asset');
        assert.strictEqual(result[2].code, 400);
        assert.strictEqual(result[2].name, 'Transaction Fee');
        assert.strictEqual(result[2].type, 'Expense');
      })
    });
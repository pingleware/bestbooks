const assert = require('assert');
    const {softwareLicense} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('softwareLicense Testing', () => {
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

      it('should verify softwareLicense does exist', () => {
        // Sample test
        assert.ok(softwareLicense, 'softwareLicense should be defined');
      });

      it("should receive monies from a software license sale",async()=>{
        await softwareLicense(date,"pingleware.support",100,5,"Cash");
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '100',
            account_name: 'Cash',
            txdate: date,
            note: 'pingleware.support',
            ref: 1,
            debit: 100,
            credit: 0,
            balance: 100,
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
            account_code: '500',
            account_name: 'Sales',
            txdate: date,
            note: 'pingleware.support',
            ref: 2,
            debit: 0,
            credit: 100,
            balance: 100,
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
            account_code: '101',
            account_name: 'Account Receivables',
            txdate: date,
            note: 'pingleware.support',
            ref: 3,
            debit: 0,
            credit: 100,
            balance: 100,
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
            account_code: '400',
            account_name: 'Transaction Fee',
            txdate: date,
            note: 'fee for pingleware.support',
            ref: 4,
            debit: 5,
            credit: 0,
            balance: 5,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          },
          {
            id: 5,
            company_id: 0,
            office_id: 0,
            account_code: '100',
            account_name: 'Cash',
            txdate: date,
            note: 'fee for pingleware.support',
            ref: 5,
            debit: 0,
            credit: 5,
            balance: 95,
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
            account: 'Cash',
            ref: 1,
            debit: 100,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Sales',
            ref: 2,
            debit: 0,
            credit: 100
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Account Receivables',
            ref: 3,
            debit: 0,
            credit: 100
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Transaction Fee',
            ref: 4,
            debit: 5,
            credit: 0
          },
          {
            id: 5,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 5,
            debit: 0,
            credit: 5
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Cash');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 500);
        assert.strictEqual(result[1].name, 'Sales');
        assert.strictEqual(result[1].type, 'Revenue');
        assert.strictEqual(result[2].code, 101);
        assert.strictEqual(result[2].name, 'Account Receivables');
        assert.strictEqual(result[2].type, 'Asset');
        assert.strictEqual(result[3].code, 400);
        assert.strictEqual(result[3].name, 'Transaction Fee');
        assert.strictEqual(result[3].type, 'Expense');
      })
    });
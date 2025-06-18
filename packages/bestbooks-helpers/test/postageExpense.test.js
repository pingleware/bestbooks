const assert = require('assert');
    const {postageExpense} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('postageExpense Testing', () => {
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

      it('should verify postageExpense does exist', () => {
        // Sample test
        assert.ok(postageExpense, 'postageExpense should be defined');
      });

      it("should record the purchase of a book of forever stamps",async()=>{
        await postageExpense(date,"purchase forever stamps book",32.00);
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '400',
            account_name: 'Postage Expense Account',
            txdate: date,
            note: 'purchase forever stamps book',
            ref: 1,
            debit: 32,
            credit: 0,
            balance: 32,
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
            account_name: 'Postage Debit Account',
            txdate: date,
            note: 'purchase forever stamps book',
            ref: 2,
            debit: 0,
            credit: 32,
            balance: 32,
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
            account: 'Postage Expense Account',
            ref: 1,
            debit: 32,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Postage Debit Account',
            ref: 2,
            debit: 0,
            credit: 32
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 400);
        assert.strictEqual(result[0].name, 'Postage Expense Account');
        assert.strictEqual(result[0].type, 'Expense');
        assert.strictEqual(result[1].code, 100);
        assert.strictEqual(result[1].name, 'Postage Debit Account');
        assert.strictEqual(result[1].type, 'Asset');
      })
    });
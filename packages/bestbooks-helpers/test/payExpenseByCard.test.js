const assert = require('assert');
    const {payExpenseByCard} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('payExpenseByCard Testing', () => {
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

      it('should verify payExpenseByCard does exist', () => {
        // Sample test
        assert.ok(payExpenseByCard, 'payExpenseByCard should be defined');
      });

      it('should record that a Company purchases $318 of office supplies and pays with a company credit card',async()=>{
        await payExpenseByCard(date,"office supplies",318,"Office Supplies");
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '200',
            account_name: 'Accounts Payable',
            txdate: date,
            note: 'office supplies',
            ref: 1,
            debit: 0,
            credit: 318,
            balance: 318,
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
            account_code: '400',
            account_name: 'Office Supplies',
            txdate: date,
            note: 'office supplies',
            ref: 2,
            debit: 318,
            credit: 0,
            balance: 318,
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
            account: 'Accounts Payable',
            ref: 1,
            debit: 0,
            credit: 318
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Office Supplies',
            ref: 2,
            debit: 318,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 400);
        assert.strictEqual(result[0].name, 'Office Supplies');
        assert.strictEqual(result[0].type, 'Expense');
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Accounts Payable');
        assert.strictEqual(result[1].type, 'Liability');
      })
    });
const assert = require('assert');
    const {isJournalInbalance} = require('../index');
    const {
      Model,
      Cash,
      Expense,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('isJournalInbalance Testing', () => {
      let model, date, dateString, cash, expense;

      before(async()=>{
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        model = new Model();
        cash = new Cash("Cash");
        expense = new Expense("Expense");
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

      it('should verify isJournalInbalance does exist', () => {
        // Sample test
        assert.ok(isJournalInbalance, 'isJournalInbalance should be defined');
      });

      it('should check if journal is in balance', async () => {
        await cash.addDebit(date, "Test Journal Entry", 1000);
        await expense.addCredit(date, "Test Journal Entry", 1000);
        // Call the isJournalInbalance function
        const result = await isJournalInbalance();
        assert.strictEqual(result, true, 'Journal should be in balance');
      });

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
            note: 'Test Journal Entry',
            ref: 1,
            debit: 1000,
            credit: 0,
            balance: 1000,
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
            account_name: 'Expense',
            txdate: date,
            note: 'Test Journal Entry',
            ref: 2,
            debit: 0,
            credit: 1000,
            balance: 1000,
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
            account: 'Expense',
            ref: 2,
            debit: 0,
            credit: 1000
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Cash');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 400);
        assert.strictEqual(result[1].name, 'Expense');
        assert.strictEqual(result[1].type, 'Expense');
      })
    });
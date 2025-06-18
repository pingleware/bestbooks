const assert = require('assert');
    const {spendFundingAccount} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('spendFundingAccount Testing', () => {
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

      it('should verify spendFundingAccount does exist', () => {
        // Sample test
        assert.ok(spendFundingAccount, 'spendFundingAccount should be defined');
      });

      it("should allocation $100,000 for Real Estate investment",async()=>{
        await spendFundingAccount(date,"Real Estate investment",100000);
      })

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '900',
            account_name: 'AccountPayable',
            txdate: date,
            note: 'Real Estate investment',
            ref: 1,
            debit: 0,
            credit: 100000,
            balance: 100000,
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
            account_code: '300',
            account_name: 'FundingAllocation',
            txdate: date,
            note: 'Real Estate investment',
            ref: 2,
            debit: 100000,
            credit: 0,
            balance: 100000,
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
            account_name: 'ApprovalRequest',
            txdate: date,
            note: 'Real Estate investment',
            ref: 3,
            debit: 100000,
            credit: 0,
            balance: 100000,
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
            account: 'AccountPayable',
            ref: 1,
            debit: 0,
            credit: 100000
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'FundingAllocation',
            ref: 2,
            debit: 100000,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'ApprovalRequest',
            ref: 3,
            debit: 100000,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 900);
        assert.strictEqual(result[0].name, 'AccountPayable');
        assert.strictEqual(result[0].type, 'AccountPayable');
        assert.strictEqual(result[1].code, 300);
        assert.strictEqual(result[1].name, 'FundingAllocation');
        assert.strictEqual(result[1].type, 'Equity');
        assert.strictEqual(result[2].code, 400);
        assert.strictEqual(result[2].name, 'ApprovalRequest');
        assert.strictEqual(result[2].type, 'Expense');
      })
    });
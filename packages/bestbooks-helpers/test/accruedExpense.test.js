const assert = require('assert');
    const {accruedExpense} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('accruedExpense Testing', () => {
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

      it('should verify accruedExpense does exist', () => {
        // Sample test
        assert.ok(accruedExpense, 'accruedExpense should be defined');
      });

      it("should add an accrued expense for COX business internet with static IP",async()=>{
        await accruedExpense("Internet","COX",date,"Business class internet with static IP",190.00);
      })

      it("should show ledger table contents",async()=>{
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '100',
            account_name: 'Internet',
            txdate: date,
            note: 'Business class internet with static IP',
            ref: 1,
            debit: 190,
            credit: 0,
            balance: 190,
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
            account_code: '200',
            account_name: 'COX',
            txdate: date,
            note: 'Business class internet with static IP',
            ref: 2,
            debit: 0,
            credit: 190,
            balance: 190,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          }
        ];
        const result = await model.querySync("SELECT * FROM ledger");
        assert.deepStrictEqual(result,expected);
      })

      it("should show the journal table contents",async()=>{
        const expected = [
          {
            id: 1,
            location_id: null,
            name: 'General',
            company_id: 0,
            office_id: 0,
            txdate: date,
            account: 'Internet',
            ref: 1,
            debit: 190,
            credit: 0
          },
          {
            id: 2,
            location_id: null,
            name: 'General',
            company_id: 0,
            office_id: 0,
            txdate: date,
            account: 'COX',
            ref: 2,
            debit: 0,
            credit: 190
          }
        ];
        const result = await model.querySync("SELECT * FROM journal");
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        const expected = [
          {
            id: 1,
            created: result[0].created,
            company_id: null,
            code: 100,
            name: 'Internet',
            type: 'Asset',
            base_type: 'Asset',
            Description: null,
            Bal01: null,
            Bal02: null,
            Bal03: null,
            Bal04: null,
            Bal05: null,
            Bal06: null,
            Bal07: null,
            Bal08: null,
            Bal09: null,
            Bal10: null,
            Bal11: null,
            Bal12: null,
            Bal13: null,
            Bal14: null,
            Bal15: null,
            Bal16: null,
            Bal17: null,
            Bal18: null,
            Bal19: null,
            Bal20: null,
            Bal21: null,
            Bal22: null,
            Bal23: null,
            Bal24: null,
            Bud01: null,
            Bud02: null,
            Bud03: null,
            Bud04: null,
            Bud05: null,
            Bud06: null,
            Bud07: null,
            Bud08: null,
            Bud09: null,
            Bud10: null,
            Bud11: null,
            Bud12: null,
            Bud13: null,
            Bud14: null,
            Bud15: null,
            Bud16: null,
            Bud17: null,
            Bud18: null,
            Bud19: null,
            Bud20: null,
            Bud21: null,
            Bud22: null,
            Bud23: null,
            Bud24: null,
            Budget: null
          },
          {
            id: 2,
            created: result[1].created,
            company_id: null,
            code: 200,
            name: 'COX',
            type: 'Liability',
            base_type: 'Liability',
            Description: null,
            Bal01: null,
            Bal02: null,
            Bal03: null,
            Bal04: null,
            Bal05: null,
            Bal06: null,
            Bal07: null,
            Bal08: null,
            Bal09: null,
            Bal10: null,
            Bal11: null,
            Bal12: null,
            Bal13: null,
            Bal14: null,
            Bal15: null,
            Bal16: null,
            Bal17: null,
            Bal18: null,
            Bal19: null,
            Bal20: null,
            Bal21: null,
            Bal22: null,
            Bal23: null,
            Bal24: null,
            Bud01: null,
            Bud02: null,
            Bud03: null,
            Bud04: null,
            Bud05: null,
            Bud06: null,
            Bud07: null,
            Bud08: null,
            Bud09: null,
            Bud10: null,
            Bud11: null,
            Bud12: null,
            Bud13: null,
            Bud14: null,
            Bud15: null,
            Bud16: null,
            Bud17: null,
            Bud18: null,
            Bud19: null,
            Bud20: null,
            Bud21: null,
            Bud22: null,
            Bud23: null,
            Bud24: null,
            Budget: null
          }
        ];
        assert.deepStrictEqual(result,expected);
      })
    });
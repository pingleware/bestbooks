const assert = require('assert');
    const {bondPremiumInterestPayment} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('bondPremiumInterestPayment Testing', () => {
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

      it('should verify bondPremiumInterestPayment does exist', () => {
        // Sample test
        assert.ok(bondPremiumInterestPayment, 'bondPremiumInterestPayment should be defined');
      });

      // TODO: insert specific test case for the helper function below
      it('should process bond premium interest payment correctly',async () => {
        const faceValue = 100000;
        const statedRate = 9; // 9%
        const interestPeriods = 6; // 6 months of interest

        const amount = Number(faceValue) * Number(statedRate / 100) * Number(interestPeriods / 12); // assuming interest is annual and txdate is monthly

        await bondPremiumInterestPayment(date, "Bond Premium Interest Payment", amount);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '400',
            account_name: 'Interest Expense',
            txdate: date,
            note: 'Bond Premium Interest Payment',
            ref: 1,
            debit: 4500,
            credit: 0,
            balance: 4500,
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
            account_name: 'Interest Payable',
            txdate: date,
            note: 'Bond Premium Interest Payment',
            ref: 2,
            debit: 0,
            credit: 4500,
            balance: 4500,
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
            account: 'Interest Expense',
            ref: 1,
            debit: 4500,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Interest Payable',
            ref: 2,
            debit: 0,
            credit: 4500
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 400);
        assert.strictEqual(result[0].name, 'Interest Expense');
        assert.strictEqual(result[0].type, 'Expense');
        assert.strictEqual(result[1].code, 200);
        assert.strictEqual(result[1].name, 'Interest Payable');
        assert.strictEqual(result[1].type, 'Liability');
      })
    });
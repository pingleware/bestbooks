const assert = require('assert');
    const {bondsIssuedWithAccruedInterest} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('bondsIssuedWithAccruedInterest Testing', () => {
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

      it('should verify bondsIssuedWithAccruedInterest does exist', () => {
        // Sample test
        assert.ok(bondsIssuedWithAccruedInterest, 'bondsIssuedWithAccruedInterest should be defined');
      });

      it('should process bonds issued with accrued interest correctly',async () => {
        const faceValue = 100000;
        const interestRate = 9; // 9%
        const monthsPaidInterest = 3; // 3 months of interest

        await bondsIssuedWithAccruedInterest(date, `Bonds Issued with ${monthsPaidInterest} months of Accrued Interest`, faceValue, interestRate, monthsPaidInterest);
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
            note: 'Bonds Issued with 3 months of Accrued Interest',
            ref: 1,
            debit: 102250,
            credit: 0,
            balance: 102250,
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
            account_name: 'Bonds Payable',
            txdate: date,
            note: 'Bonds Issued with 3 months of Accrued Interest',
            ref: 2,
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
            id: 3,
            company_id: 0,
            office_id: 0,
            account_code: '201',
            account_name: 'Interest Payable',
            txdate: date,
            note: 'Bonds Issued with 3 months of Accrued Interest',
            ref: 3,
            debit: 0,
            credit: 2250,
            balance: 2250,
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
            debit: 102250,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Bonds Payable',
            ref: 2,
            debit: 0,
            credit: 100000
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Interest Payable',
            ref: 3,
            debit: 0,
            credit: 2250
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 200);
        assert.strictEqual(result[0].name, 'Bonds Payable');
        assert.strictEqual(result[0].type,'Liability');
        assert.strictEqual(result[1].code, 201);
        assert.strictEqual(result[1].name, 'Interest Payable');
        assert.strictEqual(result[1].type,'Liability');
        assert.strictEqual(result[2].code, 100);
        assert.strictEqual(result[2].name, 'Cash');
        assert.strictEqual(result[2].type,'Cash');
      })
    });
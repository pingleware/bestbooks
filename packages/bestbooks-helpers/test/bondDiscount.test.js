const assert = require('assert');
    const {bondDiscount} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('bondDiscount Testing', () => {
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

      it('should verify bondDiscount does exist', () => {
        // Sample test
        assert.ok(bondDiscount, 'bondDiscount should be defined');
      });

      it('should calculate bond discount correctly', () => {
        const faceValue = 100000;
        const bondRate = 9; // 9%
        const marketRate = 10; // 10%
        const yearsToMaturity = 5;
        const maturityDate = new Date();
        maturityDate.setFullYear(maturityDate.getFullYear() + yearsToMaturity);

        bondDiscount(date, "New Bond Issue", faceValue, bondRate, marketRate, maturityDate);
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
            note: 'New Bond Issue',
            ref: 1,
            debit: 96139,
            credit: 0,
            balance: 96139,
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
            note: 'New Bond Issue',
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
            account_name: 'Bond Discount',
            txdate: date,
            note: 'New Bond Issue',
            ref: 3,
            debit: 3861,
            credit: 0,
            balance: 3861,
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
            debit: 96139,
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
            account: 'Bond Discount',
            ref: 3,
            debit: 3861,
            credit: 0
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
        assert.strictEqual(result[1].name, 'Bond Discount');
        assert.strictEqual(result[1].type,'ContraLiability');
        assert.strictEqual(result[2].code, 100);
        assert.strictEqual(result[2].name, 'Cash');
        assert.strictEqual(result[2].type,'Cash');
      })
    });
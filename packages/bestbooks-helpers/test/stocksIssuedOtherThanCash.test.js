const assert = require('assert');
    const {stocksIssuedOtherThanCash} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('stocksIssuedOtherThanCash Testing', () => {
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

      it('should verify stocksIssuedOtherThanCash does exist', () => {
        // Sample test
        assert.ok(stocksIssuedOtherThanCash, 'stocksIssuedOtherThanCash should be defined');
      });

      it("should issue shares for a UCC Claim",async()=>{
        await stocksIssuedOtherThanCash(date,"shares exchanged for UCC claim",100000,"UCC Claim",20000,"Preferred Stock",5);
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
            account_name: 'UCC Claim',
            txdate: date,
            note: 'shares exchanged for UCC claim',
            ref: 1,
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
            id: 2,
            company_id: 0,
            office_id: 0,
            account_code: '300',
            account_name: 'Preferred Stock',
            txdate: date,
            note: 'shares exchanged for UCC claim',
            ref: 2,
            debit: 0,
            credit: 100000,
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
            account: 'UCC Claim',
            ref: 1,
            debit: 100000,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Preferred Stock',
            ref: 2,
            debit: 0,
            credit: 100000
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'UCC Claim');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 300);
        assert.strictEqual(result[1].name, 'Preferred Stock');
        assert.strictEqual(result[1].type, 'Equity');
      })
    });
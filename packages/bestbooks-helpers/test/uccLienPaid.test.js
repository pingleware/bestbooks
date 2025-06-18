const assert = require('assert');
    const {uccLienPaid} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('uccLienPaid Testing', () => {
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

      it('should verify uccLienPaid does exist', () => {
        // Sample test
        assert.ok(uccLienPaid, 'uccLienPaid should be defined');
      });

      it("should apply a payment to a UCC lien",async()=>{
        await uccLienPaid(date,"payment",10000,Number(106770 * 0.18) / 12,"Account Receivable","202401879224");
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
            account_name: 'Account Receivable',
            txdate: date,
            note: 'payment UCC Lien No: 202401879224',
            ref: 1,
            debit: 0,
            credit: 10000,
            balance: 10000,
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
            account_code: '102',
            account_name: 'Interest Receivable',
            txdate: date,
            note: 'payment UCC Lien No: 202401879224',
            ref: 2,
            debit: 0,
            credit: 1601.55,
            balance: 1601.55,
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
            account_name: 'Cash',
            txdate: date,
            note: 'payment UCC Lien No: 202401879224',
            ref: 3,
            debit: 10000,
            credit: 0,
            balance: 10000,
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
            account: 'Account Receivable',
            ref: 1,
            debit: 0,
            credit: 10000
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Interest Receivable',
            ref: 2,
            debit: 0,
            credit: 1601.55
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 3,
            debit: 10000,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Account Receivable');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 101);
        assert.strictEqual(result[1].name, 'Cash');
        assert.strictEqual(result[1].type, 'Asset');
        assert.strictEqual(result[2].code, 102);
        assert.strictEqual(result[2].name, 'Interest Receivable');
        assert.strictEqual(result[2].type, 'Asset');
      })
    });
const assert = require('assert');
    const {uccLienNew} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('uccLienNew Testing', () => {
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

      it('should verify uccLienNew does exist', () => {
        // Sample test
        assert.ok(uccLienNew, 'uccLienNew should be defined');
      });

      it("should create a new UCC lien", async () => {
        await uccLienNew(date, "Lyft lien for wrongful vehicle deactivation", 106770, "202401879224");
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            company_id: 0,
            office_id: 0,
            account_code: '500',
            account_name: 'Revenue',
            txdate: date,
            note: 'Lyft lien for wrongful vehicle deactivation UCC Lien No: 202401879224',
            ref: 1,
            debit: 106770,
            credit: 0,
            balance: 106770,
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
            account_name: 'Account Receivables',
            txdate: date,
            note: 'Lyft lien for wrongful vehicle deactivation UCC Lien No: 202401879224',
            ref: 2,
            debit: 106770,
            credit: 0,
            balance: 106770,
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
            account_name: 'Bad Debt Expense',
            txdate: date,
            note: 'Lyft lien for wrongful vehicle deactivation UCC Lien No: 202401879224',
            ref: 3,
            debit: 106770,
            credit: 0,
            balance: 106770,
            action: 'Record',
            performed_by: 0,
            location: 0,
            due_date: 0,
            transaction_type: 'Operating'
          },
          {
            id: 4,
            company_id: 0,
            office_id: 0,
            account_code: '101',
            account_name: 'Allowance for Doubtful Accounts',
            txdate: date,
            note: 'Lyft lien for wrongful vehicle deactivation UCC Lien No: 202401879224',
            ref: 4,
            debit: 0,
            credit: 106770,
            balance: 106770,
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
            account: 'Revenue',
            ref: 1,
            debit: 106770,
            credit: 0
          },
          {
            id: 2,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Account Receivables',
            ref: 2,
            debit: 106770,
            credit: 0
          },
          {
            id: 3,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Bad Debt Expense',
            ref: 3,
            debit: 106770,
            credit: 0
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Allowance for Doubtful Accounts',
            ref: 4,
            debit: 0,
            credit: 106770
          }
        ];
        assert.deepStrictEqual(result,expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);        
        assert.strictEqual(result[0].code, 100);
        assert.strictEqual(result[0].name, 'Account Receivables');
        assert.strictEqual(result[0].type, 'Asset');
        assert.strictEqual(result[1].code, 500);
        assert.strictEqual(result[1].name, 'Revenue');
        assert.strictEqual(result[1].type, 'Revenue');
        assert.strictEqual(result[2].code, 400);
        assert.strictEqual(result[2].name, 'Bad Debt Expense');
        assert.strictEqual(result[2].type, 'Expense');
        assert.strictEqual(result[3].code, 101);
        assert.strictEqual(result[3].name, 'Allowance for Doubtful Accounts');
        assert.strictEqual(result[3].type, 'ContraAsset');
      })
    });
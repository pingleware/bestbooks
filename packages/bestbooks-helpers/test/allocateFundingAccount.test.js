const assert = require('assert');
    const {
      allocateFundingAccount,
      spendFundingAccount,
    } = require('../index');
    const {
      Cash,
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('allocateFundingAccount Testing', () => {
      let model, date, dateString, cash;

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

      it('should verify allocateFundingAccount does exist', () => {
        // Sample test
        assert.ok(allocateFundingAccount, 'allocateFundingAccount should be defined');
      });

      it("should allocate $1000 funding account", async () => {
        await allocateFundingAccount(date, "Funding Account", 1000);
      });

      it("should spend approved funds from the funding account", async () => {
        await spendFundingAccount(date, "Approved Expense", 500);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(transaction => {
          assert.strictEqual(transaction.company_id, 0);
          assert.strictEqual(transaction.office_id, 0);
          assert.strictEqual(transaction.action, 'Record');
          assert.strictEqual(transaction.performed_by, 0);
          assert.strictEqual(transaction.location, 0);
          assert.strictEqual(transaction.due_date, 0);
          assert.strictEqual(transaction.transaction_type, 'Operating');
          if (transaction.account === 'Cash') {
            assert.strictEqual(transaction.debit, 1000);
          } else if (transaction.account === 'FundingAllocation') {
            assert.strictEqual(transaction.credit, 1000);
          } else if (transaction.account === 'ApprovalRequest') {
            if (transaction.ref === 6) {
              assert.strictEqual(transaction.debit, 500);
            } else {
              assert.strictEqual(transaction.debit, 0);
            }
            assert.strictEqual(transaction.credit, 0);
          } else if (transaction.account === 'AccountPayable') {
            assert.strictEqual(transaction.debit, 0);
            assert.strictEqual(transaction.credit, 500);
          } else if (transaction.account === 'FundingAllocation') {
            assert.strictEqual(transaction.debit, 500);
          }
        });
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
            account: 'FundingAllocation',
            ref: 2,
            debit: 0,
            credit: 1000
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
            debit: 0,
            credit: 0
          },
          {
            id: 4,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'AccountPayable',
            ref: 4,
            debit: 0,
            credit: 500
          },
          {
            id: 5,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'FundingAllocation',
            ref: 5,
            debit: 500,
            credit: 0
          },
          {
            id: 6,
            name: 'General',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'ApprovalRequest',
            ref: 6,
            debit: 500,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result, expected);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        result.forEach(account => {
          if (account.name === 'Cash') {
            assert.strictEqual(account.code, 100);
          } else if (account.name === 'FundingAllocation') {
            assert.strictEqual(account.code, 300);
          } else if (account.name === 'ApprovalRequest') {
            assert.strictEqual(account.code, 400);
          } else if (account.name === 'AccountPayable') {
            assert.strictEqual(account.code, 900);
          }
        });
      })
    });
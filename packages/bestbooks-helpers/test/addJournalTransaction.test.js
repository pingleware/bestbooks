const assert = require('assert');
    const {addJournalTransaction} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('addJournalTransaction Testing', () => {
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

      it('should verify addJournalTransaction does exist', () => {
        // Sample test
        assert.ok(addJournalTransaction, 'addJournalTransaction should be defined');
      });

      // TODO: insert specific test case for the helper function below
      it('should add a journal transaction', async () => {
        const transaction = {
          date: date,
          description: 'Test Transaction',
          entries: [
            { account: 'Cash', debit: 100, credit: 0 },
            { account: 'Revenue', debit: 0, credit: 100 }
          ]
        };

        const journal_name = "Test Journal";
        
        await addJournalTransaction(
          journal_name, 
          transaction.date, 
          0, 
          transaction.entries[0].debit,
          transaction.entries[1].credit,
          0,
          0);
      });

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        assert.equal(result[0].name,'Test Journal',`${result[0].name} should be equal to 'Test Journal'`);
        assert.equal(result[0].debit,100,`${result[0].name} should have a debit entry of 100`);
        assert.equal(result[0].credit,100,`${result[0].name} should have a credit entry of 100`);
      })
    });
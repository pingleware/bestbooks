const assert = require('assert');
    const {editJournalTransaction} = require('../index');
    const {
      Model,
      Journal,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('editJournalTransaction Testing', () => {
      let model, date, dateString, id;

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

      it('should verify editJournalTransaction does exist', () => {
        // Sample test
        assert.ok(editJournalTransaction, 'editJournalTransaction should be defined');
      });

      // TODO: insert specific test case for the helper function below
      it("should create a journal entry",async()=>{
        const journal = new Journal("general");
        id = await journal.add(date,1,"Cash","Bank",1000,0);
        assert.strictEqual(id == 1, true, "Journal entry should be created with ID 1");
      });

      it("should edit a journal entry",async()=>{
        await editJournalTransaction(id,"Cash",date,1,1010,0);
      });


      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        const expected = [
          {
            id: 1,
            name: 'general',
            company_id: 0,
            office_id: 0,
            location_id: null,
            txdate: date,
            account: 'Cash',
            ref: 1,
            debit: 1010,
            credit: 0
          }
        ];
        assert.deepStrictEqual(result, expected);
      })
    });
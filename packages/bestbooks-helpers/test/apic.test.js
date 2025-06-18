const assert = require('assert');
    const {apic} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('apic Testing', () => {
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

      it('should verify apic does exist', () => {
        // Sample test
        assert.ok(apic, 'apic should be defined');
      });

      it("should record APIC for 500 shares at $10 each with par value of $5", async () => {
        await apic(date, "Additional Shares above par value", 10, 500, 5);
      });

      it("should record for an additional 1000 shares at par value", async () => {
        await apic(date, "Additional Shares at par value", 5, 1000);
      });

      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        result.forEach(transaction => {
          if (transaction.note === "Additional Shares above par value") {
            if (transaction.account_name === "Cash") {
              assert.strictEqual(transaction.debit, 5000);
            } else if (transaction.account_name === "Common Stock (Par Value)") {
              assert.strictEqual(transaction.credit, 2500);
            } else if (transaction.account_name === "APIC") {
              assert.strictEqual(transaction.credit, 2500);
            }            
          } else if (transaction.note === "Additional Shares at par value") {
            if (transaction.account_name === "Cash") {
              assert.strictEqual(transaction.debit, 5000);
            } else if (transaction.account_name === "ShareholderCapital") {
              assert.strictEqual(transaction.credit, 5000);
            }
          }
        });
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
      })
    });
const assert = require('assert');

describe('bestbooks-api Testing', () => {
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
      })
      
})
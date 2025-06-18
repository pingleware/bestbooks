const assert = require('assert');
const {
  accountsReceivablePayment
} = require('../index');
const {
  Model,
  Asset,
} = require("@pingleware/bestbooks-core");0

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
describe('accountsReceivablePayment Testing', () => {
  let model, date, dateString, cash, accountReceivables;

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

  it('should verify accountsReceivablePayment does exist', () => {
    // Sample test
    assert.ok(accountsReceivablePayment, 'accountsReceivablePayment should be defined');
  });

  it("shouold create the Cash account",async()=>{
    cash = new Asset("Cash","Cash","Asset");
  })

  it("should create the Account Receivables account",async()=>{
    accountReceivables = new Asset("Account Receivable","Asset","Asset");
  })

  it("should Company Receives Payment on an Invoice",async()=>{
    await accountsReceivablePayment(date,"Receive payment on invoice",650.00);
  })

  it("should show ledger contents",async()=>{
    const expected = [
    {
      id: 1,
      company_id: 0,
      office_id: 0,
      account_code: '100',
      account_name: 'Cash',
      txdate: date,
      note: 'Receive payment on invoice',
      ref: 1,
      debit: 650,
      credit: 0,
      balance: 650,
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
      account_code: '101',
      account_name: 'Account Receivable',
      txdate: date,
      note: 'Receive payment on invoice',
      ref: 2,
      debit: 0,
      credit: 650,
      balance: 650,
      action: 'Record',
      performed_by: 0,
      location: 0,
      due_date: 0,
      transaction_type: 'Operating'
    }
  ];
    const result = await model.querySync("SELECT * FROM ledger");
    assert.deepStrictEqual(result, expected);
  })

  it("should show the jounral table contents",async()=>{
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
        debit: 650,
        credit: 0
      },
      {
        id: 2,
        name: 'General',
        company_id: 0,
        office_id: 0,
        location_id: null,
        txdate: date,
        account: 'Account Receivable',
        ref: 2,
        debit: 0,
        credit: 650
      }
    ];
    const result = await model.querySync("SELECT * FROM journal");
    assert.deepStrictEqual(result, expected);
  })

  it("should show the accounts table contents",async()=>{
    const result = await model.querySync("SELECT * FROM accounts");
    const expected = [
      {
        id: 1,
        created: result[0].created,
        company_id: null,
        code: 100,
        name: 'Cash',
        type: 'Cash',
        base_type: 'Asset',
        Description: null,
        Bal01: null,
        Bal02: null,
        Bal03: null,
        Bal04: null,
        Bal05: null,
        Bal06: null,
        Bal07: null,
        Bal08: null,
        Bal09: null,
        Bal10: null,
        Bal11: null,
        Bal12: null,
        Bal13: null,
        Bal14: null,
        Bal15: null,
        Bal16: null,
        Bal17: null,
        Bal18: null,
        Bal19: null,
        Bal20: null,
        Bal21: null,
        Bal22: null,
        Bal23: null,
        Bal24: null,
        Bud01: null,
        Bud02: null,
        Bud03: null,
        Bud04: null,
        Bud05: null,
        Bud06: null,
        Bud07: null,
        Bud08: null,
        Bud09: null,
        Bud10: null,
        Bud11: null,
        Bud12: null,
        Bud13: null,
        Bud14: null,
        Bud15: null,
        Bud16: null,
        Bud17: null,
        Bud18: null,
        Bud19: null,
        Bud20: null,
        Bud21: null,
        Bud22: null,
        Bud23: null,
        Bud24: null,
        Budget: null
      },
      {
        id: 2,
        created: result[1].created,
        company_id: null,
        code: 101,
        name: 'Account Receivable',
        type: 'Asset',
        base_type: 'Asset',
        Description: null,
        Bal01: null,
        Bal02: null,
        Bal03: null,
        Bal04: null,
        Bal05: null,
        Bal06: null,
        Bal07: null,
        Bal08: null,
        Bal09: null,
        Bal10: null,
        Bal11: null,
        Bal12: null,
        Bal13: null,
        Bal14: null,
        Bal15: null,
        Bal16: null,
        Bal17: null,
        Bal18: null,
        Bal19: null,
        Bal20: null,
        Bal21: null,
        Bal22: null,
        Bal23: null,
        Bal24: null,
        Bud01: null,
        Bud02: null,
        Bud03: null,
        Bud04: null,
        Bud05: null,
        Bud06: null,
        Bud07: null,
        Bud08: null,
        Bud09: null,
        Bud10: null,
        Bud11: null,
        Bud12: null,
        Bud13: null,
        Bud14: null,
        Bud15: null,
        Bud16: null,
        Bud17: null,
        Bud18: null,
        Bud19: null,
        Bud20: null,
        Bud21: null,
        Bud22: null,
        Bud23: null,
        Bud24: null,
        Budget: null
      }
    ];
    assert.deepStrictEqual(result, expected);
  })
});
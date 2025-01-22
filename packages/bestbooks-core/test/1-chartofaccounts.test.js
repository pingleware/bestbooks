const assert = require('assert');
const {
  ChartOfAccounts,
  Cash
 } = require('../index');

describe('ChartOfAccounts', function() {
  let chart;
  let model;

  before(function() {
    chart = new ChartOfAccounts();
    model = chart.model;
  });

  after(async function() {
    await model.insertSync(`DELETE FROM accounts;`);
    await model.insertSync(`DELETE FROM ledger;`);
    await model.insertSync(`DELETE FROM ledger_audit;`);
    await model.insertSync(`DELETE FROM journal`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
  });

  it('should add a new account', async function() {
    const accountName = 'Cash';
    const accountType = 'Asset';
    const baseType = accountType;

    // No need to re-stub insertSync as it's already stubbed in beforeEach

    const result = await chart.add(accountName, accountType, baseType);
    assert.equal(result, 1);
  });

  it('should increase the balance for $100 deposit', async function(){
    const accountName = 'Cash';
    const cash = new Cash(accountName);
    await cash.addDebit("2024-10-28","Deposit",100.0);
    const balance = await cash.getBalance();
    assert.equal(balance,100);
  })

  it('should return true when account is in use', async function() {
    const accountName = 'Cash';

    const inUse = await chart.in_use_sync(accountName);
    assert.equal(inUse, true, 'Account in_use check failed');
  });

  it('should return the correct list of accounts', async function() {    
    const accounts = await chart.getListSync();
    assert(Array.isArray(accounts), 'Returned result is not an array');
    assert.equal(accounts[0].name, 'Cash', 'Account name is incorrect');
  });

  it('should return the correct account type code', function() {
    const result = chart.getAccountTypeCode('Asset');
    assert.deepEqual(result, ['Asset', 100], 'Account type code is incorrect');
  });

  it('should remove an account', async function() {
    const accountName = 'Cash';
    
    const result = await chart.remove(accountName);
    assert.notEqual(result, null, 'remove method returned null');
    assert.equal(result, `${accountName} removed from accounts successfully`, 'Account was not removed correctly');
  });

  it("should retrieve the audit log",async() => {
    const rows = await model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
            a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
            a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
            a.change_date, a.changed_by, a.action
        FROM ledger_audit a
        JOIN ledger l ON a.ledger_id = l.id
        ORDER BY a.change_date DESC;`);

    const expected = [
      {
        txdate: '2024-10-28',
        account_code: '100',
        account_name: 'Cash',
        debit: 100,
        credit: 0,
        balance: 100,
        old_account_code: '100',
        old_debit: 100,
        old_credit: 0,
        old_balance: 100,
        new_account_code: '100',
        new_debit: 100,
        new_credit: 0,
        new_balance: 100,
        change_date: rows[0].change_date,
        changed_by: 0,
        action: 'Update'
      }
    ];
    assert.deepStrictEqual(rows, expected);
  });
});

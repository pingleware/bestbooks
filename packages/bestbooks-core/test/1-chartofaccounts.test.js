const assert = require('assert');
const sinon = require('sinon');
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
    await model.insertSync(`DELETE FROM journal`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
    await model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
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
});

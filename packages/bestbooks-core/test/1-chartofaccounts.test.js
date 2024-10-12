/**
 * Breakdown:
 * 
 * 1. Setup and Teardown:
 *      - beforeEach and afterEach are used to initialize ChartOfAccounts and 
 *          reset stubs using sinon.
 * 2. Tests:
 *      - Table Creation: Verifies the createTable method is called during initialization.
 *      - Adding an Account: Tests the add method, checking if the SQL query is correctly 
 *          generated and executed.
 *      - Removing an Account: Tests the remove method to ensure the account is properly deleted.
 *      - Account In Use: Both true and false cases for the in_use_sync method.
 *      - Fetching Accounts: Tests the getListSync method to verify it returns an array of accounts.
 *      - Account Type Code: Verifies that the getAccountTypeCode method returns the correct 
 *          account type and code for different types.
 * 
 * This test suite uses sinon to stub database interactions, isolating the logic of the class.
 * 
 * Key Changes:
 *      - No re-stubbing of insertSync in the should add a new account test since it's already 
 *          stubbed in the beforeEach block.
 *      - Assertions are directly made using the existing stub for insertSync created in beforeEach.
 */
const assert = require('assert');
const sinon = require('sinon');
const ChartOfAccounts = require('../chartOfAccounts');

describe('ChartOfAccounts', function() {
  let chart;
  let modelStub;

  beforeEach(function() {
    chart = new ChartOfAccounts();
    modelStub = sinon.stub(chart.model, 'querySync').resolves([]);
    sinon.stub(chart.model, 'insertSync').resolves({});
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should create the accounts table on initialization', async function() {
    // Wait for the constructor to fully initialize
    await chart.createTable();

    assert(modelStub.calledOnce, 'createTable was not called');

    // Simplified expected SQL to focus on key parts
    const expectedSQL = `
    CREATE TABLE IF NOT EXISTS "accounts" (
        "id" INTEGER,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "company_id" INTEGER,
        "code" INTEGER,
        "name" TEXT UNIQUE,
        "type" TEXT,
        "base_type" TEXT,
        "Description" TEXT,
        "Bal01" NUMERIC,
        "Bal02" NUMERIC,
        "Bal03" NUMERIC,
        "Bal04" NUMERIC,
        "Bal05" NUMERIC,
        "Bal06" NUMERIC,
        "Bal07" NUMERIC,
        "Bal08" NUMERIC,
        "Bal09" NUMERIC,
        "Bal10" NUMERIC,
        "Bal11" NUMERIC,
        "Bal12" NUMERIC,
        "Bal13" NUMERIC,
        "Bal14" NUMERIC,
        "Bal15" NUMERIC,
        "Bal16" NUMERIC,
        "Bal17" NUMERIC,
        "Bal18" NUMERIC,
        "Bal19" NUMERIC,
        "Bal20" NUMERIC,
        "Bal21" NUMERIC,
        "Bal22" NUMERIC,
        "Bal23" NUMERIC,
        "Bal24" NUMERIC,
        "Bud01" NUMERIC,
        "Bud02" NUMERIC,
        "Bud03" NUMERIC,
        "Bud04" NUMERIC,
        "Bud05" NUMERIC,
        "Bud06" NUMERIC,
        "Bud07" NUMERIC,
        "Bud08" NUMERIC,
        "Bud09" NUMERIC,
        "Bud10" NUMERIC,
        "Bud11" NUMERIC,
        "Bud12" NUMERIC,
        "Bud13" NUMERIC,
        "Bud14" NUMERIC,
        "Bud15" NUMERIC,
        "Bud16" NUMERIC,
        "Bud17" NUMERIC,
        "Bud18" NUMERIC,
        "Bud19" NUMERIC,
        "Bud20" NUMERIC,
        "Bud21" NUMERIC,
        "Bud22" NUMERIC,
        "Bud23" NUMERIC,
        "Bud24" NUMERIC,
        "Budget" NUMERIC,
        PRIMARY KEY("id")
    );`;

    // Normalize both SQL queries for comparison (remove whitespace and line breaks)
    const actualSQL = modelStub.firstCall.args[0].replace(/\s+/g, ' ').trim();
    const normalizedExpectedSQL = expectedSQL.replace(/\s+/g, ' ').trim();

    assert.equal(actualSQL, normalizedExpectedSQL, 'SQL query for creating accounts table was incorrect');    
  });

  it('should add a new account', async function() {
    const accountName = 'Cash';
    const accountType = 'Asset';

    // No need to re-stub insertSync as it's already stubbed in beforeEach

    const result = await chart.add(accountName, accountType);
    assert.notEqual(result, null, 'add method returned null'); // Assert that the result is not null
    assert(chart.model.insertSync.calledOnce, 'Account was not inserted');
    const expectedSQL = `INSERT OR IGNORE INTO accounts (company_id,code,name,type,base_type) VALUES (0,(SELECT count(id)+100 AS code FROM accounts WHERE base_type='Asset'),'${accountName}','${accountType}','Asset');`
    assert(chart.model.insertSync.calledWith(expectedSQL), 'SQL query for inserting account was incorrect');
  });

  it('should remove an account', async function() {
    const accountName = 'Cash';
    
    const result = await chart.remove(accountName);
    assert.notEqual(result, null, 'remove method returned null');
    assert.equal(result, `${accountName} removed from accounts successfully`, 'Account was not removed correctly');
  });

  it('should return true when account is in use', async function() {
    const accountName = 'Cash';
    modelStub.resolves([{ count: 1 }]);

    const inUse = await chart.in_use_sync(accountName);
    
    assert.equal(inUse, true, 'Account in_use check failed');
  });

  it('should return false when account is not in use', async function() {
    const accountName = 'Cash';
    modelStub.resolves([{ count: 0 }]);

    const inUse = await chart.in_use_sync(accountName);

    assert.equal(inUse, false, 'Account in_use check failed');
  });

  it('should return the correct list of accounts', async function() {
    modelStub.resolves([{ id: 1, name: 'Cash', type: 'Asset', code: 100 }]);
    
    const accounts = await chart.getListSync();

    assert(Array.isArray(accounts), 'Returned result is not an array');
    assert.equal(accounts[0].name, 'Cash', 'Account name is incorrect');
  });

  it('should return the correct account type code', function() {
    const result = chart.getAccountTypeCode('Asset');
    assert.deepEqual(result, ['Asset', 100], 'Account type code is incorrect');
  });
});

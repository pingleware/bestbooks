const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Model = require('../model'); // Adjust this path

describe('Model Class', function() {
    let model;

    beforeEach(function() {
        model = new Model();
    });

    afterEach(async function() {
        // Close the database connection
        await model.close();

        // Clean up by deleting the database file
        if (fs.existsSync(model.getFilePath())) {
            await model.deleteDatabaseFile();
        }
    });

    it('should create the database file in the correct location', function() {
        const filePath = model.getFilePath();
        assert.strictEqual(fs.existsSync(filePath), true);
    });

    it('should return the correct file path', function() {
        const expectedPath = path.join(os.homedir(), '.bestbooks/bestbooks.db');
        assert.strictEqual(model.getFilePath(), expectedPath);
    });

    it('should delete the database file',async function() {
        await model.deleteDatabaseFile();
        assert.strictEqual(fs.existsSync(model.getFilePath()), false);
    });

    it('should execute a query and return results', function(done) {
        const createTableSQL = `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)`;
        const insertSQL = `INSERT INTO test (name) VALUES ('TestName')`;

        model.query(createTableSQL, function() {
            model.query(insertSQL, function() {
                model.query(`SELECT * FROM test`, function(rows) {
                    assert.strictEqual(rows.length, 1);
                    assert.strictEqual(rows[0].name, 'TestName');
                    done();
                });
            });
        });
    });

    it('should perform an insert operation and return the lastID', async function() {
        const createTableSQL = `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)`;
        const insertSQL = `INSERT INTO test (name) VALUES (?)`;

        await model.querySync(createTableSQL);
        const lastID = await model.insertSync(insertSQL, ['TestName']);
        
        assert.strictEqual(typeof lastID, 'number');
    });

    it('should retrieve all tables in the database', function(done) {
        const createTableSQL = `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)`;

        model.query(createTableSQL, function() {
            model.getAllTables(function(tables) {
                assert.ok(Array.isArray(tables));
                assert.strictEqual(tables[0].name, 'test');
                done();
            });
        });
    });

    it('should empty all tables in the database', async function() {
        const createTableSQL = `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)`;
        const insertSQL = `INSERT INTO test (name) VALUES (?)`;

        await model.querySync(createTableSQL);
        await model.insertSync(insertSQL, ['TestName']);

        const rowsBefore = await model.querySync(`SELECT * FROM test`);
        assert.strictEqual(rowsBefore.length, 1);

        await model.emptyAllTablesSync();
        const rowsAfter = await model.querySync(`SELECT * FROM test`);
        assert.strictEqual(rowsAfter.length, 0);
    });
});

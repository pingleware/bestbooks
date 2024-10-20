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

    after(async function() {
        // Close the database connection
        await model.close();
    });

    it('should return the correct file path',async function() {
        const expectedPath = path.join(os.homedir(), '.bestbooks/bestbooks.db');
        assert.strictEqual(await model.getFilePath(), expectedPath);
    });
});

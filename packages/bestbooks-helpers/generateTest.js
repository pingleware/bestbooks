
/**
 * Extracts the names of all top-level functions (function declarations, arrow functions, and function expressions)
 * from a given JavaScript file.
 *
 * @param {string} filePath - The path to the JavaScript file to analyze.
 * @returns {string[]} An array of function names found in the file.
 */
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

function extractFunctionNames(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = acorn.parse(code, { ecmaVersion: 2020 });
    const functionNames = [];

    ast.body.forEach((node) => {
      if (node.type === 'FunctionDeclaration' && node.id) {
        // Named function declarations
        functionNames.push(node.id.name);
      } else if (node.type === 'VariableDeclaration') {
        // Arrow functions or function expressions assigned to variables
        node.declarations.forEach((declaration) => {
          if (
            declaration.init &&
            (declaration.init.type === 'ArrowFunctionExpression' ||
              declaration.init.type === 'FunctionExpression') &&
            declaration.id
          ) {
            functionNames.push(declaration.id.name);
          }
        });
      }
    });

    return functionNames;
  } catch (err) {
    console.error('Error reading or parsing the file:', err);
    return [];
  }
}


const indexPath = path.resolve(__dirname, 'index.js');
// List of module names
const modules = extractFunctionNames(indexPath);
 
// Directory to save .test.js files
const testDirectory = './test';

if (!fs.existsSync(testDirectory)) {
  fs.mkdirSync(testDirectory);
}

// Generate a .test.js file for each module
modules.forEach(module => {
  const filePath = path.join(testDirectory, `${module}.test.js`);
  if (!fs.existsSync(filePath)) {
    const content = `
    const assert = require('assert');
    const {${module}} = require('../index');
    const {
      Model,
    } = require("@pingleware/bestbooks-core");

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    describe('${module} Testing', () => {
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

      it('should verify ${module} does exist', () => {
        // Sample test
        assert.ok(${module}, '${module} should be defined');
      });

      // TODO: insert specific test case for the helper function below

      // TODO: add specific test case verification to confirm ledger modification
      // delete if not applicable
      it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
      })

      it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
      })

      it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
      })
    });
    `;
    
      fs.writeFileSync(filePath, content.trim());
      console.log(`Created: ${filePath}`);    
  } else {
    console.log(`Exists: ${filePath}`)
  }
});

# Coding Standards
This is a living document for best practices, when applicable, for code implementation.

## Direct Database Manipulation
All database manipulation MUST BE done through the core framework. 

## Basic Test Script
The minimum test for a module class is,

```
const assert = require('assert');
const {CLASSNAME} = require('../index');

describe("CLASSNAME Class", async function(){
    let CLASS_INSTANCE;

    before(function(){
        CLASS_INSTANCE = new CLASSNAME();
    })

    after(async function(){
        await CLASSNAME.model.insertSync(`DELETE FROM accounts;`);
        await CLASSNAME.model.insertSync(`DELETE FROM ledger;`);
        await CLASSNAME.model.insertSync(`DELETE FROM journal`);
        await CLASSNAME.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await CLASSNAME.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await CLASSNAME.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of CLASSNAME", async function(){
        assert.ok(CLASS_INSTANCE instanceof CLASSNAME);
    })
})
```

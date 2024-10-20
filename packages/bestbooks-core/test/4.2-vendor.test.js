"use strict";

const assert = require('assert');
const {Vendor} = require('../index');

describe("Vendor Class", async function(){
    let user;

    before(async function(){
        user = new Vendor();
    })

    it("should create an instance of Vendor", async function(){
        assert.ok(user instanceof Vendor);
    })
})

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

    it('should add a vendor successfully', async function() {
        const usermeta = {
            company_id: 1,
            office_id: 1,
            name: 'jdoe',
            email: 'john.doe@example.com',
            password: 'password123',
            firstname: 'John',
            lastname: 'Doe',
            phone: '1234567890',
            mobile: '0987654321'
        };

        await user.add(usermeta);
        const users = await user.getUsersSync();
        assert.strictEqual(users.length, 2, 'User count should be 1');
        assert.strictEqual(users[1].user_name, usermeta.name, 'User name should match');
    });

    it('should delete the vendor when not in use by the ledger', async function() {
        const result = await user.remove('jdoe');
        assert.strictEqual(result,'jdoe removed from users successfully');
    });
})

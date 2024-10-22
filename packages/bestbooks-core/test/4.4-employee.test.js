const assert = require('assert');
const {Employee} = require('../index');

describe("Employee Class", async function(){
    let user;

    before(function(){
        user = new Employee();
    })

    after(async function(){
        await user.model.insertSync(`DELETE FROM users;`);
        await user.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='users';`);
    })

    it("should create an instance of Employee", async function(){
        assert.ok(user instanceof Employee);
    })
    
    it('should add a employee successfully', async function() {
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
        assert.strictEqual(users.length, 2, 'User count should be 2');
        assert.strictEqual(users[1].user_name, usermeta.name, 'User name should match');
    });

    it('should delete the employee when not in use by the ledger', async function() {
        const result = await user.remove('jdoe');
        assert.strictEqual(result,'jdoe removed from users successfully');
    });
})

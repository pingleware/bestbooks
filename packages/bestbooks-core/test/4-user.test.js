const assert = require('assert');
const {
    User
} = require('../index');

describe("User class",function(){
    let user;

    before(function(){
        user = new User();
    })

    after(async function(){
        await user.model.insertSync(`DELETE FROM users;`);
        await user.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='users';`);
    })

    it("should create an instance of User", async function(){
        assert.ok(user instanceof User);
    })

    it('should initialize with a name and fetch user from the database', function(done) {
        const user = new User('system', 'system');
        setTimeout(() => {
            assert.strictEqual(user.name, 'system');
            assert.strictEqual(user.id, 0);
            done();
        }, 100); // Give async query time to resolve
    });

    it('should insert user meta into the database', async function() {
        const user = new User();
        const usermeta = {
            company_id: 1,
            office_id: 1,
            name: 'testuser',
            email: 'test@example.com',
            password: 'password',
            firstname: 'First',
            lastname: 'Last',
            phone: '1234567890',
            mobile: '0987654321'
        };

        const result = await user.add(usermeta);
        assert.strictEqual(result, 1);
    });

    it('should return users matching the given name', async function() {
        const user = new User();
        const results = await user.find('testuser');
        assert.strictEqual(results[0].id,1);
    });

    it('should update shares and invested amount for a user', async function() {
        const user = new User('testuser');
        await user.updateShares(1, 1000, 50);
    });

    it('should verify shares and invested amount for a user', async function(){
        const user = new User();
        const results = await user.find('testuser');
        assert.strictEqual(results[0].invested_amount,1000);
        assert.strictEqual(results[0].shares,50);
    })

    it('should delete a user when not in use by the ledger', async function() {
        const user = new User();
        const result = await user.remove('testuser');
        assert.strictEqual(result,'testuser removed from users successfully');
    });
})
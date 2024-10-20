const User = require('../user');

describe("User class",function(){
    it("should initiate the User class without an initial user",async function(){
        const user = new User();
    })
    it("should quick add a new user of Community User with community@domain.com of role admin and password",async function(){
        const user = new User();
        const usermeta = {
            username: 'community',
            email: 'community@domain.com',
            password: '12345678',
            role: 'user',
            firstname: 'COMMUNITY',
            lastname: 'USER',
            phone: '212-555-1212'
        }
        await user.quickAdd(usermeta);
    })
    it("should the user with the username of community",async function(){
        const user = new User();
        await user.find("community");
    })
})
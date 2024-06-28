const User = require('../user');

describe("testing User class",function(){
    it("should initiate the User class without an initial user",async function(){
        const user = new User();
        console.log(user)
    })
    it("should quick add a new user of Patrick Ingle with inglepatrick@yahoo.com of role admin and password",async function(){
        const user = new User();
        const usermeta = {
            username: 'pingle',
            email: 'inglepatrick@yahoo.com',
            password: '12345678',
            role: 'admin',
            firstname: 'PATRICK',
            lastname: 'INGLE'
        }
        const result = await user.quickAdd(usermeta);
    })
    it("should the user with the username of pingle",async function(){
        const user = new User();
        const pingle = await user.find("pingle");
        console.log(pingle);
    })
})
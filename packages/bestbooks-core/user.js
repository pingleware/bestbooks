"use strict"

const Model = require('./model');

class User {
    role = '';

    constructor(role,name="") {
        this.model = new Model();
        this.init();

        if (name !== "") {
            var sql = `SELECT * FROM users WHERE name='${name}';`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.user = result[0];
                    this.name = result[0].name;
                    this.id = result[0].id;
                }
            });
        }

        this.role = role;
    }

    async init() {
        await this.createTable();
        await this.createSystemUser();
    }

    MD5(d){
        var r = this.M(this.V(this.Y(this.X(d),8*d.length)));
        return r.toLowerCase()
    }
    
    M(d){
        for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f
    }
        
    X(d){
        for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;
        for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;
        return _
    }
    
    V(d){
        for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);
        return _
    }
    
    Y(d,_){
        d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;
        for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){
            var h=m,t=f,g=r,e=i;
            f=this.md5_ii(
                f=this.md5_ii(
                    f=this.md5_ii(
                        f=this.md5_ii(
                            f=this.md5_hh(
                                f=this.md5_hh(
                                    f=this.md5_hh(
                                        f=this.md5_hh(
                                            f=this.md5_gg(
                                                f=this.md5_gg(
                                                    f=this.md5_gg(
                                                        f=this.md5_gg(
                                                            f=this.md5_ff(
                                                                f=this.md5_ff(
                                                                    f=this.md5_ff(
                                                                        f=this.md5_ff(
                                                                            f,
                                                                            r=this.md5_ff(
                                                                                r,
                                                                                i=this.md5_ff(
                                                                                    i,
                                                                                    m=this.md5_ff(m,f,r,i,d[n+0],7,-680876936),
                                                                                    f,
                                                                                    r,
                                                                                    d[n+1],
                                                                                    12,
                                                                                    -389564586),
                                                                                m,f,d[n+2],17,606105819),
                                                                            i,m,d[n+3],22,-1044525330),
                                                                        r=this.md5_ff(
                                                                            r,
                                                                            i=this.md5_ff(
                                                                                i,
                                                                                m=this.md5_ff(m,f,r,i,d[n+4],7,-176418897),
                                                                                f,
                                                                                r,
                                                                                d[n+5],
                                                                                12,
                                                                                1200080426),
                                                                            m,
                                                                            f,
                                                                            d[n+6],
                                                                            17,
                                                                            -1473231341),
                                                                        i,
                                                                        m,
                                                                        d[n+7],
                                                                        22,
                                                                        -45705983),
                                                                    r=this.md5_ff(
                                                                        r,
                                                                        i=this.md5_ff(
                                                                            i,
                                                                            m=this.md5_ff(m,f,r,i,d[n+8],7,1770035416),
                                                                            f,
                                                                            r,
                                                                            d[n+9],
                                                                            12,
                                                                            -1958414417),
                                                                        m,
                                                                        f,
                                                                        d[n+10],
                                                                        17,
                                                                        -42063),
                                                                    i,
                                                                    m,
                                                                    d[n+11],
                                                                    22,
                                                                    -1990404162),
                                                                r=this.md5_ff(
                                                                    r,
                                                                    i=this.md5_ff(
                                                                        i,
                                                                        m=this.md5_ff(m,f,r,i,d[n+12],7,1804603682),
                                                                        f,
                                                                        r,
                                                                        d[n+13],
                                                                        12,
                                                                        -40341101),
                                                                    m,
                                                                    f,
                                                                    d[n+14],
                                                                    17,
                                                                    -1502002290),
                                                                i,
                                                                m,
                                                                d[n+15],
                                                                22,
                                                                1236535329),
                                                            r=this.md5_gg(
                                                                r,
                                                                i=this.md5_gg(
                                                                    i,
                                                                    m=this.md5_gg(m,f,r,i,d[n+1],5,-165796510),
                                                                    f,
                                                                    r,
                                                                    d[n+6],
                                                                    9,
                                                                    -1069501632),
                                                                m,
                                                                f,
                                                                d[n+11],
                                                                14,643717713),
                                                            i,
                                                            m,
                                                            d[n+0],
                                                            20,
                                                            -373897302),
                                                        r=this.md5_gg(
                                                            r,
                                                            i=this.md5_gg(
                                                                i,
                                                                m=this.md5_gg(m,f,r,i,d[n+5],5,-701558691),
                                                                f,
                                                                r,
                                                                d[n+10],
                                                                9,
                                                                38016083),
                                                            m,
                                                            f,
                                                            d[n+15],
                                                            14,
                                                            -660478335),
                                                        i,
                                                        m,
                                                        d[n+4],
                                                        20,
                                                        -405537848),
                                                        r=this.md5_gg(
                                                            r,
                                                            i=this.md5_gg(
                                                                i,
                                                                m=this.md5_gg(m,f,r,i,d[n+9],5,568446438),
                                                                f,
                                                                r,
                                                                d[n+14],
                                                                9,
                                                                -1019803690),
                                                            m,
                                                            f,
                                                            d[n+3],
                                                            14,
                                                            -187363961),
                                                        i,
                                                        m,
                                                        d[n+8],
                                                        20,
                                                        1163531501),
                                                    r=this.md5_gg(
                                                        r,
                                                        i=this.md5_gg(
                                                            i,
                                                            m=this.md5_gg(m,f,r,i,d[n+13],5,-1444681467),
                                                            f,
                                                            r,
                                                            d[n+2],
                                                            9,
                                                            -51403784),
                                                        m,
                                                        f,
                                                        d[n+7],
                                                        14,
                                                        1735328473),
                                                    i,
                                                    m,
                                                    d[n+12],
                                                    20,
                                                    -1926607734),
                                                r=this.md5_hh(
                                                    r,
                                                    i=this.md5_hh(
                                                        i,
                                                        m=this.md5_hh(m,f,r,i,d[n+5],4,-378558),
                                                        f,
                                                        r,
                                                        d[n+8],
                                                        11,
                                                        -2022574463),
                                                    m,
                                                    f,
                                                    d[n+11],
                                                    16,
                                                    1839030562),
                                                i,
                                                m,
                                                d[n+14],
                                                23,
                                                -35309556),
                                            r=this.md5_hh(
                                                r,
                                                i=this.md5_hh(
                                                    i,
                                                    m=this.md5_hh(m,f,r,i,d[n+1],4,-1530992060),
                                                    f,
                                                    r,
                                                    d[n+4],
                                                    11,
                                                    1272893353),
                                                m,
                                                f,
                                                d[n+7],
                                                16,
                                                -155497632),
                                            i,
                                            m,
                                            d[n+10],
                                            23,
                                            -1094730640),
                                        r=this.md5_hh(
                                            r,
                                            i=this.md5_hh(
                                                i,
                                                m=this.md5_hh(m,f,r,i,d[n+13],4,681279174),
                                                f,
                                                r,
                                                d[n+0],
                                                11,
                                                -358537222),
                                            m,
                                            f,
                                            d[n+3],
                                            16,
                                            -722521979),
                                        i,
                                        m,
                                        d[n+6],
                                        23,
                                        76029189),
                                    r=this.md5_hh(
                                        r,
                                        i=this.md5_hh(
                                            i,
                                            m=this.md5_hh(m,f,r,i,d[n+9],4,-640364487),
                                        f,r,d[n+12],11,-421815835),
                                    m,f,d[n+15],16,530742520),
                                i,m,d[n+2],23,-995338651),
                            r=this.md5_ii(
                                r,
                                i=this.md5_ii(
                                    i,
                                    m=this.md5_ii(m,f,r,i,d[n+0],6,-198630844),
                                    f,r,d[n+7],10,1126891415),
                                m,f,d[n+14],15,-1416354905),
                            i,m,d[n+5],21,-57434055),
                        r=this.md5_ii(
                            r,
                            i=this.md5_ii(
                                i,
                                m=this.md5_ii(m,f,r,i,d[n+12],6,1700485571),
                                f,r,d[n+3],10,-1894986606),
                            m,f,d[n+10],15,-1051523),
                        i,m,d[n+1],21,-2054922799),
                    r=this.md5_ii(
                        r,
                        i=this.md5_ii(
                            i,
                            m=this.md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),
                        m,f,d[n+6],15,-1560198380),
                    i,m,d[n+13],21,1309151649),
                r=this.md5_ii(
                    r,
                    i=this.md5_ii(
                        i,
                        m=this.md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),
                    m,f,d[n+2],15,718787259),
                i,m,d[n+9],21,-343485551),
            m=this.safe_add(m,h),
            f=this.safe_add(f,t),
            r=this.safe_add(r,g),
            i=this.safe_add(i,e)
        }
        return Array(m,f,r,i)
    }
    
    md5_cmn(d,_,m,f,r,i){
        return this.safe_add(
            this.bit_rol(
                this.safe_add(
                    this.safe_add(_,d),this.safe_add(f,i)),
                r),
            m)
    }
    md5_ff(d,_,m,f,r,i,n){
        return this.md5_cmn(_&m|~_&f,d,_,r,i,n)
    }
    md5_gg(d,_,m,f,r,i,n){
        return this.md5_cmn(_&f|m&~f,d,_,r,i,n)
    }
    md5_hh(d,_,m,f,r,i,n){
        return this.md5_cmn(_^m^f,d,_,r,i,n)
    }
    md5_ii(d,_,m,f,r,i,n){
        return this.md5_cmn(m^(_|~f),d,_,r,i,n)
    }
        
    safe_add(d,_){
        var m=(65535&d)+(65535&_);
        return(d>>16)+(_>>16)+(m>>16)<<16|65535&m
    }
        
    bit_rol(d,_){
        return d<<_|d>>>32-_
    }

    // the system user has an id=0
    async createSystemUser() {
        try {
            var sql = `INSERT OR IGNORE INTO users (id,user_name) VALUES (?,?);`;
            const params = [0, 'system'];
            return await this.model.insertSync(sql,params);
        } catch(err) {
            console.error(err);
        }
    }

    async add(usermeta) {
        try {
            var sql = `INSERT OR IGNORE INTO users (
                company_id,
                office_id,
                user_name,
                user_email,
                user_pass,
                firstname,
                lastname,
                display_name,
                phone,
                mobile,
                role
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
            const fullname = `${usermeta.firstname} ${usermeta.lastname}}`;
            const params = [
                usermeta.company_id,
                usermeta.office_id,
                usermeta.name,
                usermeta.email,
                this.MD5(usermeta.password),
                usermeta.firstname,
                usermeta.lastname,
                fullname,
                usermeta.phone,
                usermeta.mobile,
                this.role
            ];
            return await this.model.insertSync(sql,params);        
        } catch(error) {
            console.error(error);
        }
    }

    quickAdd(usermeta) {
        try {
            var sql = `INSERT OR IGNORE INTO users (
                user_name,
                user_email,
                user_pass,
                role,
                first_name,
                last_name,
                display_name,
                notify_email,
                phone
            ) VALUES (?,?,?,?,?,?,?,?,?);`;
            const fullname = `${usermeta.firstname} ${usermeta.lastname}}`;
            const params = [
                usermeta.username,
                usermeta.email,
                this.MD5(usermeta.password),
                usermeta.role,
                usermeta.firstname,
                usermeta.lastname,
                fullname,
                usermeta.email,
                usermeta.phone
            ];
    
            return this.model.insertSync(sql,params);    
        } catch(error) {
            console.error(error);
        }
    }

    // user deletion permitted when NOT IN USE!
    async remove(user_name) {
        try {
            var sql = `DELETE FROM users WHERE user_name=? 
            AND NOT EXISTS (
                SELECT 1 FROM ledger WHERE ledger.performed_by = users.id
            );
            `;
            const params = [user_name];
            await this.model.insertSync(sql,params);
            return `${user_name} removed from users successfully`;
        } catch(err) {
            error(err);
            throw error;  // Optionally rethrow the error to be handled in your tests
        }
    }

    find(name) {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT id FROM users WHERE username LIKE '%${name}%';`;
                this.model.query(sql, function(results){
                    resolve(results);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    getUser() {
        return this.user;
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getUsers(callback) {
        try {
            var sql = `SELECT * FROM users;`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.users = result;
                    callback(this.users);
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    getUsersByRole(callback) {
        try {
            var sql = `SELECT * FROM users WHERE role='${this.role}';`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    this.users = result;
                    callback(this.users);
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    async getUsersSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT * FROM users;`;
                this.model.query(sql, function(result){
                    resolve(result);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    async getUsersByRoleSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT * FROM users WHERE role='${this.role}';`;
                this.model.query(sql, function(result){
                    resolve(result);
                });
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    getUserRoles(callback) {
        try {
            var sql = `SELECT user_role AS role FROM users GROUP BY user_role ORDER BY user_role;`;
            this.model.query(sql, function(result){
                if (result.length > 0) {
                    callback(result);
                }
            });    
        } catch(error) {
            console.error(error);
        }
    }

    async getUserRolesSync() {
        return new Promise((resolve,reject) => {
            try {
                var sql = `SELECT user_role AS role FROM users GROUP BY user_role ORDER BY user_role;`;
                this.model.query(sql, function(result){
                    resolve(result);
                });    
            } catch(error) {
                console.error(error);
                reject(error);
            }    
        })
    }

    async updateShares(userid,amount,shares) {
        var sql = `UPDATE users 
                    SET invested_amount = invested_amount + ?, 
                        shares = shares + ? 
                    WHERE id = ?;
                `;
        const params = [amount,shares,userid];
        return await this.model.querySync(sql,params);
    }

    async createTable() {
        try {
            var sql = `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER,
                office_id INTEGER,
                user_name TEXT UNIQUE,
                user_email TEXT UNIQUE,
                user_pass TEXT UNIQUE,
                role TEXT,
                first_name TEXT,
                last_name TEXT,
                display_name TEXT,
                notify_email TEXT,
                mobile TEXT,
                phone TEXT,
                invested_amount REAL DEFAULT 0.0,
                shares NUMBER DEFAULT 0
            );`;

            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

    async purgeTable() {
        try {
            var sql = `DELETE FROM users;`;
            await this.model.insertSync(sql);
        } catch(error) {
            console.error(error);
        }
    }

}


module.exports = User;
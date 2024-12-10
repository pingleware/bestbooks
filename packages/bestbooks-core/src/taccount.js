/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

class TAccount {
    constructor() {
        if(this.constructor == TAccount){
            throw new Error("Object of Abstract Class cannot be created");
        }    
    }
    
    getName(){
        throw new Error("Abstract Method has no implementation");
    }
    getType(){
        throw new Error("Abstract Method has no implementation");
    }
    
    addDebit(date,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
        throw new Error("Abstract Method has no implementation");
    }
    addCredit(data,desc,amount,company_id=0,office_id=0,location=0,transaction_type="Operating"){
        throw new Error("Abstract Method has no implementation");
    }
    
    getDebit(){
        throw new Error("Abstract Method has no implementation");
    }
    getCredit(){
        throw new Error("Abstract Method has no implementation");
    }
    
    getBalance(){
        throw new Error("Abstract Method has no implementation");
    }
 }

 module.exports = TAccount;
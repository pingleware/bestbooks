"use strict"

const {addTransactionSync} = require("@pingleware/bestbooks-helpers");

let MEDICARE = 3.2;
let FICA = 6.2;

function pay(companyId,officeId,employeeNo,date,description,amount) {
    addTransactionSync("Wages","Expense",date,`${employeeNo}: ${description}`,amount,0,companyId,officeId);
    addTransactionSync("Salaries Expense","Expense",date,`${employeeNo}: ${description}`,amount,0,companyId,officeId);
    addTransactionSync("Accrued Liabilities","Liability",date,`${employeeNo}: ${description}`,0,amount,companyId,officeId);
}

function calculateWithholding(companyId,officeId,employeeNo,grossAmount) {
    const medicare = grossAmount * (MEDICARE / 100);
    const fica = grossAmount * (FICA / 100);
    const federal = 0; // perform lookup
    const state = 0; // perform lookup
    const municipal = 0; // perform lookup

    const netPay = grossAmount - medicare - fica - federal - state - municipal;

    return {
        companyId: companyId,
        officeId: officeId,
        employeeNo: employeeNo,
        grossAmount: grossAmount,
        medicare: medicare,
        fica: fica,
        federal: federal,
        state: state,
        municipal: municipal,
        netPay: netPay
    }
}

module.exports = {
    MEDICARE,
    FICA,
    pay,
    calculateWithholding,
}
const assert = require("assert");
const {
    Model,
} = require("@pingleware/bestbooks-core");
const HRM = require("../index.js"); // Adjust the path to the HRM class

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


describe("HRM Class", function () {
    let model, date, dateString, hrm;

    before(function () {
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        model = new Model();
        hrm = new HRM();
    });

    afterEach(async function () {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async function(){
        await model.insertSync("DELETE FROM ledger;");
        await model.insertSync("DELETE FROM accounts");
        await model.insertSync("DELETE FROM journal");
        await model.insertSync("DELETE FROM company");
        await model.insertSync("DELETE FROM users");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='users';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='company';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='journal';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';");
        await model.insertSync("UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';");
    })

    it('should verify HRM does exist', () => {
        // Sample test
        assert.ok(hrm instanceof HRM);
    });

    it("should verify staff_position table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='staff_position';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify employee table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='employee';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify compensation table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='compensation';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify performance table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='performance';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify leave_request table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='leave_request';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify benefit table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='benefit';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify training_course table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='training_course';");
        assert.strictEqual(result.length > 0);
    })

    it("should verify employee_training table has been created",async function(){
        const result = await model.querySync("SELECT name, sql FROM sqlite_master WHERE type='table' AND name='employee_training';");
        assert.strictEqual(result.length > 0);
    })


    it("should initialize with default MEDICARE and FICA rates", function () {
        assert.strictEqual(hrm.MEDICARE, 3.2);
        assert.strictEqual(hrm.FICA, 6.2);
    });

    it("should calculate correct withholding values and net pay", async function () {
        const companyId = 1;
        const officeId = 1;
        const employeeNo = 101;
        const grossAmount = 1000;

        const result = await hrm.calculateWithholding(companyId, officeId, employeeNo, grossAmount);

        assert.strictEqual(result.grossAmount, 1000);
        assert.strictEqual(result.medicare, 32); // 3.2% of 1000
        assert.strictEqual(result.fica, 62); // 6.2% of 1000
        assert.strictEqual(result.netPay, 906); // 1000 - 32 - 62
    });

    it("should call addTransactionSync with correct parameters", async function () {
        const companyId = 1;
        const officeId = 1;
        const employeeNo = "101";
        const date = "2024-11-23";
        const description = "Salary Payment";
        const amount = 500;

        await hrm.pay(companyId, officeId, employeeNo, date, description, amount);

        assert.strictEqual(addTransactionSyncStub.callCount, 3);

        assert.deepStrictEqual(addTransactionSyncStub.getCall(0).args, [
            "Wages", "Expense", date, "101: Salary Payment", amount, 0, companyId, officeId
        ]);

        assert.deepStrictEqual(addTransactionSyncStub.getCall(1).args, [
            "Salaries Expense", "Expense", date, "101: Salary Payment", amount, 0, companyId, officeId
        ]);

        assert.deepStrictEqual(addTransactionSyncStub.getCall(2).args, [
            "Accrued Liabilities", "Liability", date, "101: Salary Payment", 0, amount, companyId, officeId
        ]);
    });

    it("should show ledger table contents",async()=>{
        const result = await model.querySync("SELECT * FROM ledger");
        assert.strictEqual(result.length > 0,true);
        console.log(result)
    })

    it("should show the journal table contents",async()=>{
        const result = await model.querySync("SELECT * FROM journal");
        assert.strictEqual(result.length > 0,true);
        console.log(result)
    })

    it("should show the accounts table contents",async()=>{
        const result = await model.querySync("SELECT * FROM accounts");
        assert.strictEqual(result.length > 0,true);
        console.log(result)
    })
});

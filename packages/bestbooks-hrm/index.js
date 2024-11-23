"use strict"

const {addTransactionSync} = require("@pingleware/bestbooks-helpers");
const {
    Model
} = require("@pingleware/bestbooks-core");

class HRM extends Model {

    constructor(MEDICARE=3.2,FICA=6.2) {
        super();
        this.MEDICARE = MEDICARE;
        this.FICA = FICA;
        this.createTables();
    }

    async pay(companyId,officeId,employeeNo,date,description,amount) {
        addTransactionSync("Wages","Expense",date,`${employeeNo}: ${description}`,amount,0,companyId,officeId);
        addTransactionSync("Salaries Expense","Expense",date,`${employeeNo}: ${description}`,amount,0,companyId,officeId);
        addTransactionSync("Accrued Liabilities","Liability",date,`${employeeNo}: ${description}`,0,amount,companyId,officeId);
    }
    
    async calculateWithholding(companyId,officeId,employeeNo,grossAmount) {
        const medicare = grossAmount * (this.MEDICARE / 100);
        const fica = grossAmount * (this.FICA / 100);
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
    
    async createTables() {
        var sql = `CREATE TABLE IF NOT EXISTS "staff_position" (
            "id"	INTEGER,
            "name"	TEXT,
            "description"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "employee" (
            "id"	INTEGER,
            "company_id"	INTEGER,
            "office_id"	INTEGER,
            "position_id"	INTEGER,
            "supervisor"	INTEGER,
            "hire_date"	TIMESTAMP,
            "termination_date"	TIMESTAMP,
            FOREIGN KEY("company_id") REFERENCES "company"("id"),
            FOREIGN KEY("office_id") REFERENCES "office_department"("id"),
            FOREIGN KEY("position_id") REFERENCES "staff_position"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        )`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "compensation" (
            "id"	INTEGER,
            "employee_id"	INTEGER,
            "salary"	REAL,
            "bonus"	REAL,
            "benefits"	REAL,
            "start_date"	TIMESTAMP,
            "end_date"	TIMESTAMP,
            FOREIGN KEY("employee_id") REFERENCES "employee"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "performance" (
            "id"	INTEGER,
            "employee_id"	INTEGER,
            "evaluation_date"	TIMESTAMP,
            "reviewer_id"	INTEGER,
            "rating"	INTEGER,
            "comments"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "leave_request" (
            "id"	INTEGER,
            "employee_id"	INTEGER,
            "leave_type"	TEXT,
            "start_date"	TIMESTAMP,
            "end_date"	TIMESTAMP,
            "status"	TEXT,
            "approved_by"	INTEGER,
            FOREIGN KEY("approved_by") REFERENCES "users"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "benefit" (
            "id"	INTEGER,
            "employee_id"	INTEGER,
            "benefit_type"	TEXT,
            "provider"	TEXT,
            "coverage_state_date"	TIMESTAMP,
            "coverage_end_date"	TIMESTAMP,
            FOREIGN KEY("employee_id") REFERENCES "employee"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "training_course" (
            "id"	INTEGER,
            "name"	TEXT,
            "description"	TEXT,
            "instructor"	TEXT,
            "duration"	TIME,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);

        sql = `CREATE TABLE IF NOT EXISTS "employee_training" (
            "id"	INTEGER,
            "training_id"	INTEGER,
            "employee_id"	INTEGER,
            "completion_date"	TIMESTAMP,
            "grade"	TEXT,
            FOREIGN KEY("training_id") REFERENCES "training_course"("id"),
            FOREIGN KEY("employee_id") REFERENCES "employee"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
        this.insertSync(sql);
    }
    
}

module.exports = HRM;
const assert = require('assert');
const { 
    init, CustomerEstimate, 
} = require("../index");
const {
    User,
    Company,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const os = require('os');
const path = require('path');
const glob = require('glob');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create a Customer Estimate", function(){
    let report, company, company_id, customer_id, metadata, formattedDueDate, data, formattedData, xml, html, date, dateString;

    before(function(){
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        report = new CustomerEstimate(); 
        company = new Company();
        init();
    });

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`DELETE FROM company`);
        await report.model.insertSync(`DELETE FROM users`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='users';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='company';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);

        const basePath = path.join(os.homedir(), `.bestbooks`);
        const pattern = `${basePath}/customerEstimate.*`;
        
        // Find files matching the pattern
        const files = glob.sync(pattern);

        // Remove each file
        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.rmSync(file, { force: true });
            }
        });
    })

    it("should create an instance of CustomerEstimate", async function(){
        assert.ok(report instanceof CustomerEstimate);
    }) 

    it("should create a new company",async function(){
        company_id = await company.add("PRESSPAGE ENTERTAINMENT INC","");
        
        const new_company = new User("company");
        new_company.add(
            {
                company_id: company_id,
                office_id: 1,
                name: "presspage",
                email: "presspage.entertainment@gmail.com",
                password: "password",
                firstname: "PATRICK",
                lastname: "INGLE",
                fullname: "PATRICK O. INGLE",
                phone: "212-879-0758",
                mobile: "352-555-1212",
            }
        )
        assert.strictEqual(company_id,1);
    })

    it("should create a new customer",async function(){
        const new_customer = new User("customer");

        customer_id = await new_customer.add({
            company_id: company_id,
            office_id: 1,
            name: "customer",
            email: "best@customer",
            password: "password1",
            firstname: "John",
            lastname: "Doe",
            fullname: "John A. Doe",
            phone: "212-555-1212",
            mobile: "212-555-1212",
        });
        assert.strictEqual(customer_id,2);
    })

    it("should return the customer estimate details",async() => {
        const dueDate = new Date(date); // Convert input date to a Date object
        dueDate.setDate(dueDate.getDate() + 15); // Add 15 days to the date
        formattedDueDate = dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        const dateArray = date.split("-");
        const estimate_no = `E-${dateArray[0]}${dateArray[1]}${dateArray[2]}-001`;
        metadata = {
            number: estimate_no,
            date: date,
            company: {
                website: "https://pingleware.support", 
                address1: "PO Box 142814", 
                address2: "", 
                city: "Gainesville", 
                state: "FL", 
                zipcode: "32614-2814", 
                fax: "212-879-0758"
            }, 
            customer: {
                address1: "One Main Street",
                address2: "Apt 1",
                city: "New York",
                state: "NY",
                zipcode: "10001",
                fax: "212-555-1212",
                shipping: {
                    contact: "John A. Doe", 
                    address1: "One Main Street",
                    address2: "Apt 1",
                    city: "New York",
                    state: "NY",
                    zipcode: "10001",
                    phone: "212-555-1212",
                    fax: "212-555-1212"
                }
            }, 
            terms: "Net 15",
            tax: "NY",
            duedate: formattedDueDate,
            lineitems: {
                lineitem: [
                    {
                        quantity: 1,
                        description: "Widget One",
                        unitprice: 10.00,
                        discount: 0,
                        tax: 0.60,
                        total: 10.00
                    },
                    {
                        quantity: 3,
                        description: "Widget Two",
                        unitprice: 5.00,
                        discount: 0,
                        tax: 0.90,
                        total: 15.00
                    }
                ]
            }, 
            comments: "Signature required", 
            prices: {
                subtotal: 25.00, 
                tax: 1.50, 
                shipping: 5.00, 
                other: 0.00, 
                total: 31.50
            },
            payment: {
                amount: 0.00,
                method: 'NOT PAID',
                confirmation: 'None'
            }
        };

        data = await report.retrieveReportDataSync("","",company_id,customer_id,metadata);
        assert.strictEqual(data.number,estimate_no);
    })

    it("should format data into array",async() => {
        const notes = ``;
        formattedData = await report.formatArray(data,notes);
        assert.strictEqual(formattedData.date,date);
        assert.strictEqual(formattedData.duedate,formattedDueDate);
    })

    it("should format array into xml",async () => {
        const expected = `<?xml version='1.0'?>
<customerEstimate>
    <number>E-20241116-001</number>
    <date>${date}</date>
    <company>
        <name>PRESSPAGE ENTERTAINMENT INC</name>
        <contact>PATRICK INGLE</contact>
        <email>presspage.entertainment@gmail.com</email>
        <phone>212-879-0758</phone>
        <website>https://pingleware.support</website>
        <address1>PO Box 142814</address1>
        <address2/>
        <city>Gainesville</city>
        <state>FL</state>
        <zipcode>32614-2814</zipcode>
        <fax>212-879-0758</fax>
    </company>
    <customer>
        <id>2</id>
        <name>John Doe</name>
        <email>best@customer</email>
        <contact>John Doe</contact>
        <address1>One Main Street</address1>
        <address2>Apt 1</address2>
        <city>New York</city>
        <state>NY</state>
        <zipcode>10001</zipcode>
        <phone>212-555-1212</phone>
        <fax>212-555-1212</fax>
        <shipping>
            <contact>John A. Doe</contact>
            <address1>One Main Street</address1>
            <address2>Apt 1</address2>
            <city>New York</city>
            <state>NY</state>
            <zipcode>10001</zipcode>
            <phone>212-555-1212</phone>
            <fax>212-555-1212</fax>
        </shipping>
    </customer>
    <terms>Net 15</terms>
    <tax>NY</tax>
    <duedate>${formattedDueDate}</duedate>
    <lineitems>
        <lineitem>
            <quantity>1</quantity>
            <description>Widget One</description>
            <unitprice>10</unitprice>
            <discount>0</discount>
            <tax>0.6</tax>
            <total>10</total>
        </lineitem>
        <lineitem>
            <quantity>3</quantity>
            <description>Widget Two</description>
            <unitprice>5</unitprice>
            <discount>0</discount>
            <tax>0.9</tax>
            <total>15</total>
        </lineitem>
    </lineitems>
    <comments>Signature required</comments>
    <prices>
        <subtotal>25</subtotal>
        <tax>1.5</tax>
        <shipping>5</shipping>
        <other>0</other>
        <total>31.5</total>
    </prices>
    <payment>
        <amount>0</amount>
        <method>NOT PAID</method>
        <confirmation>None</confirmation>
    </payment>
</customerEstimate>`;
        xml = await report.formatXml(formattedData);
        assert.deepStrictEqual(xml,expected);
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("customerEstimate",xml,"xml");
        assert.strictEqual(path.basename(filePath),"customerEstimate.xml");
    })

    it("should format the purchase order",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("customerEstimate",html,"html");
        assert.strictEqual(path.basename(filePath),"customerEstimate.html");
    })


    /*
    it("customer estimate form", function(){
        var customerEstimate = new CustomerEstimate();
        var customerEstimateInfo = {
            number: "E-20230226-001",
            date: new Date().toISOString().split('T')[0],
            company: {
                name: "PRESSPAGE ENTERTAINMENT INC",
                contact: "PATRICK INGLE", 
                email: "presspage.entertainment@gmail.com", 
                phone: "212-879-0758", 
                website: "https://support.pingleware.work", 
                address1: "PO Box 142814", 
                address2: "", 
                city: "Gainesville", 
                state: "FL", 
                zipcode: "32614-2814", 
                phone: "212-879-0758", 
                fax: "212-879-0758"
            }, 
            customer: {
                id: 1,
                name: "A Valuable Customer",
                email: "best@customer",
                contact: "John A. Doe",
                address1: "One Main Street",
                address2: "Apt 1",
                city: "New York",
                state: "NY",
                zipcode: "10001",
                phone: "212-555-1212",
                fax: "212-555-1212",
                shipping: {
                    contact: "John A. Doe", 
                    address1: "One Main Street",
                    address2: "Apt 1",
                    city: "New York",
                    state: "NY",
                    zipcode: "10001",
                    phone: "212-555-1212",
                    fax: "212-555-1212"
                }
            }, 
            terms: "Net 15",
            tax: "NY",
            duedate: "2023-03-01",
            lineitems: {
                lineitem: [
                    {
                        quantity: 1,
                        description: "Widget One",
                        unitprice: 10.00,
                        discount: 0,
                        tax: 0.60,
                        total: 10.00
                    },
                    {
                        quantity: 3,
                        description: "Widget Two",
                        unitprice: 5.00,
                        discount: 0,
                        tax: 0.90,
                        total: 15.00
                    }
                ]
            }, 
            comments: "Signature required", 
            prices: {
                subtotal: 25.00, 
                tax: 1.50, 
                shipping: 5.00, 
                other: 0.00, 
                total: 31.50
            },
            payment: {
                amount: 0.00,
                method: 'NOT PAID',
                confirmation: 'None'
            }
        };
        
        customerEstimate.createReport(customerEstimateInfo,function(html){
            fs.writeFileSync('customer-estimate.html',html);
        });
    })
    */
})

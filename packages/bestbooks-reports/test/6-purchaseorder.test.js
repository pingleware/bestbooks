const assert = require('assert'); 
const { 
    init, 
    PurchaseOrder, 
} = require("../index");
const {
    User,
    Company,
    Vendor,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const os = require('os');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create a Purchase Order", function(){
    let report, company, vendor, data, formattedData, xml, html, date, company_id, vendor_id, metadata={};

    before(function(){
        date = new Date().toISOString().split('T')[0];
        report = new PurchaseOrder();
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
    })

    it("should create an instance of PurchaseOrder", async function(){
        assert.ok(report instanceof PurchaseOrder);
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

    it("should create a new vendor",async function(){
        const new_vendor = new User("vendor");
        
        vendor_id = await new_vendor.add({
            company_id: company_id,
            office_id: 1,
            name: "vendor",
            email: "admin@vendor.vendor",
            password: "password1",
            firstname: "John",
            lastname: "Doe",
            fullname: "John Doe",
            phone: "212-555-1212",
            mobile: "212-555-1212",
        });
        assert.strictEqual(vendor_id,2);
    })

    it("should return the purchase order details",async function(){
        const expected = {
            number: 'PO-20230226-001',
            date: date,
            company: {
              name: 'PRESSPAGE ENTERTAINMENT INC',
              contact: 'PATRICK INGLE',
              email: 'presspage.entertainment@gmail.com',
              phone: '212-879-0758',
              website: 'https://pingleware.support',
              billing: {
                address1: 'PO Box 142814',
                address2: '',
                city: 'Gainesville',
                state: 'FL',
                zipcode: '32614-2814',
                phone: '212-879-0758',
                fax: '212-879-0758'
              },
              shipping: {
                contact: 'PATRICK INGLE',
                address1: '4055 SW 15 PL',
                address2: 'Apt G',
                city: 'Gainesville',
                state: 'FL',
                zipcode: '32607',
                phone: '212-879-0758',
                fax: '212-879-0758'
              }
            },
            vendor: {
              id: 1,
              name: 'John Doe',
              email: 'admin@vendor.vendor',
              contact: 'John Doe',
              address1: 'One Commerce Way',
              address2: 'Suite 100',
              city: 'New York',
              state: 'NY',
              zipcode: '10001',
              phone: '212-555-1212',
              fax: '212-555-1212'
            },
            shipping: { service: 'UPS', method: 'GROUND', deliverydate: '2023-05-09' },
            lineitems: [
              {
                quantity: 1,
                description: 'Widget One',
                unitprice: 10,
                amount: 10
              },
              {
                quantity: 3,
                description: 'Widget Two',
                unitprice: 5,
                amount: 15
              }
            ],
            comments: 'Leave at door',
            prices: { tax: 0.07, shipping: 25, other: 5 },
            payment: { amount: 0, method: 'NOT PAID', confirmation: 'None' }
        };

        metadata = {
            number: "PO-20230226-001",
            lineitems: [
                {
                    quantity: 1,
                    description: "Widget One",
                    unitprice: 10.00,
                    amount: 10.00
                },
                {
                    quantity: 3,
                    description: "Widget Two",
                    unitprice: 5.00,
                    amount: 15.00
                }
            ],
            company: {
                website: "https://pingleware.support", 
                billing: { 
                    address1: "PO Box 142814", 
                    address2: "", 
                    city: "Gainesville", 
                    state: "FL", 
                    zipcode: "32614-2814", 
                    phone: "212-879-0758", 
                    fax: "212-879-0758"
                }, 
                shipping: {
                    contact: "PATRICK INGLE", 
                    address1: "4055 SW 15 PL",
                    address2: "Apt G",
                    city: "Gainesville",
                    state: "FL",
                    zipcode: "32607",
                    phone: "212-879-0758",
                    fax: "212-879-0758"
                }
            },
            vendor: {
                address1: "One Commerce Way",
                address2: "Suite 100",
                city: "New York",
                state: "NY",
                zipcode: "10001",
                phone: "212-555-1212",
                fax: "212-555-1212"
            },
            comments: "Leave at door",
            shipping: {
                service: "UPS", 
                method: "GROUND", 
            },
            prices: {
                tax: 0.07,
                shipping: 25.00,
                other: 5.00
            },
            payment: {
                amount: 0.00,
                method: 'NOT PAID',
                confirmation: 'None'
            }
        };
        data = await report.retrieveReportDataSync(
            date,
            "2023-05-09",
            company_id,
            vendor_id,
            metadata
        );
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = ``;
        formattedData = await report.formatArray(data,notes);
        assert.strictEqual(formattedData.date,date)
    })

    it("should format array into xml",async () => {
        const expected = `<?xml version='1.0'?>
<purchaseOrder>
    <number>PO-20230226-001</number>
    <date>${date}</date>
    <company>
        <name>PRESSPAGE ENTERTAINMENT INC</name>
        <contact>PATRICK INGLE</contact>
        <email>presspage.entertainment@gmail.com</email>
        <phone>212-879-0758</phone>
        <website>https://support.pingleware.work</website>
        <billing>
            <address1>PO Box 142814</address1>
            <address2/>
            <city>Gainesville</city>
            <state>FL</state>
            <zipcode>32614-2814</zipcode>
            <phone>212-879-0758</phone>
            <fax>212-879-0758</fax>
        </billing>
        <shipping>
            <contact>PATRICK INGLE</contact>
            <address1>4055 SW 15 PL</address1>
            <address2>Apt G</address2>
            <city>Gainesville</city>
            <state>FL</state>
            <zipcode>32607</zipcode>
            <phone>212-879-0758</phone>
            <fax>212-879-0758</fax>
        </shipping>
    </company>
    <vendor>
        <id>1</id>
        <name>A Vendor</name>
        <email>admin@vendor.vendor</email>
        <contact>John A. Doe</contact>
        <address1>One Commerce Way</address1>
        <address2>Suite 100</address2>
        <city>New York</city>
        <state>NY</state>
        <zipcode>10001</zipcode>
        <phone>212-555-1212</phone>
        <fax>212-555-1212</fax>
    </vendor>
    <shipping>
        <service>UPS</service>
        <method>GROUND</method>
        <deliverydate>2023-05-09</deliverydate>
    </shipping>
    <lineItems>
        <lineitem>
            <quantity>1</quantity>
            <description>Widget One</description>
            <unitprice>10.00</unitprice>
            <amount>10.00</amount>
        </lineitem>
        <lineitem>
            <quantity>3</quantity>
            <description>Widget Two</description>
            <unitprice>5.00</unitprice>
            <amount>15.00</amount>
        </lineitem>
    </lineItems>
    <prices>
        <subtotal>25.00</subtotal>
        <tax>1.50</tax>
        <shipping>5.00</shipping>
        <other>0.00</other>
        <total>31.50</total>
    </prices>
    <comments>Leave at door</comments>
    <payment>
        <amount>0</amount>
        <method>NOT PAID</method>
        <confirmation>None</confirmation>
    </payment>
    <notes/>
</purchaseOrder>`;
        xml = await report.formatXml(formattedData);
        //assert.deepStrictEqual(xml,expected);
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("purchaseOrder",xml,"xml");
        assert.strictEqual(path.basename(filePath),"purchaseOrder.xml");
    })

    it("should format the purchase order",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("purchaseOrder",html,"html");
        assert.strictEqual(path.basename(filePath),"purchaseOrder.html");
    })

})



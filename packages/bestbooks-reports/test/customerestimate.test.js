var expect    = require("chai").expect;

const { init, CustomerEstimate } = require("../index");
const fs = require('fs');
const os = require('os');
const path = require('path');


describe("customer estimate", function(){
    before(function(){
        init();
    });
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
})

const assert = require('assert');
const {DynamicPricing} = require('../index');

const basePrice = 100;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Dynamic Pricing Testing', () => {
    let pricing; 

    before(async()=>{
        pricing = new DynamicPricing(basePrice);
    })

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });
    
    it("should calculate the retail price", async() => {
        // Retail Pricing Example
        const retailPrice = pricing.calculatePrice('retail', {
            demand: 80,
            supply: 50,
            maxSupply: 100,
            competitorPrice: 95,
            sensitivity: 0.4
        });

        //console.log(`Retail Price: $${retailPrice.toFixed(2)}`);
        assert.equal(retailPrice.toFixed(2),106.40);
    })

    it("should calculate the saas price", async() => {
        // SaaS Pricing Example
        const saasPrice = pricing.calculatePrice('saas', {
            newUsers: 500,
            lostUsers: 200,
            totalUsers: 5000,
            lifetimeValue: 300,
            acquisitionCost: 100,
            sensitivity: 0.6
        });

        //console.log(`SaaS Price: $${saasPrice.toFixed(2)}`);
        assert.equal(saasPrice.toFixed(2), 310.80);
    });

    it("should calculate the airline price", async() => {
        // Airline Pricing Example
        const airlinePrice = pricing.calculatePrice('airline', {
            seatsSold: 120,
            seatsAvailable: 30,
            totalSeats: 150,
            timeLeft: 5,
            maxTime: 24,
            sensitivity: 0.8
        });

        //console.log(`Airline Ticket Price: $${airlinePrice.toFixed(2)}`);
        assert.equal(airlinePrice.toFixed(2),265.17);
    });

});
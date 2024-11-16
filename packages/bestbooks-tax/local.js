"use strict"

class LocalTaxes {
    constructor(city) {
        this.city = city;
        this.localTaxRates = {
            "San Francisco": 0.0125,
            "New York City": 0.035,
            "Dallas": 0.02,
        };
    }

    calculateIncomeTax(income) {
        const rate = this.localTaxRates[this.city] || 0.01;
        return Number(income) * Number(rate);
    }

    calculateSalesTax(amount) {
        const salesTaxRates = {
            "San Francisco": 0.01,
            "New York City": 0.045,
            "Dallas": 0.025,
        };

        const rate = salesTaxRates[this.city] || 0.01;
        return Number(amount) * Number(rate);
    }
}

module.exports = LocalTaxes;

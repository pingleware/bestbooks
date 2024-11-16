"use strict"

class StateTaxes {
    constructor(state) {
        this.state = state;
        this.stateTaxRates = {
            "CA": 0.13,
            "NY": 0.10,
            "TX": 0.00,
            "FL": 0.00,
        };
    }

    calculateIncomeTax(income) {
        const rate = this.stateTaxRates[this.state] || 0.05;
        return Number(income) * Number(rate);
    }

    calculateSalesTax(amount) {
        const salesTaxRates = {
            "CA": 0.0725,
            "NY": 0.04,
            "TX": 0.0625,
            "FL": 0.06,
        };

        const rate = salesTaxRates[this.state] || 0.05;
        return Number(amount) * Number(rate);
    }
}

module.exports = StateTaxes;

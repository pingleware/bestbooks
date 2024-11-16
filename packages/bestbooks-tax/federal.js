"use strict"

class FederalTaxes {
    constructor() {
        this.taxBrackets = [
            { rate: 0.10, min: 0, max: 10275 },
            { rate: 0.12, min: 10276, max: 41775 },
            { rate: 0.22, min: 41776, max: 89075 },
            { rate: 0.24, min: 89076, max: 170050 },
            { rate: 0.32, min: 170051, max: 215950 },
            { rate: 0.35, min: 215951, max: 539900 },
            { rate: 0.37, min: 539901, max: Infinity }
        ];
    }

    calculateIncomeTax(income) {
        let tax = 0;

        for (const bracket of this.taxBrackets) {
            if (income > bracket.max) {
                tax += (bracket.max - bracket.min) * bracket.rate;
            } else if (income > bracket.min) {
                tax += (income - bracket.min) * bracket.rate;
                break;
            }
        }

        return tax;
    }
}

module.exports = FederalTaxes;

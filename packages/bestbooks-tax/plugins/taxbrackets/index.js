let metadata;

module.exports = {
    getFederalTaxBrackets() {
        const taxBrackets = [
            { rate: 0.10, min: 0, max: 10275 },
            { rate: 0.12, min: 10276, max: 41775 },
            { rate: 0.22, min: 41776, max: 89075 },
            { rate: 0.24, min: 89076, max: 170050 },
            { rate: 0.32, min: 170051, max: 215950 },
            { rate: 0.35, min: 215951, max: 539900 },
            { rate: 0.37, min: 539901, max: Infinity }
        ];
        return taxBrackets;
    },

    getStateTaxRates({ state="" }) {
        const stateTaxRates = {
            "CA": 0.13,
            "NY": 0.10,
            "TX": 0.00,
            "FL": 0.00,
        };
        if (state) {
            return stateTaxRates[state];
        } 
        return stateTaxRates;
    },

    getStateSalesTaxRates({ state="" }) {
        const stateSalesTaxRates = {
            "CA": 0.0725,
            "NY": 0.04,
            "TX": 0.0625,
            "FL": 0.06,
        };
        if (state) {
            return stateSalesTaxRates[state];
        } 
        return stateSalesTaxRates;
    },

    getCityTaxRates({ city="" }) {
        const localTaxRates = {
            "San Francisco": 0.0125,
            "New York City": 0.035,
            "Dallas": 0.02,
        };
        if (city) {
            return localTaxRates[city];
        } 
        return localTaxRates;
    },

    getCitySalesTaxRates({ city="" }) {
        const salesTaxRates = {
            "San Francisco": 0.01,
            "New York City": 0.045,
            "Dallas": 0.025,
        };
        if (city) {
            return salesTaxRates[city];
        } 
        return salesTaxRates;
    },

};

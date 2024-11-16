const assert = require('assert');
const {
    FederalTaxes
} = require('../index');

describe('FederalTaxes', function () {
    it('should calculate federal tax for $50,000 income', function () {
        const federal = new FederalTaxes();
        const tax = Math.round(federal.calculateIncomeTax(50000).toFixed(2));
        assert.strictEqual(tax, 6617); // Calculated based on brackets
    });

    it('should calculate federal tax for $200,000 income', function () {
        const federal = new FederalTaxes();
        const tax = Math.round(federal.calculateIncomeTax(200000).toFixed(2));
        assert.strictEqual(tax, 44231);
    });

    it('should calculate federal tax for $1,000,000 income', function () {
        const federal = new FederalTaxes();
        const tax = Math.round(federal.calculateIncomeTax(1000000).toFixed(2));
        assert.strictEqual(tax, 332953);
    });
});

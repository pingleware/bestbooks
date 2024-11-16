const assert = require('assert');
const {
    StateTaxes
} = require('../index');

describe('StateTaxes', function () {
    it('should calculate state income tax for $50,000 income in CA', function () {
        const state = new StateTaxes('CA');
        const tax = state.calculateIncomeTax(50000);
        assert.strictEqual(tax, 6500); // 13% of 50000
    });

    it('should calculate state sales tax for $100 amount in CA', function () {
        const state = new StateTaxes('CA');
        const tax = Number(state.calculateSalesTax(100).toFixed(2));
        assert.strictEqual(tax, 7.25); // 7.25% of 100
    });

    it('should calculate state income tax for $50,000 income in TX (no income tax)', function () {
        const state = new StateTaxes('TX');
        const tax = Number(state.calculateIncomeTax(50000).toFixed(2));
        assert.strictEqual(tax, 2500); // No income tax in TX
    });

    it('should calculate state sales tax for $100 amount in TX', function () {
        const state = new StateTaxes('TX');
        const tax = state.calculateSalesTax(100);
        assert.strictEqual(tax, 6.25); // 6.25% of 100
    });
});

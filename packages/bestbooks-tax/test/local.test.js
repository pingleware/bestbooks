const assert = require('assert');
const {
    LocalTaxes
} = require('../index');

describe('LocalTaxes', function () {
    it('should calculate local income tax for $50,000 income in San Francisco', function () {
        const local = new LocalTaxes('San Francisco');
        const tax = local.calculateIncomeTax(50000);
        assert.strictEqual(tax, 625); // 1.25% of 50000
    });

    it('should calculate local sales tax for $100 amount in San Francisco', function () {
        const local = new LocalTaxes('San Francisco');
        const tax = local.calculateSalesTax(100);
        assert.strictEqual(tax, 1); // 1% of 100
    });

    it('should calculate local income tax for $50,000 income in New York City', function () {
        const local = new LocalTaxes('New York City');
        const tax = Number(local.calculateIncomeTax(50000).toFixed(0));
        assert.strictEqual(tax, 1750); // 3.5% of 50000
    });

    it('should calculate local sales tax for $100 amount in New York City', function () {
        const local = new LocalTaxes('New York City');
        const tax = local.calculateSalesTax(100);
        assert.strictEqual(tax, 4.50); // 4.5% of 100
    });

    it('should use default tax rates for undefined cities', function () {
        const local = new LocalTaxes('Unknown City');
        const tax = local.calculateIncomeTax(50000);
        assert.strictEqual(tax, 500.00); // 1% default of 50000
    });
});

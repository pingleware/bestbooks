const assert = require('assert');
const {
    StateTaxes
} = require('../index');

describe('StateTaxes', function () {
    it('should calculate state income tax for $50,000 income in CA',async function () {
        const state = new StateTaxes('CA');
        const tax = await state.calculateIncomeTax(50000);
        assert.strictEqual(tax, 6500); // 13% of 50000
    });

    it('should calculate state sales tax for $100 amount in CA',async function () {
        const state = new StateTaxes('CA');
        const tax = await state.calculateSalesTax(100);
        assert.strictEqual(tax.toFixed(2), '7.25'); // 7.25% of 100
    });

    it('should calculate state income tax for $50,000 income in TX (no income tax)',async function () {
        const state = new StateTaxes('TX');
        const tax = await state.calculateIncomeTax(50000);
        assert.strictEqual(tax, 2500); // No income tax in TX
    });

    it('should calculate state sales tax for $100 amount in TX',async function () {
        const state = new StateTaxes('TX');
        const tax = await state.calculateSalesTax(100);
        assert.strictEqual(tax, 6.25); // 6.25% of 100
    });
});

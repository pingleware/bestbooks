"use strict"

const PluginManager = require('./pluginManager.js');

class LocalTaxes {
    constructor(city) {
        this.city = city;
        this.localTaxRates = {
            "San Francisco": 0.0125,
            "New York City": 0.035,
            "Dallas": 0.02,
        };
        this.init();
    }

    async init() {
        this.pluginManager = new PluginManager();
        await this.pluginManager.loadPlugins();
    }


    async calculateIncomeTax(income) {
        this.taxBracketsPlugin = await this.pluginManager.plugins.find(p => p.name === 'taxbrackets');
        this.localTaxRate = await this.taxBracketsPlugin.plugin.getCityTaxRates({ city: this.city });

        const rate = this.localTaxRate || 0.01;
        return Number(income) * Number(rate);
    }

    async calculateSalesTax(amount) {
        this.taxBracketsPlugin = await this.pluginManager.plugins.find(p => p.name === 'taxbrackets');
        this.salesTaxRate = await this.taxBracketsPlugin.plugin.getCitySalesTaxRates({ city: this.city });

        const rate = this.salesTaxRate || 0.01;
        return Number(amount) * Number(rate);
    }
}

module.exports = LocalTaxes;

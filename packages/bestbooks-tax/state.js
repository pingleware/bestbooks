"use strict"

const PluginManager = require('./pluginManager.js');

class StateTaxes {
    constructor(state) {
        this.state = state;
        this.init();
    }

    async init() {
        this.pluginManager = new PluginManager();
        await this.pluginManager.loadPlugins();
    }


    async calculateIncomeTax(income) {
        this.taxBracketsPlugin = await this.pluginManager.plugins.find(p => p.name === 'taxbrackets');
        this.stateTaxRate = await this.taxBracketsPlugin.plugin.getStateTaxRates({ state: this.state });
        const rate = this.stateTaxRate || 0.05;
        return Number(income) * Number(rate);
    }

    async calculateSalesTax(amount) {
        this.taxBracketsPlugin = await this.pluginManager.plugins.find(p => p.name === 'taxbrackets');
        this.stateSalesTaxRate = await this.taxBracketsPlugin.plugin.getStateSalesTaxRates({ state: this.state });
        
        const rate = Number(this.stateSalesTaxRate) || 0.05;
        return Number(amount) * Number(rate);
    }
}

module.exports = StateTaxes;

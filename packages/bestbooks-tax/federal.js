"use strict"

const PluginManager = require('./pluginManager.js');

class FederalTaxes {
    constructor() {
        this.init();
    }

    async init() {
        this.pluginManager = new PluginManager();
        await this.pluginManager.loadPlugins();
    }

    async calculateIncomeTax(income) {
        let tax = 0;
        this.taxBracketsPlugin = await this.pluginManager.plugins.find(p => p.name === 'taxbrackets');
        this.taxBrackets = await this.taxBracketsPlugin.plugin.getFederalTaxBrackets();

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

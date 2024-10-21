"use strict"

const FederalTaxes = require('./federal');
const StateTaxes = require('./state');
const LocalTaxes = require('./local');

module.exports = {
    FederalTaxes,
    StateTaxes,
    LocalTaxes,
}
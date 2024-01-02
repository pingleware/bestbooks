"use strict"

const {PerformanceConformanceManagement} = require('./mea01');
const {InternalControlMonitoring} = require('./mea02');
const {ComplianceMonitoring} = require('./mea03');
const {ITGovernanceAssurance} = require('./mea04');


module.exports = {
    PerformanceConformanceManagement,
    InternalControlMonitoring,
    ComplianceMonitoring,
    ITGovernanceAssurance,
}
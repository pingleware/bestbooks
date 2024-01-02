"use strict"

const {OperationsManagement} = require('./dss01');
const {ServiceRequestIncidentManagement} = require('./dss02');
const {ProblemManagement} = require('./dss03');
const {ContinuityManagement} = require('./dss04');
const {SecurityServicesManagement} = require('./dss05');
const {BusinessProcessControlsManagement} = require('./dss06');
const {DataManagement} = require('./dss07');
const {FacilitiesManagement} = require('./dss08');

module.exports = {
    OperationsManagement,
    ServiceRequestIncidentManagement,
    ProblemManagement,
    ContinuityManagement,
    SecurityServicesManagement,
    BusinessProcessControlsManagement,
    DSSDataManagenent: DataManagement,
    FacilitiesManagement,
}   
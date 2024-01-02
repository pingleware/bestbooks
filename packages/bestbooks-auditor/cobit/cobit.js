"use strict"

const {
  ITManagementFramework,
  ITStrategy,
  EnterpriseArchitecture,
  InnovationManagement,
  ITPortfolio,
  ITBudget,
  HRManagement,
  RelationshipManagement,
  ServiceAgreements
} = require('./apo/apo');
const {
  ProgramManagement,
  RequirementsManagement,
  SolutionsManagement,
  DataManagement,
  SystemsSecurity,
  ChangeManagement,
  ChangeAcceptance,
  KnowledgeManagement,
  AssetManagement,
  ConfigurationManagement,
} = require('./bai/bai');
const {
  OperationsManagement,
  ServiceRequestIncidentManagement,
  ProblemManagement,
  ContinuityManagement,
  SecurityServicesManagement,
  BusinessProcessControlsManagement,
  DSSDataManagement,
  FacilitiesManagement,
} = require('./dss/dss');
const {
  GovernanceFramework,
  GovernanceStructure,
  BenefitsDelivery,
  RiskOptimization,
  ResourceOptimization,
  StakeholderTransparency,
} = require('./edm/edm');
const {
  PerformanceConformanceManagement,
  InternalControlMonitoring,
  ComplianceMonitoring,
  ITGovernanceAssurance,
} = require('./mea/mea');

// COBIT Module

var COBIT = (function () {
    // Private variables
    var controlObjectives = [];
  
    // Private methods
    function addControlObjective(objective) {
      controlObjectives.push(objective);
    }

    function getControlObjectives() {
      return controlObjectives;
    }
  
    // Public API
    return {
      addControlObjective: addControlObjective,
      getControlObjectives: getControlObjectives,
    };
  })();
  
  /*
  // Usage example
  COBIT.addControlObjective("COBIT Control Objective 1");
  COBIT.addControlObjective("COBIT Control Objective 2");
  
  var objectives = COBIT.getControlObjectives();
  console.log(objectives); // Output: ["COBIT Control Objective 1", "COBIT Control Objective 2"]
  */

  module.exports = {
    COBIT,
    ITManagementFramework,
    ITStrategy,
    EnterpriseArchitecture,
    InnovationManagement,
    ITPortfolio,
    ITBudget,
    HRManagement,
    RelationshipManagement,
    ServiceAgreements, 
    ProgramManagement,
    RequirementsManagement,
    SolutionsManagement,
    DataManagement,
    SystemsSecurity,
    ChangeManagement,
    ChangeAcceptance,
    KnowledgeManagement,
    AssetManagement,
    ConfigurationManagement, 
    OperationsManagement,
    ServiceRequestIncidentManagement,
    ProblemManagement,
    ContinuityManagement,
    SecurityServicesManagement,
    BusinessProcessControlsManagement,
    DSSDataManagement,
    FacilitiesManagement,  
    GovernanceFramework,
    GovernanceStructure,
    BenefitsDelivery,
    RiskOptimization,
    ResourceOptimization,
    StakeholderTransparency,
    PerformanceConformanceManagement,
    InternalControlMonitoring,
    ComplianceMonitoring,
    ITGovernanceAssurance,
  }
  
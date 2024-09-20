"use strict"

/**
 *   // Example usage:
 *  
 *   // Create a new COBITAudit instance
 *   const myCOBITAudit = new COBITAudit();
 *   
 *   // Add controls to the audit
 *   myCOBITAudit.addControl('AI01', 'Manage AI Risks', 'Ensure that AI-related risks are identified and managed.');
 *   myCOBITAudit.addControl('DS02', 'Manage Third-Party Services', 'Ensure proper management of third-party services.');
 *   
 *   // Assess controls
 *   myCOBITAudit.assessControl('AI01', 'Compliant');
 *   myCOBITAudit.assessControl('DS02', 'Not Compliant');
 *   
 *   // Generate and print a summary report
 *   myCOBITAudit.generateSummaryReport();
 *   
 */

const {
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
} = require("./cobit.js");

// Define a COBITAudit object constructor
function COBITAudit() {
    this.controls = {};
  }
  
  // Define a method to add a control to the audit
  COBITAudit.prototype.addControl = function (controlId, controlName, controlDescription) {
    this.controls[controlId] = {
      name: controlName,
      description: controlDescription,
      status: 'Not Assessed', // You can customize the status based on your needs
    };
    COBIT.addControlObjective(controlName);
  };
  
  // Define a method to assess a control
  COBITAudit.prototype.assessControl = function (controlId, status) {
    if (this.controls[controlId]) {
      this.controls[controlId].status = status;
    } else {
      console.error(`Control ${controlId} not found.`);
    }
  };
  
  // Define a method to generate a summary report
  COBITAudit.prototype.generateSummaryReport = function () {
    console.log('COBIT Audit Summary Report:');
    console.log('----------------------------------------');
    Object.keys(this.controls).forEach((controlId) => {
      const control = this.controls[controlId];
      console.log(`Control ID: ${controlId}`);
      console.log(`Name: ${control.name}`);
      console.log(`Description: ${control.description}`);
      console.log(`Status: ${control.status}`);
      console.log('----------------------------------------');
    });
  };
  
module.exports = {
    COBITAudit,
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
};
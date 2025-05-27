// EDM03 Risk Optimization Implementation

"use strict"

var RiskOptimization = {
    riskIdentification: [],
    riskAssessment: [],
    riskMitigation: [],
};
  
// Define risk identification data
RiskOptimization.riskIdentification = [
    {
      process: "IT Change Management",
      risks: ["Service disruptions", "Data integrity issues"],
      responsibleParty: "IT Operations",
    },
    {
      process: "Vendor Management",
      risks: ["Vendor non-performance", "Data security breaches"],
      responsibleParty: "Procurement Department",
    },
];
  
// Define risk assessment data
RiskOptimization.riskAssessment = [
    {
      process: "IT Change Management",
      risk: "Service disruptions",
      likelihood: "High",
      impact: "Medium",
    },
    {
      process: "IT Change Management",
      risk: "Data integrity issues",
      likelihood: "Medium",
      impact: "High",
    },
];
  
// Define risk mitigation actions
RiskOptimization.riskMitigation = [
    {
      process: "IT Change Management",
      risk: "Service disruptions",
      mitigationActions: ["Implement rigorous testing procedures", "Perform change rollbacks"],
      responsibleParty: "IT Operations",
    },
    {
      process: "IT Change Management",
      risk: "Data integrity issues",
      mitigationActions: ["Implement data validation checks", "Regularly backup critical data"],
      responsibleParty: "IT Operations",
    },
];
  
module.exports = {
  RiskOptimization
};
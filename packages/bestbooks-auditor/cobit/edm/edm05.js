// EDM05 Stakeholder Transparency Implementation

"use strict"

var StakeholderTransparency = {
    communicationChannels: [],
    performanceReporting: [],
    riskReporting: [],
  };
  
  // Define communication channels
  StakeholderTransparency.communicationChannels = [
    "Email",
    "Company Intranet",
    "Monthly Meetings",
    "Executive Dashboards",
  ];
  
  // Define performance reporting data
  StakeholderTransparency.performanceReporting = [
    {
      process: "Service Desk",
      metrics: ["Average Response Time", "First Call Resolution Rate"],
      frequency: "Monthly",
      responsibleParty: "IT Operations",
    },
    {
      process: "Application Development",
      metrics: ["Defect Density", "Code Coverage"],
      frequency: "Quarterly",
      responsibleParty: "Development Team",
    },
  ];
  
  // Define risk reporting data
  StakeholderTransparency.riskReporting = [
    {
      process: "IT Change Management",
      risks: ["Service disruptions", "Data integrity issues"],
      riskLevel: "Medium",
      responsibleParty: "IT Operations",
    },
    {
      process: "Vendor Management",
      risks: ["Vendor non-performance", "Data security breaches"],
      riskLevel: "High",
      responsibleParty: "Procurement Department",
    },
  ];
  
module.exports = StakeholderTransparency;
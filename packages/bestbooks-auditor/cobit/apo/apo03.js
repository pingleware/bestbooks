// APO03 - Manage Enterprise Architecture Implementation

"use strict"

var EnterpriseArchitecture = {
    framework: "TOGAF",
    architecturePrinciples: [
      "Modularity: Systems should be designed as modular components for flexibility and reusability.",
      "Standardization: Use standardized technologies and protocols to ensure interoperability.",
    ],
    architectureModels: [
      {
        modelName: "Application Architecture",
        description: "Describes the structure and interaction of applications.",
        owner: "Enterprise Architect",
      },
      {
        modelName: "Data Architecture",
        description: "Defines how data is stored, processed, and accessed.",
        owner: "Data Architect",
      },
    ],
    architectureGovernance: {
      reviewProcess: "Architecture Review Board (ARB) reviews and approves architecture changes.",
      complianceChecks: [
        "Alignment with business goals",
        "Adherence to architecture principles",
        "Compliance with regulatory requirements",
      ],
    },
  };
  
module.exports = EnterpriseArchitecture;
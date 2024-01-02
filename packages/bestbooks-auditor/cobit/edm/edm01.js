// EDM01 Governance Framework

"use strict"

const GovernanceFramework = {
    governancePrinciples: [],
    governancePolicies: {},
    governanceStructures: {},
  };
  
  // Define governance principles
  GovernanceFramework.governancePrinciples = [
    "Accountability",
    "Transparency",
    "Integrity",
    "Ethical Behavior",
  ];
  
  // Define governance policies
  GovernanceFramework.governancePolicies = {
    decisionMaking: "Policy for decision-making processes",
    authorityDelegation: "Policy for authority delegation",
    riskManagement: "Policy for risk management",
    compliance: "Policy for compliance management",
  };
  
  // Define governance structures
  GovernanceFramework.governanceStructures = {
    board: "Governance Board",
    committees: ["Audit Committee", "Risk Committee"],
  };
  
// EDM01 Governance Structure

const GovernanceStructure = {
  governanceBoard: {
    role: "Governance Board",
    responsibilities: [
      "Setting strategic direction and goals",
      "Establishing governance policies and frameworks",
      "Ensuring compliance with laws and regulations",
      "Monitoring organizational performance",
      "Approving major decisions and initiatives",
    ],
  },
  committees: [
    {
      role: "Audit Committee",
      responsibilities: [
        "Overseeing financial reporting and internal controls",
        "Evaluating audit processes and effectiveness",
        "Assessing risk management practices",
        "Reviewing compliance with regulatory requirements",
      ],
    },
    {
      role: "Risk Committee",
      responsibilities: [
        "Identifying and assessing organizational risks",
        "Developing risk management strategies",
        "Monitoring risk mitigation activities",
        "Reviewing risk reporting and controls",
      ],
    },
  ],
};

  
module.exports = {
  GovernanceFramework,
  GovernanceStructure
}
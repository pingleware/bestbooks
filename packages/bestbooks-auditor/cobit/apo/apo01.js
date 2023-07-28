// APO01 - Manage the IT Management Framework Implementation

"use strict"

var ITManagementFramework = {
    governanceFramework: "COBIT",
    policies: [
      {
        policyName: "IT Security Policy",
        description: "Defines security controls and procedures",
        owner: "Chief Information Security Officer (CISO)",
      },
      {
        policyName: "Change Management Policy",
        description: "Defines processes for managing changes to IT systems",
        owner: "IT Operations Manager",
      },
    ],
    procedures: [
      {
        procedureName: "Incident Management Procedure",
        description: "Defines steps to handle and resolve IT incidents",
        owner: "Service Desk Manager",
      },
      {
        procedureName: "Backup and Recovery Procedure",
        description: "Defines processes for data backup and recovery",
        owner: "Data Center Manager",
      },
    ],
  };
  
module.exports = ITManagementFramework;
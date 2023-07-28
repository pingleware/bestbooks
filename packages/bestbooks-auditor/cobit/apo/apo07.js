// APO07 - Manage Human Resources Implementation

/**
 * 1. roles: An array of role objects representing the different IT roles within the organization. 
 *      Each object includes properties such as the role name and a list of responsibilities associated with that role. 
 *      This helps define the roles and responsibilities of IT personnel.
 * 2. skillsMatrix: Specifies the required skills for each role within the organization. 
 *      It includes an array of role-skill pairs, where each pair consists of the role name and the corresponding skills associated with that role. 
 *      This helps identify the necessary skills and competencies required for each role.
 * 3. trainingPrograms: Represents the training programs or initiatives offered to enhance the skills and competencies of IT personnel. 
 *      It is an array listing the various training programs available, such as leadership development, IT project management, and technical skills training.
 */

"use strict"

var HRManagement = {
    roles: [
      {
        roleName: "IT Manager",
        responsibilities: [
          "Provide strategic direction for IT initiatives",
          "Manage IT budgets and resources",
          "Oversee project planning and execution",
        ],
      },
      {
        roleName: "System Administrator",
        responsibilities: [
          "Manage and maintain IT infrastructure",
          "Monitor system performance and troubleshoot issues",
          "Implement security measures and controls",
        ],
      },
    ],
    skillsMatrix: [
      {
        role: "IT Manager",
        skills: ["Leadership", "Financial management", "Project management"],
      },
      {
        role: "System Administrator",
        skills: ["System administration", "Network management", "Troubleshooting"],
      },
    ],
    trainingPrograms: [
      "Leadership development",
      "IT project management",
      "Technical skills training",
    ],
  };
  
module.exports = HRManagement;  
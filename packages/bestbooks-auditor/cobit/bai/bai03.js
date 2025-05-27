// BAI03 - Manage Solutions Identification and Build Implementation

/**
 * projectID and projectName: Identifies the project associated with the solutions management activities. 
 *      These properties represent the unique project identifier and the name of the project.
 * businessRequirements: An array of business requirement objects representing the identified business requirements for the project. 
 *      Each object includes properties such as the requirement ID, requirement type (e.g., functional, non-functional), and description of the requirement.
 * proposedSolutions: An array of proposed solution objects representing the identified solutions to address the business requirements. 
 *      Each object includes properties such as the solution ID, description of the solution, and status (e.g., under evaluation, approved).
 * solutionBuildApproach: Describes the approach or methodology used for building the solutions. 
 *      In this example, it is set as "Follow agile development methodology and leverage DevOps practices." 
 *      You can customize it to reflect your organization's specific solution build approach.
 * solutionTestingApproach: Specifies the approach for testing the solutions, including unit testing, integration testing, and user acceptance testing.
 */

"use strict"

var SolutionsManagement = {
    projectID: "PR001",
    projectName: "Digital Transformation",
    businessRequirements: [
      {
        requirementID: "REQ001",
        requirementType: "Functional",
        description: "Ability to automate manual processes",
      },
      {
        requirementID: "REQ002",
        requirementType: "Non-functional",
        description: "Scalability to support future growth",
      },
    ],
    proposedSolutions: [
      {
        solutionID: "SOL001",
        description: "Implement a Robotic Process Automation (RPA) system",
        status: "Under evaluation",
      },
      {
        solutionID: "SOL002",
        description: "Adopt cloud-based infrastructure for scalability",
        status: "Approved",
      },
    ],
    solutionBuildApproach: "Follow agile development methodology and leverage DevOps practices",
    solutionTestingApproach: "Perform unit testing, integration testing, and user acceptance testing",
  };
  
module.exports = SolutionsManagement;
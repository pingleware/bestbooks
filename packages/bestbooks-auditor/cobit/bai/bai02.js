// BAI02 - Manage Requirements Definition Implementation

/**
 * projectID and projectName: Identifies the project associated with the requirements management activities. 
 *      These properties represent the unique project identifier and the name of the project.
 * requirements: An array of requirement objects representing the defined requirements for the project. 
 *      Each object includes properties such as the requirement ID, requirement type (e.g., functional, non-functional), description of the requirement, priority, and status. 
 *      This information helps track and manage the requirements.
 * requirementGatheringApproach: Describes the approach or methodology used for gathering requirements. 
 *      In this example, it is set as "Conduct workshops with stakeholders and utilize requirement gathering templates." 
 *      You can customize it to reflect your organization's specific requirement gathering approach.
 * requirementValidationApproach: Specifies the approach for validating the requirements, ensuring that they are complete, accurate, and aligned with stakeholders' 
 *      expectations. The example approach is "Perform reviews, walkthroughs, and obtain stakeholder sign-off."
 */

"use strict"

var RequirementsManagement = {
    projectID: "PR001",
    projectName: "Digital Transformation",
    requirements: [
      {
        requirementID: "REQ001",
        requirementType: "Functional",
        description: "Ability to automate manual processes",
        priority: "High",
        status: "Approved",
      },
      {
        requirementID: "REQ002",
        requirementType: "Non-functional",
        description: "Scalability to support future growth",
        priority: "Medium",
        status: "Under review",
      },
    ],
    requirementGatheringApproach: "Conduct workshops with stakeholders and utilize requirement gathering templates",
    requirementValidationApproach: "Perform reviews, walkthroughs, and obtain stakeholder sign-off",
  };
  
module.exports = RequirementsManagement;  
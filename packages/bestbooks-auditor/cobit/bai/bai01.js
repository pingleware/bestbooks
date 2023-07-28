// BAI01 - Manage Programs and Projects Implementation

/**
 * programs: An array of program objects representing the IT programs within the organization. 
 *      Each object includes properties such as the program ID, program name, description, program manager, start date, end date, and status. 
 *      This information helps track and manage the programs.
 * projectManagementApproach: Describes the approach or methodology used for project management. 
 *      In this example, it is set as "Follow a structured project management methodology and leverage project management software." 
 *      You can customize it to reflect your organization's specific project management approach.
 * projectGovernance: Specifies the approach to project governance, including the establishment of a governance framework with clear roles and responsibilities. 
 *      This ensures that projects are managed and controlled effectively.
 */

"use strict"

var ProgramManagement = {
    programs: [
      {
        programID: "PR001",
        programName: "Digital Transformation",
        description: "Implement digital solutions to enhance operational efficiency",
        programManager: "John Smith",
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        status: "In progress",
      },
      {
        programID: "PR002",
        programName: "Data Analytics",
        description: "Leverage data analytics to gain insights and improve decision-making",
        programManager: "Jane Doe",
        startDate: "2023-06-01",
        endDate: "2024-09-30",
        status: "Planned",
      },
    ],
    projectManagementApproach: "Follow a structured project management methodology and leverage project management software",
    projectGovernance: "Establish project governance framework with clear roles and responsibilities",
  };
  
module.exports = ProgramManagement;  
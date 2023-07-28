// APO05 - Manage Portfolio Implementation

"use strict"

var ITPortfolio = {
    projects: [
      {
        projectID: "P001",
        projectName: "Digital Transformation Initiative",
        description: "Implement digital solutions to enhance customer experience",
        businessObjective: "Increase online sales by 20%",
        status: "In progress",
        priority: "High",
      },
      {
        projectID: "P002",
        projectName: "Infrastructure Upgrade",
        description: "Upgrade network infrastructure to improve performance and security",
        businessObjective: "Ensure 99.9% network uptime",
        status: "Planned",
        priority: "Medium",
      },
    ],
    resourceAllocation: {
      budget: 1000000, // Total budget allocated for IT initiatives
      allocationByCategory: [
        { category: "Application Development", budgetAllocation: 600000 },
        { category: "Infrastructure", budgetAllocation: 300000 },
        { category: "Security", budgetAllocation: 100000 },
      ],
    },
    projectMetrics: [
      "Return on Investment (ROI)",
      "Schedule adherence",
      "Quality of deliverables",
    ],
  };
  
module.exports = ITPortfolio;  
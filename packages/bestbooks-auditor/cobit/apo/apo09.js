// APO09 - Manage Service Agreements Implementation

/**
 * 1. agreements: An array of agreement objects representing the service agreements established between the IT department and service providers. 
 *      Each object includes properties such as the agreement ID, agreement type (e.g., Service Level Agreement (SLA), Underpinning Contract (UC)), 
 *      service, provider, agreed service levels, and review date. The agreed service levels include the specific service level targets, measurement frequency, 
 *      and relevant metrics.
 * 2. agreementManagementApproach: Describes the approach or strategy for managing service agreements. 
 *      In this example, it is set as "Establish clear agreements, regularly monitor service levels, and conduct periodic reviews and revisions." 
 *      You can customize it to reflect your organization's specific approach to managing service agreements.
 */

"use strict"

var ServiceAgreements = {
    agreements: [
      {
        agreementID: "SA001",
        agreementType: "Service Level Agreement (SLA)",
        service: "Network Operations",
        provider: "Internal IT Department",
        agreedServiceLevels: [
          {
            serviceLevel: "Network availability",
            target: "99.9%",
            measurement: "Monthly",
          },
          {
            serviceLevel: "Incident response time",
            target: "4 hours",
            measurement: "24x7",
          },
        ],
        reviewDate: "2023-12-31",
      },
      {
        agreementID: "SA002",
        agreementType: "Underpinning Contract (UC)",
        service: "Cloud Hosting",
        provider: "External Cloud Provider",
        agreedServiceLevels: [
          {
            serviceLevel: "Infrastructure uptime",
            target: "99.99%",
            measurement: "Annual",
          },
          {
            serviceLevel: "Data backup and recovery",
            target: "48 hours",
            measurement: "On-demand",
          },
        ],
        reviewDate: "2024-06-30",
      },
    ],
    agreementManagementApproach:
      "Establish clear agreements, regularly monitor service levels, and conduct periodic reviews and revisions.",
  };
  
module.exports = ServiceAgreements;
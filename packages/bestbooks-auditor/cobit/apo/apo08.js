// APO08 - Manage Relationships Implementation

/**
 * 1. internalStakeholders: An array listing the internal stakeholders within the organization with whom the IT department needs to manage relationships. 
 *      Examples include executive management, business units, and other departments within the organization.
 * 2. externalStakeholders: An array listing the external stakeholders outside the organization who are important for the IT department to engage with. 
 *      Examples include vendors, customers, regulatory bodies, and other external partners.
 * 3. communicationChannels: Represents the various communication channels utilized to engage with stakeholders. 
 *      It is an array listing the different communication channels, such as email, meetings, collaboration tools, and project management software.
 * 4. relationshipManagementApproach: Describes the approach or strategy for managing relationships with stakeholders. 
 *      In this example, it is set as "Establish regular communication channels, engage stakeholders in decision-making, and manage expectations." 
 *      You can customize it to reflect your organization's specific relationship management practices.
 */

"use strict"

var RelationshipManagement = {
    internalStakeholders: ["Executive Management", "Business Units", "IT Department"],
    externalStakeholders: ["Vendors", "Customers", "Regulatory Bodies"],
    communicationChannels: [
      "Email",
      "Meetings",
      "Collaboration Tools",
      "Project Management Software",
    ],
    relationshipManagementApproach:
      "Establish regular communication channels, engage stakeholders in decision-making, and manage expectations.",
  };
  
  module.exports = RelationshipManagement;
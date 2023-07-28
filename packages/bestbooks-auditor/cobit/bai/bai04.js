// BAI04 - Manage Data Implementation

/**
 * When considering levels of business communication, the order typically ranges from the most restricted and confidential to the most open and public. Here is a list of common levels of business communication, listed from confidential to public:
 * 
 * 1. Confidential: Communication at this level is highly sensitive and should only be disclosed to authorized individuals with a need-to-know basis. 
 *                  It often involves proprietary information, trade secrets, or sensitive personal data.
 * 
 * 2. Restricted: Communication at this level is restricted to a specific group of individuals or stakeholders who have been granted access based on their roles or 
 *                  responsibilities. It may include confidential information that is shared within a limited circle of trusted parties.
 * 
 * 3. Internal: Communication at this level is intended for internal use within the organization. It includes information shared among employees, teams, 
 *                  or departments to facilitate internal operations, collaboration, and decision-making.
 * 
 * 4. External: Communication at this level involves sharing information with external parties, such as clients, customers, vendors, or partners. 
 *                  It may include project updates, sales presentations, or discussions related to business relationships.
 * 
 * 5. Public: Communication at this level is meant for the general public and is openly accessible to anyone. 
 *                  It includes public announcements, press releases, marketing materials, and information shared on public platforms like websites, social media, 
 *                  or public forums.
 * 
 * It's important to note that the classification and handling of business communication may vary depending on the organization, industry, and applicable regulations. The above list provides a general framework for understanding the levels of business communication, but specific classification and handling practices should be defined based on organizational policies and requirements.
 */

"use strict"

var DataManagement = {
    dataClassification: [
      {
        classificationID: "CL001",
        classificationName: "Confidential",
        description: "Highly sensitive data requiring strict access controls",
      },
      {
        classificationID: "CL002",
        classificationName: "Restricted",
        description: "Restricted data to a specific group of individuals or stakeholders",
      },
      {
        classificationID: "CL003",
        classificationName: "Internal",
        description: "Internal data for business operations",
      },
      {
        classificationID: "CL004",
        classificationName: "External",
        description: "Data for sharing with external parties, such as clients, customers, vendors, or partners",
      },
      {
        classificationID: "CL005",
        classificationName: "Public",
        description: "Data meant for the general public and is openly accessible to anyone",
      },
    ],
    dataLifecycleManagement: {
      dataGathering: "Collect data from various sources",
      dataStorage: "Store data securely in databases or data repositories",
      dataProcessing: "Process and analyze data using appropriate tools",
      dataRetention: "Define data retention policies and archive data as needed",
      dataDisposal: "Securely dispose of data when no longer needed",
    },
    dataProtectionControls: [
      {
        controlID: "CTRL001",
        controlName: "Access controls",
        description: "Implement authentication and authorization mechanisms",
      },
      {
        controlID: "CTRL002",
        controlName: "Encryption",
        description: "Apply encryption to protect sensitive data in transit and at rest",
      },
    ],
  };
  
  
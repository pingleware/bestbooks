// BAI10 - Manage Configuration Implementation

/**
 * configurationIdentification: Involves identifying and documenting the configuration items (CIs) that make up the organization's technology infrastructure. 
 *      This step helps create an inventory of CIs and their relationships.
 * configurationBaseline: Establishes baselines for each CI to define their approved and authorized state. 
 *      These baselines serve as reference points for configuration changes and ensure that configurations are controlled and aligned with organizational standards.
 * configurationControl: Covers various aspects of configuration control. 
 *      It includes implementing a change management process to control and track changes to CIs, 
 *      implementing version control mechanisms to manage different versions of CIs, 
 *      and conducting regular configuration audits to verify the accuracy and integrity of the configuration information.
 * configurationStatusAccounting: Emphasizes maintaining up-to-date records of the status and history of each CI. 
 *      This includes tracking changes, current configurations, and any related information that provides a comprehensive view of the CI's lifecycle.
 * configurationVerificationandAudit: Involves verifying that the actual configurations of CIs match their defined configurations and conducting periodic configuration 
 *      audits to ensure compliance with configuration management policies and procedures. These activities help ensure the integrity and consistency of configurations.
 * configurationReporting: Highlights the generation of reports on the status, changes, and performance of the configuration items. 
 *      These reports provide valuable insights for decision-making and monitoring purposes.
 * configurationPlanning: Focuses on developing a configuration management plan that outlines the strategies, procedures, and responsibilities for managing configuration
 */

"use strict"

var ConfigurationManagement = {
    configurationIdentification: "Identify and document the configuration items (CIs) that make up the organization's technology infrastructure",
    configurationBaseline: "Establish baselines for each CI to define its approved and authorized state",
    configurationControl: {
      changeManagement: "Implement a change management process to control and track changes to CIs",
      versionControl: "Implement version control mechanisms to manage different versions of CIs",
      configurationAudit: "Conduct regular configuration audits to verify the accuracy and integrity of the configuration information",
    },
    configurationStatusAccounting: "Maintain up-to-date records of the status and history of each CI, including changes and current configurations",
    configurationVerificationandAudit: {
      configurationverification: "Verify that the actual configurations of CIs match their defined configurations",
      configurationaudit: "Conduct periodic configuration audits to ensure compliance with configuration management policies and procedures",
    },
    configurationReporting: "Generate reports on the status, changes, and performance of the configuration items for decision-making and monitoring purposes",
    configurationPlanning: "Develop a configuration management plan that outlines the strategies, procedures, and responsibilities for managing configurations",
  };
  
module.exports = ConfigurationManagement;  
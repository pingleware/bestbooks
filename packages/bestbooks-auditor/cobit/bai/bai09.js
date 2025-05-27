// BAI09 - Manage Assets Implementation

/**
 * assetInventory: Involves maintaining an inventory of all assets within the organization, including hardware, software, data, and other digital and physical assets. 
 *      This provides visibility and control over the organization's asset landscape.
 * assetClassification: Focuses on classifying assets based on their criticality, sensitivity, and value to the organization. 
 *      This classification helps prioritize resource allocation and security measures.
 * assetOwnership: Assigns ownership and accountability for each asset to ensure clear responsibility. 
 *      This helps ensure that assets are properly managed and maintained.
 * assetLifecycleManagement: Covers the various stages of an asset's lifecycle. 
 *      It includes processes for acquiring assets through procurement, licensing, and contract management. 
 *      It also involves managing the deployment, utilization, maintenance, and disposal of assets in a controlled and secure manner.
 * assetProtection: Addresses the protection of assets from various threats. 
 *      It includes implementing access controls to prevent unauthorized access, establishing backup and recovery procedures to ensure availability and integrity, 
 *      encrypting sensitive data to protect confidentiality, and implementing physical security measures for physical assets.
 * assetMonitoring: Involves monitoring assets to detect and respond to security incidents or anomalies. 
 *      This includes implementing monitoring controls, conducting vulnerability management activities, and monitoring compliance with relevant laws, regulations, 
 *      and policies.
 */

"use strict"

var AssetManagement = {
    assetInventory: "Maintain an inventory of all assets, including hardware, software, data, and other digital and physical assets",
    assetClassification: "Classify assets based on their criticality, sensitivity, and value to the organization",
    assetOwnership: "Assign ownership and accountability for each asset to ensure clear responsibility",
    assetLifecycleManagement: {
      acquisition: "Define processes for acquiring assets, including procurement, licensing, and contract management",
      deployment: "Manage the deployment and installation of assets in a controlled and secure manner",
      utilization: "Monitor and optimize the utilization of assets to ensure efficient usage",
      maintenance: "Establish maintenance procedures to keep assets in a good operational state",
      disposal: "Implement proper disposal methods for retiring or disposing of assets to mitigate risks",
    },
    assetProtection: {
      accessControls: "Implement appropriate access controls to protect assets from unauthorized access",
      backupAndRecovery: "Establish backup and recovery procedures to ensure the availability and integrity of assets",
      dataEncryption: "Encrypt sensitive data to protect its confidentiality during storage and transmission",
      physicalSecurity: "Implement physical security measures to safeguard physical assets from theft or damage",
    },
    assetMonitoring: {
      monitoringControls: "Implement monitoring controls to detect and respond to security incidents or anomalies affecting assets",
      vulnerabilityManagement: "Regularly assess and address vulnerabilities that could compromise asset security",
      complianceMonitoring: "Monitor asset-related activities to ensure compliance with relevant laws, regulations, and policies",
    },
  };
  
module.exports = AssetManagement;
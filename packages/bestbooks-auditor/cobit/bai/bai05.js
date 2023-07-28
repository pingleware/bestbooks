// BAI05 - Ensure Systems Security Implementation

/**
 * riskAssessment: Represents the practice of performing regular risk assessments to identify potential security vulnerabilities and prioritize security measures 
 *      accordingly.
 * accessControls: Includes various controls related to access management. 
 *      It covers authentication mechanisms (e.g., passwords, multi-factor authentication), authorization practices (e.g., least privilege principle), 
 *      and user account management procedures.
 * dataProtection: Focuses on protecting data from unauthorized access or disclosure. 
 *      It includes encryption of sensitive data, regular data backup and recovery procedures, and defining data retention policies.
 * monitoringAndIncidentResponse: Addresses the need for continuous security monitoring and incident response capabilities. 
 *      It involves implementing security monitoring systems, establishing an incident response plan, and providing security awareness training to employees.
 * securityCompliance: Highlights the importance of complying with applicable laws, regulations, and industry standards. 
 *      It emphasizes the establishment and enforcement of security policies and procedures, as well as conducting regular security audits.
 */

"use strict"

var SystemsSecurity = {
    riskAssessment: "Perform regular risk assessments to identify potential security vulnerabilities",
    accessControls: {
      authentication: "Implement strong authentication mechanisms, such as passwords, multi-factor authentication, or biometrics",
      authorization: "Assign access rights and permissions based on the principle of least privilege",
      userAccountManagement: "Establish procedures for creating, modifying, and disabling user accounts",
    },
    dataProtection: {
      encryption: "Encrypt sensitive data to ensure confidentiality, both at rest and in transit",
      backupAndRecovery: "Implement regular data backup and recovery procedures to mitigate data loss risks",
      dataRetention: "Define data retention policies and securely dispose of data that is no longer needed",
    },
    monitoringAndIncidentResponse: {
      securityMonitoring: "Implement security monitoring systems to detect and respond to security incidents",
      incidentResponse: "Establish an incident response plan to effectively address and mitigate security incidents",
      securityAwarenessTraining: "Provide security awareness training to employees to promote a security-conscious culture",
    },
    securityCompliance: {
      regulatoryCompliance: "Ensure compliance with applicable laws, regulations, and industry standards",
      securityPoliciesAndProcedures: "Establish and enforce security policies and procedures to guide security practices",
      securityAudits: "Conduct regular security audits to assess the effectiveness of security controls and identify areas for improvement",
    },
  };
  
module.exports = SystemsSecurity;
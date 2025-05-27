"use strict"

const {COBITAudit} = require('./COBITAudit');

// Create a new COBITAudit instance for email communication
const emailCommunicationAudit = new COBITAudit();

// Add controls related to email communication
emailCommunicationAudit.addControl(
  'DS05.1',
  'Ensure Email Policies and Procedures',
  'Establish and maintain policies and procedures for the appropriate use of email.'
);

emailCommunicationAudit.addControl(
  'DS05.2',
  'Classify Email Data',
  'Classify and label email data based on sensitivity and criticality.'
);

emailCommunicationAudit.addControl(
  'DS05.3',
  'Encrypt Sensitive Email',
  'Implement encryption mechanisms for sensitive and confidential email communication.'
);

emailCommunicationAudit.addControl(
  'DS05.4',
  'Monitor Email Usage',
  'Regularly monitor and audit email usage to detect unauthorized activities.'
);

// Assess the status of each control
emailCommunicationAudit.assessControl('DS05.1', 'Compliant');
emailCommunicationAudit.assessControl('DS05.2', 'Not Compliant');
emailCommunicationAudit.assessControl('DS05.3', 'Compliant');
emailCommunicationAudit.assessControl('DS05.4', 'In Progress');

// Generate and print a summary report
emailCommunicationAudit.generateSummaryReport();

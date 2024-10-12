// services/reportService.js

const { performAllChecks } = require('./gaapGaasCheckService');

// Function to generate an S-X compliant financial audit report
async function generateSxCompliantAuditReport(companyName, yearEnd, auditFirm, auditPartnerName) {
  const checks = await performAllChecks();
  const reportDate = new Date().toISOString();
  
  let report = `
    INDEPENDENT AUDITOR’S REPORT
    To the Board of Directors and Shareholders of ${companyName}:
    
    We have audited the accompanying financial statements of ${companyName}, which comprise the balance sheets as of December 31, ${yearEnd}, and the related statements of operations, changes in equity, and cash flows for the year then ended, and the related notes to the financial statements.

    **Opinion on the Financial Statements:**
    In our opinion, the financial statements referred to above present fairly, in all material respects, the financial position of ${companyName} as of December 31, ${yearEnd}, and the results of its operations and its cash flows for the year then ended in accordance with accounting principles generally accepted in the United States of America (GAAP).

    **Basis for Opinion:**
    We conducted our audit in accordance with the standards of the Public Company Accounting Oversight Board (PCAOB). Our responsibilities under those standards are further described in the **Auditor’s Responsibilities for the Audit of the Financial Statements** section of our report. We are required to be independent of ${companyName} and to meet our other ethical responsibilities, in accordance with the relevant ethical requirements related to our audit.

    **Going Concern:**
    The accompanying financial statements have been prepared assuming that the Company will continue as a going concern. As discussed in Note X to the financial statements, there is substantial doubt about the Company’s ability to continue as a going concern. Our opinion is not modified with respect to this matter.

    **Internal Control Over Financial Reporting (ICFR):**
    We have also audited the internal control over financial reporting of ${companyName} as of December 31, ${yearEnd}, based on the criteria established in **Internal Control - Integrated Framework** issued by the Committee of Sponsoring Organizations of the Treadway Commission (COSO). In our opinion, ${companyName} maintained, in all material respects, effective internal control over financial reporting as of December 31, ${yearEnd}, based on those criteria.

    **Audit of the Financial Statements:**
    We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our audit opinion.

    **Critical Audit Matters (CAMs):**
    The following is a description of a matter that was communicated or required to be communicated to the audit committee and that:
    (1) relates to accounts or disclosures that are material to the financial statements, and
    (2) involves especially challenging, subjective, or complex auditor judgment:

    CAM 1: **[Insert Critical Audit Matter]**
    (Further details about the matter would be described here.)

    **S-X Regulations Compliance:**
    This audit report is prepared in compliance with the U.S. Securities and Exchange Commission (SEC) Regulation S-X, as well as the standards set by the Public Company Accounting Oversight Board (PCAOB).

    **Audit Conclusion:**
    Based on the results of our audit, we conclude that the financial statements of ${companyName} for the year ended December 31, ${yearEnd}, are free of material misstatements and comply with the relevant accounting standards in accordance with GAAP.

    Signed by:
    ${auditFirm}
    ${auditPartnerName}
    ${reportDate}

    **End of Report**
  `;

  // Include the GAAP/GAAS checks errors as part of the report
  checks.forEach(check => {
    if (check.errors.length > 0) {
      report += `\n\n**${check.check}:**\n`;
      check.errors.forEach(error => {
        report += `  - ${error.message}\n`;
      });
    }
  });

  return report;
}

// Function to generate a Management Audit Report
async function generateManagementAuditReport(companyName, yearEnd, managerName, managerTitle) {
    const checks = await performAllChecks();  // Perform the GAAP/GAAS checks
    const reportDate = new Date().toISOString();
  
    let report = `
      MANAGEMENT AUDIT REPORT
      To the Board of Directors and Shareholders of ${companyName}:
  
      **Management's Responsibility:**
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with accounting principles generally accepted in the United States of America (GAAP) and for the design, implementation, and maintenance of internal controls over financial reporting (ICFR).
  
      **Assessment of Internal Control Over Financial Reporting (ICFR):**
      We, the management of ${companyName}, have assessed the effectiveness of our internal controls over financial reporting as of December 31, ${yearEnd}. Based on this assessment, we believe that our internal control system is effective and operating as designed.
  
      **Conclusion on Internal Controls:**
      Based on the results of our assessment, we have concluded that our internal control over financial reporting was effective as of December 31, ${yearEnd}. There were no material weaknesses identified that would affect the reliability of our financial reporting.
  
      **Material Weaknesses or Deficiencies:**
      Based on our review, we have not identified any material weaknesses in our internal controls over financial reporting. All internal controls are functioning properly, and there are no deficiencies in our control environment that would adversely affect the integrity of our financial statements.
  
      **Compliance with S-X Regulations:**
      This management audit report is prepared in compliance with the U.S. Securities and Exchange Commission (SEC) Regulation S-X, as well as other relevant regulatory requirements. We believe that the company’s financial statements for the year ended December 31, ${yearEnd} comply with all applicable SEC regulations and accounting standards.
  
      **Changes in Internal Control:**
      During the year, we made several improvements to our internal controls to strengthen our processes. These changes included implementing new software systems for data entry and approval workflows, improving segregation of duties, and enhancing the training of financial reporting personnel. As of the year-end date, these changes have been fully implemented and are functioning as expected.
  
      **Management's Opinion on Financial Reporting:**
      Based on our assessment and the results of our internal controls, we believe that the financial statements for ${companyName} for the year ended December 31, ${yearEnd}, present fairly, in all material respects, the financial position of the company in accordance with GAAP.
  
      Signed by:
      ${managerName}
      ${managerTitle}
      ${companyName}
      ${reportDate}
  
      **End of Report**
    `;
  
    // Include the GAAP/GAAS checks errors as part of the report
    checks.forEach(check => {
      if (check.errors.length > 0) {
        report += `\n\n**${check.check}:**\n`;
        check.errors.forEach(error => {
          report += `  - ${error.message}\n`;
        });
      }
    });
  
    return report;
}

// Function to generate a Public Disclosure Audit Report
async function generatePublicDisclosureAuditReport(companyName, yearEnd, auditFirm, auditPartnerName) {
    const checks = await performAllChecks();  // Perform the GAAP/GAAS checks
    const reportDate = new Date().toISOString();
  
    let report = `
      PUBLIC DISCLOSURE AUDIT REPORT
      To the Board of Directors and Shareholders of ${companyName}:
  
      **Management's Responsibility for Public Disclosures:**
      Management is responsible for the preparation and fair presentation of the public disclosures in accordance with the rules and regulations of the U.S. Securities and Exchange Commission (SEC). These disclosures include financial statements, risk factors, management's discussion and analysis (MD&A), related party transactions, and all other public filings required under SEC Regulation S-X.
  
      **Compliance with SEC Regulation S-X:**
      We have examined the public disclosures made by ${companyName} in its filings with the SEC, including the financial statements for the year ended December 31, ${yearEnd}, and related disclosures. Based on our review, we believe that these disclosures comply in all material respects with the disclosure requirements of SEC Regulation S-X.
  
      **Financial Disclosures and GAAP Compliance:**
      In our opinion, the financial statements presented in the filings with the SEC for the year ended December 31, ${yearEnd} are in conformity with U.S. generally accepted accounting principles (GAAP) and provide a fair presentation of the company’s financial position and results of operations. All material disclosures related to the financial statements, including the notes to the financial statements, are accurate and complete.
  
      **Material Misstatements or Omissions:**
      Based on our review, we have not identified any material misstatements or omissions in the public disclosures made by ${companyName}. All material events and transactions have been properly disclosed, and there are no significant facts that have been omitted or inaccurately represented.
  
      **Risk Factors and Related Party Transactions:**
      We have reviewed the company’s disclosures regarding risk factors and related party transactions. We found that the risk factors disclosed are consistent with the company’s operations and industry, and related party transactions have been properly disclosed in accordance with SEC rules.
  
      **Internal Control Over Public Disclosures:**
      Management has implemented a system of internal controls over public disclosures to ensure the accuracy and completeness of the information provided to the public. Based on our review of the company’s internal controls and disclosure processes, we believe that these controls are effective and operating as designed.
  
      **Conclusion on Public Disclosures:**
      Based on the procedures performed and the evidence obtained, we conclude that the public disclosures made by ${companyName} for the year ended December 31, ${yearEnd} are complete, accurate, and in compliance with SEC Regulation S-X and applicable accounting standards. There are no material discrepancies, and the company has met its public disclosure obligations in full.
  
      Signed by:
      ${auditFirm}
      ${auditPartnerName}
      ${reportDate}
  
      **End of Report**
    `;
  
    // Include the GAAP/GAAS checks errors as part of the report
    checks.forEach(check => {
      if (check.errors.length > 0) {
        report += `\n\n**${check.check}:**\n`;
        check.errors.forEach(error => {
          report += `  - ${error.message}\n`;
        });
      }
    });
  
    return report;
}

module.exports = { 
    generateSxCompliantAuditReport,
    generateManagementAuditReport,
    generatePublicDisclosureAuditReport,
};

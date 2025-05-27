# SOC Audit

A SOC 1 report focuses on your internal controls for financial reporting; it’s a measure of how accurate your financial reporting will be. SOC 2 focuses on information security rather than financial reporting. SOC 3 assesses the same controls and information as SOC 2, but it’s designed for public release rather than for security professionals. Because of this, a SOC 3 report is less technical so the general public can understand it.

A **SOC (System and Organization Controls) audit** is an independent examination conducted by a Certified Public Accountant (CPA) to provide assurance about the controls at a service organization, especially those related to security, availability, processing integrity, confidentiality, and privacy of data. SOC audits are designed to help service organizations demonstrate that they have effective controls in place to protect client data and to ensure proper processing of transactions. There are three main types of SOC reports: **SOC 1, SOC 2,** and **SOC 3**, each serving different purposes and audiences.

### 1. **SOC 1 Report**

- **Purpose**: Focuses on the internal controls over financial reporting (ICFR) of a service organization. It is primarily used by organizations whose services can impact the financial reporting of their clients. Examples include payroll processors, data centers, and SaaS providers whose services feed into the financial statements of client companies.
- **Audience**: Intended for users’ auditors, user entities, and others with a thorough understanding of the organization. It is not intended for general public distribution.
- **Content**: SOC 1 reports are based on the **Statement on Standards for Attestation Engagements No. 18 (SSAE 18)**. They include:
  - **Type I**: Evaluates the design and implementation of the service organization's controls at a specific point in time.
  - **Type II**: Evaluates the design, implementation, and operating effectiveness of controls over a period of time (usually 6 to 12 months).
- **Examples of Controls Reviewed**:
  - Transaction processing
  - Access controls
  - Data integrity controls

### 2. **SOC 2 Report**

- **Purpose**: Focuses on a broader range of controls relevant to the Trust Services Criteria, which include **Security, Availability, Processing Integrity, Confidentiality,** and **Privacy** of the data managed by the service organization. SOC 2 reports are essential for service organizations that handle sensitive client information, such as cloud service providers, data centers, and IT managed services.
- **Audience**: Intended for a restricted audience, including existing and potential customers, business partners, and other stakeholders who need to understand the service organization's controls relevant to the Trust Services Criteria.
- **Content**: SOC 2 reports include:
  - **Type I**: Evaluates the design and implementation of the service organization's controls at a specific point in time.
  - **Type II**: Evaluates the design, implementation, and operating effectiveness of the controls over a period of time (usually 6 to 12 months).
- **Examples of Controls Reviewed**:
  - **Security**: Protection against unauthorized access (e.g., firewalls, multi-factor authentication).
  - **Availability**: System availability (e.g., backup procedures, disaster recovery).
  - **Processing Integrity**: System processing is complete, valid, accurate, timely, and authorized.
  - **Confidentiality**: Protection of confidential information (e.g., encryption).
  - **Privacy**: Personal information is collected, used, retained, disclosed, and disposed of according to the organization's privacy notice.

### 3. **SOC 3 Report**

- **Purpose**: Similar to SOC 2, SOC 3 focuses on the same Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. However, SOC 3 reports are intended for a broader audience and are designed to be shared publicly.
- **Audience**: General public, including customers, stakeholders, and potential clients. Unlike SOC 1 and SOC 2, SOC 3 reports can be freely distributed and used for marketing purposes.
- **Content**: SOC 3 reports are essentially a summarized version of SOC 2 Type II reports. They do not include the detailed description of controls, testing procedures, and results. Instead, they provide a high-level overview of the effectiveness of the service organization's controls.
- **Examples of Controls Reviewed**: Since SOC 3 is a summary report, it covers the same areas as SOC 2 (e.g., security, availability) but in a more general, less detailed manner.

### **Key Differences Between SOC 1, SOC 2, and SOC 3**

| Aspect                   | SOC 1                                         | SOC 2                                                                                         | SOC 3                                                 |
| ------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Purpose**        | Internal controls over financial reporting    | Trust Services Criteria (Security, Availability, etc.)                                        | Trust Services Criteria (summarized version of SOC 2) |
| **Audience**       | Restricted (user auditors, user entities)     | Restricted (customers, business partners)                                                     | General public                                        |
| **Content**        | Detailed report on financial controls         | Detailed report on security, availability, processing integrity, confidentiality, and privacy | High-level summary of SOC 2 Type II                   |
| **Report Types**   | Type I and Type II                            | Type I and Type II                                                                            | Summary of SOC 2 Type II                              |
| **Distribution**   | Restricted                                    | Restricted                                                                                    | Publicly available                                    |
| **Example of Use** | Payroll service provider affecting financials | Cloud service providers handling sensitive data                                               | Public assurance on security controls                 |

### Summary

- **SOC 1**: Focuses on controls relevant to financial reporting, used by auditors and clients to understand how a service organization's controls affect their financial statements.
- **SOC 2**: Focuses on controls relevant to security, availability, processing integrity, confidentiality, and privacy, used by clients and business partners who need assurance about the protection and processing of their data.
- **SOC 3**: Provides a high-level summary of SOC 2 findings, intended for public distribution to provide general assurance about the service organization's controls.

These reports help service organizations build trust with clients and stakeholders by demonstrating that they have effective controls in place to protect data and process transactions securely and accurately.

# Other Resources

SOC-2 Audit in perl at [https://github.com/mcoia/soc2_server_audit](https://github.com/mcoia/soc2_server_audit)

SOC-2 audit in python at [https://github.com/AndriiKostenetskyi/soc_audit](https://github.com/AndriiKostenetskyi/soc_audit)

SOC audit notes at [https://github.com/shreyas-malhotra/soc-compliance-framework-notes](https://github.com/shreyas-malhotra/soc-compliance-framework-notes)

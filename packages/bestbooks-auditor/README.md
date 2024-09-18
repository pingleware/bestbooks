# BestBooks Accounting Application Framework - AUDITOR

Using the R-language and examples from https://github.com/ameypophali/Auditing-financial-data-using-R.git and https://github.com/PieInOblivion/ABRA repositories.

BestBooks Auditor will provide automatic financial audits with a notation added to the financial report using the noteToFinancialStatement component of bestbooks-reports.

## Introduction to R

See https://cran.r-project.org/doc/manuals/r-release/R-intro.pdf

## Installing R

R language is required and can be installed from https://www.r-project.org/. The Rscript tool is used to launch R scripts from the command line, and is included in the R installation package.\

## GAAS

When the SEC brought action against the audit firm [Prager Metis for negligence](https://www.sec.gov/newsroom/press-releases/2024-133), the [complaint](https://www.sec.gov/files/litigation/complaints/2024/comp-pr2024-133.pdf) starting in paragragh II details the mechanics for conducting an audit which is based on [Auditing Standards Board clarified statements](https://us.aicpa.org/research/standards/auditattest/clarifiedsas).

## Audit Rules

A financial audit involves a thorough examination of an organization's financial statements, transactions, and controls to ensure accuracy, compliance with accounting standards, and the prevention of fraud. The specific rules and procedures for a financial audit can vary based on the auditing standards followed (such as Generally Accepted Auditing Standards or International Standards on Auditing). Below are some common rules and principles typically applied in financial audits:

1. **Materiality:**

   - **Rule:** Focus on items that are material to the financial statements.
2. **Consistency:**

   - **Rule:** Ensure consistency in accounting methods and reporting between periods.
3. **Completeness:**

   - **Rule:** Verify that all transactions and events are recorded and disclosed in the financial statements.
4. **Accuracy:**

   - **Rule:** Verify the mathematical accuracy of financial statements and supporting documentation.
5. **Valuation:**

   - **Rule:** Ensure that assets and liabilities are valued accurately.
6. **Rights and Obligations:**

   - **Rule:** Confirm that the entity has legal rights to assets and is obligated for liabilities.
7. **Existence and Occurrence:**

   - **Rule:** Confirm the existence of assets and the occurrence of transactions.
8. **Presentation and Disclosure:**

   - **Rule:** Ensure that financial statements are presented fairly and all required disclosures are made.
9. **Audit Trail:**

   - **Rule:** Trace transactions from the original source documents through the accounting records to the financial statements.
10. **Internal Controls:**

    - **Rule:** Assess the effectiveness of internal controls over financial reporting.
11. **Going Concern:**

    - **Rule:** Evaluate the entity's ability to continue as a going concern.
12. **Substantive Procedures:**

    - **Rule:** Perform substantive procedures to gather evidence on the accuracy of account balances and transactions.
13. **Risk Assessment:**

    - **Rule:** Identify and assess risks of material misstatement in the financial statements.
14. **Independence:**

    - **Rule:** Ensure independence and objectivity of the audit team.
15. **Documentation:**

    - **Rule:** Maintain thorough and complete audit documentation.
16. **Sampling:**

    - **Rule:** Use statistical or judgmental sampling to test transactions and account balances.
17. **Fraud Detection:**

    - **Rule:** Consider the risk of fraud and perform procedures to detect and prevent it.
18. **Subsequent Events:**

    - **Rule:** Evaluate events occurring after the balance sheet date that may affect financial statements.

## Auditing using PROLOG

Creating Prolog routines for each of the rules listed would be quite extensive, and Prolog may not be the most suitable language for implementing all aspects of a financial audit. However, I can provide simplified Prolog examples for a few rules to give you an idea. Keep in mind that these examples are basic and may need to be adapted based on the specific requirements and structure of your financial audit system.

Here are Prolog examples for a few rules:

1. **Materiality:**

   ```prolog
   % Rule: Focus on items that are material to the financial statements.
   materiality_threshold(100000). % Set a threshold amount

   material_item(Item) :-
       financial_statement(Item, Amount),
       materiality_threshold(Threshold),
       Amount >= Threshold.
   ```
2. **Consistency:**

   ```prolog
   % Rule: Ensure consistency in accounting methods and reporting between periods.
   consistent_methods :-
       accounting_method(CurrentPeriod, Method),
       accounting_method(PreviousPeriod, Method),
       CurrentPeriod \= PreviousPeriod.
   ```
3. **Completeness:**

   ```prolog
   % Rule: Verify that all transactions and events are recorded and disclosed in the financial statements.
   transaction_recorded(Transaction) :-
       recorded_transaction(Transaction).

   all_transactions_recorded :-
       forall(transaction(Transaction), transaction_recorded(Transaction)).
   ```
4. **Accuracy:**

   ```prolog
   % Rule: Verify the mathematical accuracy of financial statements and supporting documentation.
   check_accuracy :-
       financial_statement(Item, Amount),
       sum_all_items(Sum),
       Amount =:= Sum.
   ```
5. **Valuation:**

   ```prolog
   % Rule: Ensure that assets and liabilities are valued accurately.
   accurate_valuation(Item) :-
       asset_or_liability(Item),
       acceptable_valuation_method(Item).

   all_valuations_accurate :-
       forall(asset_or_liability(Item), accurate_valuation(Item)).
   ```
6. **Rights and Obligations:**

   ```prolog
   % Rule: Confirm that the entity has legal rights to assets and is obligated for liabilities.
   legal_rights(Item) :-
       has_legal_rights(Item).

   legal_obligations(Item) :-
       has_legal_obligations(Item).

   rights_and_obligations_verified :-
       forall(asset(Item), legal_rights(Item)),
       forall(liability(Item), legal_obligations(Item)).
   ```
7. **Existence and Occurrence:**

   ```prolog
   % Rule: Confirm the existence of assets and the occurrence of transactions.
   asset_exists(Item) :-
       exists_in_physical_form(Item).

   transaction_occurred(Transaction) :-
       occurred_as_per_records(Transaction).

   all_assets_exist :-
       forall(asset(Item), asset_exists(Item)).

   all_transactions_occurred :-
       forall(transaction(Transaction), transaction_occurred(Transaction)).
   ```
8. **Presentation and Disclosure:**

   ```prolog
   % Rule: Ensure that financial statements are presented fairly and all required disclosures are made.
   fair_presentation :-
       presented_fairly.

   required_disclosures_made :-
       all_required_disclosures_made.

   financial_statements_compliant :-
       fair_presentation,
       required_disclosures_made.
   ```
9. **Audit Trail:**

   ```prolog
   % Rule: Trace transactions from the original source documents through the accounting records to the financial statements.
   traceable(Transaction) :-
       traced_to_source_documents(Transaction).

   audit_trail_intact :-
       forall(transaction(Transaction), traceable(Transaction)).
   ```
10. **Internal Controls:**

    ```prolog
    % Rule: Assess the effectiveness of internal controls over financial reporting.
    effective_internal_controls :-
        documented_internal_controls,
        regularly_monitored_controls.

    internal_controls_assessed :-
        effective_internal_controls.
    ```
11. **Going Concern:**

    ```prolog
    % Rule: Evaluate the entity's ability to continue as a going concern.
    going_concern_risk_low :-
        low_risk_indicators.

    assess_going_concern :-
        going_concern_risk_low.
    ```
12. **Substantive Procedures:**

    ```prolog
    % Rule: Perform substantive procedures to gather evidence on the accuracy of account balances and transactions.
    substantive_procedures_complete :-
        evidence_gathered_according_to_plan.

    audit_evidence_sufficient :-
        substantive_procedures_complete.
    ```
13. **Risk Assessment:**

    ```prolog
    % Rule: Identify and assess risks of material misstatement in the financial statements.
    material_misstatement_risk_low :-
        low_risk_assessment_indicators.

    assess_risk_of_misstatement :-
        material_misstatement_risk_low.
    ```
14. **Independence:**

    ```prolog
    % Rule: Ensure independence and objectivity of the audit team.
    independent_audit_team :-
        no_conflicts_of_interest.

    audit_team_objective :-
        independent_audit_team.
    ```

## Financial Statement Notes

An entry to the financial statements by bestbooks-auditor would be considered a management entry since the BestBooks Auditor is NOT a registered CPA or licensed Auditor.

### 10 GAAP Principles

1. **Principle of Regularity:** GAAP-compliant accountants strictly adhere to established rules and regulations.
2. **Principle of Consistency:** Consistent standards are applied throughout the financial reporting process.
3. **Principle of Sincerity:** GAAP-compliant accountants are committed to accuracy and impartiality.
4. **Principle of Permanence of Methods:** Consistent procedures are used in the preparation of all financial reports.
5. **Principle of Non-Compensation:** All aspects of an organization's performance, whether positive or negative, are fully reported with no prospect of debt compensation.
6. **Principle of Prudence:** Speculation does not influence the reporting of financial data.
7. **Principle of Continuity:** Asset valuations assume the organization's operations will continue.
8. **Principle of Periodicity:** Reporting of revenues is divided by standard accounting periods, such as fiscal quarters or fiscal years.
9. **Principle of Materiality:** Financial reports fully disclose the organization's monetary situation.
10. **Principle of Utmost Good Faith:** All involved parties are assumed to be acting honestly.

## Codification

Businesses should codify their accounting records regularly and consistently as part of their financial management and record-keeping processes. Codifying accounting records refers to organizing and categorizing financial transactions in a structured and systematic manner, typically using accounting codes or chart of accounts. Here are some key points to consider:

1. **Consistency**: It's important to establish a consistent system for codifying accounting records from the outset. This ensures that all financial transactions are recorded and categorized in a uniform manner, making it easier to track and analyze financial data over time.
2. **Chart of Accounts**: Developing a comprehensive chart of accounts is a fundamental step in codifying accounting records. This chart outlines the specific categories and subcategories under which different financial transactions will be recorded. It should be tailored to the specific needs of the business and can be customized to reflect the nature of its operations.
3. **Frequency**: Accounting records should be codified as transactions occur. This means recording and categorizing financial transactions on a regular basis, whether that's daily, weekly, monthly, or as often as necessary for your business's size and complexity.
4. **Accuracy**: It's crucial to ensure accuracy when codifying accounting records. Mistakes or inconsistencies can lead to financial reporting errors and compliance issues. Utilize accounting software or hire experienced accountants to help maintain accuracy.
5. **Compliance**: Depending on the jurisdiction and industry, businesses may be required to follow specific accounting standards and regulations. Codifying accounting records in compliance with these standards is essential to meet legal and reporting requirements.
6. **Decision-Making**: Well-organized accounting records are essential for making informed business decisions. When financial data is codified and categorized effectively, it's easier to analyze trends, monitor cash flow, and assess the overall financial health of the business.
7. **Auditing and Tax Reporting**: Having codified accounting records in place makes it easier to prepare for audits and generate accurate tax reports. In the event of an audit, having organized financial records will save time and reduce stress.
8. **Growth and Scaling**: As a business grows and scales, the complexity of its financial transactions can increase. Proper codification becomes even more critical in such cases to maintain financial control and visibility.
9. **Business Type**: The timing and frequency of codifying accounting records can vary depending on the type of business. For example, a small sole proprietorship may codify records more informally compared to a large corporation with more rigorous reporting requirements.

In summary, businesses should codify their accounting records consistently, accurately, and in compliance with relevant standards and regulations. This ongoing process ensures that financial data is organized and readily accessible for management, reporting, and decision-making purposes. The specific timing and frequency of codification will vary depending on the nature and size of the business.

## Audits

The audits which can be automated include,

    - Fixed and Intangible Assets

    - Prepaid Expenses and Deferred Charges

    - Details and Transactions

    - Long Term Liabilities and Stockholder Equity

    - Cash and Investments (common accounts inclulde: Operating Checking Account, Payroll Checking Account, Merchant Account and Money Market Account [can also be currency trading account, a sweep account may also serve as this purpose ]))

* **Anti Money Laundering (AML), review of OFAC (Office of Foreign Assets Control) procedures and AML processes, strategy, policy, controls and related technologies.**
* **Financial Condition, expresses an unqualified opinion, that the financial statements were presented fairly, in all material respects, in accordance with US GAAP accounting principles.**
* **Digital Currency required because custody bitcoin on behalf of our clients, Grant Thorton conducted a thorough examination of how we hold digital assets.**
* **Security, an Information Technology (IT) Security Risk Assessment that evaluated the effectiveness of existing security controls.**
* **Internal Controls, (technically known as a SOC I Type II Audit) to ensure that they are operating effectively and appropriately protecting client data**
* **Onsite IT systems, onsite systems and safeguards**

## Internal Controls

An important factor of audits is to access the risk of internal controls. When revenue was received by the USPS, there were four employees to process, record and deposit the checks received. In today's economy where electronic payments are the norm, a paper trail is already established and routing payments to operating accounting is usually automatic.

Technically known as a SOC I Type II Audit. A SOC 1 –Type II audit report **contains the same opinions as a Type I, but it adds an opinion on the operating effectiveness to achieve related control objectives throughout a specified period**

## Conducting a SOC 1 - Type II Audit

SOC 1 audits focus on the controls related to financial reporting, so it's important to ensure that the controls are adequately designed and operating effectively. Here's an outline of the process:

1. Understand the Audit Scope: Familiarize yourself with the scope and objectives of the SOC 1 - Type II audit. Determine the specific controls and processes that need to be assessed.
2. Identify Control Objectives: Identify the control objectives for the audit. These objectives define the criteria against which the controls will be evaluated. Control objectives typically include areas such as data security, access controls, change management, and backup and recovery procedures.
3. Design Audit Tests: Develop a plan for testing the controls. This includes determining the appropriate audit procedures, sampling methods, and data analysis techniques. R can be used for data analysis and statistical procedures to support the audit testing.
4. Data Collection: Collect the necessary data and evidence to support the audit procedures. This may involve gathering documentation, conducting interviews, or extracting data from relevant systems. R can be used for data extraction, transformation, and loading (ETL) processes.
5. Perform Audit Procedures: Execute the audit procedures according to the plan. This may involve testing the controls, reviewing documentation, and analyzing data. R can be used for performing data analysis, statistical tests, and generating audit reports.
6. Evaluate Control Effectiveness: Assess the effectiveness of the controls based on the audit findings. Determine if the controls are adequately designed and operating effectively to achieve the control objectives.
7. Document Audit Findings: Document the audit findings, including any control deficiencies or areas for improvement. R can be used to generate audit reports, charts, and visualizations to communicate the results effectively.
8. Issue Audit Report: Prepare and issue the SOC 1 - Type II audit report based on the audit findings. The report should include a description of the scope, control objectives, testing procedures, and the results of the audit.

It's worth noting that while R can be used for data analysis and statistical procedures, conducting a SOC 1 - Type II audit involves a broader set of activities that require expertise in auditing, accounting, and information systems. Therefore, it's essential to have a thorough understanding of the audit requirements and engage qualified professionals to perform the audit.

### Scope and Objectives

The scope and objectives of a SOC 1 - Type II audit are focused on assessing the effectiveness of a service organization's internal controls over financial reporting. The audit is conducted to provide assurance to user entities (typically the service organization's clients) regarding the reliability and security of the financial information processed by the service organization. Here's an overview of the scope and objectives:

1. Scope:

   - The audit scope defines the boundaries and components of the audit engagement. It specifies the systems, processes, and controls that are subject to examination.
   - The scope typically includes the service organization's financial systems, applications, and related processes that are relevant to the financial reporting of the user entities.
   - It may also include the underlying IT infrastructure, data centers, and other systems that support the financial processes.
2. Objectives:

   - The primary objective of a SOC 1 - Type II audit is to assess the effectiveness of the service organization's controls over financial reporting.
   - The audit aims to determine if the controls are suitably designed to achieve specific control objectives and whether they have been operating effectively over a specified period of time.
   - The control objectives typically include areas such as data integrity, security, availability, processing accuracy, and compliance with relevant regulations or industry standards.
   - The audit provides assurance to user entities that the service organization's controls adequately safeguard their financial information and ensure the reliability of financial reporting.

The SOC 1 - Type II audit follows the guidelines and criteria established by the American Institute of Certified Public Accountants (AICPA). It requires the service organization to provide detailed information about its systems, controls, and processes. The audit involves testing and evaluating the design and operating effectiveness of the controls, as well as assessing any identified control deficiencies or weaknesses.

It's important to note that the specific scope and control objectives of the audit may vary depending on the nature of the service organization's business, industry regulations, and client requirements. Therefore, it is crucial to consult with qualified professionals and engage with a reputable audit firm to ensure compliance with the appropriate standards and guidelines.

### Control Objectives

When conducting a SOC 1 - Type II audit, the control objectives can vary depending on the nature of the service organization's operations, industry regulations, and client requirements. However, here are some common control objectives that are typically assessed in a SOC 1 - Type II audit:

1. Security Controls:
   a. Access Controls: Ensure that access to systems and data is appropriately restricted, and user access is granted based on authorized roles and responsibilities.
   b. Authentication and Authorization: Validate the identity of users and ensure they have the necessary permissions to perform authorized actions.
   c. Physical Security: Protect physical assets, such as data centers and servers, against unauthorized access, theft, or damage.
   d. Network Security: Safeguard networks against unauthorized access, malicious activities, and data breaches through firewalls, intrusion detection systems, and encryption mechanisms.
2. Change Management Controls:
   a. Change Authorization: Implement a structured process for reviewing, approving, and implementing changes to systems, applications, and configurations.
   b. Change Documentation: Maintain proper documentation of all changes, including the reason for the change, the individuals involved, and the date and time of the change.
   c. Testing and Validation: Perform appropriate testing and validation procedures to ensure that changes are implemented accurately and do not adversely impact financial reporting.
3. Data Integrity and Processing Controls:
   a. Data Validation and Accuracy: Implement controls to ensure the accuracy, completeness, and integrity of financial data throughout the processing and reporting cycles.
   b. Error Handling and Exception Reporting: Establish procedures for identifying and resolving errors or exceptions encountered during data processing.
   c. Data Backup and Recovery: Maintain appropriate backup and recovery procedures to protect financial data and enable timely restoration in the event of system failures or data loss.
4. Compliance Controls:
   a. Regulatory Compliance: Ensure compliance with relevant laws, regulations, and industry-specific standards that impact financial reporting, such as Sarbanes-Oxley Act (SOX) requirements.
   b. Internal Policies and Procedures: Establish and enforce internal policies and procedures that govern financial reporting processes, ensuring adherence to established guidelines and standards.
   c. Audit Trail and Monitoring: Implement mechanisms to capture and retain an audit trail of activities, including system logs, user activity logs, and change logs, to facilitate monitoring and forensic investigations.
5. Service Continuity and Availability:
   a. Business Continuity Planning: Develop and maintain a comprehensive business continuity plan to mitigate risks and ensure timely resumption of critical operations in the event of disruptions.
   b. Redundancy and Failover: Implement redundant systems, failover mechanisms, and backup infrastructure to ensure continuous availability of services.
   c. Incident Response: Establish protocols and procedures to promptly respond to and manage security incidents or disruptions.

It's important to note that the control objectives can vary based on the specific industry, regulatory requirements, and client expectations. The service organization and the auditor should work together to define the appropriate control objectives for the audit engagement, considering the organization's unique circumstances and risks.

### COBIT Control Objectives

COBIT (Control Objectives for Information and Related Technologies) provides a framework for IT governance and management. While COBIT does not prescribe specific control objectives, it offers a set of high-level control objectives organized into domains and processes. Here are the standard COBIT control objectives organized by domain:

1. Evaluate, Direct, and Monitor (EDM) Domain:

   - EDM01: Ensure Governance Framework Setting and Maintenance.
   - EDM02: Ensure Benefits Delivery.
   - EDM03: Ensure Risk Optimization.
   - EDM04: Ensure Resource Optimization.
   - EDM05: Ensure Stakeholder Transparency.
2. Align, Plan, and Organize (APO) Domain:

   - APO01: Manage the IT Management Framework.
   - APO02: Manage Strategy.
   - APO03: Manage Enterprise Architecture.
   - APO04: Manage Innovation.
   - APO05: Manage Portfolio.
   - APO06: Manage Budget and Costs.
   - APO07: Manage Human Resources.
   - APO08: Manage Relationships.
   - APO09: Manage Service Agreements.
3. Build, Acquire, and Implement (BAI) Domain:

   - BAI01: Manage Programs and Projects.
   - BAI02: Manage Requirements Definition.
   - BAI03: Manage Solutions Identification and Build.
   - BAI04: Manage Availability and Capacity.
   - BAI05: Ensure Systems Security.
   - BAI06: Manage Changes.
   - BAI07: Manage Change Acceptance and Transitioning.
   - BAI08: Manage Knowledge.
   - BAI09: Manage Assets.
   - BAI10: Manage Configuration.
4. Deliver, Service, and Support (DSS) Domain:

   - DSS01: Manage Operations.
   - DSS02: Manage Service Requests and Incidents.
   - DSS03: Manage Problems.
   - DSS04: Manage Continuity.
   - DSS05: Manage Security Services.
   - DSS06: Manage Business Process Controls.
   - DSS07: Manage Data.
   - DSS08: Manage Facilities.
5. Monitor, Evaluate, and Assess (MEA) Domain:

   - MEA01: Monitor, Evaluate, and Assess Performance and Conformance.
   - MEA02: Monitor, Evaluate, and Assess System of Internal Control.
   - MEA03: Monitor, Evaluate, and Assess Compliance with External Requirements.
   - MEA04: Provide Assurance of IT Governance.

These control objectives provide a framework for organizations to define specific control activities and measures based on their unique requirements, risks, and regulatory environment. Organizations should tailor and adapt the COBIT control objectives to their specific circumstances to effectively manage and govern their IT functions.

It's important to note that the control objectives can evolve with changes in technology, industry standards, and regulations. Therefore, staying updated with the latest version of COBIT and relevant industry guidance is crucial for organizations implementing COBIT control objectives.

## PCAOB Auditing Standards

See [https://pcaobus.org/oversight/standards/auditing-standards](https://pcaobus.org/oversight/standards/auditing-standards)

## GAO Financial Audit Manual

* [Financial Audit Manual - Volume 1](assets/gao-22-105894.pdf)
* [Financial Audit Manual - Volume 2](assets/gao-22-105895.pdf)
* [Financial Audit Manual - Volume 3](assets/gao-21-105127.pdf)

## Federal Reserve Codification Reference

See [https://www.ffiec.gov/pdf/FFIEC_forms/CodificationReferences_201006.pdf](https://www.ffiec.gov/pdf/FFIEC_forms/CodificationReferences_201006.pdf)

## CPA Education Requirements

120 semester or 180 quarter hours:

* Total upper-division accounting hours required of the 120 semester or 180 quarter hours:
  * 24 semester or 36 quarter hours to include:
    * coverage in auditing and cost accounting,
    * three (3) semester or four (4) quarter hours of financial accounting
      and three (3) semester or four (4) quarter hours of taxation, both of
      which must be based on USA accounting standards.
  * Total upper-division general business hours required of the 120 semester or 180 quarter hours:
    * 24 semester or 36 quarter hours to include:
      * three (3) semester or four (4) quarter hours of business law based on USA Law.

|                    | Course                               | Credits | Cost | Book                                                                                                                                                             |
| ------------------ | ------------------------------------ | :-----: | :---: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prerequisites      |                                      |        |      |                                                                                                                                                                  |
|                    | Principles of Financial Accounting   |    3    | 10.29 | https://www.thriftbooks.com/w/financial-and-managerial-accounting-information-for-decisions_john-j-wild/434234/#edition=13193064&idiq=34454027                   |
|                    | Principles of Managerial Accounting  |    3    |   -   | https://www.thriftbooks.com/w/financial-and-managerial-accounting-information-for-decisions_john-j-wild/434234/#edition=13193064&idiq=34454027                   |
|                    | Computer Applications for Business   |    3    | 4.00 | https://www.abebooks.com/Computer-Applications-Business-R-Parameswaran-Chand/4513299831/bd                                                                       |
|                    | Principles of Macroeconomics         |    3    | 6.39 | https://www.thriftbooks.com/w/principles-of-macroeconomics_n-gregory-mankiw/34604432/?resultid=91d5a1f1-ed05-48a6-8ed8-fa7e4652ac0f#edition=6513056&idiq=6149835 |
|                    | Principles of Microeconomics         |    3    | 7.39 | https://www.thriftbooks.com/w/principles-of-microeconomics_robert-frank/367334/?resultid=4e06159a-4d34-427c-adfc-a59c1fa5b2f6#edition=13244269&idiq=32269544     |
|                    | Calculus for Business                |    3    |      |                                                                                                                                                                  |
|                    | Elementary Statistics-Business       |    3    |      |                                                                                                                                                                  |
|                    | TOTAL                                |   21   |      |                                                                                                                                                                  |
| Core Requirements |                                      |        |      |                                                                                                                                                                  |
|                    | Legal Environment of Business        |    3    |      |                                                                                                                                                                  |
|                    | Financial Management                 |    3    |      |                                                                                                                                                                  |
|                    | Principles of Management             |    3    |      |                                                                                                                                                                  |
|                    | Principles of Marketing              |    3    |      |                                                                                                                                                                  |
|                    | Operations Management                |    3    |      |                                                                                                                                                                  |
|                    | Strategic Management Business Policy |    3    |      |                                                                                                                                                                  |
|                    | TOTAL                                |   18   |      |                                                                                                                                                                  |
| Major Requirements |                                      |        |      |                                                                                                                                                                  |
|                    |                                      |        |      |                                                                                                                                                                  |
|                    |                                      |        |      |                                                                                                                                                                  |
|                    |                                      |        |      |                                                                                                                                                                  |
|                    |                                      |        |      |                                                                                                                                                                  |
|                    |                                      |        |      |                                                                                                                                                                  |

## Internal Audit

Three types of internal audit,

1. Envrionmental
2. Operational
3. Performance

### The Five C's of Auditing

The following are the 5 Cs of the internal auditing process:

* **C**riteria: Audit Criteria are usually based on some company's manual, policy and targets, or it can also be based on some subscribed standards. What issue was identified during the auditing process, and why conducting the internal auditing was necessary? Is the organization prepared tovconduct an external audit in the future?
* **C**ondition: What is the relation of the identified issue with the company's expectations and targets? Was there any company policy, procedures, or subscribed standards that was bypassed?
* **C**ause: What were the reasons why these issues arose first? Who was involved, and what processes were infringed? How the company could have prevented this issue from arising?
* **C**onsequence: What was the result of the issue that arose? Did the issue cause disruption in internal matters of the company or were there any external risks involved too? Are there any financial consequences of the identified issue?
* **C**orrective Action: What corrective actions can the company take to fix this issue from reoccurrence? How will the company monitor and review the effectiveness of solutions after their implementation?

## Stages in an Internal Audit

1. Planning
2. Auditing
3. Reporting
4. Monitoring

## Resources

Accounting Courseware - [https://alison.com/dashboard](https://alison.com/dashboard)

AuditNet Audit Programs  - [https://www.auditnet.org/audit_programs](https://www.auditnet.org/audit_programs)

Deloitte Omnia for Audit Automation - [https://www2.deloitte.com/us/en/pages/audit/solutions/audit-technology-solutions.html](https://www2.deloitte.com/us/en/pages/audit/solutions/audit-technology-solutions.html)

Deloitte Audit & Assurance playlist - [https://www.youtube.com/watch?v=eYtn7t1dylQ&amp;list=PLl4by_vVwv0yhFIvBmaYv5u9q6as6q8jD](https://www.youtube.com/watch?v=eYtn7t1dylQ&list=PLl4by_vVwv0yhFIvBmaYv5u9q6as6q8jD)

Deloitte Technology Industry Accounting Guide - [https://www2.deloitte.com/us/en/pages/audit/articles/technology-industry-accounting-guide.html](https://www2.deloitte.com/us/en/pages/audit/articles/technology-industry-accounting-guide.html)

FASB ASC606 Revenue Recognition - [https://fasb.org/page/PageContent?pageId=/projects/recentlycompleted/revenue-recognition-summary.html](https://fasb.org/page/PageContent?pageId=/projects/recentlycompleted/revenue-recognition-summary.html)

## Auditing using LLaMA.cpp amd Large Language Models (LLM)

To use LLaMA.cpp and Large Language Models (LLMs) for GAAS (Generally Accepted Auditing Standards) auditing based on the ASB (Auditing Standards Board) clarified statements, you can follow these steps:

### 1. **Setting Up LLaMA.cpp:**

- **Compile LLaMA.cpp:** Ensure LLaMA.cpp is set up on your system, which involves compiling it for your specific hardware. You've mentioned working on optimizing `llama.cpp` for a CPU-only system, so follow these steps if not already completed:
  ```bash
  git clone https://github.com/ggerganov/llama.cpp
  cd llama.cpp
  make
  ```
- **Quantize the Model:** If you need to reduce the model's memory footprint, quantize the model using one of the supported quantization formats (avoiding IQ1_S, IQ1_M, IQ2_S, etc., based on your preference).
- **Load the Model:** Prepare the LLaMA model by downloading the weights and placing them in the correct directory.

### 2. **Data Preparation:**

- **GAAS and ASB Statements:** You need to provide LLaMA with the clarified statements from ASB and relevant GAAS guidelines. You can either:
  - **Direct Embedding:** Use LLaMA embeddings to store this data in your server for retrieval-augmented generation (RAG).
  - **Fine-tuning:** Fine-tune LLaMA on a dataset that includes GAAS guidelines and ASB statements if the LLaMA model supports fine-tuning in your setup.

### 3. **Implementing RAG with LLaMA.cpp:**

- **Indexing Statements:** Use a RAG setup to embed the ASB statements into a retrievable index.
- **Query Processing:** When an auditing question is posed, use LLaMA to generate a query response by first retrieving the relevant ASB statement using the embedding index.
- **Embedding Index Updates:** As you want to keep the embeddings updated, use the `/embed` route you've mentioned previously to update the `embeddingsIndex` array with new or revised ASB statements.

### 4. **Building an Auditing Application:**

- **Server-Side Implementation:** Set up a server (using Node.js with Express, as you prefer) that listens to auditing queries and responds with LLaMA-generated answers.
- **Interacting with LLaMA.cpp:** Use the command line to interact with the LLaMA model. For example:
  ```bash
  ./llama.cpp -m path/to/llama/model -p "Query related to GAAS and ASB standards"
  ```
- **Enhancing the Responses:** Refine the LLM's output to ensure compliance with auditing standards by tailoring prompts and adding constraints.

### 5. **Refining the Workflow:**

- **Accuracy Checks:** Regularly verify the LLaMA responses against actual auditing standards to ensure compliance and accuracy.
- **Manual Override:** Implement a manual review system where auditors can override LLM suggestions when necessary.

### 6. **Example Workflow:**

- **Query:** An auditor inputs, "What are the documentation requirements for an audit based on GAAS?"
- **RAG Server:** The system retrieves relevant ASB statements on documentation requirements.
- **LLaMA Processing:** LLaMA generates a response that outlines the necessary documentation per GAAS.
- **Output:** The final response is displayed to the auditor for review.

This setup allows you to leverage LLaMA.cpp for generating responses based on ASB statements and GAAS guidelines, providing a practical auditing tool. If you have any specific requirements or need further customization, let me know!

Using the company's developed [RAG Server](https://snapcraft.io/rag-server) to provide this interface for bestbooks-auditor.

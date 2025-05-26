# BestBooks Accounting Application Framework - CORE

[![npm test](https://github.com/pingleware/bestbooks-core/actions/workflows/npm-test.yml/badge.svg)](https://github.com/pingleware/bestbooks-core/actions/workflows/npm-test.yml)

BestBooks is an open source accounting application framework based on accounting terminology. Originally developed in Java to support multiple database because at the time the accounting applications had a close data model. Then migrated to PHP and as a WordPress plugin. BestBooks grew and matured as a WordPress plugin and became to cumbersome for a multiple site bookkeeping record system. A decision to rearchitect the framework with minimal web functionality interacting with a backend desktop-server component that can be placed behind a firewall.

NodeJS was chosen for the code base of the architecture because of one-code-base multiple platforms, as well as to breakup the functionality into node modules for easier maintenance with the base module beginning as the core.

The core module is a migration of the PHP classes from the WordPress plugin.

![Overview](https://github.com/pingleware/bestbooks/blob/main/packages/bestbooks-core/assets/overview.png)

## Overview of the components
| Module | Description                                                                   | Version |
|--------|------------------------------------------------------------------------------ | ------- |
| [core](https://github.com/pingleware/bestbooks-core)   | The core which provides database connectivity and logging |  1.2.3  |
| [auditor](https://github.com/pingleware/bestbooks-auditor)  | algorithmic auditing |  1.0.7  |
| [helpers](https://github.com/pingleware/bestbooks-helpers) | common methods used in accounting |  1.1.19 |
| [api](https://github.com/pingleware/bestbooks-api) | an API server interface |  1.4.0  |
| [reports](https://github.com/pingleware/bestbooks-reports) | an XML based report generation without any third-party reporting frameworks |  1.2.1  |
| [export](https://github.com/pingleware/bestbooks-export) | permit exporting the records to other formats |  1.0.6  |
| [import](https://github.com/pingleware/bestbooks-import)  | permit importing financial information from other formats |  1.0.7  |
| [mailer](https://github.com/pingleware/bestbooks-mailer)  | a built SMTP mail server |  1.1.1  |
| [hrm](https://github.com/pingleware/bestbooks-hrm)     | a human resource management integration |  1.0.0  |
| [tax](https://github.com/pingleware/bestbooks-tax)     | tax integration for federal, state and local taxes |  1.0.0  |

## Application
The modules mentioned above define the BestBooks Accounting Application Framework that is used to create an accounting application at [https://github.com/pingleware/bestbooks](https://github.com/pingleware/bestbooks)

## Official User Guide
Avalable on [amazon](https://www.amazon.com/dp/B07H1GQZYC)

# Reporting
The reports module returns the report data in object-row format generate by SQL views.

## Income Statement
There are two income statement reports, a regular and a geographic income statement. The Geographic
income statement shows the percentage of total revenu by location as defined in the location table. Here is a sample view,
![Income Statement](https://github.com/pingleware/bestbooks-core/raw/master/assets/income-statement.png)
![Income Statement Geographic](https://github.com/pingleware/bestbooks-core/raw/master/assets/income-statement-geographic.png)

## Balance Sheet
![Balance Sheet](https://github.com/pingleware/bestbooks-core/raw/master/assets/balance-sheet.png)

## Accounts Receivable Aging
![Accounts Receivable Aging](https://github.com/pingleware/bestbooks-core/raw/master/assets/accounts-receivable-aging.png)

## Accounts Payable Aging
![Accounts Payable Aging](https://github.com/pingleware/bestbooks-core/raw/master/assets/accounts-payable-aging.png)

## Statement of Change in Equity
![Statement of Change in Equity](https://github.com/pingleware/bestbooks-core/raw/master/assets/statement-of-chnges-in-equity.png)

## Trial Balance
![Trial Balance](https://github.com/pingleware/bestbooks-core/raw/master/assets/trial-balance.png)

# Test Driven Development

TDD will be utilized during the development and maintenance, using the mocha test framework. A good example of use cases can be found in each test. Execution delays have been added in the tests to compensate for latency in the database updates and response.

You can run the entire test suite using the command,
```
npm test
```

or an individual test script by using the command,
```
npm test test/TEST_SCRIPT_FILENAME.test.js
```

```
mocha [spec..]

Run tests with Mocha

Commands
  mocha inspect [spec..]  Run tests with Mocha                         [default]
  mocha init <path>       create a client-side Mocha setup at <path>

Rules & Behavior
      --allow-uncaught              Allow uncaught errors to propagate [boolean]
  -A, --async-only                  Require all tests to use a callback (async)
                                    or return a Promise                [boolean]
  -b, --bail                        Abort ("bail") after first test failure
                                                                       [boolean]
      --check-leaks                 Check for global variable leaks    [boolean]
      --delay                       Delay initial execution of root suite
                                                                       [boolean]
      --dry-run                     Report tests without executing them[boolean]
      --exit                        Force Mocha to quit after tests complete
                                                                       [boolean]
      --pass-on-failing-test-suite  Not fail test run if tests were failed
                                                      [boolean] [default: false]
      --fail-zero                   Fail test run if no test(s) encountered
                                                                       [boolean]
      --forbid-only                 Fail if exclusive test(s) encountered
                                                                       [boolean]
      --forbid-pending              Fail if pending test(s) encountered[boolean]
      --global, --globals           List of allowed global variables     [array]
  -j, --jobs                        Number of concurrent jobs for --parallel;
                                    use 1 to run in serial
                                   [number] [default: (number of CPU cores - 1)]
  -p, --parallel                    Run tests in parallel              [boolean]
      --retries                     Retry failed tests this many times  [number]
  -s, --slow                        Specify "slow" test threshold (in
                                    milliseconds)         [string] [default: 75]
  -t, --timeout, --timeouts         Specify test timeout threshold (in
                                    milliseconds)       [string] [default: 2000]
  -u, --ui                          Specify user interface
                                                       [string] [default: "bdd"]

Reporting & Output
  -c, --color, --colors                     Force-enable color output  [boolean]
      --diff                                Show diff on failure
                                                       [boolean] [default: true]
      --full-trace                          Display full stack traces  [boolean]
      --inline-diffs                        Display actual/expected differences
                                            inline within each string  [boolean]
  -R, --reporter                            Specify reporter to use
                                                      [string] [default: "spec"]
  -O, --reporter-option,                    Reporter-specific options
  --reporter-options                        (<k=v,[k1=v1,..]>)           [array]

Configuration
      --config       Path to config file   [string] [default: (nearest rc file)]
  -n, --node-option  Node or V8 option (no leading "--")                 [array]
      --package      Path to package.json for config                    [string]

File Handling
      --extension          File extension(s) to load
                                           [array] [default: ["js","cjs","mjs"]]
      --file               Specify file(s) to be loaded prior to root suite
                           execution                   [array] [default: (none)]
      --ignore, --exclude  Ignore file(s) or glob pattern(s)
                                                       [array] [default: (none)]
      --recursive          Look for tests in subdirectories            [boolean]
  -r, --require            Require module              [array] [default: (none)]
  -S, --sort               Sort test files                             [boolean]
  -w, --watch              Watch files in the current working directory for
                           changes                                     [boolean]
      --watch-files        List of paths or globs to watch               [array]
      --watch-ignore       List of paths or globs to exclude from watching
                                      [array] [default: ["node_modules",".git"]]

Test Filters
  -f, --fgrep   Only run tests containing this string                   [string]
  -g, --grep    Only run tests matching this string or regexp           [string]
  -i, --invert  Inverts --grep and --fgrep matches                     [boolean]

Positional Arguments
  spec  One or more files, directories, or globs to test
                                                     [array] [default: ["test"]]

Other Options
  -h, --help             Show usage information & exit                 [boolean]
  -V, --version          Show version number & exit                    [boolean]
      --list-interfaces  List built-in user interfaces & exit          [boolean]
      --list-reporters   List built-in reporters & exit                [boolean]

Mocha Resources
    Chat: https://discord.gg/KeDn2uXhER
  GitHub: https://github.com/mochajs/mocha.git
    Docs: https://mochajs.org/
```

# Package Naming Convention

The BestBooks packages prefix the name with @pingleware, for PressPage Entertainment Inc DBA PINGLEWARE which is the branded operations responsible for IT development.

# Digital Currency Support Added

When Chairman Gensler testified at the House Financial Services Committee, he was ask a question to define Ether, see at [https://www.coindesk.com/video/sec-chair-gensler-refuses-to-say-if-ether-is-a-security-during-house-hearing/](https://www.coindesk.com/video/sec-chair-gensler-refuses-to-say-if-ether-is-a-security-during-house-hearing/), he could not define whether ether is a commodity or security, according to then Professor Gensler at MIT Blockchain course [(https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/](https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/)), Professor Gensler explains that both Bitcoin and Ether are not securiies but a [unit of account.](https://en.wikipedia.org/wiki/Unit_of_account)

Actually Ether like Bitcoin, like Cash is neither a commodity or security. Ether like Bitcoin and Cash and all other foreign currency denominations is a unit of account and is consider a liquid asset like Cash on the balance sheet.

Hence, Digital Currency is derived as a Cash asset for which Bitcoin and Ether is derived from DigitalCurrency class.

# Logging is now available

The log file is named bestbooks.log and resides in the system directory identified as .bestbooks located in the home directory. On a Mac, to view dot directories, open finder and and press CTRL-CMD-. (the dot or period key). Toggle this key combination will toggle the view of the dot directories

There are three levels of logging

| Level | Description                        | Example                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| warn  | For warning, non-critical messages | 2024-04-06T09:42:55.628Z [WARN] {}                                                                                                                                                                                                                                                                                                                                                                                        |
| info  | For informational messages         | 2024-04-06T09:42:55.586Z [INFO] INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,credit,balance) VALUES (0,0,'Google Adsense Revenue',(SELECT code FROM accounts WHERE name='Google Adsense Revenue'),'2013-05-27','Service Adjustment','71.12',(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+71.12,71.12) FROM ledger WHERE account_name='Google Adsense Revenue')); |
| error | For critical messages              | 2024-04-06T09:42:55.628Z [ERROR] {}                                                                                                                                                                                                                                                                                                                                                                                       |
| cat | For consolidated audit trail          | 2024-04-06T09:42:55.628Z [CAT] {}                                                                                                                                                                                                                                                                                                                                                                                       |
| mail | For mail messages                    | 2024-04-06T09:42:55.628Z [MAIL] {}                                                                                                                                                                                                                                                                                                                                                                                       |


# GAAP Compliance

Creating a chart of accounts in accordance with GAAP is the first step towards GAAP complaince and including entries for  FOREX trading to create operational budgets as well as digital currencies

### Chart of Accounts

#### **1000 - Assets**

* **1100 - Current Assets**

  * **1110 - Cash and Cash Equivalents**

    * 1111 - Petty Cash
    * 1112 - Checking Account
    * 1113 - Savings Account
    * 1114 - Money Market Account
    * **1115 - FOREX Trading Accounts**

      * 1115.1 - FOREX Account - RESERVES
      * 1115.2 - FOREX Account - OPERATIONS
  * **1120 - Digital Currencies**

    * 1121 - Bitcoin
    * 1122 - Ether
    * 1123 - Other Digital Currencies
  * **1130 - Accounts Receivable**

    * 1131 - Accounts Receivable - Trade
    * 1132 - Allowance for Doubtful Accounts
  * **1140 - Inventory**

    * 1141 - Raw Materials Inventory
    * 1142 - Work-in-Progress Inventory
    * 1143 - Finished Goods Inventory
  * **1150 - Prepaid Expenses**

    * 1151 - Prepaid Insurance
    * 1152 - Prepaid Rent
  * **1160 - Other Current Assets**

    * 1161 - Short-term Investments
    * 1162 - Notes Receivable (due within one year)
* **1200 - Non-Current Assets**

  * **1210 - Property, Plant, and Equipment (PP&E)**

    * 1211 - Land
    * 1212 - Buildings
    * 1213 - Machinery and Equipment
    * 1214 - Furniture and Fixtures
    * 1215 - Accumulated Depreciation
  * **1220 - Intangible Assets**

    * 1221 - Goodwill
    * 1222 - Patents
    * 1223 - Trademarks
    * 1224 - Accumulated Amortization
  * **1230 - Long-term Investments**
  * **1240 - Other Non-Current Assets**
  * **1242 - Long-term FOREX Investments**

    * 1243 - Long-term Digital Currency Investments
  * **1250 - Other Non-Current Assets**

    * 1251 - Long-term Notes Receivable

#### **2000 - Liabilities**

* **2100 - Current Liabilities**

  * **2110 - Accounts Payable**

    * 2111 - Accounts Payable - Trade
    * 2112 - Accounts Payable - Other
  * **2120 - Short-term Debt**

    * 2121 - Short-term Loans Payable
    * 2122 - Current Portion of Long-term Debt
  * **2130 - Accrued Liabilities**

    * 2131 - Accrued Salaries and Wages
    * 2132 - Accrued Interest Payable
    * 2133 - Accrued Taxes Payable
  * **2140 - Deferred Revenue (current)**

    * 2145 - Unrealized FOREX Gains
    * 2146 - Unrealized FOREX Losses
  * **2150 - Other Current Liabilities**

    * 2151 - Customer Deposits
* **2200 - Non-Current Liabilities**

  * 2210 - Long-term Debt
    * 2211 - Bonds Payable
    * 2212 - Long-term Loans Payable
  * 2220 - Deferred Revenue (non-current)
  * 2230 - Other Non-Current Liabilities
    * 2231 - Deferred Tax Liabilities

#### **3000 - Equity**

* **3100 - Shareholders' Equity**
  * 3110 - Common Stock
  * 3120 - Preferred Stock
  * 3130 - Additional Paid-in Capital
  * 3140 - Retained Earnings
  * 3150 - Treasury Stock
  * **3160 - Accumulated Other Comprehensive Income**
    * 3161 - Cumulative Translation Adjustments

#### **4000 - Revenue**

* **4100 - Sales Revenue**

  * 4110 - Product Sales
  * 4120 - Service Sales
* **4200 - Other Revenue**

  * **4210 - Interest Income**
  * **4220 - Dividend Income**
  * **4230 - Rental Income**
  * **4240 - Gain on Sale of Assets**
  * **4250 - FOREX Trading Gains**
    * 4251 - Realized FOREX Gains
    * 4252 - Unrealized FOREX Gains
  * **4260 - Digital Currency Gains**
    * 4261 - Realized Digital Currency Gains
    * 4262 - Unrealized Digital Currency Gains

#### **5000 - Cost of Goods Sold (COGS)**

* **5100 - COGS**
  * 5110 - Direct Materials
  * 5120 - Direct Labor
  * 5130 - Manufacturing Overhead

#### **6000 - Operating Expenses**

* **6100 - Selling Expenses**
  * 6110 - Advertising Expense
  * 6120 - Sales Commissions
  * 6130 - Travel Expense
* **6200 - General and Administrative Expenses**
  * 6210 - Salaries and Wages
  * 6220 - Rent Expense
  * 6230 - Utilities Expense
  * 6240 - Insurance Expense
  * 6250 - Depreciation Expense
  * 6260 - Amortization Expense
  * 6270 - Office Supplies Expense

#### **7000 - Other Expenses**

* **7300 - Other Expenses**
  * **7100 - Interest Expense**
  * **7200 - Tax Expenses**
  * **7300 - Other Expenses**
    * 7310 - Loss on Sale of Assets
    * 7320 - FOREX Trading Losses
      * 7321 - Realized FOREX Losses
      * 7322 - Unrealized FOREX Losses
    * 7330 - Digital Currency Losses
      * 7331 - Realized Digital Currency Losses
      * 7332 - Unrealized Digital Currency Losses

# About the Disclousres table
The `Disclosures` table holds crucial financial information that must comply with regulatory and accounting standards. It is designed to track the company's public disclosures related to financial statements, which are required for audits, SEC filings, and general financial transparency.

## Use Cases for the `Disclosures` Table

1. **Tracking Financial Disclosures Compliance**  
   The primary use case for the `Disclosures` table is to ensure that financial disclosures (such as income statements, balance sheets, and cash flow statements) are compliant with applicable standards like GAAP, GAAS, and SEC regulations.
   
   **Example**:  
   The company must disclose the financial health of the company by publishing a **Cash Flow Statement**. The table tracks whether the disclosure was made on time, whether it's compliant, and if any issues were found (like missing notes or improper methodology).
   
   **Disclosure Record**:
   ```json
   {
     "name": "Cash Flow Statement",
     "description": "Cash Flow Statement for FY 2023",
     "is_compliant": 1,
     "date_disclosed": "2023-01-15",
     "compliance_note": "Compliant"
   }
   ```

2. **Monitoring Non-Compliant Disclosures**  
   Identifying and monitoring disclosures that have failed to comply with the necessary accounting or regulatory standards is critical for audits and assessments.
   
   **Example**:  
   If an **Income Statement** lacks proper notes on revenue recognition, the audit team may flag this as non-compliant, and the company will be required to correct it before final approval.

   **Non-compliant Disclosure Record**:
   ```json
   {
     "name": "Income Statement",
     "description": "Income Statement for FY 2023",
     "is_compliant": 0,
     "date_disclosed": "2023-03-01",
     "compliance_note": "Methodology not disclosed"
   }
   ```

3. **Reporting on Disclosure History**  
   The `Disclosures` table can provide a historical record of all financial statements and other disclosures the company has made over a period of time. This helps auditors and regulatory bodies to review the company’s compliance with financial reporting over time.

   **Example**:  
   The audit team retrieves all financial disclosures made by the company over the last five years to confirm continuous compliance.

   **Historical Disclosure Records**:
   ```json
   [
     {
       "name": "Balance Sheet",
       "description": "Balance Sheet for FY 2022",
       "is_compliant": 1,
       "date_disclosed": "2022-03-01",
       "compliance_note": "Compliant"
     },
     {
       "name": "Income Statement",
       "description": "Income Statement for FY 2022",
       "is_compliant": 1,
       "date_disclosed": "2022-03-01",
       "compliance_note": "Compliant"
     }
   ]
   ```

4. **Generating Compliance Reports for Audits**  
   The disclosures data can be used to generate detailed reports for external audits, including management and public audit reports. These reports indicate whether the company is in compliance with disclosure requirements, pinpointing areas of improvement.

   **Example**:  
   A **Management Audit Report** is generated, summarizing which disclosures were compliant and which required corrective actions.
   
   **Audit Report Example**:
   ```json
   {
     "total_disclosures": 10,
     "compliant_disclosures": 9,
     "non_compliant_disclosures": 1,
     "non_compliant_details": [
       {
         "disclosure": "Income Statement",
         "compliance_note": "Methodology not disclosed"
       }
     ]
   }
   ```

5. **Ensuring Timeliness of Disclosures**  
   The `Disclosures` table allows tracking the timeliness of financial disclosures, which is important for SEC reporting deadlines. Late filings can lead to penalties or regulatory scrutiny.
   
   **Example**:  
   The **Balance Sheet** for Q2 is supposed to be disclosed by the end of the quarter. If it is delayed beyond the disclosure deadline, the company may face penalties.

   **Late Disclosure Record**:
   ```json
   {
     "name": "Balance Sheet",
     "description": "Balance Sheet for Q2 2023",
     "is_compliant": 0,
     "date_disclosed": "2023-07-15",
     "compliance_note": "Late submission"
   }
   ```

6. **Tracking Disclosure Corrections**  
   Companies may need to revise their disclosures if auditors or regulators find errors. Tracking when disclosures were corrected helps maintain an audit trail.
   
   **Example**:  
   The **Cash Flow Statement** initially failed to disclose a cash outflow correctly. After a revision, it was marked as compliant.

   **Corrected Disclosure Record**:
   ```json
   {
     "name": "Cash Flow Statement",
     "description": "Revised Cash Flow Statement for FY 2023",
     "is_compliant": 1,
     "date_disclosed": "2023-04-01",
     "compliance_note": "Revised disclosure"
   }
   ```

7. **Tracking Key Financial Metrics and Their Presentation**  
   Ensure that key financial metrics such as earnings per share (EPS), total assets, liabilities, and cash flows are properly disclosed and are consistent across the disclosures.
   
   **Example**:  
   The company's **Equity Statement** must include the proper breakdown of share transactions and equity changes. If some key equity metrics are omitted, it would be considered non-compliant.

   **Equity Statement Disclosure**:
   ```json
   {
     "name": "Equity Statement",
     "description": "Equity Statement for FY 2023",
     "is_compliant": 1,
     "date_disclosed": "2023-01-15",
     "compliance_note": "Includes EPS, dividends, and other changes in equity"
   }
   ```

8. **Ensuring Compliance with Regulatory Changes**  
   As regulations evolve, the company must ensure that disclosures are updated to reflect new accounting standards or regulatory requirements.
   
   **Example**:  
   New SEC regulations may require additional disclosure of **Related Party Transactions**. The `Disclosures` table tracks whether this new requirement has been implemented.

   **Related Party Transaction Disclosure**:
   ```json
   {
     "name": "Related Party Transactions",
     "description": "Disclosures of transactions with related parties for FY 2023",
     "is_compliant": 1,
     "date_disclosed": "2023-01-15",
     "compliance_note": "Compliant with new SEC regulations"
   }
   ```

9. **Support for Public Disclosure Reporting**  
   The `Disclosures` table is also useful for generating **Public Disclosure Audit Reports**, which summarize the financial information made available to investors and the public, ensuring transparency and accountability.
   
   **Example**:  
   A **Public Disclosure Report** is generated to confirm that all mandatory filings have been made and publicly disclosed by the company in accordance with SEC regulations.
   
   **Public Disclosure Report Example**:
   ```json
   {
     "total_disclosures": 12,
     "compliant_disclosures": 11,
     "non_compliant_disclosures": 1,
     "non_compliant_details": [
       {
         "disclosure": "Income Statement",
         "compliance_note": "Disclosure methodology missing"
       }
     ],
     "date": "2023-12-31"
   }
   ```

### Summary of Use Cases
1. **Tracking Financial Disclosures Compliance** (e.g., Balance Sheet, Income Statement)
2. **Monitoring Non-Compliant Disclosures** (e.g., flagging incomplete/missing disclosures)
3. **Reporting on Disclosure History** (e.g., view historical disclosure records)
4. **Generating Compliance Reports for Audits** (e.g., create audit reports)
5. **Ensuring Timeliness of Disclosures** (e.g., track on-time vs late disclosures)
6. **Tracking Disclosure Corrections** (e.g., track revisions to disclosures)
7. **Tracking Key Financial Metrics** (e.g., EPS, liabilities, cash flows)
8. **Ensuring Compliance with Regulatory Changes** (e.g., adaptation to new regulations)
9. **Support for Public Disclosure Reporting** (e.g., ensure investor disclosures are accurate)

These use cases are essential for maintaining financial transparency, ensuring regulatory compliance, and assisting in internal and external audits.

## Conservatism Principle
The Conservatism Principle should be applied and potentially updated when a ledger transaction is added, based on the type and certainty of the transaction. The principle specifically requires that:

Expenses and Liabilities:

These are to be recorded as soon as they are probable, even if the exact amount is uncertain. Therefore, when any transaction classified as an expense or liability is added to the ledger, it should be immediately flagged as "conservative."
Revenues and Assets:

These should only be recorded when they are certain. When a transaction classified as revenue or an asset is added, it should be flagged as "non-conservative" unless there is a high level of certainty regarding the transaction.
In practical terms, when a new transaction is added to the ledger, the system should evaluate the nature of the transaction and apply or update the conservatism flag based on this logic.

When to Update Conservatism in the Ledger
Expenses and Liabilities should be updated and flagged immediately when they are recorded in the ledger (e.g., estimated costs, potential legal settlements, contingent liabilities).

Revenues and Assets should be deferred or marked as uncertain until they are realized or certain (e.g., expected future sales, unrealized asset gains).

Process to Update Conservatism Principle on Ledger Transactions
Evaluate Transaction Type:

If the transaction is an expense or liability, the conservatism principle should immediately flag it as conservative.
If the transaction is revenue or asset, it should be flagged as non-conservative until certainty is achieved (i.e., confirmation of actual receipt or asset ownership).
Update the Transaction Record:

The transaction should be inserted into the ledger with the corresponding conservatism flag (is_conservative) based on the evaluation.

## Going Concern Assumption
The Going Concern Assumption in accounting is the assumption that a company will continue to operate in the foreseeable future and not be forced to halt its operations or liquidate its assets. In an audit or financial assessment, this principle is crucial because it affects the valuation of assets, liabilities, and other financial items.

### How to Implement the Going Concern Assumption
The logic for this can be applied by monitoring specific financial indicators that could suggest that the company may no longer continue as a going concern. These indicators might include:

- Declining revenues
- High debt levels
- Negative cash flows
- Inability to meet obligations

### Key Logic Explained
1. Adding Financial Indicators: Each financial indicator (like revenue, debt, or cash flow) is inserted into the financial_indicators table. Each entry has a value, a predefined threshold, and a status:

  - If the value exceeds the threshold by a critical amount (e.g., 1.5 times), the status is marked as "critical."
  - If the value exceeds the threshold but is not critical, it is marked as "warning."
  - If the value is within normal range, it is marked as "normal."
2. Evaluating the Going Concern Assumption: The evaluateGoingConcern() function checks for any critical financial indicators. If one or more indicators are critical, the company is flagged as not a going concern. Otherwise, it is considered a going concern.

Financial Indicators:
```
[
    {
        "id": 1,
        "indicator_name": "debt_to_equity_ratio",
        "value": 4.5,
        "threshold": 3.0,
        "status": "critical",
        "recorded_at": "2024-10-12"
    },
    {
        "id": 2,
        "indicator_name": "net_profit_margin",
        "value": 0.1,
        "threshold": 0.05,
        "status": "normal",
        "recorded_at": "2024-10-12"
    }
]
```
 Evaluate the Going Concern Assumption
 ```
{
    "going_concern": true,
    "message": "Company is operating as a going concern."
}
 ```
# COGS vs SPROCKETS
In accounting terms, **COG (Cost of Goods)** and **SPROCKET** don't directly relate, but we can reinterpret your question to address possible conceptual analogies or clarify their relevance in a financial or operational context.

### **COG (Cost of Goods)**
- **Definition**: Refers to the direct costs associated with the production of goods sold by a company.
- **Components**:
  - Direct materials: Raw materials used in production.
  - Direct labor: Wages for workers directly involved in manufacturing.
  - Overhead: Factory costs directly tied to production (e.g., utilities, equipment depreciation).
- **Purpose**:
  - Determines the **gross profit**: 
    \[
    \text{Gross Profit} = \text{Revenue} - \text{Cost of Goods Sold (COGS)}
    \]
  - Critical for financial reporting, inventory management, and profitability analysis.

---

### **SPROCKET (Operational Analogy)**
In accounting, a **sprocket** might metaphorically represent **operational components** or **processes** that "drive" an organization's functionality—particularly those connected to supply chains or production processes. For instance:
- **Chain Mechanism**: A sprocket drives a chain, much like an operational system that facilitates the flow of raw materials (inventory management) or product delivery (logistics).
- **Budget Categories**: Could refer to specific cost centers (e.g., distribution or manufacturing processes).

---

### **Comparison in Accounting Context**
| **Aspect**           | **COG (Cost of Goods)**                         | **Sprocket (Operational Analogy)**          |
|-----------------------|------------------------------------------------|---------------------------------------------|
| **Focus**            | Financial measurement of production costs.      | Operational or logistical cost drivers.     |
| **Role in Business** | Calculates profitability of goods sold.         | Drives supply chain efficiency and output.  |
| **Example Use**      | Raw material, labor costs.                      | Transportation, machinery maintenance.      |

If you're asking about a specific accounting analogy or need further clarification, feel free to elaborate!
# End of Life Doctrine

When a piece of software is useful there should never be an end-of-life doctrine. The goal of this software is to achieve immortality ;). When this software has reached that stage, this project may appear abandon but the opposit is true. This software (in release not alpha, beta or gamma) has achieve that state where maintenance is no longer required.

Patrick O. Ingle

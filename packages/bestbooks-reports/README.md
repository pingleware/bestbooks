# BestBooks Accounting Application Framework - REPORTS

There are no free options for creating reports from content received from a database. jsreports, jasperreports have limited free options.

Hence the report design will go back to basics,

    1. creating an XML document for the data required for the report
    2. display the XML using XSLT with CSS which can be printed or
       save as a PDF or DOCX (see https://www.geeksforgeeks.org/displaying-xml-using-xslt/)

During initialization (invoking the init() function)), will copy the xslt template files to the user's home directory in the bestbooks system directory.

The js2xmlparser package is used to convert an object to xml, while the xslt-processor package will transform the XML data and XSLT template to HTML format.

HTML can be converted to other forms like PDF.

## Test Driven Development
When testing, run on a local system, as github workflows have issues with permissions and other problems that result in failure of the tests.

## Reporting in Accounting

Reporting is the most important feature of any accounting system, because reporting permits the communication to interested parties. Using test driven development (TDD) allows the implementation of the reports module first.

## GAAP Compliance

There is much discussion concerning GAAP compliance and accounting sofftware with some commentors stating that accounting software can never be GAAP compliance. First, GAAP compliance has to do with reporting and involves an accountant statement or notes added to the financial statements, this where the component noteToFinancialStatements permits the addition of a notes fields to the report XML data, thus making BestBooks GAAP compliance with the addition of a notes field on reports.

Also to ensure GAAP compliance, standard labels as defined by FASB should be used in the report generation. See [FASB Segment Reporting (Topic 280)](https://www.fasb.org/page/ShowPdf?path=ASU%202023-07.pdf),  [2024 US GAAP Financial, SEC Reporting and DQC Rules Taxonomies ](https://xbrl.us/xbrl-taxonomy/2024-us-gaap/)with the updated link to [FASB Explanatory Page ](https://fasb.org/projects/fasb-taxonomies)

An exempt offering under Section 3(a)(11) which is an intrastate public offering issuing unrestricted securities to a single state bonafide residents. To ensure compliance of this exempt offering, segment reporting is required if the securities become traded on a NMS Exchange.

## Reports included

You can customize the style of the reports by modifying the XSLT file located in the **.bestbooks** system directory of the current user home directory. The package XSLT files are ONLY copied to this directory if they do not exist. The available report XSLT files include,

```
account-payables-aging.xslt
account-receivables-aging.xslt
balance-sheet.xslt
breakeven-analysis.xslt
budget-vs-actual.xslt
customer-estimate.xslt
income-statement.xslt
income-statement-geographic.xslt
purchase-order.xslt
retained-earnings.xslt
statement-in-change-in-equity.xslt
statement-of-cash-flows.xslt
trial-balance.xslt
```

### Account Payables Aging

![account-payables-aging.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/account-payables-aging.png)

### Account Receivables Aging

![account-receivables-aging.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/account-receivables-aging.png)

### Balance Sheet

![balance-sheet.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/balance-sheet.png)

### Breakeven Analysis

![breakeven-analysis.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/breakeven-analysis.png)

### Budget vs. Actual

![budget-vs-actual.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/budget-vs-actual.png)

### Income Statement

![income-statement.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/income-statement.png)

### Income Statement by Geography

![income-statement-geographic.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/income-statement-geographic.png)

### Customer Estimate

![1712500090802](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/1712500090802.png)

### Purchase Order

![purchase-order.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/purchase-order.png)

### Retained Earnings

![retained-earnings.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/retained-earnings.png)


### Statement in Change in Equity

![statement-of-change-in-equity.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/statement-of-change-in-equity.png)

### Statement of Cash Flows

![statement-of-cashflows.png](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/statement-of-cashflows.png)

### Trial Balance

![trial-balance](https://github.com/pingleware/bestbooks-reports/blob/master/image/README/trial-balance.png)

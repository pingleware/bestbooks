# BestBooks Accounting Application Framework - TAX

[![npm test](https://github.com/pingleware/bestbooks-tax/actions/workflows/npm-test.yml/badge.svg)](https://github.com/pingleware/bestbooks-tax/actions/workflows/npm-test.yml)

A comprehensive library to manage federal, state, and local tax obligations for businesses and individuals. Due to the nature of taxes with changes occuring annually, this component is architecture using plugins with the first plugin example for tax brackets.

## Features

- Federal income tax calculation based on tax brackets.
- State income tax and sales tax management.
- Local income and sales tax calculations.

## Installation

```bash
npm install @pingleware/bestbooks-tax
```

The new `@pingleware/bestbooks-tax` module will be an extension of the BestBooks accounting system, designed to handle various tax obligations including federal, state, and local taxes. It will support income tax calculations, sales tax management, and other specialized taxes, ensuring compliance and ease of use for businesses and individuals. Below is a detailed breakdown of the features:

### 1. **Federal Taxes**
   - **Income Tax:** Automatically calculate federal income taxes for both individuals and businesses based on current IRS tax brackets.
     - **Features:**
       - Support for various filing statuses: Single, Married Filing Jointly, Married Filing Separately, Head of Household, and Qualifying Widow(er).
       - Progressive tax calculation using the latest IRS tax rates and standard deductions.
       - Support for tax credits such as Child Tax Credit, Earned Income Credit, and Education Credits.
       - Integration with payroll for automatic federal withholding calculations.
   - **Corporate Taxes:** Calculate and file corporate income taxes for businesses, including deductions, depreciation, and tax credits.
   - **Estimated Taxes:** Allow for the tracking and payment of estimated quarterly federal taxes, with reminders and projections for future payments.

### 2. **State Taxes**
   - **Income Tax:** Automatically calculate state income taxes based on user location and applicable state laws.
     - **Features:**
       - Support for different state tax structures, including flat and progressive tax rates.
       - Automatic withholding calculations for state income tax in payroll.
       - Tracking and filing for state-specific tax deductions and credits.
   - **Sales Tax:** Management of state-level sales tax rates, including:
     - **Features:**
       - Automatic sales tax calculations based on customer location for e-commerce or physical store transactions.
       - Multi-jurisdictional support for businesses operating in multiple states.
       - Integration with sales and invoicing modules to automatically apply correct sales tax rates.
       - Regular updates on changing state sales tax rates and laws.
   - **Franchise Tax:** Handle state-level franchise taxes for corporations, including due dates and calculation methods for various states.

### 3. **Local Taxes**
   - **Local Income Taxes:** Support for local municipalities that require additional income tax payments.
     - **Features:**
       - Automatic calculation of local income taxes based on user address or business location.
       - Support for multiple local tax rates within a single state or region.
   - **Property Tax:** Manage local property tax obligations for businesses or individuals.
     - **Features:**
       - Tracking property values and tax rates for accurate property tax calculations.
       - Automatic reminders for property tax payments and due dates.
   - **Business License Taxes:** Track and manage local business taxes and fees required for operating within specific jurisdictions.
   - **Utility Taxes:** Support for calculating and tracking local taxes on utilities like water, electricity, and gas.

### 4. **Sales and Use Tax**
   - **Sales Tax Collection and Reporting:** Automatically calculate and apply the correct sales tax rate based on the customer's location and the type of product or service.
     - **Features:**
       - Dynamic calculation of sales tax for online transactions using geolocation or manual input.
       - Support for tax-exempt customers or transactions.
       - Generation of detailed sales tax reports for easy filing with local and state tax authorities.
   - **Use Tax:** Automatically calculate use taxes for goods purchased out of state but used within a jurisdiction where use tax applies.
   - **Tax Nexus Management:** Track tax nexus status for businesses to ensure compliance in states where sales tax should be collected due to physical or economic presence.

### 5. **Other Taxes**
   - **Payroll Taxes:** Full support for employer-side taxes such as Social Security, Medicare, and unemployment taxes.
     - **Features:**
       - Automatic withholding calculations for employees, ensuring compliance with federal and state payroll tax laws.
       - Regular updates on payroll tax rates and regulations.
   - **Excise Taxes:** Manage excise tax calculations for businesses involved in selling specific goods like alcohol, tobacco, or fuel.
   - **Luxury and Sin Taxes:** Handle taxes on luxury items or "sin" goods like cigarettes or sugary drinks, based on local laws.
   - **Environmental and Carbon Taxes:** Support for businesses required to report and pay environmental taxes related to emissions, energy use, or carbon output.
   - **Import/Export Duties:** For businesses involved in international trade, the module will calculate duties and tariffs on imported/exported goods.

### 6. **Integration with BestBooks**
   - **Seamless Data Flow:** The `bestbooks-tax` module will integrate seamlessly with existing BestBooks modules, ensuring smooth data transfer between accounting, payroll, invoicing, and tax functions.
   - **Tax Filing Support:** Provide pre-filled forms for federal, state, and local tax filings, including electronic filing options for supported jurisdictions.
   - **Audit Trail:** Track all tax-related transactions for audit purposes, maintaining a clear record of tax filings, payments, and adjustments.
   - **Tax Calendar and Reminders:** Automatically generate a tax calendar with important due dates for filing and payment at the federal, state, and local levels.

### 7. **Customization and Localization**
   - **Custom Tax Rules:** Users can set up custom tax rules for specific business needs or regions, including industry-specific taxes.
   - **Localization:** The module will support multiple languages and currencies, ensuring international businesses can comply with their local tax requirements.
   
### 8. **Reporting and Analytics**
   - **Tax Reports:** Generate detailed tax reports for federal, state, and local taxes, including summaries of tax liabilities, payments, and due dates.
   - **Tax Projections:** Estimate future tax liabilities based on current income, sales, and expenses to help businesses plan for upcoming payments.
   - **Tax Reconciliation:** Easily reconcile tax payments with accounting records to ensure accuracy and prevent overpayments or underpayments.

This `bestbooks-tax` module will ensure users can manage their taxes efficiently, stay compliant with ever-changing tax laws, and minimize their tax liabilities through optimized accounting practices.
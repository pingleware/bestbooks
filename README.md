# BestBooks ™️

An open-source accounting framework used to build a full fledge accounting bookkeepign system based on accounting terms

# New Architecture

BestBooks is being redesigned to a client-server-desktop model, where the server-deesktop applications operates behind a firewall while the client provides relevant data to the server-desktop.

![1712411119697](image/README/1712411119697.png)

![1712411135560](image/README/1712411135560.png)

* Administrative Assistant - https://snapcraft.io/administrative-assistant
* Node Application Builder - https://snapcraft.io/node-application-builder (future)
* Everyday Management - https://everyday.management
* Corporate Book - https://snapcraft.io/corporate-book
* SOP Manager - https://snapcraft.io/sop-manager (future)
* EDGAR Reporting Tools - https://snapcraft.io/edgar-reporting-tools
* Records Management System - https://snapcraft.io/records-management-system (future)
* Transfer Agent Stock Certificate Creator - https://github.com/pingleware/transferagent-stockcertificate-creator/releases

## Release Schedule

| Date | Version     | Deescription                                                                                                                                                              |
| ---- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TBD  | 1.0.0-alpha | Integration implementation of CHart of Account, Ledger, Journal; importing accounting csv from Wave Accounting; balance sheet, income statement and trial balance reports |
|      |             |                                                                                                                                                                           |

### Alpha

A first pre-release alpha is targeted to include working functionality of the following,

1. Implemention of Accounting panel operations (Chart of Accounts, Ledger & Journal Transaction, Budget and Balances)
2. Importing accounting.csv from Wave Accounting
3. Balance Sheet, Income Statement and Trial Balance reports

The database is a SQLite datastore saved in the .bestbooks directory of the user directory.

## Directory Structure

This repository contains the following directories,

    assets - for current and new assets
    dotnet - a dotnet maui version
    node-electron - the Node-Electron Desktop Administrator
    wordpress.org - the original wordpress.org/plugins/bestbooks code
    wordpress - the future wordpress.org/plugins/bestbooks refactor for the Desktop Administrator

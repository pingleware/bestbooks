# BestBooks ™️

An open-source accounting framework used to build a full fledge accounting bookkeepign system based on accounting terms

# New Architecture

BestBooks is being redesigned to a client-server-desktop model, where the server-deesktop applications operates behind a firewall while the client provides relevant data to the server-desktop.

![New Architectire](https://github.com/pingleware/bestbooks/blob/master/assets/new-architecture.png "New Architecture")

![Business Automation Rendition](https://github.com/pingleware/bestbooks/blob/master/assets/business-automation.png "Business Automation")

## Release Schedule

### Alpha

A first pre-release alpha is targeted to include working functionality of the following,

1. Implemention of Accounting panel operations (Chart of Accounts, Ledger & Journal Transaction, Budget and Balances)
2. Importing accounting.csv from Wave Accounting
3. Balance Sheet, Income Statement and Trial Balance reports

The database is a SQLite datastore saved in the .bestbooks directory of the user directory.

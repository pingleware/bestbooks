# BestBooks Accounting Application Framework - CORE

BestBooks is an open source accounting application framework based on accounting terminology. Originally developed in Java to support multiple database because at the time the accounting applications had a close data model. Then migrated to PHP and as a WordPress plugin. BestBooks grew and matured as a WordPress plugin and became to cumbersome for a multiple site bookkeeping record system. A decision to rearchitect the framework with minimal web functionality interacting with a backend desktop-server component that can be placed behind a firewall.

NodeJS was chosen for the code base of the architecture because of one-code-base multiple platforms, as well as to breakup the functionality into node modules for easier maintenance with the base module beginning as the core.

The core module is a migration of the PHP classes from the WordPress plugin.

# Test Driven Development

TDD will be utilized during the development and maintenance, using the mocha test framework.

# Package Naming Convention

The BestBooks packages prefix the name with @pingleware, for PressPage Entertainment Inc DBA PINGLEWARE which is the branded operations responsible for IT development.

## Digital Currency Support Added

When Chairman Gensler testified at the House Financial Services Committee, he was ask a question to define Ether, see at [https://www.coindesk.com/video/sec-chair-gensler-refuses-to-say-if-ether-is-a-security-during-house-hearing/](https://www.coindesk.com/video/sec-chair-gensler-refuses-to-say-if-ether-is-a-security-during-house-hearing/), he could not define whether ether is a commodity or security, according to then Professor Gensler at MIT Blockchain course [(https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/](https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/)), Professor Gensler explains that both Bitcoin and Ether are not securiies but a [unit of account.](https://en.wikipedia.org/wiki/Unit_of_account)

Actually Ether like Bitcoin, like Cash is neither a commodity or security. Ether like Bitcoin and Cash and all other foreign currency denominations is a unit of account and is consider a liquid asset like Cash on the balance sheet.

Hence, Digital Currency is derived as a Cash asset for which Bitcoin and Ether is derived from DigitalCurrency class.

## Logging is now available

The log file is named bestbooks.log and resides in the system directory identified as .bestbooks located in the home directory. On a Mac, to view dot directories, open finder and and press CTRL-CMD-. (the dot or period key). Toggle this key combination will toggle the view of the dot directories

There are three levels of logging

| Level | Description                        | Example                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| warn  | For warning, non-critical messages | 2024-04-06T09:42:55.628Z [WARN] {}                                                                                                                                                                                                                                                                                                                                                                                        |
| info  | For informational messages         | 2024-04-06T09:42:55.586Z [INFO] INSERT OR IGNORE INTO ledger (company_id,office_id,account_name,account_code,txdate,note,credit,balance) VALUES (0,0,'Google Adsense Revenue',(SELECT code FROM accounts WHERE name='Google Adsense Revenue'),'2013-05-27','Service Adjustment','71.12',(SELECT IIF(SUM(debit)-SUM(credit),SUM(debit)-SUM(credit)+71.12,71.12) FROM ledger WHERE account_name='Google Adsense Revenue')); |
| error | For critical messages              | 2024-04-06T09:42:55.628Z [ERROR] {}                                                                                                                                                                                                                                                                                                                                                                                       |

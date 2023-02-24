# Bestbooks 
The official development branch for the wordpress plugin located at https://wordpress.org/plugins/bestbooks/

Contributors: phkcorp2005
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9674139
Tags: shari PressPage Entertainment Inc bestbooks accounting application framework sourceforge
Requires PHP: 7.1
Requires at least: 2.9
Tested up to: 5.8.1
Stable tag: 2.6.2

Provides an accounting application framework for wordpress.

# Description

BestBooks For Wordpress originally was developed in Java, the original framework.
The goal behind Bestbooks is to provide an accounting application framework modelled
after common accounting terms (t-account,ledger,jornal) and the GAAP (Generally Accepted
Accounting Principles) while providing open database connectivity. At the time,
accounting frameworks had a proprietary, closed database structure. The original Bestbooks
for Java has connectivity for multiple databases including MSSQL, DB2, Oracle and MySQL.

BestBooks for Wordpress started as a minimal accounting framework but with inspiration (not copy)
from waveaccounting.com, BestBooks is becoming a full fledge accounting application.

BestBooks for Wordpress has enough functionality that you can create
workable scripts that solve accounting problems. You will be able to
implement many of the accounting problems on the accounting
learning website, http://www.simplestudies.com

Additional help from the excellent tutorials at https://www.keynotesupport.com/menu-accounting.shtml

BestBooks Accounting Application Framework is a registered trademark of PressPage Entertainment Inc.

# Installation 

To instal this plugin, follow these steps:

1. Download the plugin
2. Extract the single file
3. Extract the plugin to the `/wp-content/plugins/` directory as new directory will be created identified as 'bestbooks'
4. Activate the plugin through the 'Plugins' menu in WordPress, identified by 'Bestbooks'


# Arbitrary section

More information of the GAAP at http://www.accounting.com/resources/gaap/

Tables creation from SQL:
------------------------


These tables are created automatically within the wordpress database


-- 
-- Table structure for table `Accounts`
-- 

For Network-aware configurations, aka WPMU

CREATE TABLE IF NOT EXISTS {$wpdb->base_prefix}bestbooks_accounts (
    `id` int(11) NOT NULL,
    `txdate` date NOT NULL DEFAULT '0000-00-00',
    `name` varchar(50) NOT NULL DEFAULT '',
    `type` varchar(20) NOT NULL DEFAULT '',
    `data` varchar(25) NOT NULL DEFAULT '',
    `class` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1

For non-Network-aware configurations,

CREATE TABLE IF NOT EXISTS {$wpdb->prefix}bestbooks_accounts (
    `id` int(11) NOT NULL,
    `txdate` date NOT NULL DEFAULT '0000-00-00',
    `name` varchar(50) NOT NULL DEFAULT '',
    `type` varchar(20) NOT NULL DEFAULT '',
    `data` varchar(25) NOT NULL DEFAULT '',
    `class` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1
                          
-- --------------------------------------------------------

-- 
-- Table structure for table `Journal`
-- 

For Network-aware configurations, aka WPMU

CREATE TABLE IF NOT EXISTS {$wpdb->base_prefix}bestbooks_journal (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT 'General Journal',
    `txdate` date DEFAULT NULL,
    `ref` int(11) NOT NULL DEFAULT 0,
    `account` varchar(50) NOT NULL DEFAULT '',
    `debit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `credit` decimal(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

For non-Network-aware configurations,

CREATE TABLE IF NOT EXISTS {$wpdb->prefix}bestbooks_journal (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT 'General Journal',
    `txdate` date DEFAULT NULL,
    `ref` int(11) NOT NULL DEFAULT 0,
    `account` varchar(50) NOT NULL DEFAULT '',
    `debit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `credit` decimal(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
                      
-- --------------------------------------------------------

-- 
-- Table structure for table `Ledger`
-- 
 
For Network-aware configurations, aka WPMU

CREATE TABLE IF NOT EXISTS {$wpdb->base_prefix}bestbooks_ledger (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `num` int(11) NOT NULL DEFAULT 0,
    `name` varchar(255) NOT NULL DEFAULT '',
    `txdate` date DEFAULT NULL,
    `note` varchar(255) NOT NULL DEFAULT '',
    `ref` double NOT NULL DEFAULT 0,
    `debit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `credit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
    `type` varchar(10) NOT NULL DEFAULT '',
    `cleared` char(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

For non-Network-aware configurations,

CREATE TABLE IF NOT EXISTS {$wpdb->prefix}bestbooks_ledger (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `num` int(11) NOT NULL DEFAULT 0,
    `name` varchar(255) NOT NULL DEFAULT '',
    `txdate` date DEFAULT NULL,
    `note` varchar(255) NOT NULL DEFAULT '',
    `ref` double NOT NULL DEFAULT 0,
    `debit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `credit` decimal(10,2) NOT NULL DEFAULT 0.00,
    `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
    `type` varchar(10) NOT NULL DEFAULT '',
    `cleared` char(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
                    


Testing:
-------

Create a page with the following shortcode, [bestbooks-sample-1]
then check your database tables for the validation.

If you get an error, please report it!

# Frequently Asked Questions 

Please do not be afraid of asking questions?<br>

(There are no stupid or dumb questions!)


# Changelog
= 2.6.3=
* Added xref column to both ledger and journal tables
* Updated the ref and xref with the releated ledger and journal entries

= 2.6.2=
* Added 'Add New Transaction' feature on Banking Transactions page
* Fixed 'Add Transaction' on Accounting|Transactions page

= 2.6.1=
* Added an Auditing top menu item
* Added Tax Jurisdictions
* Added Customer Statement, Invoices, Recurring Invoices, and Payments list table
* Create a custom post type 'reject'
* Implemented Sales Estimates

= 2.6.0=
* Implemented Sales|Add Customer
* Fixed Ledger class does not exist exception during plugin upgrade
* Fixed plugin delete (uninstall) error

= 2.5.6=
* Remove Sales menu filtering between Profit and Non-Profit bestbooks_company users

= 2.5.5=
* Implemented Purchase|Purchase Order entry, edit, delete, send, and view/print
* Implemented multi-company; default company is the primary administration (ID=1) and has additional metadata; 
* Added bestbooks_company role for multi-company and create separate ledger, journal and chartofoaccount tables indexed by the user ID.
* Vendor's are shared between multi-companies because WordPress prevents the creation of duplicate users (bestbooks_vendor)
* Added the meta field of 'company' to BestBooks post types to keep the company records separate; company is the bestbooks_company user ID.
* Implemented XML and XSLT transformation for generating printable purchase orders; purchase order metadata is saved as JSON

= 2.5.4=
* Implemented Purchase|Bill entry
* Added bestbooks_external_payment_methods filter to permit extending payment method functions when assigned to a payment method
* Added bestbooks_expense action hook
* Added privacy option to star-out descriptions on the transaction, chart of account and journal pages
* Added vendor edit and delete

= 2.5.3=
* Implemented Banking less reconciliation
* Added Purchase|Receipts create a ledger entry during receipt view

= 2.5.2=
* Fixed missing function bestbooks_payexpensebycard
* Added ledger updates for Purchase|Receipts

= 2.5.1=
* Implemented Inventory (Sales, Purchase, Capital Assets), Purchase|Vendor(s) and Purchase|Methods,Terms,Forms
* Added function_exists statements
* Fixed multisite detection

= 2.4.6=
* Updated BestBooks object model

= 2.4.5=
* Fixed alter table errors by detecting if changes have occurred
* Updated trademark registration notice

= 2.4.4=
* Added upgrader_process_complete action hook to update the database after a plugin repository upgrade has occurred

= 2.4.3=
* Ledger and Journal table updates, to include support for multiple journals. The first journal is referenced as the 'General Journal'
* Added Filter by Journal on Journal dashboard page
* Updated BestBooks API panel on the Help dasbboard page
* Fix Add New Account within Chart of Accounts

= 2.4.2=
* Redesigned amd added third party accounting course links, codification links, and additional topics on the Help dashboard

= 2.4.1=
* Added UNINSTALL.PHP to delete bestbooks custom data - BACKUP DATA BEFORE UNINSTALLING

= 2.4.0=
* Implemented Accounting pages using WP_List_Table
* Added common transactions import

= 2.3.7=
* Fixed Ledger::alertTable not found error, to Ledger::alterTable

= 2.3.6=
* Modify table id column from tinyint to full int

= 2.3.5=
* Removal of ABS function

= 2.3.4=
* Increased version number

= 2.3.3 =
* Fixed single-site with function checking for "is_plugin_active_for_network"
* Clean formatting on SETTINGS page

= 2.3.2 =
* Fixed for operations on a single-site as well as multi-site installation of WordPress
* Added argument information to the REST API routes

= 2.3.1 =
* Change ownership references from PHK Corporation to PressPage Entertainment Inc
* Added Current Time Zone field to settings
* Added hacker-proof to prevent exposing usernames via the rest API
* Added user authentication

= 2.3 =
* Added import of Stripe Transactions CSV
* Added pagination for Accounting|Transactions
* Added pagination for Accounting|Journal Transaction
* Implemented a simple Income Statement report

= 2.2.2 =
* Added WooCommerce action filter woocommerce_payment_successful_result
* Added function checking for hooks
* Fixed typo's

= 2.2.1 =
* Fixed execption on plugin activation for undefined function Journal::alterTable()

= 2.2 =
* Made tables network aware and general code fixes
* Added UI panels for easier management with report generation
* Added hooks to ease with the integration with the framework from other themes and plugins.

= 2.1.1 =
* Added Dashboard settings form to add new Chart of Accounts 
* Exposed the Bestbooks chart of accounts as a WordPress taxonomy of bestbooks_coa

= 2.1 =
* Fixed Journal entries, Liability accounts enter increases in the credit, and decreases in the debit columns
* Add additional implementation to the REST API, to include add and subtract and updates appropriately
* Added additional WP-JSON REST API's: account_types, debit, credit, balance, add, subtract, headers
* Implemented composer for autoload using vendor/autoload.php
* Implemented backward compatibility when SplEnum is not available
* added getAccountBaseType to TAccount
* added new account classes: Cash, Bank, Credit, Investment, Withdrawal

= 2.0 =
* Architect framework to use PSR-4 autoloading
* change table name to preceed with bestbooks_ as not to interfere with existing tables
* added a rest API

= 1.1.2 =
* Version number change only

= 1.1.1 =
* Compatible to WP Version 4.3

= 1.1 =
* Change table reference to include wpdb->prefix to support WPMU as well as custom table names, removed php5-ext

= 1.0 =
* Created

== Upgrade Notice ==
= 2.5.5 =
* PHP XML module is required to create purchase orders
* Paying a purchase order, involves creating an associated bill (Purchase|Bill|Create Bill) and selecting the purchase order. Then selecting Pay Bill from the list.
* Purchase Order creation DOES NOT update ANY accounting table. Accounting tables are updated when a Bill is created for the Purhase Order.
* Accounting tables are updated when a Bill is paid, providing Purchase|Payment Methods have been provided and assigned to a payment action hook?

= 2.3.1 =
Upgrade to the latest as the API permit non-authorized access

== Credits ==

We make honorable mention to anyone who helps make Bestbooks for Wordpress a better plugin!

== Contact ==

Support is provided at https://github.com/patrickingle/bestbooks/issues. You will require a free account on github.com

Please contact presspage.entertainment@gmail.com or visit the above forum with questions, comments, or requests.
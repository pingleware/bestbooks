# BestBooks Accounting Application Framework - CORE
BestBooks is an open source accounting application framework based on accounting terminology. Originally developed in Java to support multiple database because at the time the accounting applications had a close data model. Then migrated to PHP and as a WordPress plugin. BestBooks grew and matured as a WordPress plugin and became to cumbersome for a multiple site bookkeeping record system. A decision to rearchitect the framework with minimal web functionality interacting with a backend desktop-server component that can be placed behind a firewall.

NodeJS was chosen for the code base of the architecture because of one-code-base multiple platforms, as well as to breakup the functionality into node modules for easier maintenance with the base module beginning as the core.

The core module is a migration of the PHP classes from the WordPress plugin.

# Test Driven Development
TDD will be utilized during the development and maintenance, using the mocha test framework.

# Package Naming Convention
The BestBooks packages prefix the name with @pingleware, for PressPage Entertainment Inc DBA PINGLEWARE which is the branded operations responsible for IT development.

# Package List
| Module | Description                                                                   | Version |
|--------|------------------------------------------------------------------------------ | ------- |
| [core](bestbooks-core)   | The core which provides database connectivity and logging |  1.2.3  |
| [auditor](bestbooks-auditor)  | algorithmic auditing |  1.0.7  |
| [helpers](bestbooks-helpers) | common methods used in accounting |  1.1.19 |
| [api](bestbooks-api) | an API server interface |  1.4.0  |
| [reports](bestbooks-reports) | an XML based report generation without any third-party reporting frameworks |  1.2.1  |
| [export](bestbooks-export) | permit exporting the records to other formats |  1.0.6  |
| [import](bestbooks-import)  | permit importing financial information from other formats |  1.0.7  |
| [mailer](bestbooks-mailer)  | a built SMTP mail server |  1.1.1  |
| [hrm](bestbooks-hrm)     | a human resource management integration |  1.0.0  |
| [tax](bestbooks-tax)     | tax integration for federal, state and local taxes |  1.0.0  |
| [ui](bestbooks-ui)      | user application | 1.0.0 |

## Create a Package
```sh
cd /path/to/bestbooks # Navigate to the root of your monorepo
npx lerna create @pingleware/bestbooks-core # Create a new package from the root
# adding dependencies
cd packages/bestbooks-core # change to package path
yarn add sqlite3 localStorage # add sqlite3 localStorage dependency
yarn add --dev acorn # add acorn as a dev dependency to the package-only
# add dev dependency for all packages to use
cd ..
yarn add --dev mocha # add mocha as a dev dependecy for all packages
```

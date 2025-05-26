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
Using NPM as yarn, lerna and bit have compatibility issues.

```sh
mkdir -p packages/bestbooks-core
cd packages/bestbooks-core
npm init -y
# edit package.json as necessary
npm i <dependencies>
```

to publish,
```sh
cd packages/bestbooks-core
npm login
npm publish --access public
```

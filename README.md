# BestBooks Accounting Application Framework&trade;
Monolithic repository (monorepo) for BestBooks Accounting Application Framework&trade;

| Module | Description                                                                   | Version |
|--------|------------------------------------------------------------------------------ | ------- |
| [core](packages/bestbooks-core)   | The core which provides database connectivity and logging |  1.2.3  |
| [auditor](packages/bestbooks-auditor)  | algorithmic auditing |  1.0.7  |
| [helpers](https://github.com/pingleware/bestbooks-helpers) | common methods used in accounting |  1.1.19 |
| [api](packages/bestbooks-api) | an API server interface |  1.4.0  |
| [reports](packages/bestbooks-reports) | an XML based report generation without any third-party reporting frameworks |  1.2.1  |
| [export](packages/bestbooks-export) | permit exporting the records to other formats |  1.0.6  |
| [import](packages/bestbooks-import)  | permit importing financial information from other formats |  1.0.7  |
| [mailer](packages/bestbooks-mailer)  | a built SMTP mail server |  1.1.1  |
| [hrm](packages/bestbooks-hrm)     | a human resource management integration |  1.0.0  |
| [tax](packages/bestbooks-tax)     | tax integration for federal, state and local taxes |  1.0.0  |
| [ui](packages/bestbooks-ui)      | user application | 1.0.0 |


## Official User Guide
Avalable on [amazon](https://www.amazon.com/dp/B07H1GQZYC)

# Use yarn for all interactions

| NPM | YARN |
|-----|------|
|npm install|yarn install|
|npx lerna init|yarn lerna init|
|lerna repair|yarn lerna repair|

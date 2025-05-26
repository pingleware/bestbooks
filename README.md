# BestBooks Accounting Application Framework&trade;
Monolithic repository (monorepo) for BestBooks Accounting Application Framework&trade;

BestBooks is an open source accounting application framework based on accounting terminology. Originally developed in Java to support multiple database because at the time the accounting applications had a close data model. Then migrated to PHP and as a WordPress plugin. BestBooks grew and matured as a WordPress plugin and became to cumbersome for a multiple site bookkeeping record system. A decision to rearchitect the framework with minimal web functionality interacting with a backend desktop-server component that can be placed behind a firewall.

NodeJS was chosen for the code base of the architecture because of one-code-base multiple platforms, as well as to breakup the functionality into node modules for easier maintenance with the base module beginning as the core.

The core module is a migration of the PHP classes from the WordPress plugin.

![Overview](images/README/overview.png)

## Package list
| Module | Description                                                                   | Version |
|--------|------------------------------------------------------------------------------ | ------- |
| [core](packages/bestbooks-core)   | The core which provides database connectivity and logging |  1.2.3  |
| [auditor](packages/bestbooks-auditor)  | algorithmic auditing |  1.0.7  |
| [helpers](packages/bestbooks-helpers) | common methods used in accounting |  1.1.19 |
| [api](packages/bestbooks-api) | an API server interface |  1.4.0  |
| [receipts](packages/bestbooks-receipts) | Cordova application for receipt handling | 1.0.0 |
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

# Reporting
The reports module returns the report data in object-row format generate by SQL views.

## Income Statement
There are two income statement reports, a regular and a geographic income statement. The Geographic
income statement shows the percentage of total revenu by location as defined in the location table. Here is a sample view,
![Income Statement](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/income-statement.png)
![Income Statement Geographic](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/income-statement-geographic.png)

## Balance Sheet
![Balance Sheet](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/balance-sheet.png)

## Accounts Receivable Aging
![Accounts Receivable Aging](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/accounts-receivable-aging.png)

## Accounts Payable Aging
![Accounts Payable Aging](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/accounts-payable-aging.png)

## Statement of Change in Equity
![Statement of Change in Equity](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/statement-of-chnges-in-equity.png)

## Trial Balance
![Trial Balance](https://raw.githubusercontent.com/pingleware/bestbooks/main/images/README/trial-balance.png)

# Testing with YARN
If your project is structured as a monorepo with multiple packages, and each package has its own tests, you can set up Yarn to run tests for each package individually. Here's how to set it up:

## 1. **Organize Your Project Structure**

Assuming you're using a monorepo structure, you might have something like this:

```
/project-root
  /packages
    /package-1
      /test
      package.json
    /package-2
      /test
      package.json
  package.json
```

Each package has its own `package.json` with dependencies, including Mocha, and a `test` folder.

## 2. **Add `test` Scripts in Each Package**
In each `package.json` within the packages, add a `test` script:

For example, in `packages/package-1/package.json`:

```json
{
  "name": "package-1",
  "scripts": {
    "test": "mocha"
  }
}
```

And in `packages/package-2/package.json`:

```json
{
  "name": "package-2",
  "scripts": {
    "test": "mocha"
  }
}
```

Each package now has a `yarn test` command that runs Mocha for that specific package.

## 3. **Use Yarn Workspaces (Optional but Recommended)**
If you're using Yarn Workspaces to manage your monorepo, make sure you have the following configuration in your root `package.json`:

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

This tells Yarn to treat the `packages/*` directory as workspaces, so it can manage dependencies across multiple packages.

## 4. **Add a `test` Script in the Root `package.json`**
In your root `package.json`, you can create a `test` script that will run the `test` script for each package. This can be done using a tool like `lerna` or `yarn workspaces run`. Here's how to set it up with Yarn Workspaces:

In your root `package.json`, add the following `test` script:

```json
"scripts": {
  "test": "yarn workspaces run test"
}
```

This will run `yarn test` in each workspace (i.e., each package).

## 5. **Run Tests for All Packages**
Now, you can run tests for all packages by simply running:

```bash
yarn test
```

This command will invoke the `yarn test` script in each package (defined in each package's `package.json`), running the Mocha tests for each package.

## 6. **Example Directory Structure**

Here's an example of how it might look:

```
/project-root
  /packages
    /package-1
      /test
        example.test.js
      package.json
    /package-2
      /test
        example.test.js
      package.json
  package.json
```

The `yarn test` command in the root will automatically execute the tests in both `package-1` and `package-2`.

## 7. **Additional Configurations**
You can also customize the command to only run tests for specific packages if needed. For instance, using a pattern in the `test` script like:

```json
"scripts": {
  "test": "yarn workspaces run test --scope package-1"
}
```

This will only run the tests for `package-1`.

## Summary:
- Each package has its own `test` script in `package.json`.
- Use Yarn Workspaces to manage your monorepo structure.
- In the root `package.json`, use `yarn workspaces run test` to run tests for all packages.

# Creating New Packages
If you're working with an existing monorepo and want to add a new package using **Yarn, npm, or Lerna**, here’s how you can do it:  

---

### **Using Yarn Workspaces**
1. Navigate to the root of your monorepo:
```sh
cd /path/to/bestbooks
```
2. Create a new package from the root:
```sh
npx lerna create <package-name>
```
3. Add dependencies if needed:
```sh
cd packages/<package-name>
yarn add <dependency-name>
```
4. Ensure the `package.json` contains:
```json
{
  "name": "@your-scope/new-package",
  "version": "1.0.0",
  "main": "index.js"
}
```
5. Add the new package to your workspace (if not automatically included) by updating `package.json` in the root:
```json
{
  "workspaces": ["packages/*"]
}
```
6. Run:
```sh
yarn install # or add --ignore-engines to resolve errors
```

---

### **Using npm Workspaces**
1. Navigate to the monorepo root:
   ```sh
   cd /path/to/monorepo
   ```
2. Create the package directory:
   ```sh
   mkdir packages/new-package
   cd packages/new-package
   npm init -y
   ```
3. Add dependencies:
   ```sh
   npm install some-dependency
   ```
4. Ensure `package.json` contains:
   ```json
   {
     "name": "@your-scope/new-package",
     "version": "1.0.0",
     "main": "index.js"
   }
   ```
5. Ensure your root `package.json` has workspaces enabled:
   ```json
   {
     "workspaces": ["packages/*"]
   }
   ```
6. Install dependencies:
   ```sh
   npm install
   ```

---

### **Using Lerna**
If you’re using Lerna (with or without workspaces), follow these steps:

1. Navigate to the monorepo root:
   ```sh
   cd /path/to/monorepo
   ```
2. Run:
   ```sh
   npx lerna create new-package packages/new-package
   ```
   Or, if using global Lerna:
   ```sh
   lerna create new-package packages/new-package
   ```
3. This initializes a new package, and you can now add dependencies:
   ```sh
   lerna add some-dependency --scope=@your-scope/new-package
   ```
4. Bootstrap everything:
   ```sh
   lerna bootstrap
   ```

---

### **Final Check**
- Ensure the new package is properly referenced in your workspace setup.
- Run `yarn install`, `npm install`, or `lerna bootstrap` again if necessary.

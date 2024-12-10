# Deploying to NPMJS.COM
To deploy a monorepo package to `npmjs.com`, follow these steps. This assumes that you're using Yarn Workspaces and that you want to publish a specific package from your monorepo to npm.

### Prerequisites:
- Make sure you're logged into `npmjs.com` via the CLI with your npm credentials.
- Ensure your package has a valid `package.json` file, including the necessary fields like `name`, `version`, and `publishConfig`.

### 1. **Ensure Each Package is Ready for Publication**

Make sure the package you want to publish is properly configured with the required `package.json` fields. The key fields are:
- `name`: The name of the package as it will appear on npm.
- `version`: The version number, which should follow semantic versioning (`x.y.z`).
- `publishConfig`: Optional, but helps specify the registry or access level if you're using scoped packages.

Example `package.json` for a package in the monorepo:

**`/packages/package-1/package.json`**:

```json
{
  "name": "my-package-1",
  "version": "1.0.0",
  "description": "My awesome package",
  "main": "index.js",
  "scripts": {
    "test": "mocha"
  },
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

### 2. **Log in to npm**

If you haven't already logged into `npm` through the CLI, you need to authenticate. Run:

```bash
npm login
```

You'll be prompted for your username, password, and email. If you haven't created an npm account, you can do so on [npm's website](https://npmjs.com/).

### 3. **Publish the Package**

Navigate to the specific package folder that you want to publish:

```bash
cd packages/package-1
```

Then, run the `npm publish` command to publish the package to npm:

```bash
npm publish --access public
```

This command will:
- Publish the package to npm.
- If the package is scoped (e.g., `@your-org/package-name`), the `--access public` flag is needed for public packages. If your package is not scoped, this flag is not necessary.

### 4. **Publish a Scoped Package**

If your package is scoped (e.g., `@my-org/package-1`), you must specify the `--access` flag to define whether it's public or private. Here's how you'd publish a scoped package publicly:

```bash
npm publish --access public
```

If you want the package to be private, use:

```bash
npm publish --access restricted
```

### 5. **Verify Package Publication**

After running `npm publish`, you can verify the package has been published successfully by checking it on the npm website:

- Go to [npmjs.com](https://npmjs.com) and search for your package by name (e.g., `my-package-1`).
- You can also use the following command to confirm that the package version is published:

```bash
npm view my-package-1
```

### 6. **Automating with CI/CD**

If you're using a continuous integration/continuous deployment (CI/CD) pipeline (e.g., GitHub Actions, GitLab CI), you can automate the publishing process. Here's an example of how you might automate the `npm publish` process in a GitHub Actions workflow:

**`.github/workflows/publish.yml`**:

```yaml
name: Publish Package

on:
  push:
    branches:
      - main
    paths:
      - 'packages/package-1/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Use the appropriate version of Node.js

      - name: Install dependencies
        run: yarn install

      - name: Publish package to npm
        run: |
          cd packages/package-1
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

In this example, the workflow triggers a publish when changes are pushed to the `main` branch. The `NODE_AUTH_TOKEN` is securely stored in the GitHub secrets to authenticate with npm.

### 7. **Versioning and Updating**

When you want to publish a new version of the package, you'll need to:
1. Update the `version` field in `package.json` (follow semantic versioning).
2. Run the `npm publish` command again.

You can use the `npm version` command to automatically update the version and create a Git tag:

```bash
npm version patch  # or minor, major, depending on the change
```

This command will:
- Increment the version in `package.json`.
- Create a Git tag for the new version.
- Commit the changes.

Afterward, run `npm publish` to deploy the new version.

---

### Summary:
1. Set up each package in your monorepo with a valid `package.json`.
2. Log in to npm using `npm login`.
3. Publish the package by running `npm publish` from the package's directory.
4. Automate publishing via CI/CD (optional).
5. To release a new version, increment the version and publish again.
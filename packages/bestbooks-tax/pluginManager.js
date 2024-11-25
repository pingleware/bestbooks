"use strict";

const fs = require('fs');
const path = require('path');
const os = require('os');
const unzipper = require('unzipper');
const { promisify } = require('util');
const ncp = promisify(require('ncp').ncp); // File copy utility
const {
    warn,
    error,
    info,
} = require('@pingleware/bestbooks-core');

const BASE_PATH = path.join(os.homedir(), '.bestbooks');
const PLUGIN_DIR = path.join(BASE_PATH, 'plugins');
const PACKAGE_PLUGIN_DIR = path.join(__dirname, 'plugins'); // Default package plugins directory

class PluginManager {
    constructor() {
        this.pluginDir = PLUGIN_DIR;
        this.plugins = [];

        if (!fs.existsSync(this.pluginDir)) {
            fs.mkdirSync(this.pluginDir, { recursive: true });
        }
        this.init();
    }

    async init() {
        await this.syncPluginsFromPackage();
    }

    async loadPlugins() {
        const pluginDirs = fs.readdirSync(this.pluginDir);

        for (const dir of pluginDirs) {
            const pluginPath = path.join(this.pluginDir, dir);
            const pluginMain = path.join(pluginPath, 'index.js');
            const pluginConfig = path.join(pluginPath, 'package.json');

            if (fs.existsSync(pluginMain) && fs.existsSync(pluginConfig)) {
                const metadata = require(pluginConfig);
                const plugin = require(pluginMain);

                if (typeof plugin.initialize === 'function') {
                    plugin.initialize(metadata);
                }

                // Discover plugin functions dynamically
                const functions = this.discoverFunctions(plugin);

                this.plugins.push({ 
                    name: metadata.name, 
                    metadata, 
                    plugin, 
                    functions 
                });

                info(`Loaded plugin: ${metadata.name} with functions: ${functions.join(', ')}`);
            }
        }
    }

    /**
     * Discovers all callable functions in a plugin.
     * @param {object} plugin - The plugin module.
     * @returns {string[]} - List of function names.
     */
    discoverFunctions(plugin) {
        return Object.keys(plugin).filter(
            (key) => typeof plugin[key] === 'function'
        );
    }

    /**
     * Executes a specific action across all plugins dynamically.
     * @param {string} action - The action (function name) to execute.
     * @param {object} args - Arguments to pass to the action.
     */
    async execute(action, args) {
        this.plugins.forEach(({ plugin, metadata, functions }) => {
            if (functions.includes(action)) {
                info(`Executing action '${action}' on plugin '${metadata.name}'`);
                plugin[action](args);
            } else {
                console.warn(`Action '${action}' not found in plugin '${metadata.name}'`);
            }
        });
    }

    /**
     * Adds a plugin by extracting an uploaded zip file into the plugin directory.
     * @param {string} zipFilePath - Path to the uploaded zip file.
     * @returns {Promise<void>}
     */
    async addPlugin(zipFilePath) {
        const pluginName = path.basename(zipFilePath, '.zip');
        const pluginPath = path.join(this.pluginDir, pluginName);

        if (fs.existsSync(pluginPath)) {
            return error(`Plugin with name '${pluginName}' already exists.`);
        }

        info(`Adding new plugin: ${pluginName}`);

        // Extract the zip file into the plugin directory
        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: pluginPath }))
            .promise();

        info(`Extracted plugin to ${pluginPath}`);

        // Load the new plugin
        const pluginMain = path.join(pluginPath, 'index.js');
        const pluginConfig = path.join(pluginPath, 'package.json');

        if (fs.existsSync(pluginMain) && fs.existsSync(pluginConfig)) {
            const metadata = require(pluginConfig);
            const plugin = require(pluginMain);

            if (typeof plugin.initialize === 'function') {
                plugin.initialize(metadata);
            }

            // Discover functions dynamically
            const functions = this.discoverFunctions(plugin);

            this.plugins.push({ 
                name: metadata.name, 
                metadata, 
                plugin, 
                functions 
            });

            info(`Loaded new plugin: ${metadata.name} with functions: ${functions.join(', ')}`);
        } else {
            return error('Invalid plugin structure: Missing index.js or package.json');
        }
    }

    /**
     * Syncs plugins from the package's default plugin directory to the plugin directory.
     */
    async syncPluginsFromPackage() {
        if (fs.existsSync(PACKAGE_PLUGIN_DIR)) {
            const packagePlugins = fs.readdirSync(PACKAGE_PLUGIN_DIR);

            for (const pluginName of packagePlugins) {
                const sourcePluginPath = path.join(PACKAGE_PLUGIN_DIR, pluginName);
                const targetPluginPath = path.join(this.pluginDir, pluginName);

                if (!fs.existsSync(targetPluginPath)) {
                    info(`Copying plugin '${pluginName}' to plugins directory.`);
                    await ncp(sourcePluginPath, targetPluginPath);
                }
            }
        } else {
            console.warn('No package plugins directory found.');
        }
    }
}

module.exports = PluginManager;

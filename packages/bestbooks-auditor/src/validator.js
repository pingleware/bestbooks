const fs = require('fs');

/**
 * Loads GAAP rules from configuration file.
 */
function loadRules() {
    const data = fs.readFileSync('rules_config.json', 'utf8');
    return JSON.parse(data).rules;
}

/**
 * Evaluates a single rule against provided data.
 * @param {Object} rule - The GAAP rule object.
 * @param {Object} data - Accounting entry data.
 * @returns {Object} - Validation result.
 */
function evaluateRule(rule, data) {
    try {
        const conditionMet = eval(rule.condition);
        return {
            ruleId: rule.id,
            passed: conditionMet,
            severity: rule.severity,
            message: conditionMet ? "Compliant" : `Non-compliant: ${rule.description}`
        };
    } catch (error) {
        return { ruleId: rule.id, error: `Rule evaluation error: ${error.message}` };
    }
}

/**
 * Validates accounting data against GAAP rules.
 * @param {Object} data - The accounting data to validate.
 * @returns {Array} - Array of validation results.
 */
function validateGAAP(data) {
    const rules = loadRules();
    return rules.map(rule => evaluateRule(rule, data));
}

module.exports = {
    validateGAAP
};

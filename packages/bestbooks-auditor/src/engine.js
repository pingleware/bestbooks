const fs = require("fs");
const path = require("path");

class GAAPRuleEngine {
    constructor() {
        this.rules = {};
        this.loadRules();
    }

    loadRules() {
        const rulesPath = path.join(__dirname, "rules");
        fs.readdirSync(rulesPath).forEach(file => {
            if (file.endsWith(".js")) {
                const rule = require(path.join(rulesPath, file));
                this.rules[rule.topic] = rule.validate;
            }
        });
    }

    audit(financialData) {
        let results = [];
        for (let topic in this.rules) {
            const validationResult = this.rules[topic](financialData);
            if (validationResult) results.push(validationResult);
        }
        return results;
    }
}

module.exports = GAAPRuleEngine;

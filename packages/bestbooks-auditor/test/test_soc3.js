// app.js
const Soc3Framework = require('./Soc3Framework');

const soc3 = new Soc3Framework();

// Monitor system status
const status = soc3.monitorSystemStatus();

// Log a public incident
soc3.logPublicIncident('System experienced a minor outage, resolved in 5 minutes.');

// Report system uptime
const uptime = soc3.reportUptime();

// Validate public data (Example schema: 'username' must be a string, 'age' must be a number)
const publicData = { username: 'john_doe', age: 30 };
const schema = { username: 'string', age: 'number' };
const validation = soc3.validatePublicData(publicData, schema);

// Mask sensitive fields for public display
const sensitiveData = { name: 'John Doe', ssn: '123-45-6789', address: '123 Main St' };
const maskedData = soc3.maskData(sensitiveData, ['ssn', 'address']);

// Anonymize data for public privacy compliance
const personalData = { name: 'Jane Doe', email: 'jane@example.com' };
const anonymizedData = soc3.anonymizeData(personalData);

// Retrieve public logs
const logs = soc3.getPublicLogs();

console.log('Public Logs:', logs);

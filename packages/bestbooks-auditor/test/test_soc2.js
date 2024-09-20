// app.js
const express = require('express');
const Soc2Framework = require('./soc2framework');

const app = express();
const soc2 = new Soc2Framework();

// Dummy users for access control example
const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user', role: 'user' }
];

// Middleware for access control
app.use((req, res, next) => {
  req.userId = 1; // Assume user with id 1 is logged in
  next();
});

// Example route with access control
app.get('/admin', soc2.accessControl(users, 'admin'), (req, res) => {
  soc2.logEvent('Admin page accessed.');
  res.send('Welcome to the admin page!');
});

// Example route for system health check
app.get('/health', (req, res) => {
  const health = soc2.systemHealthCheck();
  res.json(health);
});

// Example route for data validation
app.post('/validate', express.json(), (req, res) => {
  const schema = { name: 'string', age: 'number' };
  const errors = soc2.validateData(req.body, schema);
  if (errors) {
    res.status(400).json({ errors });
  } else {
    res.send('Data is valid.');
  }
});

// Example of encrypting and decrypting data
const secretKey = 'my-secret-key';
const encrypted = soc2.encryptData('Sensitive Data', secretKey);
console.log('Encrypted:', encrypted);
const decrypted = soc2.decryptData(encrypted, secretKey);
console.log('Decrypted:', decrypted);

// Example of redacting sensitive fields
const sensitiveData = { name: 'John Doe', ssn: '123-45-6789' };
const redactedData = soc2.redactSensitiveFields(sensitiveData, ['ssn']);
console.log('Redacted:', redactedData);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

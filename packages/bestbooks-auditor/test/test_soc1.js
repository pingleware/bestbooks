// app.js
const express = require('express');
const Soc1Framework = require('./Soc1Framework');

const app = express();
const soc1 = new Soc1Framework();

// Dummy users for role-based access control
const users = [
  { id: 1, username: 'accountant', role: 'Accountant' },
  { id: 2, username: 'auditor', role: 'Auditor' },
  { id: 3, username: 'manager', role: 'Manager' }
];

// Middleware for financial data access control
app.use((req, res, next) => {
  req.userId = 1; // Assume user with id 1 is logged in
  next();
});

// Example route with financial data access control
app.get('/financial-data', soc1.financialDataAccessControl(users, ['Accountant', 'Auditor']), (req, res) => {
  soc1.logAuditEvent('Financial data accessed.');
  res.send('Financial data content.');
});

// Example route to log a financial transaction
app.post('/log-transaction', express.json(), (req, res) => {
  const transaction = req.body;
  soc1.logFinancialTransaction(transaction);
  res.send('Transaction logged for audit.');
});

// Example route for data validation
app.post('/validate-data', express.json(), (req, res) => {
  const schema = { amount: 'number', date: 'string', accountId: 'string' };
  const validation = soc1.validateFinancialData(req.body, schema);
  if (validation === 'Data is valid') {
    res.send('Financial data is valid.');
  } else {
    res.status(400).json({ errors: validation });
  }
});

// Check segregation of duties between Accountant and Auditor
const isSegregated = soc1.enforceSegregationOfDuties(users, 'Accountant', 'Auditor');
console.log('Segregation of Duties:', isSegregated);

// Retrieve audit logs
app.get('/audit-logs', (req, res) => {
  const logs = soc1.getAuditLogs();
  res.json(logs);
});

// Start the server
app.listen(3000, () => {
  console.log('SOC 1 Server is running on port 3000');
});

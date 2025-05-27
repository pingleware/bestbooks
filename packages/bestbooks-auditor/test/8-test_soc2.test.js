// app.js
const express = require('express');
const Soc2Framework = require('../soc/Soc2Framework'); // Adjust the path as necessary

const app = express();
const soc2 = new Soc2Framework();

// Dummy users for access control example
const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user', role: 'user' }
];

describe("auditor",function(){
  const secretKey = 'my-secret-key';

  before(function(){
    // Initialize the SOC 2 framework
    soc2.initialize();

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

    // Start the server
    global._server = app.listen(0, () => {
      const port = global._server.address().port;
      console.log(`Server is running on port ${port}`);
    });
  });
  after(function(){
    // Cleanup if necessary
    soc2.cleanup();
    if (global._server) {
        global._server.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });
    }
  });
  it("should log an event", function(done) {
    soc2.logEvent('Test event logged.');
    const logs = soc2.getLogs();
    console.log('Logs:', logs);
    done();
  });
  // Example of encrypting and decrypting data
  //it("soc2 encrypting data",function(){
  //  const encrypted = soc2.encryptData('Sensitive Data', secretKey);
  //  console.log('Encrypted:', encrypted);
  //});
  //it("soc2 decrypting data",function(){
  //  const decrypted = soc2.decryptData(encrypted, secretKey);
  //  console.log('Decrypted:', decrypted);
  //});
  it("soc2 redacting sensitive fields", function(done) {
    const sensitiveData = { name: 'John Doe', ssn: '123-45-6789' };
    const redactedData = soc2.redactSensitiveFields(sensitiveData, ['ssn']);
    console.log('Redacted Data:', redactedData);
    soc2.logEvent(JSON.stringify(redactedData));
    done();
  });
});
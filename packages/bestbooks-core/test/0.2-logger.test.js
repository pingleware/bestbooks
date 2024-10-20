const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
    info,
    warn,
    error
} = require('../logger.js'); // Adjust the path to your logger module

describe('Logger Module', function () {
    const logDir = path.join(os.homedir(), '.bestbooks');
    const logFilePath = path.join(logDir, 'bestbooks.log');
    
    // Helper function to clear the log file before each test
    beforeEach(function () {
        if (fs.existsSync(logFilePath)) {
         fs.unlinkSync(logFilePath);
        }
    });

    // Test for logging an info message
    it('should log an info message to the log file', function (done) {
        const testMessage = 'Test info message';
        
        info(testMessage);
        
        // Wait a bit to ensure the log file is written
        setTimeout(async () => {
            assert(fs.existsSync(logFilePath), 'Log file should be created');
            
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            assert(logContent.includes('INFO'), 'Log should contain the "INFO" level');
            assert(logContent.includes(testMessage), 'Log should contain the test message');
            done();
        }, 100);
    });

    // Test for logging a warning message
    it('should log a warning message to the log file', function (done) {
        const testMessage = 'Test warning message';
        
        warn(testMessage);
        
        // Wait to ensure the log file is written
        setTimeout(async() => {
            assert(fs.existsSync(logFilePath), 'Log file should be created');
            
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            assert(logContent.includes('WARN'), 'Log should contain the "WARN" level');
            assert(logContent.includes(testMessage), 'Log should contain the test message');
            done();
        }, 100);
    });

    // Test for logging an error message
    it('should log an error message to the log file', function (done) {
        const testMessage = 'Test error message';
        
        error(testMessage);
        
        // Wait to ensure the log file is written
        setTimeout(async() => {
            assert(await fs.existsSync(logFilePath), 'Log file should be created');
            
            const logContent = await fs.readFileSync(logFilePath, 'utf8');
            assert(logContent.includes('ERROR'), 'Log should contain the "ERROR" level');
            assert(logContent.includes(testMessage), 'Log should contain the test message');
            done();
        }, 100);
    });
    
    // Test for unhandled promise rejection logging
    it('should log unhandled promise rejections',async function (done) {
        const rejectionMessage = 'Unhandled promise rejection test';

        process.emit('unhandledRejection', rejectionMessage,await new Promise(() => {done()}));

        setTimeout(async() => {
            const logContent = await fs.readFileSync(logFilePath, 'utf8');
            assert(logContent.includes('WARN'), 'Log should contain the "WARN" level for unhandled rejection');
            assert(logContent.includes(rejectionMessage), 'Log should contain the unhandled rejection message');
            done();
        }, 100);
    });
    
    // TODO: handle uncaughtException
});

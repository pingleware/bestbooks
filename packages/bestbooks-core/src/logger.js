"use strict"

const fs = require('fs');
const os = require('os');
const path = require('path');

async function logError(message) {
    const errorLogPath = path.join(os.homedir(), '.bestbooks', 'bestbooks.log');
    
    // Create directory if it doesn't exist
    if (!await fs.existsSync(path.dirname(errorLogPath))) {
        await fs.mkdirSync(path.dirname(errorLogPath), { recursive: true });
    }

    // Append error to log file
    await fs.appendFileSync(errorLogPath, message);
}
// Function to get the path of the log file
function getLogFilePath() {
    const homeDir = os.homedir();
    const logDir = path.join(homeDir,'.bestbooks');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    const logFileName = 'bestbooks.log';
    return path.join(logDir, logFileName);
}

// Function to log messages to the file
function log(level, message) {
    const logFilePath = getLogFilePath();
    const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}\n`;
    logError(logMessage);
}

function handleExit() {
    process.on('exit', (code) => {
        log('info',`Process exited with code ${code}`);
    });

    process.on('uncaughtException', (error) => {
        console.error('Uncaught exception occurred:', error);
        log('error',error);
        //process.exit(1); // Exit with failure status
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled promise rejection at:', promise, 'reason:', reason);
        log('warn',`Unhandled promise rejection: ${reason}`);
    });
}

// Initialize error handling
handleExit();

// Export functions for use in other modules
module.exports = {
    warn: message => log('warn', message),
    error: message => log('error', message),
    info: message => log('info', message),
    cat: message => log('cat', message),         // for consolidate audit trail (CAT) logging
    mail: message => log('mail', message),
};
"use strict"

function generateMessageId() {
    // Generate a unique identifier
    const uniqueId = Math.random().toString(36).substr(2, 9); // Random alphanumeric string

    // Get the current timestamp
    const timestamp = Date.now();

    // Combine the uniqueId and timestamp to form the messageId
    const messageId = `${uniqueId}-${timestamp}`;

    return messageId;
}

module.exports = generateMessageId;
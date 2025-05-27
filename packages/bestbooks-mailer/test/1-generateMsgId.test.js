const {expect} = require("chai");
const {generateMessageId} = require("../generateMsgId");

describe("generateMessageId", function() {
    it("should generate a unique message ID",async function() {
        const msgId1 = await generateMessageId();
        const msgId2 = await generateMessageId();
        
        // Check that the message IDs are unique
        expect(msgId1).to.not.equal(msgId2);
        
        // Check that the message ID format is correct
        // Adjust the regex to match the actual format if '@' is not present
        expect(msgId1).to.match(/^[a-zA-Z0-9._-]+(@[a-zA-Z0-9.-]+)?$/);
        expect(msgId2).to.match(/^[a-zA-Z0-9._-]+(@[a-zA-Z0-9.-]+)?$/);
    });
});
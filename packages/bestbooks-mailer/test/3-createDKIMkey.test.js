const {expect} = require("chai");
const {CreateDkimKey} = require("../index");
const fs = require("fs");
const path = require("path");
const os = require("os");

describe("createDKIMKey", function() {
    it("should create a DKIM key", async function() {
        const dkimSelector = "default";
        const dkimDomain = "localdomain"; // Replace with your actual domain
        const dkimKey = await CreateDkimKey(dkimDomain, dkimSelector);
        // Log the DKIM key for debugging purposes
        console.log("DKIM Key created successfully.");
        console.log("DKIM Key:", dkimKey);

        const dkimDnsHost = `${dkimSelector}._domainkey.${dkimDomain}`;
        const dkimDnsTxt = `v=DKIM1; k=rsa; p=${dkimKey.publicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, "")}`;
        console.log("DNS Host:", dkimDnsHost);
        console.log("DNS TXT Value:", dkimDnsTxt);

        fs.writeFileSync(path.join(os.homedir(), '.bestbooks', `private.key`), dkimKey.privateKey);
        fs.writeFileSync(path.join(os.homedir(), '.bestbooks', `public.key`), dkimKey.publicKey);
        fs.writeFileSync(path.join(os.homedir(), '.bestbooks', `dns.txt`), `${dkimDnsHost} ${dkimDnsTxt}`);
        
        // Check that the DKIM key is an object
        expect(dkimKey).to.be.an('object');
        
        // Check that the DKIM key has the expected properties
        expect(dkimKey).to.have.property('privateKey');
        expect(dkimKey).to.have.property('publicKey');
        
        // Check that the private key is a string
        expect(dkimKey.privateKey).to.be.a('string');
        
        // Check that the public key is a string
        expect(dkimKey.publicKey).to.be.a('string');
        
        // Optionally, check that the keys are not empty
        expect(dkimKey.privateKey).to.not.be.empty;
        expect(dkimKey.publicKey).to.not.be.empty;
    });
});
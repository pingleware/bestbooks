const assert = require('assert');
const {Disclosures} = require('../index');

describe("Disclosures Class", async function(){
    let audit;

    before(function(){
        audit = new Disclosures();
    })

    after(async function(){
        await audit.model.insertSync(`DELETE FROM disclosures;`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='disclosures';`);
    })

    it("should create an instance of Disclosures", async function(){
        assert.ok(audit instanceof Disclosures);
    })

    it('should create a new disclosure record', async function() {
        const disclosureData = {
            name: 'Disclosure 1',
            description: 'Description for disclosure 1',
            is_compliant: true,
            date_disclosed: '2024-01-01',
            compliance_note: 'Compliant with all regulations'
        };

        await audit.createDisclosure(disclosureData);
        const records = await audit.getDisclosures();
        assert.strictEqual(records.length, 1);
        assert.strictEqual(records[0].name, 'Disclosure 1');
        assert.strictEqual(records[0].is_compliant, 1);
    });

    it('should retrieve all disclosure records', async function() {
        const records = await audit.getDisclosures();
        assert.strictEqual(records.length, 1); // We added one record in the previous test
    });

    it('should retrieve a disclosure by ID', async function() {
        const records = await audit.getDisclosures();
        const record = await audit.getDisclosureById(records[0].id);
        assert.strictEqual(record[0].name, 'Disclosure 1');
    });

    it('should update an existing disclosure record', async function() {
        const records = await audit.getDisclosures();
        const idToUpdate = records[0].id;

        const updatedData = {
            name: 'Disclosure 1 Updated',
            description: 'Updated description',
            is_compliant: false,
            date_disclosed: '2024-02-01',
            compliance_note: 'Non-compliant due to changes in regulations'
        };

        await audit.updateDisclosure(idToUpdate, updatedData);
        const updatedRecord = await audit.getDisclosureById(idToUpdate);

        assert.strictEqual(updatedRecord[0].name, 'Disclosure 1 Updated');
        assert.strictEqual(updatedRecord[0].is_compliant, 0);
    });

    it('should delete a disclosure record by ID', async function() {
        const records = await audit.getDisclosures();
        const idToDelete = records[0].id;

        await audit.deleteDisclosure(idToDelete);
        const remainingRecords = await audit.getDisclosures();

        assert.strictEqual(remainingRecords.length, 0); // Should be empty after deletion
    });

    it('should retrieve non-compliant disclosure records', async function() {
        const disclosureData = {
            name: 'Non-compliant Disclosure',
            description: 'This disclosure is not compliant',
            is_compliant: false,
            date_disclosed: '2024-01-15',
            compliance_note: 'Requires further review'
        };

        await audit.createDisclosure(disclosureData);
        const nonCompliantRecords = await audit.getNonCompliantDisclosures();
        assert.strictEqual(nonCompliantRecords.length, 1);
        assert.strictEqual(nonCompliantRecords[0].is_compliant, 0);
    });

    it('should correctly assess compliance', async function() {
        const complianceResult = await audit.checkDisclosureCompliance();
        assert.strictEqual(complianceResult.compliant, false);
        assert.strictEqual(complianceResult.nonCompliantCount, 1);
        assert.strictEqual(complianceResult.complianceDetails.length, 1);
        assert.strictEqual(complianceResult.complianceDetails[0].disclosure, 'Non-compliant Disclosure');
    });

    it('should retrieve detailed information of non-compliant audit', async function() {
        const nonCompliantDetails = await audit.getNonCompliantDisclosuresDetails();
        assert.strictEqual(nonCompliantDetails.length, 1);
        assert.strictEqual(nonCompliantDetails[0].disclosure, 'Non-compliant Disclosure');
        assert.strictEqual(nonCompliantDetails[0].note, 'Requires further review');
    });
})
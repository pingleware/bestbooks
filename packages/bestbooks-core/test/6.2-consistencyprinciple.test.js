const assert = require('assert');
const {ConsistencyPrinciple} = require('../index');

describe("ConsistencyPrinciple Class", async function(){
    let audit;

    before(function(){
        audit = new ConsistencyPrinciple();
    })

    after(async function(){
        await audit.model.insertSync(`DELETE FROM consistency;`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='consistency';`);
    })

    it("should create an instance of ConsistencyPrinciple", async function(){
        assert.ok(audit instanceof ConsistencyPrinciple);
    })

    it('should create a new audit record', async function() {
        const auditData = {
            accounting_method: 'Cash',
            description: 'Using cash accounting method',
            reporting_period: '2024-01',
            date_changed: '2024-01-01',
            is_consistent: true
        };

        const id = await audit.createConsistency(auditData);
        const records = await audit.getConsistency();
        assert.strictEqual(records.length, 1);
        assert.strictEqual(records[0].accounting_method, 'Cash');
        assert.strictEqual(records[0].is_consistent, 1);
    });

    it('should retrieve all audit records', async function() {
        const records = await audit.getConsistency();
        assert.strictEqual(records.length, 1); // We added one record in the previous test
    });

    it('should retrieve a audit record by ID', async function() {
        const records = await audit.getConsistency();
        const record = await audit.getConsistencyById(records[0].id);
        assert.strictEqual(record[0].accounting_method, 'Cash');
    });

    it('should update an existing audit record', async function() {
        const records = await audit.getConsistency();
        const idToUpdate = records[0].id;

        const updatedData = {
            accounting_method: 'Accrual',
            description: 'Using accrual accounting method',
            reporting_period: '2024-02',
            date_changed: '2024-02-01',
            is_consistent: false
        };

        await audit.updateConsistency(updatedData, idToUpdate);
        const updatedRecord = await audit.getConsistencyById(idToUpdate);

        assert.strictEqual(updatedRecord[0].accounting_method, 'Accrual');
        assert.strictEqual(updatedRecord[0].is_consistent, 0);
    });

    it('should delete a audit record by ID', async function() {
        const records = await audit.getConsistency();
        const idToDelete = records[0].id;

        await audit.deleteConsistency(idToDelete);
        const remainingRecords = await audit.getConsistency();

        assert.strictEqual(remainingRecords.length, 0); // Should be empty after deletion
    });

    it('should check audit based on accounting method and reporting period', async function() {
        const auditData = {
            accounting_method: 'Cash',
            description: 'Using cash accounting method',
            reporting_period: '2024-01',
            date_changed: '2024-01-01',
            is_consistent: true
        };

        await audit.createConsistency(auditData);
        const checkResult = await audit.checkConsistency('Cash', '2024-01');

        assert.strictEqual(checkResult.length, 1); // Should find one matching record
        assert.strictEqual(checkResult[0].accounting_method, 'Cash');
    });
})
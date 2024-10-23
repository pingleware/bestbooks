const assert = require('assert');
const {GoingConcernAssumption} = require('../index');

describe("GoingConcernAssumption Class", async function(){
    let audit;

    before(function(){
        audit = new GoingConcernAssumption();
    })

    after(async function(){
        await audit.model.insertSync(`DELETE FROM financial_indicators;`);
        await audit.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='financial_indicators';`);
    })

    it("should create an instance of GoingConcernAssumption", async function(){
        assert.ok(audit instanceof GoingConcernAssumption);
    })

    it('should return true when no critical financial indicators exist', async function() {
        const result = await audit.evaluateGoingConcern();
        assert.strictEqual(result, true, 'The company should be a going audit when no critical indicators');
    });

    it('should return false when critical financial indicators exist', async function() {
        // Insert a critical indicator
        await audit.insertFinancialIndicator({
            indicator_name: 'Revenue',
            value: 100000,
            threshold: 50000,
            recorded_at: new Date().toISOString()
        });
        
        const result = await audit.evaluateGoingConcern();
        assert.strictEqual(result, false, 'The company should not be a going audit when there are critical indicators');
    });

    it('should insert a financial indicator and retrieve it', async function() {
        const indicator = {
            indicator_name: 'Net Income',
            value: 80000,
            threshold: 50000,
            recorded_at: new Date().toISOString()
        };

        await audit.insertFinancialIndicator(indicator);
        const rows = await audit.getIndicators();

        assert.strictEqual(rows.length, 2, 'Should have two records in the financial_indicators table');
        assert.strictEqual(rows[1].indicator_name, 'Net Income', 'Inserted indicator name should match');
    });

    it('should return correct cash flow status based on the threshold', async function() {
        // Insert mock cash flow indicator
        await audit.insertFinancialIndicator({
            indicator_name: 'CashFlow',
            value: 50000,
            threshold: 100000,
            recorded_at: new Date().toISOString()
        });

        const result = await audit.calculateOperatingCashFlow();
        assert.strictEqual(result.status, 'Normal', 'Cash flow should be normal based on the value');
    });
})
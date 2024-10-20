const assert = require('assert');
const {
    Inventory
} = require('../index');

describe("Inventory Class", async function(){
    let inventory, itemId;

    before(function(){
        inventory = new Inventory();
    })

    after(async function(){
        await inventory.model.insertSync(`DELETE FROM accounts;`);
        await inventory.model.insertSync(`DELETE FROM ledger;`);
        await inventory.model.insertSync(`DELETE FROM journal`);
        await inventory.model.insertSync(`DELETE FROM inventory`);
        await inventory.model.insertSync(`DELETE FROM inventory_transactions`);
        await inventory.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await inventory.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await inventory.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await inventory.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='inventory';`);
        await inventory.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='inventory_transactions';`);
    })

    it("should create an instance of Inventory", async function(){
        assert.ok(inventory instanceof Inventory);
    })

    it('should add a new inventory item', async function () {
        const itemName = 'Test Item';
        const costFlowAssumption = 'FIFO';

        const result = await inventory.addItem(itemName, costFlowAssumption);
        assert.ok(result > 0, 'Item should be added successfully');

        const row = await inventory.model.querySync(`SELECT * FROM inventory WHERE id = ?`, [result]);
        assert.strictEqual(row[0].item_name, itemName);
        assert.strictEqual(row[0].cost_flow_assumption, costFlowAssumption);
    });

    it('should purchase an inventory item and update inventory', async function () {
        const itemName = 'Test Item';
        const costFlowAssumption = 'FIFO';
        const itemId = await inventory.addItem(itemName, costFlowAssumption);
        
        const date = '2024-10-16';
        const description = 'Initial Purchase';
        const quantity = 10;
        const cost = 5.0;

        const [ledgerId, journalId] = await inventory.purchase(itemId, date, description, quantity, cost);
        assert.ok(ledgerId > 0, 'Purchase should be recorded');

        const inventoryRow = await inventory.model.querySync(`SELECT * FROM inventory WHERE id = ?`, [itemId]);
        assert.strictEqual(inventoryRow[0].total_quantity, 10);
        assert.strictEqual(inventoryRow[0].total_cost, 50.0); // quantity * cost
    });

    it('should sell an inventory item and update inventory', async function () {
        const itemName = 'Test Item';
        const costFlowAssumption = 'FIFO';
        const itemId = await inventory.addItem(itemName, costFlowAssumption);
        
        // Initial purchase before selling
        const date = '2024-10-16';
        const description = 'Initial Purchase';
        const quantityPurchased = 10;
        const cost = 5.0;

        await inventory.purchase(itemId, date, description, quantityPurchased, cost);
        
        const sellDate = '2024-10-17';
        const sellDescription = 'Initial Sale';
        const sellQuantity = 5;
        const sellPrice = 10.0;

        const [ledgerId, journalId] = await inventory.sell(itemId, sellDate, sellDescription, sellQuantity, sellPrice);
        assert.ok(ledgerId > 0, 'Sale should be recorded');

        const inventoryRow = await inventory.model.querySync(`SELECT * FROM inventory WHERE id = ?`, [itemId]);
        assert.strictEqual(inventoryRow[0].total_quantity, 5); // 10 - 5
        assert.strictEqual(inventoryRow[0].total_cost, 50.0); // 50 - (5 * 5.0)
    });    
})

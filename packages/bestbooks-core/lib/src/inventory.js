/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Asset = require('./asset');

/**
 * Key Changes for FASB Compliance:
 * 
 * Cost Flow Assumptions: The system now supports different cost flow methods 
 *      (FIFO, LIFO, Weighted Average). This affects how COGS is calculated when selling inventory.
 * Total Cost Tracking: The inventory table tracks total cost, making it easier to implement 
 *      cost flow assumptions.
 * Lower of Cost or Market (LCM): You can add a periodic check for LCM compliance by comparing 
 *      inventory values with market prices and adjusting the value accordingly.
 */

class Inventory extends Asset {
    constructor(name) {
        super(name);
        this.init();
    }

    async init() {
        await this.createTable();
    }

    // Add new inventory item with cost flow assumption (FIFO, LIFO, or Weighted Average)
    async addItem(itemName, costFlowAssumption,company_id=0,office_id=0) {
        let sql = `INSERT INTO inventory (item_name, total_quantity, total_cost, cost_flow_assumption, company_id, office_id) VALUES (?, 0, 0, ?, ?, ?)`;
        const params = [itemName, costFlowAssumption, company_id, office_id];
        return await this.model.insertSync(sql,params);
    }

    // Purchase inventory: records transactions and updates inventory
    async purchase(itemId, date, description, quantity, cost, company_id=0, office_id=0) {
        let sql = `INSERT INTO inventory_transactions (item_id, date, description, transaction_type, quantity, unit_cost, company_id, office_id) 
                    VALUES (?, ?, ?, 'purchase', ?, ?, ?, ?)`;
        const params = [itemId, date, description, quantity, cost, company_id, office_id];
        const invId = await this.model.insertSync(sql,params);
        if (invId > 0) {
            // Update inventory
            let updateSql = `UPDATE inventory SET total_quantity = total_quantity + ?, total_cost = total_cost + ? WHERE id = ?`;
            const params = [quantity, quantity * cost, itemId];
            await this.model.updateSync(updateSql,params);
            // Add monetary record to the ledger
            /**
             *  in your ledger:
             * 1. Debit the Inventory account for the cost of the inventory.
             * 2. Credit either Cash (if paid immediately) or Accounts Payable 
             *      (if purchased on credit).
             */
            return await this.addDebit(date,description,(cost * quantity)); // returns ledger_id, journal_id
            // on return, the Cash or Accounts Payable must be credited with the
            // (cost * quantity)
        }
        return [0,0]; // returns ledger_id, journal_id
    }

    // Sell inventory with cost calculation based on the cost flow assumption
    async sell(itemId, date, description, quantity, price, company_id=0, office_id=0) {
        const result = await this.getCostFlowAssumption(itemId);
        const costFlowAssumption = result[0].cost_flow_assumption;
        const _unitCost = await this.calculateCost(itemId, quantity, costFlowAssumption);
        let sql = `INSERT INTO inventory_transactions (item_id, date, description, transaction_type, quantity, unit_cost, price, company_id, office_id) 
        VALUES (?, ?, ?, 'sell', ?, ?, ?, ?, ?)`;
        let params = [itemId, date, description, -quantity, _unitCost, price, company_id, office_id];
        await this.model.insertSync(sql,params);
        // Update inventory
        sql = `UPDATE inventory SET total_quantity = total_quantity - ?, total_cost = total_cost - ? WHERE id = ?`;
        params = [quantity, (quantity * _unitCost), itemId];
        await this.model.updateSync(sql,params);
        return await this.addCredit(date,description,(price * quantity)); // returns ledger_id, journal_id
    }

    // Get cost flow assumption (FIFO, LIFO, Weighted Average)
    async getCostFlowAssumption(itemId, callback) {
        let sql = `SELECT cost_flow_assumption FROM inventory WHERE id = ?`;
        const params = [itemId];
        return await this.model.querySync(sql,params);
    }

    // Calculate cost based on cost flow assumption
    async calculateCost(itemId, quantity, costFlowAssumption) {
        if (costFlowAssumption == 'FIFO') {
            // Fetch earliest purchases for FIFO
            let sql = `SELECT unit_cost FROM inventory_transactions 
                         WHERE item_id = ? AND transaction_type = 'purchase' 
                         ORDER BY date ASC LIMIT ?`;
            const params = [itemId, quantity];
            const rows = await this.model.querySync(sql,params);
            rows.forEach(function(row){
                const totalCost = rows.reduce((sum, row) => sum + row.unit_cost, 0);
                const unitCost = (totalCost / quantity);
                return unitCost;
            })
        } else if (costFlowAssumption == 'LIFO') {
            // Fetch most recent purchases for LIFO
            let sql = `SELECT unit_cost FROM inventory_transactions 
                         WHERE item_id = ? AND transaction_type = 'purchase' 
                         ORDER BY date DESC LIMIT ?`;
            const params = [itemId, quantity];
            const rows = await this.model.querySync(sql,params);
            rows.forEach(function(row){
                const totalCost = rows.reduce((sum, row) => sum + row.unit_cost, 0);
                return (totalCost / quantity);    
            })
        } else if (costFlowAssumption == 'Weighted Average') {
            // Calculate weighted average cost
            let sql = `SELECT total_quantity, total_cost FROM inventory WHERE id = ?`;
            const params = [itemId];
            const rows = await this.model.querySync(sql,params);
            rows.forEach(function(row){
                if (row.total_quantity === 0) {
                    return new Error('No inventory available to calculate cost.');
                }
                return (row.total_cost / row.total_quantity);    
            })
        }
        return 0;
    }
    
    async getCost(itemId, quantity, costFlowAssumption) {
        return await this.calculateCost(itemId, quantity, costFlowAssumption);
    }

    // Calculate total revenue for a specific item
    async getRevenue(itemId) {
        let sql = `SELECT SUM(quantity * price) AS total_revenue 
                     FROM inventory_transactions 
                     WHERE item_id = ? AND transaction_type = 'sell'`;
        row = await this.model.querySync(sql,[itemId]);
        const totalRevenue = row.total_revenue || 0;
        return totalRevenue;
    }

    // Get the current value of an inventory item for tax reporting
    async getValue(itemId, callback) {
        // SQL query to get the current quantity and unit cost
        let sql = `SELECT total_quantity, total_cost FROM inventory WHERE id = ?`;
        const row = await this.model.querySync(sql,[itemId]);

        // If there are no items in inventory, return 0
        if (!row || row.total_quantity === 0) {
            return 0;
        }

        // Calculate the current value of the inventory item
        const currentValue = row.total_cost; // Total cost represents the current value
        return currentValue;
    }

    // Calculate Cost of Goods Sold (COGS) for a specific item
    async getCOGS(itemId) {
        // Get the cost flow assumption for the item
        const costFlowAssumption = this.getCostFlowAssumption(itemId);

        let sql;
        if (costFlowAssumption === 'FIFO') {
            // Fetch all sales transactions for FIFO
            sql = `SELECT quantity, unit_cost FROM inventory_transactions 
                   WHERE item_id = ? AND transaction_type = 'sell' 
                   ORDER BY date ASC`;
        } else if (costFlowAssumption === 'LIFO') {
            // Fetch all sales transactions for LIFO
            sql = `SELECT quantity, unit_cost FROM inventory_transactions 
                   WHERE item_id = ? AND transaction_type = 'sell' 
                   ORDER BY date DESC`;
        } else if (costFlowAssumption === 'Weighted Average') {
            // Calculate COGS using weighted average
            sql = `SELECT total_quantity, total_cost FROM inventory WHERE id = ?`;
        } else {
            return (new Error('Invalid cost flow assumption'));
        }

        if (costFlowAssumption === 'Weighted Average') {
            // Calculate using the weighted average cost
            row = await this.model.querySync(sql,[itemId]);

            if (row.total_quantity === 0) {
                return 0;
            }

            const avgCost = row.total_cost / row.total_quantity;
            return (avgCost * row.total_quantity);
        } else {
            // For FIFO and LIFO, calculate COGS based on transactions
            const rows = await this.model.querySync(sql,[itemid]);
            let totalCOGS = 0;
            let quantitySold = 0;

            for (const row of rows) {
                // Calculate total COGS
                totalCOGS += row.unit_cost * row.quantity;
                quantitySold += row.quantity;
            }

            return totalCOGS;
        }    
    }

    async createTable() {
        // -- Inventory table for tracking item quantities and details
        var sql = `CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER DEFAULT 0,
            office_id INTEGER DEFAULT 0,
            item_name TEXT NOT NULL,
            total_quantity INTEGER DEFAULT 0,
            total_cost REAL DEFAULT 0,  -- This keeps track of the total cost value
            cost_flow_assumption TEXT NOT NULL  -- 'FIFO', 'LIFO', 'Weighted Average'
        );`;
        await this.model.insertSync(sql);

        // -- Inventory transactions for tracking each operation on inventory
        sql = `CREATE TABLE IF NOT EXISTS inventory_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER DEFAULT 0,
                office_id INTEGER DEFAULT 0,
                item_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                description TEXT,
                transaction_type TEXT NOT NULL,  -- 'purchase', 'sell', 'adjust'
                quantity INTEGER NOT NULL,
                unit_cost REAL,  -- Cost per unit at time of transaction
                price REAL,  -- Price sold for (if selling)
                FOREIGN KEY (item_id) REFERENCES inventory(id)
        );`;
        await this.model.insertSync(sql);
    }

    async purgeTable(table,where='') {
        try {
            if (table == "inventory" || table == "inventory_transactions") {
                let sql = `DELETE FROM ? ?;`;
                const params = [table, where];
                await this.model.deleteSync(sql, params);    
            }
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

}

module.exports = Inventory;
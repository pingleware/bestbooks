/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');

const {
    info,
    warn,
    error
} = require('./logger');

class Disclosures {

    constructor() {
        // create and open database
        this.model = new Model();
        // create disclosures table if not exist
        this.init();
    }

    async init() {
        await this.createTable();
    }

    async getDisclosures() {
        return await this.model.querySync('SELECT * FROM disclosures;');
    }

    async getDisclosureById(id) {
        return await this.model.querySync(`SELECT * FROM disclosures WHERE id = ${id};`);
    }

    async createDisclosure(disclosure) {
        const { name, description, is_compliant, date_disclosed, compliance_note } = disclosure;
        var sql = `INSERT INTO disclosures (name, description, is_compliant, date_disclosed, compliance_note) VALUES (?,?,?,?,?);`;
        const params = [name, description, is_compliant, date_disclosed, compliance_note];
        return await this.model.insertSync(sql,params);
    }

    async updateDisclosure(id, disclosure) {
        const { name, description, is_compliant, date_disclosed, compliance_note } = disclosure;
        var sql = `UPDATE disclosures SET name = ?, description = ?, is_compliant = ?, date_disclosed = ?, compliance_note = ? WHERE id = ?;`;
        const params = [name,description,is_compliant,date_disclosed,compliance_note,id];
        return await this.model.updateSync(sql,params);
    }

    async deleteDisclosure(id) {
        var sql = `DELETE FROM disclosures WHERE id = ?;`;
        const params = [id];
        return await this.model.deleteSync(sql,params);
    }

    async getNonCompliantDisclosures() {
        return await this.model.querySync('SELECT * FROM disclosures WHERE is_compliant = 0;');
    }

    async checkDisclosureCompliance() {
        try {
            const disclosures = await this.getDisclosures();
        
            let compliant = true;
            let nonCompliantCount = 0;
            let complianceDetails = [];
        
            disclosures.forEach(disclosure => {
              if (!disclosure.is_compliant) {
                compliant = false;
                nonCompliantCount++;
                complianceDetails.push({
                  disclosure: disclosure.name,
                  note: disclosure.compliance_note || 'No note provided.'
                });
              }
            });
        
            return {
              compliant,
              nonCompliantCount,
              complianceDetails
            };
        } catch (error) {
            throw new Error('Error checking compliance: ' + error.message);
        }
    }

    async  getNonCompliantDisclosuresDetails() {
        try {
          const nonCompliantDisclosures = await this.getNonCompliantDisclosures();
      
          return nonCompliantDisclosures.map(disclosure => ({
            disclosure: disclosure.name,
            date: disclosure.date_disclosed,
            note: disclosure.compliance_note || 'No note provided.'
          }));
        } catch (error) {
          throw new Error('Error fetching non-compliant disclosures: ' + error.message);
        }
    }

    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS disclosures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                is_compliant BOOLEAN NOT NULL,
                date_disclosed TEXT NOT NULL,
                compliance_note TEXT
            );`;
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM disclosures;`;
            await this.model.deleteSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

}

module.exports = Disclosures;
'use strict';

const res = require("express/lib/response");

class SKU_DAO {

    constructor() { }

    /* -- Interface methods -- */

    dropTable() {

    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU( id INTEGER PRIMARY KEY AUTOINCREMENT,  description VARCHAR(20), weight INTEGER,  volume INTEGER, notes VARCHAR(20), availableQuantity INTEGER, price REAL)';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });

        });
    }

    storeSKU(db, data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU (id,  description, weight, volume, notes, availableQuantity, price) VALUES (?, ?, ?, ? ,? ,? ,?)';
            db.run(sql, [data.id, data.description, data.weight, data.volume, data.notes, data.availableQuantity, data.price], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getStoredSKU(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skus = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        weight: r.weight,
                        volume: r.volume,
                        notes: r.notes,
                        availableQuantity: r.availableQuantity,
                        price: r.price
                    }
                ));
                resolve(skus);
            });
        });
    }

    getSKUbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count, * FROM SKU WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    resolve(undefined)
                }
                else {
                    resolve({
                        id: r.id,
                        description: r.description,
                        weight: r.weight,
                        volume: r.volume,
                        notes: r.notes,
                        availableQuantity: r.availableQuantity,
                        price: r.price
                    });
                }
            });
        });
    }
}

/* Export class SKU_DAO with methods */

module.exports = SKU_DAO;

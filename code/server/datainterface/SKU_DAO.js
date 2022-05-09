'use strict';

const res = require("express/lib/response");

class SKU_DAO {

    constructor() { }

    /* -- Interface methods -- */

    dropTable() {

    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR(20), weight INTEGER, volume INTEGER, notes VARCHAR(20), position VARCHAR(20), availableQuantity INTEGER, price REAL, testDescriptor INTEGER, FOREIGN KEY(position) REFERENCES POSITION(positionID))';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }


    storeSKU(db, data) {

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU (id,  description, weight, volume, notes, position, availableQuantity, price, testDescriptor) VALUES (?, ?, ?, ? ,? ,? ,?, ?, ?)';
            db.run(sql, [data.id, data.description, data.weight, data.volume, data.notes, null, data.availableQuantity, data.price, []], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
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
                        position: r.position,
                        availableQuantity: r.availableQuantity,
                        price: r.price,
                        testDescriptors: r.testDescriptor
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

    getWeightVolumeByID(db, id) {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT weight, volume FROM SKU WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else
                    resolve({
                        weight: r.weight,
                        volume: r.volume
                    });
            });
        }

        );
    }

    // delete sku by id
    deleteSKU(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM SKU WHERE id = ?';
                    db.run(sql2, [id], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });

                }
            })

        });

    }

    //update SKU
    updateSKU(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, position FROM SKU WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'));
                    return;
                } else {
                    let position = r.position
                    const sql3 = 'SELECT maxWeight, maxVolume, occupiedWeight, occupiedVolume FROM POSITION WHERE id = ?'
                    db.get(sql3, [position], (err, p) => {
                        if (err) {
                            reject(err);
                            return;
                        } else if (data.newWeight * data.newAvailableQuantity + p.occupiedWeight > p.maxWeight || data.newVolume * data.newAvailableQuantity + p.occupiedVolume > p.maxVolume) {
                            reject(new Error("Maximum position capacity exceeded"))
                            return;
                        } else {
                            const sql4 = 'UPDATE POSITION SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?'
                            db.run(sql4, [p.occupiedWeight + data.newWeight * data.newAvailableQuantity, p.occupiedVolume + data.newVolume * data.newAvailableQuantity, position], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                            const sql2 = 'UPDATE SKU SET description = ?, weight = ?, volume= ?, notes= ?  availableQuantity = ?, price= ? WHERE id = ?';
                            db.run(sql2, [data.newDescription, data.newWeight, data.newVolume, data.newAvailableQuantity, data.newPrice, id], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                        };
                    });
                }
            })
        });
    }

    //update SKU position


    updateSKUposition(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'));
                } else {
                    const sql2 = 'UPDATE SKU SET position = ? WHERE id = ?';
                    db.run(sql2, [data.position, id], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                }
            });
        });
    }


    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE SKU';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }


}



/* Export class SKU_DAO with methods */

module.exports = SKU_DAO;

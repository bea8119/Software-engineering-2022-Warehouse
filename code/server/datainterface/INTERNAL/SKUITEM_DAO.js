'use strict';

class SKUITEM_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR(32) PRIMARY KEY, Available INTEGER, DateOfStock VARCHAR(20), SKUId INTEGER, FOREIGN KEY (SKUId) REFERENCES SKU(id) ON UPDATE CASCADE ON DELETE CASCADE)';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });

        });
    }

    /* Post SKUItem */

    storeSKUItem(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [data.SKUId], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'INSERT INTO SKUITEM(RFID, Available, DateOfStock, SKUId) VALUES (?, ?, ?, ?)';
                    db.run(sql2, [data.RFID, 0, data.DateOfStock, data.SKUId], (err) => {
                        if (err) {
                            reject(err);
                        }
                        const sql3 = 'UPDATE SKU SET availableQuantity = availableQuantity+1 WHERE id = ?'
                        db.run(sql3, [data.SKUId], (err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        })
                    });
                }
            });
        });
    }


    /* Get SKUITEMs */

    getStoredSKUItem(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const SKUItem = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUId,
                        Available: r.Available,
                        DateOfStock: r.DateOfStock
                    }
                ));
                resolve(SKUItem);
            });
        });
    }


    /* Get SKUITEMs where Available = 1 */

    getAvailableStoredSKUItem(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'SELECT * FROM SKUITEM WHERE SKUId = ? AND Available = 1';
                    db.all(sql2, [id], (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        const SKUItem = rows.map((r) => (
                            {
                                RFID: r.RFID,
                                SKUId: r.SKUId,
                                DateOfStock: r.DateOfStock
                            }
                        ));
                        resolve(SKUItem);
                    });
                };
            });
        });
    }


    /* Get SKUITEMs by RFID*/

    getStoredSKUItemByRFID(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM SKUITEM WHERE RFID = ?'
            db.get(sql1, [data], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error("ID not found"));
                }
                else {
                    const SKUItem = {
                        RFID: r.RFID,
                        SKUId: r.SKUId,
                        Available: r.Available,
                        DateOfStock: r.DateOfStock
                    }
                    resolve(SKUItem);
                };
            });
        });
    }


    /* Put SKUItem by ID */

    updateSKUItem(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE RFID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error("ID not found"))
                } else {
                    const sql2 = 'UPDATE SKUITEM SET RFID = ?,  Available = ?, DateOfStock = ? WHERE RFID = ?';
                    db.run(sql2, [data.newRFID, data.newAvailable, data.newDateOfStock, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
            })
        });
    }


    /* Delete SKUITEM by ID */

    deleteSKUItem(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM SKUITEM WHERE RFID = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM SKUITEM WHERE RFID = ?';
                    db.run(sql2, [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        const sql3 = 'UPDATE SKU SET availableQuantity = availableQuantity-1 WHERE id = ?'
                        db.run(sql3, [r.SKUId], (err) => {
                            if (err) {
                                reject(err)
                            }
                            resolve();
                        })
                    });

                }
            })

        });

    }

    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE IF EXISTS SKUITEM';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }
}


/* Export class SKUITEM_DAO with methods */

module.exports = SKUITEM_DAO;

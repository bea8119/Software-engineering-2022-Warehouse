'use strict';

class SKUITEM_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR(32) PRIMARY KEY, FOREIGN KEY(SKUId) REFERENCES SKU(id), Available INTEGER, DateOfStock VARCHAR(20))';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    /* Post SKUItem */

    storeSKUItem(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE Id = ?'
            db.run(sql, [data.SKUId], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'INSERT INTO SKUITEM(RFID,  SKUId, Available, DateOfStock) VALUES (?, ?, ?, ?)';
                    db.run(sql, [data.RFID, data.SKUid, 0, data.DataOfStock], (err) => {
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

    /* Get SKUITEMs */

    getStoredSKUItem(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
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
        const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE Id = ?'
        db.run(sql, [id], (err, r) => {
            if (err) {
                reject(err);
                return;
            }
            else if (r.count === 0) {
                reject(new Error('ID not found'))
            }
            else {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * FROM SKUITEM WHERE SKUId = ? AND Available = 1';
                    db.all(sql, [id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
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
                });
            }
        });
    }


    /* Get SKUITEMs by RFID*/

    getStoredSKUItemByRFID(db, data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [data.RFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
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


    /* Put SKUItem by ID */

    updateSKUItem(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE RFID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE SKUITEM SET RFID = ?,  Available = ?, DateOfStock = ? WHERE RFID = ?';
                    db.run(sql2, [data.newRFID, data.newAvailable, data.newDateOfStock, id], (err) => {
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


    /* Delete SKUITEM by ID */

    deleteSKUItem(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE RFID = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM SKUITEM WHERE RFID = ?';
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
}


/* Export class SKUITEM_DAO with methods */

module.exports = SKUITEM_DAO;

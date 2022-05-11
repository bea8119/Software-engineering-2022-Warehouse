'use strict';

class RESTOCKORDER_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER_ITEM(roid INTEGER, SKUId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, PRIMARY KEY (roid, SKUId))'
            const sql2 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR(20), state VARCHAR(20), supplierId INTEGER)';
            db.run(sql1, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.run(sql2, (err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                }))
                resolve();
            });

        });
    }

    /* Post RestockOrder */

    storeRestockOrder(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'INSERT INTO RESTOCKORDER(id, issueDate, state, supplierId) VALUES (?, ?, ?, ?)';
            const sql2 = 'INSERT INTO RESTOCKORDER_ITEM (roid, SKUId, description, price, quantity) VALUES (?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(ID) AS lastroid FROM RESTOCKORDER'
            db.run(sql1, [null, data.issueDate, "ISSUED", data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.get(sql3, [], (err, r) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    data.products.map((product) => {
                        db.run(sql2, [r.lastroid, product.SKUId, product.description, product.price, product.qty], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        })
                    })
                })
                resolve();
            });
        });
    }

    /* Get RestockOrder */

    getStoredRestockOrder(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM RESTOCKORDER';
            const sql2 = 'SELECT * FROM RESTOCKORDER_ITEM';
            db.all(sql1, [], (err, restockrows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, itemrows) => {
                const restockorder = restockrows.map((r) => (
                    {
                        id: r.id,
                        issueDate: r.issueDate,
                        state: r.state,
                        products: [itemrows.filter((i) => i.roid === r.id).map((i) => (
                            {
                                SKUId: i.SKUId,
                                description: i.description,
                                price: i.price,
                                qty: i.quantity
                            }
                            ))],
                        supplierId: r.supplierId
                    }
                ))
                resolve(restockorder);
                })
            });
            });
        };


        /* Get RestockOrder Issued */

    getStoredRestockOrderIssued(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM RESTOCKORDER WHERE state = "ISSUED"';
            const sql2 = 'SELECT * FROM RESTOCKORDER_ITEM';
            db.all(sql1, [], (err, restockrows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, itemrows) => {
                const restockorder = restockrows.map((r) => (
                    {
                        id: r.id,
                        issueDate: r.issueDate,
                        state: r.state,
                        products: [itemrows.filter((i) => i.roid === r.id).map((i) => (
                            {
                                SKUId: i.SKUId,
                                description: i.description,
                                price: i.price,
                                qty: i.quantity
                            }
                            ))],
                        supplierId: r.supplierId
                    }
                ))
                resolve(restockorder);
                })
            });
            });
        };



    /* Put position by ID */

    updatePosition(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE POSITION SET positionID = ?,  aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
                    db.run(sql2, [data.newAisleID + data.newRow + data.newCol, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, id], (err) => {
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

    /* Update position Occupied weight and volume */

    updatePositionWV(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*), occupiedWeight, occupiedVolume AS count FROM POSITION WHERE positionID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE POSITION SET  occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
                    db.run(sql2, [(r.occupiedWeight + data.weight), (r.occupiedVolume + data.volume), id], (err) => {
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


    /* Put position ID */

    updatePositionID(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE POSITION SET positionID = ?  WHERE positionID = ?';
                    db.run(sql2, [data, id], (err) => {
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


    /* Delete position by ID */

    deletePosition(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM POSITION WHERE positionID = ?';
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

    /* FUNZIONI NON RICHIESTE, SOLO DI CONTROLLO: */

    /* Get restockorder */

    restockorder(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const restock = rows.map((r) => (
                    {
                        id: r.id,
                        issueDate: r.issueDate,
                        state: r.state,
                        supplierId: r.supplierId,
                    }
                ));
                resolve(restock);
            });
        });
    }


    /* Get restockorder_item */

    restockorder_item(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER_ITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const restockitem = rows.map((r) => (
                    {
                        roid: r.roid,
                        SKUId: r.SKUId,
                        description: r.description,
                        price: r.price,
                        quantity: r.quantity,
                    }
                ));
                resolve(restockitem);
            });
        });
    }
}


/* Export class RESTOCKORDER_DAO with methods */

module.exports = RESTOCKORDER_DAO;

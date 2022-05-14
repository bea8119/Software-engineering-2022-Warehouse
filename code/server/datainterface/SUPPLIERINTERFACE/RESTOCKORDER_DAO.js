'use strict';

class RESTOCKORDER_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER_ITEM(roid INTEGER, SKUId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, PRIMARY KEY (roid, SKUId), FOREIGN KEY(roid) REFERENCES RESTOCKORDER(id), FOREIGN KEY(SKUId) references SKU(id))'
            const sql2 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR(20), state VARCHAR(20), supplierId INTEGER, transportNote VARCHAR(20))';
            const sql3 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER_SKUITEM(rfid VARCHAR(32) PRIMARY KEY, SKUId INTEGER, roid INTEGER, FOREIGN KEY(rfid) REFERENCES SKUITEM(RFID), FOREIGN KEY(roid) REFERENCES RESTOCKORDER(id), FOREIGN KEY(SKUId) REFERENCES SKU(id))'
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
                    db.run(sql3, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    })
                }))
            });

        });
    }

    /* Post RestockOrder */

    storeRestockOrder(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'INSERT INTO RESTOCKORDER(id, issueDate, state, supplierId, transportNote) VALUES (?, ?, ?, ?, ?)';
            const sql2 = 'INSERT INTO RESTOCKORDER_ITEM (roid, SKUId, description, price, quantity) VALUES (?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(ID) AS lastroid FROM RESTOCKORDER'
            db.run(sql1, [null, data.issueDate, "ISSUED", data.supplierId, null], (err) => {
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
            const sql3 = 'SELECT * FROM RESTOCKORDER_SKUITEM';
            db.all(sql1, [], (err, restockrows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, itemrows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    db.all(sql3, [], (err, skuitemrows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const restockorder = restockrows.map((r) => (
                            {
                                id: r.id,
                                issueDate: r.issueDate,
                                state: r.state,
                                products: itemrows.filter((i) => i.roid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        qty: i.quantity
                                    }
                                )),
                                supplierId: r.supplierId,
                                transportNote: r.transportNote ? {
                                    deliveryDate: r.transportNote
                                } : {},
                                skuItems: skuitemrows.filter((s) => s.roid === r.id).length !== 0 ? skuitemrows.filter((s) => s.roid === r.id).map((s) => (
                                    {
                                        SKUId: s.SKUId,
                                        rfid: s.rfid
                                    }
                                )) : []

                            }
                        ))
                        resolve(restockorder);
                    })
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
                    if (err) {
                        reject(err);
                        return;
                    }
                    const restockorder = restockrows.map((r) => (
                        {
                            id: r.id,
                            issueDate: r.issueDate,
                            state: r.state,
                            products: itemrows.filter((i) => i.roid === r.id).map((i) => (
                                {
                                    SKUId: i.SKUId,
                                    description: i.description,
                                    price: i.price,
                                    qty: i.quantity
                                }
                            )),
                            supplierId: r.supplierId,
                            skuItems: []
                        }
                    ))
                    resolve(restockorder);
                })
            })
        });
    };

    /* Get RestockOrder ById */

    getStoredRestockOrderById(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RESTOCKORDER WHERE id = ?';
            const sql2 = 'SELECT * FROM RESTOCKORDER_ITEM';
            const sql3 = 'SELECT * FROM RESTOCKORDER_SKUITEM';
            db.get(sql1, [id], (err, restockrow) => {
                if (err) {
                    reject(err);
                    return;
                } else if (restockrow.count === 0) {
                    reject(new Error("ID not found"));
                    return;
                } else {
                    db.all(sql2, [], (err, itemrows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        db.all(sql3, [], (err, skuitemrows) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            const restockorder =
                            {
                                id: restockrow.id,
                                issueDate: restockrow.issueDate,
                                state: restockrow.state,
                                products: itemrows.filter((i) => i.roid === restockrow.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        qty: i.quantity
                                    }
                                )),
                                supplierId: restockrow.supplierId,
                                transportNote: restockrow.transportNote ? {
                                    deliveryDate: restockrow.transportNote
                                } : {},
                                skuItems: skuitemrows.filter((s) => s.roid === restockrow.id).length !== 0 ? skuitemrows.filter((s) => s.roid === restockrow.id).map((s) => (
                                    {
                                        SKUId: s.SKUId,
                                        rfid: s.rfid
                                    }
                                )) : []
                            }
                            resolve(restockorder);
                        })
                    })
                };
            });
        });
    }


    /* Get RestockOrder skuitems to return*/

    getSkuItemsToReturn(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RESTOCKORDER WHERE id = ?';
            const sql2 = 'SELECT DISTINCT * FROM RESTOCKORDER_SKUITEM R NATURAL JOIN TESTRESULT T WHERE roid = ? AND Result = 0';
            db.get(sql1, [id], (err, restockrow) => {
                if (err) {
                    reject(err);
                    return;
                } else if (restockrow.count === 0) {
                    reject(new Error("ID not found"));
                    return;
                } else if (restockrow.state !== "COMPLETEDRETURN" ){
                    reject(new Error ("Not COMPLETEDRETURN state"))
                } else {
                    db.all(sql2, [id], (err, skuitemrows) => {
                        console.log(skuitemrows)
                        if (err) {
                            reject(err);
                            return;
                        }
                        const returnskuitems =
                            skuitemrows.map((s) => (
                                {
                                    SKUId: s.SKUId,
                                    rfid: s.rfid
                                }
                            ))
                            
                        resolve(returnskuitems);
                    })
                }
            });
        });
    };




    /* Put skuitems in restockorder of given id */

    updateRestockOrderSkuItems(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RESTOCKORDER WHERE id = ?'
            const sql2 = 'INSERT INTO RESTOCKORDER_SKUITEM(rfid, SKUId, roid) VALUES(?, ?, ?)';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else if (r.state !== 'DELIVERED') {
                    reject(new Error('Not DELIVERED state'));
                } else {
                    data.skuItems.map((skuitem) => {
                        db.run(sql2, [skuitem.rfid, skuitem.SKUId, id], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        })
                    })
                    resolve();
                }
            });
        })
    }

    /* Put transportnote in restockorder of given id */

    updateRestockOrderTransportNote(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RESTOCKORDER WHERE id = ?'
            const sql2 = 'UPDATE RESTOCKORDER SET transportNote = ? WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else if (r.state !== 'DELIVERY') {
                    reject(new Error('Not DELIVERY state'));
                } else {
                    db.run(sql2, [data.transportNote.deliveryDate, id], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                    })
                    resolve();
                }
            });
        })
    }



    /* Put RestockOrder state given ID */

    updateRestockOrderState(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM RESTOCKORDER WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE RESTOCKORDER SET state = ?  WHERE id = ?';
                    db.run(sql2, [data.newState, id], (err) => {
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


    /* Delete restockorder by ID */

    deleteRestockOrder(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM RESTOCKORDER WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM RESTOCKORDER WHERE id = ?';
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
                        transportNote: r.transportNote
                    }
                ));
                resolve(restock);
            });
        });
    }


    /* Get restockorder_item */

    restockorder_item(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER_SKUITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const restockitem = rows.map((r) => (
                    {
                        roid: r.roid,
                        SKUId: r.SKUId,
                        rfid: r.rfid
                    }
                ));
                resolve(restockitem);
            });
        });
    }

    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE RESTOCKORDER';
            const sql2 = 'DROP TABLE RESTOCKORDER_ITEM';
            db.run(sql1, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.run(sql2, [], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                })
            })
        });
    }
}


/* Export class RESTOCKORDER_DAO with methods */

module.exports = RESTOCKORDER_DAO;

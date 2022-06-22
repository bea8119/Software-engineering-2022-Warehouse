'use strict';

const dayjs = require("dayjs");

class RESTOCKORDER_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER_ITEM(roid INTEGER, SKUId INTEGER, itemId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, PRIMARY KEY (roid, SKUId), FOREIGN KEY(roid) REFERENCES RESTOCKORDER(id), FOREIGN KEY(SKUId) references SKU(id))'
            const sql2 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR(20), state VARCHAR(20), supplierId INTEGER, transportNote VARCHAR(20))';
            const sql3 = 'CREATE TABLE IF NOT EXISTS RESTOCKORDER_SKUITEM(rfid VARCHAR(32) PRIMARY KEY, SKUId INTEGER, roid INTEGER, itemId INTEGER, FOREIGN KEY(rfid) REFERENCES SKUITEM(RFID), FOREIGN KEY(roid) REFERENCES RESTOCKORDER(id), FOREIGN KEY(SKUId) REFERENCES SKU(id))'
            db.run(sql1, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(sql2, (err => {
                        if (err) {
                            reject(err);
                        } else {
                            db.run(sql3, (err) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        }
                    }))
                }
            });

        });
    }

    /* Post RestockOrder */

    storeRestockOrder(db, data) {

        return new Promise(async (resolve, reject) => {
            const sql1 = 'INSERT INTO RESTOCKORDER(id, issueDate, state, supplierId, transportNote) VALUES (?, ?, ?, ?, ?)';
            const sql2 = 'INSERT INTO RESTOCKORDER_ITEM (roid, SKUId, itemId, description, price, quantity) VALUES (?, ?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(ID) AS lastroid FROM RESTOCKORDER'
                await db.run(sql1, [null, data.issueDate, "ISSUED", data.supplierId, null], async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        await db.get(sql3, [], async (err, r) => {
                            if (err) {
                                reject(err);
                            } else if (data.products.length !== 0) {
                                await data.products.map(async (product) => {
                                    await db.run(sql2, [r.lastroid, product.SKUId, product.itemId, product.description, product.price, product.qty], (err) => {
                                        if (err) {
                                            reject(err);
                                        }
                                    })
                                })
                            }
                            resolve()
                        })
                    }
                });
        });

    }



    /* Get RestockOrder */

    getStoredRestockOrder(db) {
        return new Promise(async (resolve, reject) => {
            const sql1 = 'SELECT * FROM RESTOCKORDER';
            const sql2 = 'SELECT * FROM RESTOCKORDER_ITEM';
            const sql3 = 'SELECT * FROM RESTOCKORDER_SKUITEM';
            await db.all(sql1, [], async (err, restockrows) => {
                if (err) {
                    reject(err);
                } else {
                    await db.all(sql2, [], async (err, itemrows) => {
                        if (err) {
                            reject(err);
                        } else {
                            await db.all(sql3, [], async (err, skuitemrows) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const restockorder = await restockrows.map((r) => (
                                        {
                                            id: r.id,
                                            issueDate: r.issueDate,
                                            state: r.state,
                                            products: itemrows.filter((i) => i.roid === r.id).map((i) => (
                                                {
                                                    SKUId: i.SKUId,
                                                    itemId: i.itemId,
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
                                                    itemId: s.itemId,
                                                    rfid: s.rfid
                                                }
                                            )) : []

                                        }
                                    ))
                                    resolve(restockorder);
                                }
                            })
                        }
                    })
                }
            });
        });
    };


    /* Get RestockOrder Issued */

    getStoredRestockOrderIssued(db) {
        return new Promise(async (resolve, reject) => {
            const sql1 = 'SELECT * FROM RESTOCKORDER WHERE state = "ISSUED"';
            const sql2 = 'SELECT * FROM RESTOCKORDER_ITEM';
            await db.all(sql1, [], async (err, restockrows) => {
                if (err) {
                    reject(err);
                } else {
                    await db.all(sql2, [], async (err, itemrows) => {
                        if (err) {
                            reject(err);
                        } else {
                            const restockorder = await restockrows.map((r) => (
                                {
                                    id: r.id,
                                    issueDate: r.issueDate,
                                    state: r.state,
                                    products: itemrows.filter((i) => i.roid === r.id).map((i) => (
                                        {
                                            SKUId: i.SKUId,
                                            itemId: i.itemId,
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
                        }
                    })
                }
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
                } else if (restockrow.count === 0) {
                    reject(new Error("ID not found"));
                } else {
                    db.all(sql2, [], (err, itemrows) => {
                        if (err) {
                            reject(err);
                        } else {
                            db.all(sql3, [], (err, skuitemrows) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const restockorder =
                                    {
                                        issueDate: restockrow.issueDate,
                                        state: restockrow.state,
                                        products: itemrows.filter((i) => i.roid === restockrow.id).map((i) => (
                                            {
                                                SKUId: i.SKUId,
                                                itemId: i.itemId,
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
                                                itemId: s.itemId,
                                                rfid: s.rfid
                                            }
                                        )) : []
                                    }
                                    resolve(restockorder);
                                }
                            })
                        }
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
                } else if (restockrow.count === 0) {
                    reject(new Error("ID not found"));
                } else if (restockrow.state !== "COMPLETEDRETURN") {
                    reject(new Error("Not COMPLETEDRETURN state"))
                } else {
                    db.all(sql2, [id], (err, skuitemrows) => {
                        if (err) {
                            reject(err);
                        } else {
                            const returnskuitems =
                                skuitemrows.map((s) => (
                                    {
                                        SKUId: s.SKUId,
                                        itemId: s.itemId,
                                        rfid: s.rfid
                                    }
                                ))

                            resolve(returnskuitems);
                        }
                    })

                }
            });
        });
    };




    /* Put skuitems in restockorder of given id */

    updateRestockOrderSkuItems(db, id, data) {
        return new Promise(async (resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RESTOCKORDER WHERE id = ?'
            const sql2 = 'INSERT INTO RESTOCKORDER_SKUITEM(rfid, SKUId, itemId, roid) VALUES(?, ?, ?, ?)';
            await db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else if (r.state !== 'DELIVERED') {
                    reject(new Error('Not DELIVERED state'));
                } else {
                    data.skuItems.map(async (skuitem) => {
                        await db.run(sql2, [skuitem.rfid, skuitem.SKUId, skuitem.itemId, id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    })
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
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else if (r.state !== 'DELIVERY') {
                    reject(new Error('Not DELIVERY state'));
                } else if (dayjs(data.transportNote.deliveryDate).isBefore(dayjs(r.issueDate))) {
                    reject(new Error('Delivery date before issue date'))
                } else {
                    db.run(sql2, [data.transportNote.deliveryDate, id], (err) => {
                        if (err) {
                            reject(err);
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
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE RESTOCKORDER SET state = ?  WHERE id = ?';
                    db.run(sql2, [data.newState, id], (err) => {
                        if (err) {
                            reject(err);
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
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql0 = 'DELETE FROM RESTOCKORDER_SKUITEM WHERE roid = ? '
                    db.run(sql0, [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const sql = 'DELETE FROM RESTOCKORDER_ITEM WHERE roid = ? '
                            db.run(sql, [id], (err) => {
                                if (err) {
                                    reject(err);
                                }

                                else {
                                    const sql2 = 'DELETE FROM RESTOCKORDER WHERE id = ?';
                                    db.run(sql2, [id], (err) => {
                                        if (err) {
                                            reject(err);
                                        }
                                        resolve();
                                    });
                                }
                            })


                        }
                    })
                }
            })

        });

    }

    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE IF EXISTS RESTOCKORDER';
            const sql2 = 'DROP TABLE IF EXISTS RESTOCKORDER_ITEM';
            const sql3 = 'DROP TABLE IF EXISTS RESTOCKORDER_SKUITEM';
            db.run(sql3, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(sql2, [], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            db.run(sql1, [], (err) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        }
                    })
                }
            });

        })
    }

    async checkProducts(db, prod, restockOrder) {
        return new Promise(async (resolve, reject) => {
            const sqln = 'SELECT COUNT(*) AS count FROM ITEM WHERE id = ? AND SKUId = ? AND supplierId = ?';
                db.get(sqln, [prod.itemId, prod.SKUId, restockOrder.supplierId], (err, s) => {
                    if (err){
                        reject (err);
                    }
                    else {
                        resolve(s.count)
                    }
                })
            })
        }
    }



/* Export class RESTOCKORDER_DAO with methods */

module.exports = RESTOCKORDER_DAO;

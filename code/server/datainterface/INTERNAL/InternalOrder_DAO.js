'use strict';

class InternalOrder_DAO {
    constructor() { }

    /* -- Interface methods -- */

    /* new table create */
    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS INTERNALORDER_PRODUCT(ioid INTEGER, SKUId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, RFID VARCHAR(32),  PRIMARY KEY (ioid, SKUId), FOREIGN KEY(ioid) REFERENCES INTERNALORDER(id), FOREIGN KEY(SKUId) REFERENCES SKU(id))'
            const sql2 = 'CREATE TABLE IF NOT EXISTS INTERNALORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR(20), state VARCHAR(20), customerId INTEGER)';
            db.run(sql1, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    db.run(sql2, (err => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    }))
                }
            });
        });
    }

    /* Post InternalOrder */
    storeInternalOrder(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'INSERT INTO INTERNALORDER(id, issueDate, state, customerId) VALUES (?, ?, ?, ?)';
            const sql2 = 'INSERT INTO INTERNALORDER_PRODUCT (ioid, SKUId, description, price, quantity, RFID) VALUES (?, ?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(ID) AS lastioid FROM INTERNALORDER'

            //Lo stato viene messo ACCEPTED di default perchè l'ordine è appena stato inserito->RFID=null
            db.run(sql1, [null, data.issueDate, "ACCEPTED", data.customerId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    db.get(sql3, [], (err, r) => {
                        if (err) {
                            reject(err);
                        }
                        else if (data.products.length !==0) {
                            data.products.map((product) => {
                                db.run(sql2, [r.lastioid, product.SKUId, product.description, product.price, product.qty, null], (err) => { //RFID viene messo a null perchè lo stato è accepted
                                    if (err) {
                                        reject(err);
                                    }
                                });
                            });
                        }
                        resolve();
                    });
                }
            });
        });
    }

    /* Get InternalOrder */
    getStoredInternalOrder(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM INTERNALORDER';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.all(sql1, [], (err, internalrows) => {
                if (err) {
                    reject(err);
                }
                else {
                    db.all(sql2, [], (err, productrows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const internalorder = internalrows.map((r) => (
                                r.state === "COMPLETED" ?
                                    {
                                        id: r.id,
                                        issueDate: r.issueDate,
                                        state: r.state,
                                        products: [productrows.filter((i) => i.ioid === r.id).map((i) => (
                                            {
                                                SKUId: i.SKUId,
                                                description: i.description,
                                                price: i.price,
                                                RFID: i.RFID
                                            }
                                        ))],
                                        customerId: r.customerId,
                                    } :
                                    {
                                        id: r.id,
                                        issueDate: r.issueDate,
                                        state: r.state,
                                        products: productrows.filter((i) => i.ioid === r.id).map((i) => (
                                            {
                                                SKUId: i.SKUId,
                                                description: i.description,
                                                price: i.price,
                                                qty: i.quantity
                                            }
                                        )),
                                        customerId: r.customerId,
                                    }
                            ))
                            resolve(internalorder);
                        }
                    });
                }
            });
        });
    }

    /* Get InternalOrder Issued */
    getStoredInternalOrderIssued(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM INTERNALORDER WHERE state = "ISSUED"';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.all(sql1, [], (err, internalrows) => {
                if (err) {
                    reject(err);
                }
                else {
                    db.all(sql2, [], (err, productrows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const internalorder = internalrows.map((r) => (
                                {
                                    id: r.id,
                                    issueDate: r.issueDate,
                                    state: r.state,
                                    products: productrows.filter((i) => i.ioid === r.id).map((i) => (
                                        {
                                            SKUId: i.SKUId,
                                            description: i.description,
                                            price: i.price,
                                            qty: i.quantity
                                        }
                                    )),
                                    customerId: r.customerId,
                                }
                            ));
                            resolve(internalorder);
                        }
                    });
                }
            });
        });
    }

    /* Get InternalOrder Accepted */
    getStoredInternalOrderAccepted(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM INTERNALORDER WHERE state = "ACCEPTED"';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.all(sql1, [], (err, internalrows) => {
                if (err) {
                    reject(err);
                }
                db.all(sql2, [], (err, productrows) => {
                    if (err) {
                        reject(err);
                    }
                    else{
                        const internalorder = internalrows.map((r) => (
                            {
                                id: r.id,
                                issueDate: r.issueDate,
                                state: r.state,
                                products: productrows.filter((i) => i.ioid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        qty: i.quantity
                                    }
                                )),
                                customerId: r.customerId
                            }
                        ))
                        resolve(internalorder);
                    }
                });
            });
        });
    }

    /* Get InternalOrder ById */
    getStoredInternalOrderById(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM INTERNALORDER WHERE id = ?';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.get(sql1, [id], (err, internalrows) => {
                if (err) {
                    reject(err);
                }
                else if (internalrows.count === 0) {
                    reject(new Error("ID not found"));
                }
                else {
                    db.all(sql2, [], (err, productrows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const internalorder =
                                internalrows.state === "COMPLETED" ?
                                    {
                                        id: internalrows.id,
                                        issueDate: internalrows.issueDate,
                                        state: internalrows.state,
                                        products: productrows.filter((i) => i.ioid === internalrows.id).map((i) => (
                                            {
                                                SKUId: i.SKUId,
                                                description: i.description,
                                                price: i.price,
                                                RFID: i.RFID
                                            }
                                        )),
                                        customerId: internalrows.customerId,
                                    } :
                                    {
                                        id: internalrows.id,
                                        issueDate: internalrows.issueDate,
                                        state: internalrows.state,
                                        products: productrows.filter((i) => i.ioid === internalrows.id).map((i) => (
                                            {
                                                SKUId: i.SKUId,
                                                description: i.description,
                                                price: i.price,
                                                qty: i.quantity
                                            }
                                        )),
                                        customerId: internalrows.customerId,
                                    }
                            resolve(internalorder);
                        }
                    });
                }
            });
        });
    }

    /* Put skuproducts in InternalOrder of given id */
    updateInternalOrderSkuProducts(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM INTERNALORDER WHERE id = ?'
            const sql2 = 'UPDATE INTERNALORDER_PRODUCT SET RFID = ?, quantity = null  WHERE ioid = ?  AND SKUId = ?'
            //const sql2 = 'INSERT INTO INTERNALORDER_PRODUCT(RFID, SKUId, ioid) VALUES(?, ?, ?)';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql3 = 'UPDATE INTERNALORDER SET state = ?  WHERE id = ?';
                    db.run(sql3, [data.newState, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const sql4 = 'SELECT COUNT(*) AS count FROM INTERNALORDER_PRODUCT  WHERE ioid = ? ';
                            db.get(sql4, [id], (err, r) => {
                                if (err) {
                                    reject(err);
                                }
                                else if (r.count !== Object.keys(data.products).length) {
                                    reject(new Error('Uncorrect product'));
                                }
                                else {
                                    data.products.map((product) => {
                                        db.run(sql2, [product.RFID, id, product.SkuId], (err) => {
                                            if (err) {
                                                reject(err);
                                            }
                                            else {
                                                resolve();
                                            }
                                        });
                                    })
                                }
                            });
                        }
                    });
                }
            });
        })
    }

    /* Put InternalOrder state given ID */
    updateInternalOrderState(db, id, state) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM INTERNALORDER WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error('ID not found'));
                } else {
                    const sql2 = 'UPDATE INTERNALORDER SET state = ?  WHERE id = ?';
                    db.run(sql2, [state, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
            })
        });
    }

    /* Delete InternalOrder by ID */
    deleteInternalOrder(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM INTERNALORDER WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM INTERNALORDER WHERE id = ?';
                    db.run(sql2, [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const sql3 = 'DELETE FROM INTERNALORDER_PRODUCT WHERE ioid = ?';
                            db.run(sql3, [id], err => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                } 
                            });
                        }
                    });

                }
            })

        });

    }

    /* Delelte entire item table */
    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE IF EXISTS INTERNALORDER';
            const sql2 = 'DROP TABLE IF EXISTS INTERNALORDER_PRODUCT';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(sql1, [], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }
            });

        })
    }
}

/* Export class InternalOrder_DAO with methods */

module.exports = InternalOrder_DAO;
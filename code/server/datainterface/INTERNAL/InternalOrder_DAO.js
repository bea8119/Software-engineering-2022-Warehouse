'use strict';

class InternalOrder_DAO {
    constructor() { }

    /* -- Interface methods -- */

    /* new table create */
    newTableName(db) {
        return new Promise((resolve, reject) => {
            //DOMANDA-> product di InternalOrder è uguale a product di RESTOCK ORDER?->qui viene considerato come se NON fossero uguali
            const sql1 = 'CREATE TABLE IF NOT EXISTS INTERNALORDER_PRODUCT(ioid INTEGER, SKUId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, RFID VARCHAR(32),  PRIMARY KEY (ioid, SKUId), FOREIGN KEY(ioid) REFERENCES INTERNALORDER(id), FOREIGN KEY(SKUId) REFERENCES SKU(id))'
            const sql2 = 'CREATE TABLE IF NOT EXISTS INTERNALORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR(20), state VARCHAR(20), customerId INTEGER)';
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
                    return;
                }
                db.get(sql3, [], (err, r) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    data.products.map((product) => {
                        db.run(sql2, [r.lastioid, product.SKUId, product.description, product.price, product.qty, null], (err) => { //RFID viene messo a null perchè lo stato è accepted
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

    /* Get InternalOrder */
    getStoredInternalOrder(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM INTERNALORDER';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.all(sql1, [], (err, internalrows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, productrows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const internalorder = internalrows.map((r) => (
                        r.state === "COMPETED" ?
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
                                products: [productrows.filter((i) => i.ioid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        qty: i.quantity
                                    }
                                ))],
                                customerId: r.customerId,
                            }
                    ))
                    resolve(internalorder);
                })
            })
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
                    return;
                }
                db.all(sql2, [], (err, productrows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const internalorder = internalrows.map((r) => (
                        {
                            id: r.id,
                            issueDate: r.issueDate,
                            state: r.state,
                            products: [productrows.filter((i) => i.ioid === r.id).map((i) => (
                                {
                                    SKUId: i.SKUId,
                                    description: i.description,
                                    price: i.price,
                                    qty: i.quantity
                                }
                            ))],
                            customerId: r.customerId,
                        }
                    ))
                    resolve(internalorder);
                })
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
                    return;
                }
                db.all(sql2, [], (err, productrows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const internalorder = internalrows.map((r) => (
                        {
                            id: r.id,
                            issueDate: r.issueDate,
                            state: r.state,
                            products: [productrows.filter((i) => i.ioid === r.id).map((i) => (
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
                    resolve(internalorder);
                })
            });
        });
    }

    /* Get InternalOrder ById */
    getStoredInternalOrderById(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM INTERNALORDER WHERE id = ?';
            const sql2 = 'SELECT * FROM INTERNALORDER_PRODUCT';
            db.all(sql1, [id], (err, internalrows) => {
                if (err) {
                    console.log("Errore sql1");
                    reject(err);
                    return;
                } 
                else if (internalrows.count === 0) {
                    console.log("ciao");
                    reject(new Error("ID not found"));
                    return;
                } 
                else {
                    db.all(sql2, [], (err, productrows) => {
                        if (err) {
                            console.log("Errore sql1");
                            reject(err);
                            return;
                        }
                        const internalorder = internalrows.map((r) => (
                            r.state === "COMPETED" ?
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
                                    products: [productrows.filter((i) => i.ioid === r.id).map((i) => (
                                        {
                                            SKUId: i.SKUId,
                                            description: i.description,
                                            price: i.price,
                                            qty: i.quantity
                                        }
                                    ))],
                                    customerId: r.customerId,
                                }
                        ))
                        resolve(internalorder);
                    })
                };
            });
        });
    }

}

/* Export class InternalOrder_DAO with methods */

module.exports = InternalOrder_DAO;
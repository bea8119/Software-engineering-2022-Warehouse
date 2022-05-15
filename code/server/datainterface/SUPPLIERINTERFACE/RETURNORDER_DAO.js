'use strict';

class ReturnOrder_DAO {

    constructor(){ }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS RETURNORDER_PRODUCT(SKUId INTEGER, description VARCHAR(20), price REAL, RFID VARCHAR(32), roid INTEGER, PRIMARY KEY (SKUId, roid) )'
            const sql2 = 'CREATE TABLE IF NOT EXISTS RETURNORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, returnDate VARCHAR(20), restockOrderId INTEGER)';
           
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
                    resolve();
                }));
            });

        });
    }

    //manage when id is eq 0
    storeReturnOrder(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'INSERT INTO RETURNORDER(id, returnDate, restockOrderId) VALUES (?, ?, ?)';
            const sql2 = 'INSERT INTO RETURNORDER_PRODUCT (SKUId, description, price, RFID, roid) VALUES (?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(id) AS lastroid FROM RETURNORDER'
            db.run(sql1, [null, data.returnDate, data.restockOrderId], (err) => {
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
                        db.run(sql2, [product.SKUId, product.description, product.price, product.RFID, r.lastroid ], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        });
                    });
                });
            });
                resolve();
            });
    }


    getStoredReturnOrders(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM RETURNORDER';
            const sql2 = 'SELECT * FROM RETURNORDER_PRODUCT';
            db.all(sql1, [], (err, returnRows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, itemrows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                       
                        const returnorder = returnRows.map((r) => (
                            {
                                id: r.id,
                                returnDate: r.returnDate,
                                
                                products: [itemrows.filter((i) => i.roid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        RFID: i.RFID
                                    }
                                ))],
                                restockOrderId: r.restockOrderId
                                

                            }
                        ))
                        resolve(returnorder);
                    
                })
            });
        });
    }



    getStoredReturnOrderById(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM RETURNORDER WHERE id = ?';
            const sql2 = 'SELECT * FROM RETURNORDER_PRODUCT';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                } else if (r.count === 0) {
                    reject(new Error("ID not found"));
                    return;
                } else {
                    db.all(sql2, [], (err, itemrows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                           
                            
                            const returnorder =
                            {
                                id: r.id,
                                returnDate: r.returnDate,
                                
                                products: [itemrows.filter((i) => i.roid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        description: i.description,
                                        price: i.price,
                                        RFID: i.RFID
                                    }
                                ))],
                                restockOrderId: r.restockOrderId
                                
                                
                            }
                            resolve(returnorder);
                        
                    })
                };
            });
        });
    }


    deleteReturnOrder(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM RETURNORDER WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM RETURNORDER WHERE id = ?';
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

    /* -- Interface methods -- */
}

/* Export class ReturnOrder_DAO with methods */

module.exports = ReturnOrder_DAO;
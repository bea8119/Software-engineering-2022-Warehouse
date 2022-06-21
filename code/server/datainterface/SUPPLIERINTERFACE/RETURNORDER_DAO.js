'use strict';

class ReturnOrder_DAO {

    constructor(){ }

    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE IF EXISTS RETURNORDER_PRODUCT';
            db.run(sql1, [], (err) => {
                if (err) {
                    reject(err);
                } else{
                
                    const sql2 = 'DROP TABLE IF EXISTS RETURNORDER';
                    db.run(sql2, [], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
                
            });
        })
    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'CREATE TABLE IF NOT EXISTS RETURNORDER_PRODUCT(SKUId INTEGER, itemId INTEGER, description VARCHAR(20), price REAL, RFID VARCHAR(32), roid INTEGER, PRIMARY KEY (SKUId, roid), FOREIGN KEY (roid) REFERENCES RETURNORDER(id) ON UPDATE CASCADE ON DELETE SET NULL )'
            const sql2 = 'CREATE TABLE IF NOT EXISTS RETURNORDER(id INTEGER PRIMARY KEY AUTOINCREMENT, returnDate VARCHAR(20), restockOrderId INTEGER, FOREIGN KEY (restockOrderId) REFERENCES RESTOCKORDER(id) ON UPDATE CASCADE ON DELETE SET NULL)';
           
            db.run(sql1, (err) => {
                if (err) {
                    reject(err);
                }
                db.run(sql2, (err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }));
            });

        });
    }

    
    async storeReturnOrder(db, data) {
        return new Promise(async (resolve, reject) => {
            const sql1 = 'INSERT INTO RETURNORDER(id, returnDate, restockOrderId) VALUES (?, ?, ?)';
            const sql2 = 'INSERT INTO RETURNORDER_PRODUCT (SKUId, itemId, description, price, RFID, roid) VALUES (?, ?, ?, ?, ?, ?)'
            const sql3 = 'SELECT MAX(id) AS lastroid FROM RETURNORDER'
            const sql4 = 'SELECT COUNT(*) AS count FROM RESTOCKORDER WHERE id = ? ';
            await db.get(sql4, [data.restockOrderId], async (err, m) => {
                if (err) {
                    reject(err);
                } else if(m.count === 0){
                    reject(new Error("ID not found"));
                }
                else{
            await db.run(sql1, [null, data.returnDate, data.restockOrderId], async (err) => {
                if (err) {
                    reject(err);
                } else {
                    await db.get(sql3, [], async (err, r) => {
                        if (err) {
                            reject(err);
                        } else {

                            await data.products.map(async (product) => {
                                await db.run(sql2, [product.SKUId, product.itemId, product.description, product.price, product.RFID, r.lastroid], (err) => {
                                    if (err) {
                                        reject(err);
                                    }
                                        

                                });
                            });

                            resolve();

                        }
                    });
                }
            });
        }
        });

        });
    }


    async getStoredReturnOrders(db) {
        return new Promise( async (resolve, reject) => {
            const sql1 = 'SELECT * FROM RETURNORDER';
            const sql2 = 'SELECT * FROM RETURNORDER_PRODUCT';
           await db.all(sql1, [], async (err, returnRows) => {
                if (err) {
                    reject(err);
                } else{
                await db.all(sql2, [], async (err, itemrows) => {
                    if (err) {
                        reject(err);
                    }
                    else{
                    
                       
                        const returnorder = await returnRows.map((r) => (
                            {
                                id: r.id,
                                returnDate: r.returnDate,
                                
                                products:  itemrows.filter( (i) => i.roid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        itemId: i.itemId,
                                        description: i.description,
                                        price: i.price,
                                        RFID: i.RFID
                                    }
                                )),
                                restockOrderId: r.restockOrderId
                                

                            }
                        )) 
                    
                        resolve(returnorder);
                    }
                        
                    
                }); }
                
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
                } else if (r.count === 0) {
                    reject(new Error("ID not found"));
                } else {
                    db.all(sql2, [], (err, itemrows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                           
                            
                            const returnorder =
                            {
                                id: r.id,
                                returnDate: r.returnDate,
                                
                                products: itemrows.filter((i) => i.roid === r.id).map((i) => (
                                    {
                                        SKUId: i.SKUId,
                                        itemId: i.itemId,
                                        description: i.description,
                                        price: i.price,
                                        RFID: i.RFID
                                    }
                                )),
                                restockOrderId: r.restockOrderId
                                
                                
                            }
                            resolve(returnorder);
                        }
                        
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
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM RETURNORDER WHERE id = ?';
                    db.run(sql2, [id], (err) => {
                        if (err) {
                            reject(err);
                        } else
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
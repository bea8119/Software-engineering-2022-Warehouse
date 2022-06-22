'use strict';

class ITEM_DAO {
    constructor() { }

    /* -- Interface methods -- */

    /* new table create */
    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEM( id INTEGER PRIMARY KEY,  description VARCHAR(20), price REAL,  SKUId INTEGER, supplierId INTEGER, FOREIGN KEY(supplierId) REFERENCES RESTOCKORDER(supplierId) )';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });

        });
    }

    /*Get item */
    getStoredITEM(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                const item = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        SKUId: r.SKUId,
                        supplierId: r.supplierId

                    }
                ));
                resolve(item);
                }
            });
        });
    }

    /* Store new item */
    storeITEM(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [data.SKUId], (err, r) => {
                if (err) {
                    //console.log("Errore sql1");
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('SKU not found'));
                }
                else {
                    const sql2 = 'SELECT COUNT(*) AS count FROM ITEM WHERE (supplierId=? and SKUId=?) or (supplierId=? and id=?)';
                    db.get(sql2, [data.supplierId, data.SKUId, data.supplierId, data.id], (err, r) => {
                        if(err){
                            //console.log("Errore sql2");
                            reject(err);
                        }
                        else if(r.count!==0){
                            reject(new Error('Item already sells'));
                        }
                        else {
                            const sql3 = 'INSERT INTO ITEM (id,  description, price, SKUId, supplierId) VALUES (?, ?, ?, ? ,?)';
                            db.run(sql3, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
                                if (err) {
                                    //console.log("Errore sql3");
                                    reject(err);
                                }
                                resolve();
                            });
                        }
                    });
                }
            });

        });
    }

    /* Get Item by ID and SupplierId */
    getStoredITEMbyIDAndSupplierId(db, id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count, * FROM ITEM WHERE id = ? AND supplierId = ?'
            db.get(sql, [id, supplierId], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    reject(new Error('ID not found'));
                }
                else {
                    resolve({
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        SKUId: r.SKUId,
                        supplierId: r.supplierId
                    });
                }
            });
        });
    }

    /* Update ITEM with ID and supplierID */
    updateItem(db, id, supplierId, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM ITEM WHERE id = ? AND supplierId = ?'
            db.get(sql1, [id, supplierId], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    if(data.newDescription===undefined)
                        data.newDescription=r.description;
                    if(data.newPrice===undefined)
                        data.newPrice=r.price;
                    if(data.newSKUId===undefined)
                        data.newSKUId=r.SKUId;   
                    if(data.newSupplierId===undefined)
                        data.newSupplierId=r.supplierId;
                    const sql2 = 'UPDATE ITEM SET  description = ?, price = ? WHERE id = ? AND supplierId = ?';
                    db.run(sql2, [ data.newDescription, data.newPrice, id, supplierId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                        resolve();
                        }
                    });
                }
            })
        });
    }

    /* Delete Item */
    deleteItem(db, id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM ITEM WHERE id = ? AND supplierId = ?';
            db.get(sql1, [id, supplierId], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'));
                }
                else {
                    const sql2 = 'DELETE FROM ITEM WHERE id = ? AND supplierId = ?';
                    db.run(sql2, [id, supplierId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                        resolve();
                        }
                    });

                }
            })

        });
    }

    /* Delelte entire item table */
    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE IF EXISTS ITEM';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                resolve();
                }
            });
        })
    }

}

/* Export class ITEM_DAO with methods */

module.exports = ITEM_DAO;

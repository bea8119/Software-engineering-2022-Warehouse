'use strict';

class ITEM_DAO {
    constructor() { }

    /* -- Interface methods -- */


    ////MODIFY WHEN WE HAVE SUPPLIERID
    /* new table create */
    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEM( id INTEGER PRIMARY KEY AUTOINCREMENT,  description VARCHAR(20), price REAL,  SKUId INTEGER, supplierId INTEGER)';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
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
                    return;
                }
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
            });
        });
    }

    /* Get Item by ID */
    getITEMbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count, * FROM ITEM WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    resolve(undefined)
                }
                else {
                    resolve({
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        SKUId: r, SKUId,
                        supplierId: r.supplierId
                    });
                }
            });
        });
    }

    // /*Find SKU by ID */
    // findSKUbyID(db, id) {
    //     return new Promise((resolve, reject) => {
    //         const sql = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
    //         db.get(sql, [id], (err, r) => {
    //             if (err){
    //                 console.log("errore sku");
    //                 reject(err);
    //             }
    //             else if (r.count === 0) {
    //                 //console.log("non trovato");
    //                 resolve(0);
    //             }
    //             else {
    //                 //console.log("trovato");
    //                 resolve(1);
    //             }
    //         });
    //     });
    // }


    /* Store new item */
    storeITEM(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [data.SKUId], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('SKU not found'))
                }
                else {
                    const sql2 = 'INSERT INTO ITEM (id,  description, price, SKUId, supplierId) VALUES (?, ?, ?, ? ,?)';
                    db.run(sql2, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
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

    /* Update ITEM with ID */
    updateItem(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM ITEM WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(new Error('errore prima query'))
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('Item not found'))
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

                    console.log("data.newSupplierId "+data.newSupplierId+" r.supplierId "+r.supplierId);
                    const sql2 = 'UPDATE ITEM SET  description = ?, price = ?, SKUId = ?, supplierId = ?  WHERE id = ?';
                    db.run(sql2, [ data.newDescription, data.newPrice, data.newSKUId, data.newSupplierId, id], (err) => {
                        if (err) {
                            reject(new Error('errore seconda query'))
                            return;
                        }
                        resolve();
                    });
                }
            })
        });
    }

    /* Delete Item */
    deleteItem(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM ITEM WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('Item not found'));
                }
                else {
                    const sql2 = 'DELETE FROM ITEM WHERE id = ?';
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

/* Export class ITEM_DAO with methods */

module.exports = ITEM_DAO;

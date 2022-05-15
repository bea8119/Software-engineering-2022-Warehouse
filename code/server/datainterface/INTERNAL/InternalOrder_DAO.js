'use strict';

class InternalOrder_DAO {
    constructor(){ }

    /* -- Interface methods -- */

    /* new table create */
    newTableName(db) {
        return new Promise((resolve, reject) => {
            //DOMANDA-> product di InternalOrder è uguale a product di RESTOCK ORDER?->qui viene considerato come se NON fossero uguali
            const sql1 = 'CREATE TABLE IF NOT EXISTS INTERNALORDER_ITEM(roid INTEGER, SKUId INTEGER, description VARCHAR(20), price REAL, quantity INTEGER, PRIMARY KEY (roid, SKUId))'
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

    getStoredInternalOrderIssued(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM INTERNALORDER WHERE state = "ISSUED"';
            const sql2 = 'SELECT * FROM INTERNALORDER_ITEM';
            db.all(sql1, [], (err, internalrows) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.all(sql2, [], (err, itemrows) => {
                const internalorder = internalrows.map((r) => (
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
    }
}

/* Export class InternalOrder_DAO with methods */

module.exports = InternalOrder_DAO;
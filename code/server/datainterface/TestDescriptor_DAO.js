'use strict';

const res = require("express/lib/response");

class testDescriptor_DAO{

    constructor() { }

    dropTable(){

    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS testDescriptor( id INTEGER PRIMARY KEY AUTOINCREMENT,  name VARCHAR(20), procedureDescription VARCHAR(50), skuId INTEGER, FOREIGN KEY (skuId) REFERENCES SKU(id))';
            db.run(sql, (err) => {
              if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });

        });  
    }

    storeTestDescriptor(db, data) {
        
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO testDescriptor (id,  name, procedureDescription, skuId) VALUES (?, ?, ?, ? )';
            db.run(sql, [data.id, data.name, data.procedureDescription, data.skuId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getStoredTestDescriptors(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM testDescriptor';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testDescs = rows.map((r) => (
                    {
                        id: r.id,
                        name: r.name,
                        procedureDescription: r.procedureDescription,
                        skuId: r.skuId
                        
                    }
                ));
                resolve(testDescs);
            });
        });
    }

    getTestDescriptorbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count, * FROM testDescriptor WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    resolve(undefined)
                }
                else {
                    resolve({
                        id: r.id,
                        name: r.name,
                        procedureDescription: r.procedureDescription,
                        skuId: r.skuId
                    });
                }
            });
        });
    }

    // delete test desc
    deleteTesDescriptor(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM testDescriptor WHERE id = ?';
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


    ///TO MODIFYYYYYYY  i did not manage the case in which some fields are empty
    updateTestDescriptor(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE testDescriptor SET  name = ?, procedureDescription = ?, skuId = ? WHERE id = ?';
                    db.run(sql2, [data.name, data.procedureDescription, data.skuId, id], (err) => {
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
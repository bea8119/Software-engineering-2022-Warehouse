'use strict';

class TestDescriptor_DAO {

    constructor() { }



    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS testDescriptor(id INTEGER PRIMARY KEY AUTOINCREMENT,  name VARCHAR(20), procedureDescription VARCHAR(50), skuId INTEGER, FOREIGN KEY (skuId) REFERENCES SKU(id))';
            db.run(sql, (err) => {
              if (err) {
                    reject(err);
                }
                resolve();
            });

        });  
    }

   

    storeTestDescriptor(db, data) {

        return new Promise((resolve, reject) => {
            const sql1 = ' SELECT COUNT(*) AS count FROM SKU WHERE id = ?';
            db.get(sql1, [data.idSKU], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error('ID sku not found')); // AGREGAR ESTE
                } else {

                    const sql = 'INSERT INTO testDescriptor (id,  name, procedureDescription, skuId) VALUES (?, ?, ?, ? )';
                    db.run(sql, [data.id, data.name, data.procedureDescription, data.idSKU], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    getStoredTestDescriptors(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM testDescriptor';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const testDescs = rows.map((r) => (
                    {
                        id: r.id,
                        name: r.name,
                        procedureDescription: r.procedureDescription,
                        idSKU: r.skuId

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
                    reject(new Error('ID not found'));
                }
                else {
                    resolve({
                        id: r.id,
                        name: r.name,
                        procedureDescription: r.procedureDescription,
                        idSKU: r.skuId
                    });
                }
            });
        });
    }

    // delete test desc
    deleteTestDescriptor(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM testDescriptor WHERE id = ?';
                    db.run(sql2, [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
            })
        });
    }


    updateTestDescriptor(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error('ID not found'));
                } else {
                    const sql1=' SELECT COUNT(*) AS count FROM SKU WHERE id = ?';
            db.get(sql1, [data.newIdSKU], (err, r) => {
                if(err){
                    reject(err);
                }
                else if(r.count === 0){
                    reject(new Error('ID sku not found'));
                } else{
                    const sql2 = 'UPDATE testDescriptor SET name = ?, procedureDescription = ?, skuId = ? WHERE id = ?';
                    db.run(sql2, [data.newName, data.newProcedureDescription, data.newIdSKU, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
                  });
                }
        });
    })
}


    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE IF EXISTS testDescriptor';
            db.run(sql1, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

}



/* Export class TestDescriptor_DAO with methods */

module.exports = TestDescriptor_DAO;

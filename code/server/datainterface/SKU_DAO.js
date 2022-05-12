'use strict';

const res = require("express/lib/response");

class SKU_DAO {

    constructor() { }

    /* -- Interface methods -- */

    

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR(20), weight INTEGER, volume INTEGER, notes VARCHAR(20), position VARCHAR(20), availableQuantity INTEGER, price REAL)';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }


    storeSKU(db, data) {

        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO SKU (id,  description, weight, volume, notes, position, availableQuantity, price) VALUES (?, ?, ?, ? ,? ,? ,?, ?)';
            db.run(sql, [data.id, data.description, data.weight, data.volume, data.notes, null, data.availableQuantity, data.price], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    findSKUbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    resolve(0);
                }
                else {
                    resolve(1);
                }
            });
        });
    }

    findPosbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?'
            db.get(sql, [id], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    resolve(0)
                }
                else {
                    resolve(1);
                }
            });
        });
    }

    getStoredSKU(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                /*const sql2= 'SELECT id, COUNT(*) AS count FROM TESTDESCRIPTOR WHERE skuId = ?';
                db.get(sql2, [], (err, r) => { 
                    if(err){
                        reject(err);
                    return;
                      }
                      if(count > 0){
                          const testdesc= r.map((t) => ({testDescriptor: t.id}));
                      }

                }); */
                const skus = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        weight: r.weight,
                        volume: r.volume,
                        notes: r.notes,
                        position: r.position,
                        availableQuantity: r.availableQuantity,
                        price: r.price,
                    
                    }
                ));
                resolve(skus);
            });
        });
    }

    getSKUbyID(db, id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE id = ?';
            db.get(sql, [id], (err, r) => {
                if (err){
                    reject(err);
                    return;
                }
                else {
                    const sku= {
                        id: r.id,
                        description: r.description,
                        weight: r.weight,
                        volume: r.volume,
                        notes: r.notes,
                        position: r.position,
                        availableQuantity: r.availableQuantity,
                        price: r.price
                    };
                    resolve(sku);
                }
            });
        });
    }


    // delete sku by id
    deleteSKU(db, id) {
       
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKU WHERE id = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM SKU WHERE id = ?';
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

    //update SKU
    // NEED TO REMOVE THE OLD WEIGHT FROM POSITION AND PUT NEW ONE
    updateSKU(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT * FROM SKU WHERE id = ?';
            const sql2 = 'UPDATE SKU SET description = ?, weight = ?, volume= ?, notes= ?  availableQuantity = ?, price= ? WHERE id = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }  else {
                    if(r.position !== null){
                    let posit = r.position;
                    const sql3 = 'SELECT maxWeight, maxVolume, occupiedWeight, occupiedVolume FROM POSITION WHERE id = ?';
                    db.get(sql3, [posit], (err, p) => {
                        if (err) {
                            reject(err);
                            return;
                        } else if ((data.newWeight * data.newAvailableQuantity + p.occupiedWeight - r.weight*r.availableQuantity) > p.maxWeight || (data.newVolume * data.newAvailableQuantity + p.occupiedVolume - r.volume*r.availableQuantity) > p.maxVolume) {
                            reject(new Error("Maximum position capacity exceeded"));
                            return;
                        } else {
                            const sql4 = 'UPDATE POSITION SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
                            db.run(sql4, [(p.occupiedWeight + data.newWeight * data.newAvailableQuantity - r.weight*r.availableQuantity), (p.occupiedVolume + data.newVolume * data.newAvailableQuantity - r.volume*r.availableQuantity), posit], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                            
                           // const sql2 = 'UPDATE SKU SET description = ?, weight = ?, volume= ?, notes= ?  availableQuantity = ?, price= ? WHERE id = ?';
                            db.run(sql2, [data.newDescription, data.newWeight, data.newVolume, data.newAvailableQuantity, data.newPrice, id], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        };
                    });
                }
                else{
                    
                            db.run(sql2, [data.newDescription, data.newWeight, data.newVolume, data.newAvailableQuantity, data.newPrice, id], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });

                }
            }
            });
        });
    }

    //update SKU position
    /* 1. check se l'id sku esiste (secondo me creiamo una funzione per questo check in ogni classe perchè ci torna utile)
2. check se position id passato esiste
3. check se pos max weight e max vol son abbastanza per mettere l' sku nella nuova posizione
4. prendere la posizione vecchia e rimuovere sku weight e volume occupati
5. prendere posizione nuova e aggiungere sku weight and volume occupati
6. update sku con la nuova posizione*/

    updateSKUposition(db, id, pos) {
        let posit=pos.position;
        const oldSku = this.getSKUbyID(db, id);
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION WHERE positionID = ?';
            const sql1 = 'UPDATE POSITION SET  occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
            db.get(sql, [posit], (err, p) => {
                console.log(p.occupiedWeight);
                console.log(oldSku.weight);
               
                if ((oldSku.weight * oldSku.availableQuantity + p.occupiedWeight) > p.maxWeight || (oldSku.volume * oldSku.availableQuantity + p.occupiedVolume) > p.maxVolume) {
                    reject(new Error("Maximum position capacity exceeded"));
                    return;
                }

                if (err) {
                    reject(err);
                    return;
                } else {

                    db.run(sql1, [(p.occupiedWeight + oldSku.weight*oldSku.availableQuantity), (p.occupiedVolume + oldSku.volume * oldSku.availableQuantity), posit], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                    });


                }

            });
            if(oldSku.position !== null){
            db.get(sql, [oldSku.position], (err, p) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    db.run(sql1, [(p.occupiedWeight - oldSku.weight * oldSku.availableQuantity), (p.occupiedVolume - oldSku.volume * oldSku.availableQuantity), oldSku.position], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                    });


                }
            }); }
            const sql2 = 'UPDATE SKU SET position = ? WHERE id = ?';
            db.run(sql2, [posit, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });



        });



    }

   


    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE SKU';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }


} 



/* Export class SKU_DAO with methods */

module.exports = SKU_DAO;

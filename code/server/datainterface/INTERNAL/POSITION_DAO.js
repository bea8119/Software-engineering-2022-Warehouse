'use strict';

class POSITION_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS POSITION(positionID VARCHAR(20) PRIMARY KEY, aisleID VARCHAR(20), row VARCHAR(20),  col VARCHAR(20), maxWeight INTEGER, maxVolume INTEGER, occupiedWeight INTEGER, occupiedVolume INTEGER)';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });

        });
    }

    /* Post position */

    storePosition(db, data) {
        return new Promise((resolve, reject) => {
           
            const sql = 'INSERT INTO POSITION (positionID,  aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES (?, ?, ?, ? ,? ,? ,?, ?)';
            db.run(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, 0, 0], (err) => {
                if (err) {
                    
                    reject(err);
                }
                resolve();
            });
        });
    }

    /* Get position */

    getStoredPosition(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else{
                const position = rows.map((r) => (
                    {
                        positionID: r.positionID,
                        aisleID: r.aisleID,
                        row: r.row,
                        col: r.col,
                        maxWeight: r.maxWeight,
                        maxVolume: r.maxVolume,
                        occupiedWeight: r.occupiedWeight,
                        occupiedVolume: r.occupiedVolume
                    }
                ));

                resolve(position);
                }
            });
        });
    }

    getStoredPosByID(db, position){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count, * FROM POSITION WHERE positionID = ?'
            db.get(sql, [position], (err, r) => {
                if (err)
                    reject(err);
                else if (r.count === 0) {
                    reject(new Error("ID not found"));
                }
                else {
                    resolve({
                        positionID: r.positionID,
                        aisleID: r.aisleID,
                        row: r.row,
                        col: r.col,
                        maxWeight: r.maxWeight,
                        maxVolume: r.maxVolume,
                        occupiedWeight: r.occupiedWeight,
                        occupiedVolume: r.occupiedVolume
                    });
                }
            });
        });


    }

    

    /* Put position by ID */

    updatePosition(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE POSITION SET positionID = ?,  aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
                    db.run(sql2, [data.newAisleID + data.newRow + data.newCol, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
            })
        });
    }

    

    


    /* Put position ID */

    updatePositionID(db, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?'
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                } else if (r.count === 0) {
                    reject(new Error('ID not found'))
                } else {
                    const sql2 = 'UPDATE POSITION SET positionID = ?  WHERE positionID = ?';
                    db.run(sql2, [data, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                }
            })
        });
    }


    /* Delete position by ID */

    deletePosition(db, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM POSITION WHERE positionID = ?';
            db.get(sql1, [id], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'DELETE FROM POSITION WHERE positionID = ?';
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

    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE IF EXISTS POSITION';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }
}


/* Export class POSITION_DAO with methods */

module.exports = POSITION_DAO;

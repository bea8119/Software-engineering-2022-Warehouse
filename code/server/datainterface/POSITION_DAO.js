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
                    return;
                }
                resolve(this.lastID);
            });

        });
    }

    storePosition(db, data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION (positionID,  aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES (?, ?, ?, ? ,? ,? ,?, ?)';
            db.run(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, 0, 0], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getStoredPosition(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
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
            });
        });
    }

    updatePosition(db, data, positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET positionID = ?,  aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
            db.run(sql, [positionID, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    updatePositionID(db, positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET positionID = ?  WHERE positionID = ?';
            db.run(sql, [data.newPositionID, positionID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    findID(db, positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) FROM POSITION WHERE ID = ?';
            db.run(sql, [positionID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deletePosition(db, data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM POSITION WHERE positionID = ?';
            db.run(sql, [data], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });

    }
}


/* Export class POSITION_DAO with methods */

module.exports = POSITION_DAO;

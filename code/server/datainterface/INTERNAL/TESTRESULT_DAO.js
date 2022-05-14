'use strict';

const res = require("express/lib/response");

class TESTRESULT_DAO {

    constructor() { }

    /* -- Interface methods -- */

    dropTable() {

    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TESTRESULT(id INTEGER PRIMARY KEY AUTOINCREMENT, rfid VARCHAR(32), idTestDescriptor INTEGER, Date VARCHAR(20), Result INTEGER, FOREIGN KEY (rfid) REFERENCES SKUITEM(RFID), FOREIGN KEY (idTestDescriptor) REFERENCES testDescriptor(id))';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    /* Post TestResult */

    storeTestResult(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE RFID = ?'
            db.get(sql1, [data.rfid], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql3 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
                    db.get(sql3, [data.idTestDescriptor], (err, r) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        else if (r.count === 0) {
                            reject(new Error('ID not found'))
                        }
                        else {
                            const sql2 = 'INSERT INTO TESTRESULT(id, rfid, idTestDescriptor, Date, Result) VALUES (?, ?, ?, ?, ?)';
                            db.run(sql2, [data.id, data.rfid, data.idTestDescriptor, data.Date, data.Result], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                        })};
                    });
                }
            });
        });
    }
    
    getTestResultsArraybySkuitemRfid(db, rfid) {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?'
        db.get(sql1, [rfid], (err, r) => {
            if (err) {
                reject(err);
                return;
            }
            else if (r.count === 0) {
                reject(new Error("ID not found"));
                return;
            }
            else {
                const sql2 = 'SELECT * FROM TESTRESULT WHERE rfid = ?';
                db.all(sql2, [rfid], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const testResults = rows.map((r) => (
                        {
                            id: r.id,
                            idTestDescriptor: r.idTestDescriptor,
                            Date: r.Date,
                            Result: r.Result
                        }
                    ));
                    resolve(testResults);
                });
            };
        });
    });
}


getTestResultArraybyidandbySkuitemRfid(db, rfid, id) {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?'
        db.get(sql1, [rfid], (err, r) => {
            if (err) {
                reject(err);
                return;
            }
            else if (r.count === 0) {
                reject(new Error("ID not found"));
                return;
            }
            else {
                const sql3 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE id = ?'
                db.get(sql3, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                else if (r.count === 0) {
                    reject(new Error("ID not found"));
                    return;
                }
                else {
                    //Nested selects
                    const sql2 = 'SELECT * FROM TESTRESULT WHERE rfid = ? AND id = ?';
                    db.all(sql2, [rfid, id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const testResults = rows.map((r) => (
                            {
                                id: r.id,
                                idTestDescriptor: r.idTestDescriptor,
                                Date: r.Date,
                                Result: r.Result
                            } 
                        ));
                        resolve(testResults);
                    });
                    }
                });
            }
        });
    })
}

 /* Delete TestResult by ID */

 deleteTestResult(db, rfid, id) {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?';
        db.get(sql1, [rfid], (err, r) => {
            if (err) {
                reject(err)
                return;
            }
            else if (r.count === 0) {
                reject(new Error('ID not found'))
            }
            else {
                const sql3 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE id = ?';
                db.get(sql3, [id], (err, r) => {
                    if (err) {
                        reject(err)
                        return;
                    }
                    else if (r.count === 0) {
                        reject(new Error('ID not found'))
                    }
                    else {
                        const sql2 = 'DELETE FROM TESTRESULT WHERE rfid = ? AND id = ?';
                        db.run(sql2, [rfid, id], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    }
                });
            }
        });
    });
}

 /* Modify TestResult by ID */

 updateTestResult(db, id, rfid, data) {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?';
        db.get(sql1, [data.newIdTestDescriptor], (err, r) => {
            
            if (err) {
                reject(err)
                return;
            }
            else if (r.count === 0) {
                reject(new Error('ID not found'))
            }
            else {
                const sql2 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?';
                db.get(sql2, [rfid], (err, r) => {
                    
                    if (err) {
                        reject(err)
                        return;
                    }
                    else if (r.count === 0) {
                        reject(new Error('ID not found'))
                    }
                    else {
                        const sql3 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE id = ?';
                        db.get(sql3, [id], (err, r) => {
                            
                            if (err) {
                                reject(err)
                                return;
                            }
                            else if (r.count === 0) {
                                reject(new Error('ID not found'))
                            }
                            else {
                                const sql4 = 'UPDATE TESTRESULT SET idTestDescriptor = ?,  Date = ?, Result = ? WHERE (rfid = ? AND id = ?)';
                                db.run(sql4, [data.newIdTestDescriptor, data.newDate, data.newResult, rfid, id], (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve();
                                })
                            }
                        });
                    }
                });
            }
        });
    });
}


}

/* Export class TESTRESULT_DAO with methods */

module.exports = TESTRESULT_DAO;
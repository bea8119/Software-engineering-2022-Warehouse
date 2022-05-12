'use strict';

const res = require("express/lib/response");

class TESTRESULT_DAO {

    constructor() { }

    /* -- Interface methods -- */

    dropTable() {

    }

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TESTRESULT(id INTEGER PRIMARY KEY AUTOINCREMENT, rfid INTEGER, FOREIGN KEY (rfid) REFERENCES SKUITEM(RFID), idTestDescriptor INTEGER, FOREIGN KEY (idTestDescriptor) REFERENCES testDescriptor(id), Date VARCHAR(20), Result BIT)';
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
        db.get(sql1, [data], (err, r) => {
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
                db.all(sql2, [data], (err, rows) => {
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

getTestResultsArraybySkuitemRfid(db, id, rfid) {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?'
        db.get(sql1, [data], (err, r) => {
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
                db.get(sql3, [data], (err, r) => {
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
                    const sql2 = 'SELECT * FROM (SELECT * FROM TESTRESULT WHERE rfid = ?) WHERE id = ?';
                    db.all(sql2, [data], (err, rows) => {
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

 deleteTestResult(db, id, rfid) {
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
                        const sql2 = 'DELETE FROM (SELECT * FROM TESTRESULT WHERE rfid = ?) WHERE id = ?';
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
        const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE newIdTestDescriptor = ?';
        db.get(sql1, [data.newIdTestDescriptor], (err, r) => {
            if (err) {
                reject(err)
                return;
            }
            else if (r.count === 0) {
                reject(new Error('ID not found'))
            }
            else {
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
                                const sql2 = 'UPDATE TESTRESULT SET newIdTestDescriptor = ?,  newDate = ?, newResult = ? WHERE (rfid = ? AND id = ?)';
                                db.run(sql2, [data.newIdTestDescriptor, data.newDate, data.newResult, rfid, id], (err) => {
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
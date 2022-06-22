'use strict';

class TESTRESULT_DAO {

    constructor() { }

    /* -- Interface methods -- */


    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TESTRESULT(id INTEGER PRIMARY KEY AUTOINCREMENT, rfid VARCHAR(32), idTestDescriptor INTEGER, Date VARCHAR(20), Result INTEGER, FOREIGN KEY (rfid) REFERENCES SKUITEM(RFID), FOREIGN KEY (idTestDescriptor) REFERENCES testDescriptor(id))';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
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
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql3 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?'
                    db.get(sql3, [data.idTestDescriptor], (err, r) => {
                        if (err) {
                            reject(err);
                        }
                        else if (r.count === 0) {
                            reject(new Error('ID not found'))
                        }
                        else {
                            const sql2 = 'INSERT INTO TESTRESULT(id, rfid, idTestDescriptor, Date, Result) VALUES (?, ?, ?, ?, ?)';
                            db.run(sql2, [data.id, data.rfid, data.idTestDescriptor, data.Date, data.Result], (err) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        };
                    });
                }
            });
        });
    }

    getTestResultsArraybySkuitemRfid(db, rfid) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE rfid = ?'
            db.get(sql1, [rfid], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error("ID not found"));
                }
                else {
                    const sql2 = 'SELECT * FROM TESTRESULT WHERE rfid = ?';
                    db.all(sql2, [rfid], (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        const testResults = rows.map((r) => (
                            {
                                id: r.id,
                                idTestDescriptor: r.idTestDescriptor,
                                Date: r.Date,
                                Result: (r.Result) ? true : false
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
            const sql = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE id = ?'
            db.get(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                }
                else if (r.count === 0) {
                    reject(new Error("ID not found"));
                } else {
                    const sql0 = 'SELECT COUNT(*) AS count FROM SKUITEM WHERE rfid = ?'
                    db.get(sql0, [rfid], (err, z) => {
                        if (err) {
                            reject(err);
                        }
                        else if (z.count === 0) {
                            reject(new Error("ID not found"));
                        } else {
                            const sql1 = 'SELECT COUNT(*) AS count2, * FROM TESTRESULT WHERE rfid = ? AND id = ?'
                            db.get(sql1, [rfid, id], (err, s) => {
                                if (err) {
                                    reject(err);
                                }
                                else if (s.count2 === 0) {
                                    reject(new Error("ID not found"));
                                }
                                else {
                                    const testResult =
                                    {
                                        id: s.id,
                                        idTestDescriptor: s.idTestDescriptor,
                                        Date: s.Date,
                                        Result: (s.Result) ? true : false
                                    }
                                    resolve(testResult);
                                }
                            });
                        }
                    })
                }
            })
        })
    }

    /* Delete TestResult by ID */

    deleteTestResult(db, rfid, id) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ?';
            db.get(sql1, [rfid], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql3 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE id = ?';
                    db.get(sql3, [id], (err, r) => {
                        if (err) {
                            reject(err)
                        }
                        else if (r.count === 0) {
                            reject(new Error('ID not found'))
                        }
                        else {
                            const sql2 = 'DELETE FROM TESTRESULT WHERE rfid = ? AND id = ?';
                            db.run(sql2, [rfid, id], (err) => {
                                if (err) {
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

    /* Modify TestResult by ID */

    updateTestResult(db, id, rfid, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count FROM testDescriptor WHERE id = ?';
            db.get(sql1, [data.newIdTestDescriptor], (err, r) => {
                if (err) {
                    reject(err)
                }
                else if (r.count === 0) {
                    reject(new Error('ID not found'))
                }
                else {
                    const sql2 = 'SELECT COUNT(*) AS count FROM TESTRESULT WHERE rfid = ? AND id = ?';
                    db.get(sql2, [rfid, id], (err, r) => {
                        if (err) {
                            reject(err)
                        }
                        else if (r.count === 0) {
                            reject(new Error('ID not found'))
                        }
                        else {
                            const sql3 = 'UPDATE TESTRESULT SET idTestDescriptor = ?,  Date = ?, Result = ? WHERE rfid = ? AND id = ?';
                            db.run(sql3, [data.newIdTestDescriptor, data.newDate, data.newResult, rfid, id], (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();    
                                }
                            });
                        }
                    });
                }
            });
        });
    }


    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql1 = 'DROP TABLE IF EXISTS TESTRESULT';
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

/* Export class TESTRESULT_DAO with methods */

module.exports = TESTRESULT_DAO;
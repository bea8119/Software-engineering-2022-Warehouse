'use strict';

/* md5 password encryption */

const md5 = require("blueimp-md5");

class USER_DAO {

    constructor() { }

    /* -- Interface methods -- */

    newTableName(db) {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS USER(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(30) UNIQUE, name VARCHAR(20), surname VARCHAR(20), password VARCHAR(20), type VARCHAR(20))';
            db.run(sql, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    /* Post user */

    storeUser(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) as count FROM USER WHERE username = ?'
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 1) {
                    reject(new Error('Conflict'));
                } else {
                    const sql2 = 'INSERT INTO USER(username,  name, surname, password, type) VALUES (?, ?, ?, ? ,?)';
                    db.run(sql2, [data.username, data.name, data.surname, md5(data.password), data.type], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        })
    }


    /* Get users */

    getStoredUsers(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type != "manager"';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const user = rows.map((r) => (
                        {
                            id: r.id,
                            name: r.name,
                            surname: r.surname,
                            email: r.username,
                            type: r.type
                        }
                    ));
                    resolve(user);
                }
            });
        });
    }

    /* Get suppliers */

    getStoredSuppliers(db) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type = "supplier"';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const user = rows.map((r) => (
                        {
                            id: r.id,
                            name: r.name,
                            surname: r.surname,
                            email: r.username
                        }
                    ));
                    resolve(user);
                }
            });
        });
    }


    /* Put user type by username */

    updateUserType(db, username, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?'
            db.get(sql1, [username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.type !== data.oldType) {
                    reject(new Error('ID not found')) ////////// AGREGAR ESTE
                } else if (r.type === "administrator" || r.type === "manager") {
                    reject(new Error('Permission not allowed'))
                } else {
                    const sql2 = 'UPDATE USER SET type = ? WHERE username = ?';
                    db.run(sql2, [data.newType, username], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            })
        });
    }


    /* Delete user by username and type */

    deleteUser(db, username, type) {
        return new Promise((resolve, reject) => {
           
                
                    const sql2 = 'DELETE FROM USER WHERE username = ?';
                    db.run(sql2, [username], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });

                
        });
    }


    /* Sessions */

    /* Customer Session */


    customerSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !==  md5(data.password) || r.type !== "customer") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    


    /* Supplier Session */

    
    supplierSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !==  md5(data.password) || r.type !== "supplier") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    

    /* Manager session*/

    
    managerSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !==  md5(data.password) || r.type !== "manager") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    


    /* Clerek session*/

    
    clerkSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !==  md5(data.password) || r.type !== "clerk") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    


    /* Quality Employee session*/

    
    qualityEmployeeSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !== md5(data.password) || r.type !== "qualityEmployee") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    


    /* Delivery Employee session*/

    
    deliveryEmployeeSession(db, data) {
        return new Promise((resolve, reject) => {
            const sql1 = 'SELECT COUNT(*) AS count, * FROM USER WHERE username = ?';
            db.get(sql1, [data.username], (err, r) => {
                if (err) {
                    reject(err);
                } else if (r.count === 0 || r.password !==  md5(data.password) || r.type !== "deliveryEmployee") {
                    reject(new Error('Wrong credentials'));
                }
                else {
                    const userinfo =
                    {
                        id: r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname
                    }
                    resolve(userinfo);
                };

            })
        })
    }
    



    dropTable(db) {
        return new Promise((resolve, reject) => {
            const sql2 = 'DROP TABLE IF EXISTS USER';
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
}



/* Export class USER_DAO with methods */

module.exports = USER_DAO;

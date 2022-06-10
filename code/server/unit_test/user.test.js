const USER_DAO = require('../datainterface/USER/USER_DAO')

const u = new USER_DAO()

const database = require("../database");
const db = database.db;

describe("test user", () => {
    beforeEach(async () => {
        await u.dropTable(db);

        let user1 = {
            username: "user1@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "testpassword",
            type: "customer"
        }

        let user2 = {
            username: "john.snow@supplier.ezwh.com",
            name: "John",
            surname: "Snow",
            password: "testpassword2",
            type: "supplier"
        }

        let user3 = {
            username: "michael.jordan@supplier.ezwh.com",
            name: "Michael",
            surname: "Jordan",
            password: "testpassword3",
            type: "supplier"
        }

        let user4 = {
            username: "massimo.palermo@manager.ezwh.com",
            name: "Massimo",
            surname: "Palermo",
            password: "testpassword4",
            type: "manager"
        }

        let user5 = {
            username: "franco.negri@clerk.ezwh.com",
            name: "Franco",
            surname: "Negri",
            password: "testpassword5",
            type: "clerk"
        }

        let user6 = {
            username: "mariangela.romano@qualityemployee.ezwh.com",
            name: "Mariangela",
            surname: "Romano",
            password: "testpassword6",
            type: "qualityEmployee"
        }

        let user7 = {
            username: "andrea.bindoni@deliveryemployee.ezwh.com",
            name: "Andrea",
            surname: "Bindoni",
            password: "testpassword7",
            type: "deliveryEmployee"
        }

        try {
            await u.newTableName(db);

            //Add users
            await u.storeUser(db, user1); //customer
            await u.storeUser(db, user2); //supplier
            await u.storeUser(db, user3); //supplier
            await u.storeUser(db, user4); //manager
            await u.storeUser(db, user5); //clerk
            await u.storeUser(db, user6); //qualityEmployee
            await u.storeUser(db, user7); //deliveryEmployee

        } catch (err) {
            console.log(err)
        }
    })

    testgetStoredSuppliers();
    testgetStoredUsers();
    testupdateUserType("mariangela.romano@qualityemployee.ezwh.com", "massimo.palermo@manager.ezwh.com"); //correct username change, then invalid permission username
    teststoreUser();
    testdeleteUser("user1@ezwh.com", "customer", "manager");

    //SESSIONS
    testcustomerSession("user1@ezwh.com", "testpassword", "user1@ezwh.cm", "testpassword2");
    testsupplierSession("john.snow@supplier.ezwh.com", "testpassword2", "user1@ezwh.cm", "testpassword");
    testmanagerSession("massimo.palermo@manager.ezwh.com", "testpassword4", "user1@ezwh.cm", "testpassword");
    testclerkSession("franco.negri@clerk.ezwh.com", "testpassword5", "user1@ezwh.cm", "testpassword");
    testqualityEmployeeSession("mariangela.romano@qualityemployee.ezwh.com", "testpassword6", "user1@ezwh.cm", "testpassword");
    testdeliveryEmployeeSession("andrea.bindoni@deliveryemployee.ezwh.com", "testpassword7", "user1@ezwh.cm", "testpassword")
});

function testgetStoredSuppliers() {
    test("Testing getStoredSuppliers", async () => {
        let res = await u.getStoredSuppliers(db);
        expect(res).toEqual(
            [

                {
                    id: 2,
                    name: "John",
                    surname: "Snow",
                    email: "john.snow@supplier.ezwh.com"
                }, {
                    id: 3,
                    name: "Michael",
                    surname: "Jordan",
                    email: "michael.jordan@supplier.ezwh.com"
                }
            ]
        )
    })
}

function testgetStoredUsers() {
    test("Testing getStoredUsers", async () => {
        let res = await u.getStoredUsers(db);
        expect(res).toEqual(
            [
                {
                    id: 1,
                    name: "John",
                    surname: "Smith",
                    email: "user1@ezwh.com",
                    type: "customer"
                }, {
                    id: 2,
                    name: "John",
                    surname: "Snow",
                    email: "john.snow@supplier.ezwh.com",
                    type: "supplier"
                }, {
                    id: 3,
                    name: "Michael",
                    surname: "Jordan",
                    email: "michael.jordan@supplier.ezwh.com",
                    type: "supplier"
                }, {
                    id: 5,
                    name: "Franco",
                    surname: "Negri",
                    email: "franco.negri@clerk.ezwh.com",
                    type: "clerk"
                }, {
                    id: 6,
                    name: "Mariangela",
                    surname: "Romano",
                    email: "mariangela.romano@qualityemployee.ezwh.com",
                    type: "qualityEmployee"
                }, {
                    id: 7,
                    name: "Andrea",
                    surname: "Bindoni",
                    email: "andrea.bindoni@deliveryemployee.ezwh.com",
                    type: "deliveryEmployee"
                }
            ]
        )
    })
}

function teststoreUser() {
    user8 = {
        "username": "user8@ezwh.com",
        "name": "User",
        "surname": "8",
        "password": "testpassword8",
        "type": "customer"
    }

    existingusername = {
        "username": "user1@ezwh.com",
        "name": "User",
        "surname": "8",
        "password": "testpassword8",
        "type": "customer"
    }

    describe('Testing storeUser', () => {
        test('User data correct', async () => {
            await u.storeUser(db, user8);
            var res = await u.getStoredUsers(db);
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        name: "John",
                        surname: "Smith",
                        email: "user1@ezwh.com",
                        type: "customer"
                    }, {
                        id: 2,
                        name: "John",
                        surname: "Snow",
                        email: "john.snow@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 3,
                        name: "Michael",
                        surname: "Jordan",
                        email: "michael.jordan@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 5,
                        name: "Franco",
                        surname: "Negri",
                        email: "franco.negri@clerk.ezwh.com",
                        type: "clerk"
                    }, {
                        id: 6,
                        name: "Mariangela",
                        surname: "Romano",
                        email: "mariangela.romano@qualityemployee.ezwh.com",
                        type: "qualityEmployee"
                    }, {
                        id: 7,
                        name: "Andrea",
                        surname: "Bindoni",
                        email: "andrea.bindoni@deliveryemployee.ezwh.com",
                        type: "deliveryEmployee"
                    }, {
                        id: 8,
                        name: "User",
                        surname: "8",
                        email: "user8@ezwh.com",
                        type: "customer"
                    }
                ]
            )
        })

        test('Username exists', async () => {
            await expect(u.storeUser(db, existingusername)).rejects.toThrow('Conflict');
        })
    })
}

function testdeleteUser(username, type, invalidtype) {
    describe('Testing deleteUser', () => {
        test('User data correct', async () => {
            await u.deleteUser(db, username, type);
            var res = await u.getStoredUsers(db);
            expect(res).toEqual(
                [
                    {
                        id: 2,
                        name: "John",
                        surname: "Snow",
                        email: "john.snow@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 3,
                        name: "Michael",
                        surname: "Jordan",
                        email: "michael.jordan@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 5,
                        name: "Franco",
                        surname: "Negri",
                        email: "franco.negri@clerk.ezwh.com",
                        type: "clerk"
                    }, {
                        id: 6,
                        name: "Mariangela",
                        surname: "Romano",
                        email: "mariangela.romano@qualityemployee.ezwh.com",
                        type: "qualityEmployee"
                    }, {
                        id: 7,
                        name: "Andrea",
                        surname: "Bindoni",
                        email: "andrea.bindoni@deliveryemployee.ezwh.com",
                        type: "deliveryEmployee"
                    }
                ]
            )
        })
    })
}

function testupdateUserType(username, invalidusername) {
    UserTypeUpdate = {
        oldType: "qualityEmployee",
        newType: "clerk"
    }

    invalidtype = {
        oldType: "manager",
        newType: "clerk"
    }

    describe('Testing updateUserType', () => {
        test('Username and data correct, permissions allowed', async () => {
            await u.updateUserType(db, username, UserTypeUpdate);
            var res = await u.getStoredUsers(db);
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        name: "John",
                        surname: "Smith",
                        email: "user1@ezwh.com",
                        type: "customer"
                    }, {
                        id: 2,
                        name: "John",
                        surname: "Snow",
                        email: "john.snow@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 3,
                        name: "Michael",
                        surname: "Jordan",
                        email: "michael.jordan@supplier.ezwh.com",
                        type: "supplier"
                    }, {
                        id: 5,
                        name: "Franco",
                        surname: "Negri",
                        email: "franco.negri@clerk.ezwh.com",
                        type: "clerk"
                    }, {
                        id: 6,
                        name: "Mariangela",
                        surname: "Romano",
                        email: "mariangela.romano@qualityemployee.ezwh.com",
                        type: "clerk" //Expected update
                    }, {
                        id: 7,
                        name: "Andrea",
                        surname: "Bindoni",
                        email: "andrea.bindoni@deliveryemployee.ezwh.com",
                        type: "deliveryEmployee"
                    }
                ]
            )
        })

        test('Username and data correct, permissions not allowed', async () => {
            await expect(u.updateUserType(db, invalidusername, invalidtype)).rejects.toThrow('Permission not allowed');
        })
    })
}

//SESSIONS


function testcustomerSession(username, password, wrongusername, wrongpassword) {
    describe('Testing customerSession', () => {

        data = {
            username: username,
            password: password
        }

        data2 = {
            username: wrongusername,
            password: password
        }

        data3 = {
            username: username,
            password: wrongpassword
        }

        test('username and password existing', async () => {
            var res = await u.customerSession(db, data);
            expect(res).toEqual(
                {
                    id: 1,
                    username: "user1@ezwh.com",
                    name: "John",
                    surname: "Smith"
                }
            )
        });

        test('username not existing, password correct', async () => {
            await expect(u.customerSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            await expect(u.customerSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

function testsupplierSession(username, password, wrongusername, wrongpassword) {
    describe('Testing supplierSession', () => {

        test('username and password existing', async () => {
            data = {
                username: username,
                password: password
            }
            var res = await u.supplierSession(db, data);
            expect(res).toEqual(
                {
                    id: 2,
                    username: "john.snow@supplier.ezwh.com",
                    name: "John",
                    surname: "Snow"
                }
            )
        });

        test('username not existing, password correct', async () => {
            data2 = {
                username: wrongusername,
                password: password
            }
            await expect(u.supplierSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            data3 = {
                username: username,
                password: wrongpassword
            }
            await expect(u.supplierSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

function testmanagerSession(username, password, wrongusername, wrongpassword) {
    describe('Testing managerSession', () => {

        test('username and password existing', async () => {
            data = {
                username: username,
                password: password
            }
            var res = await u.managerSession(db, data);
            expect(res).toEqual(
                {
                    id: 4,
                    username: "massimo.palermo@manager.ezwh.com",
                    name: "Massimo",
                    surname: "Palermo"
                }
            )
        });

        test('username not existing, password correct', async () => {

            data2 = {
                username: wrongusername,
                password: password
            }
            await expect(u.managerSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            data3 = {
                username: username,
                password: wrongpassword
            }
            await expect(u.managerSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

function testclerkSession(username, password, wrongusername, wrongpassword) {
    describe('Testing clerkSession', () => {

        test('username and password existing', async () => {
            data = {
                username: username,
                password: password
            }
            var res = await u.clerkSession(db, data);
            expect(res).toEqual(
                {
                    id: 5,
                    username: "franco.negri@clerk.ezwh.com",
                    name: "Franco",
                    surname: "Negri"
                }
            )
        });

        test('username not existing, password correct', async () => {
            data2 = {
                username: wrongusername,
                password: password
            }
            await expect(u.clerkSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            data3 = {
                username: username,
                password: wrongpassword
            }
            await expect(u.clerkSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

function testqualityEmployeeSession(username, password, wrongusername, wrongpassword) {
    describe('Testing qualityEmployeeSession', () => {


        test('username and password existing', async () => {
            data = {
                username: username,
                password: password
            }
            var res = await u.qualityEmployeeSession(db, data);
            expect(res).toEqual(
                {
                    id: 6,
                    username: "mariangela.romano@qualityemployee.ezwh.com",
                    name: "Mariangela",
                    surname: "Romano"
                }
            )
        });

        test('username not existing, password correct', async () => {
            data2 = {
                username: wrongusername,
                password: password
            }
            await expect(u.qualityEmployeeSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            data3 = {
                username: username,
                password: wrongpassword
            }
            await expect(u.qualityEmployeeSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

function testdeliveryEmployeeSession(username, password, wrongusername, wrongpassword) {
    describe('Testing deliveryEmployeeSession', () => {
        test('username and password existing', async () => {
            data = {
                username: username,
                password: password
            }
            var res = await u.deliveryEmployeeSession(db, data);
            expect(res).toEqual(
                {
                    id: 7,
                    username: "andrea.bindoni@deliveryemployee.ezwh.com",
                    name: "Andrea",
                    surname: "Bindoni"
                }
            )
        });

        test('username not existing, password correct', async () => {
            data2 = {
                username: wrongusername,
                password: password
            }
            await expect(u.deliveryEmployeeSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            data3 = {
                username: username,
                password: wrongpassword
            }
            await expect(u.deliveryEmployeeSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

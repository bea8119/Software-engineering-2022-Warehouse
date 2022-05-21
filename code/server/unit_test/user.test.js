const USER_DAO = require('../datainterface/USER/USER_DAO')

const u = new USER_DAO()

const database = require("../database");
const db = database.db;

describe("test user", () => {
    beforeEach(async () => {
        await u.dropTable(db);

        let user1 = { 
            username:"user1@ezwh.com",
            name:"John",
            surname: "Smith",
            password: "testpassword",
            type: "customer"
        }

        let user2 = { 
            username:"john.snow@supplier.ezwh.com",
            name:"John",
            surname: "Snow",
            password: "testpassword2",
            type: "supplier"
        }

        let user3 = { 
            username:"michael.jordan@supplier.ezwh.com",
            name:"Michael",
            surname: "Jordan",
            password: "testpassword3",
            type: "supplier"
        }

        //ADD MORE USERS

        try {
            await u.newTableName(db);
            
            //Add users
            await u.storeUser(db, user1); //customer
            await u.storeUser(db, user2); //supplier
            await u.storeUser(db, user3); //supplier
            //ADD MORE USERS

        } catch (err) {
            console.log(err)
        }
    })

    testgetStoredSuppliers();
    testgetStoredUsers(); //NOT MANAGER. TODO
    testupdateUserType(1, ); // TODO
    teststoreUser(); //TODO --> Depends on the number of users
    testdeleteUser(); //TODO

    //SESSIONS
    testcustomerSession("user1@ezwh.com", "testpassword", "user1@ezwh.cm", "testpassword2");
    testsupplierSession("john.snow@supplier.ezwh.com", "testpassword2", "user1@ezwh.cm", "testpassword");
    //TODO

});

function testgetStoredSuppliers() {
    test("Testing getStoredSuppliers", async () => {
        let res = await u.getStoredSuppliers(db)
        expect(res).toEqual(
            [
                {
                    id:2,
                    name:"John",
                    surname:"Snow",
                    email:"john.snow@supplier.ezwh.com"
                },{
                    id:3,
                    name:"Michael",
                    surname:"Jordan",
                    email:"michael.jordan@supplier.ezwh.com"
                }
            ]
        )
    })
}

function testupdateUserType(username, wrongusername) {
    UserTypeUpdate = {
        oldType : "qualityEmployee",
        newType : "clerk"
    }

    wrongUserTypeUpdate = {
        oldType : "qualityEmployee",
        newType : "clerkk"
    }

    describe('Testing updateUserType', () => {
        test('Username and data correct, permissions allowed', async () => {
            await u.updateUserType(db, username, UserTypeUpdate)
            //var res = await u.getStoredUsers(db, rfid, id); DE ACÁ EN ADELANTE ACTUALIZARS, COMO MANAGE THE USER UPDATE CHECK
            expect(res).toEqual(
                {
                    id:2,
                    idTestDescriptor: 1,
                    Date: "2021/11/28",
                    Result: true
                }
            )
        })

        test('rfid and id existing and idTestDescriptor not existing', async () => {
            await expect(tr.updateTestResult(db, rfid, id, wrongtestResultUpdate)).rejects.toThrow('ID not found');
        })

        test('rfid not existing, id and idTestDescriptor existing', async () => {
            await expect(tr.updateTestResult(db, wrongrfid, id, testResultUpdate)).rejects.toThrow('ID not found');
        })

        test('rfid and idTestDescriptor existing, id not existing ', async () => {
            await expect(tr.updateTestResult(db, rfid, wrongid, testResultUpdate)).rejects.toThrow('ID not found');
        })
    })
}

//SESSIONS

function testcustomerSession(username, password, wrongusername, wrongpassword) {
    describe('Testing customerSession', () => {

        data = {
            username : username,
            password : password
        }

        data2 = {
            username : wrongusername,
            password : password
        }

        data3 = {
            username : username,
            password : wrongpassword
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

        data = {
            username : username,
            password : password
        }

        data2 = {
            username : wrongusername,
            password : password
        }

        data3 = {
            username : username,
            password : wrongpassword
        }

        test('username and password existing', async () => {
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
            await expect(u.supplierSession(db, data2)).rejects.toThrow('Wrong credentials');
        })

        test('username correct, password not existing', async () => {
            await expect(u.supplierSession(db, data3)).rejects.toThrow('Wrong credentials');
        })
    })
}

//TO BE CONTINUED...
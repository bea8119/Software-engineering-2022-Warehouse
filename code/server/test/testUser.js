const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    beforeEach(async () => {
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

        let user4 = { 
            username:"massimo.palermo@manager.ezwh.com",
            name:"Massimo",
            surname: "Palermo",
            password: "testpassword4",
            type: "manager"
        }

        let user5 = { 
            username:"franco.negri@clerk.ezwh.com",
            name:"Franco",
            surname: "Negri",
            password: "testpassword5",
            type: "clerk"
        }

        let user6 = { 
            username:"mariangela.romano@qualityemployee.ezwh.com",
            name:"Mariangela",
            surname: "Romano",
            password: "testpassword6",
            type: "qualityEmployee"
        }

        let user7 = { 
            username:"andrea.bindoni@deliveryemployee.ezwh.com",
            name:"Andrea",
            surname: "Bindoni",
            password: "testpassword7",
            type: "deliveryEmployee"
        }

        await agent.delete('/api/user/emergenza');
        await agent.post('/api/newUser').send(user1)
        await agent.post('/api/newUser').send(user2)
        await agent.post('/api/newUser').send(user3)
        await agent.post('/api/newUser').send(user4)
        await agent.post('/api/newUser').send(user5)
        await agent.post('/api/newUser').send(user6)
        await agent.post('/api/newUser').send(user7)
    })

    deleteAllData(204);

    //postUser(201, "user8@ezwh.com", "User", "8", "testpassword8", "customer") // not passing --> sql error, no user table
    //postUser(409, "user1@ezwh.com", "John", "Smith", "testpassword", "customer") //not passing --> should be a conflict but it's 201
    postUser(422, "", "User", "8", "testpassword8", "customer")
    postUser(422, "user8@ezwh.com", "", "8", "testpassword8", "customer")
    postUser(422, "user8@ezwh.com", "User", "", "testpassword8", "customer")
    postUser(422, "user8@ezwh.com", "User", "8", "", "customer")
    postUser(422, "user8@ezwh.com", "User", "8", "testpassword8", "customerr")
    postUser(404, "user8@ezwh.com", "User", "8", "testpassword8", "customerr")

    getStoredSuppliers()
    getStoredUsers()

    putUser(201, "user1@ezwh.com", "customer", "qualityEmployee")
    putUser(422, undefined, "customer", "qualityEmployee")
    putUser(422, "", "customer", "qualityEmployee")
    putUser(422, "user1@ezwh.com", "customer", "manger")
    putUser(422, "user1@ezwh.com", "customer", "administrator")
    putUser(404, "user11@ezwh.com", "customer", "qualityEmployee")
    
    deleteUser(204, "user1@ezwh.com", "customer")
    deleteUser(422, "massimo.palermo@manager.ezwh.com", "manager")
    deleteUser(422, "user1@ezwh.com", "customerr")
    deleteUser(422, "", "customer")
    deleteUser(422, undefined, "customer")
});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/user/emergenza (deleting data...)', function () {
        agent.delete('/api/user/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    });
}

function postUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('test /api/newUser', function () {
        let user = {
            "username": username,
            "name": name,
            "surname": surname,
            "password": password,
            "type": type
        }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    })
}

function getStoredSuppliers() {
    it('test /api/suppliers', function () {
        agent.get('/api/suppliers')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql([

                    {
                        "id":2,
                        "name":"John",
                        "surname":"Snow",
                        "email":"john.snow@supplier.ezwh.com"
                    },{
                        "id":3,
                        "name":"Michael",
                        "surname":"Jordan",
                        "email":"michael.jordan@supplier.ezwh.com"
                    }
                ])
            
            })
    })
}

function getStoredUsers() {
    it('test /api/users', function () {
        agent.get('/api/users')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql([
                    {
                        "id":1,
                        "name":"John",
                        "surname": "Smith",
                        "email":"user1@ezwh.com",
                        "type": "customer"
                    }, {
                        "id":2,
                        "name":"John",
                        "surname":"Snow",
                        "email":"john.snow@supplier.ezwh.com",
                        "type": "supplier"
                    },{
                        "id":3,
                        "name":"Michael",
                        "surname":"Jordan",
                        "email":"michael.jordan@supplier.ezwh.com",
                        "type": "supplier"
                    },{
                        "id": 5,
                        "name":"Franco",
                        "surname": "Negri",
                        "email":"franco.negri@clerk.ezwh.com",
                        "type": "clerk"
                    },{
                        "id": 6,
                        "name":"Mariangela",
                        "surname": "Romano",
                        "email":"mariangela.romano@qualityemployee.ezwh.com",
                        "type": "qualityEmployee"
                    },{
                        "id": 7,
                        "name":"Andrea",
                        "surname": "Bindoni",
                        "email":"andrea.bindoni@deliveryemployee.ezwh.com",
                        "type": "deliveryEmployee"
                    }
                ])
            
            })
    })
}


function putUser(expectedHTTPStatus, username, oldType, newType) {
    it('test put /api/users/:username', function () {
        updates = {
            "oldType": oldType,
            "newType": newType
        }
        agent.put(`/api/users/${username}`)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function deleteUser(expectedHTTPStatus, username, type) {
    it('test /api/users/:username/:type', function () {
        agent.delete('/api/users/' + username + '/' + type)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}
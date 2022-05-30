const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test TestDescriptor apis', () => {

    beforeEach(async () => {
        let sku1 = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let sku2 = {
            description : "another sku",
            weight : 101,
            volume : 60,
            notes : "second SKU",
            price : 10.99,
            availableQuantity : 55
        }

        let testDescriptor1 = {
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testDescriptor2 = {
            name:"test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU :2
        }

        await agent.delete('/api/sku/emergenza');
        await agent.delete('/api/testDescriptor/emergenza/superermergenza');

        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/sku').send(sku2);
        await agent.post('/api/testDescriptor').send(testDescriptor1);
        await agent.post('/api/testDescriptor').send(testDescriptor2);

    })

    deleteAllData(204);
    getTestDescriptorbyID();
    getTestDescriptors();

    postTestDescriptor(201, "test descriptor 3", "This test is described by...", 1);
    postTestDescriptor(422, "", "This test is described by...", 1);
    postTestDescriptor(422, undefined, "This test is described by...", 1);
    postTestDescriptor(422, "test descriptor 3", "", 1);
    postTestDescriptor(422, "test descriptor 3", undefined, 1);
    postTestDescriptor(422, "test descriptor 3", "This test is described by...", undefined);
    postTestDescriptor(422, "test descriptor 3", "This test is described by...", null);
    postTestDescriptor(422, "test descriptor 3", "This test is described by...", "a");
    postTestDescriptor(404, "test descriptor 3", "This test is described by...", 0);

    getTestDescriptorbyIDError(404, 0) //--> Not passing (422 pasa);
    getTestDescriptorbyIDError(422, undefined);
    getTestDescriptorbyIDError(422, null);
    getTestDescriptorbyIDError(422, "a");
   
    putTestDescriptor(200, 1, "new name", "new description", 2);
    putTestDescriptor(422, 1, "", "new description", 2);
    putTestDescriptor(422, 1, undefined, "new description", 2);
    putTestDescriptor(422, 1, "new name", "", 2);
    putTestDescriptor(422, 1, "new name", undefined, 2);
    putTestDescriptor(422, 1, "new name", "new description", null);
    putTestDescriptor(422, 1, "new name", "new description", undefined);
    putTestDescriptor(422, 1, "new name", "new description", "a");
    putTestDescriptor(404, 1, "new name", "new description", 0);
    putTestDescriptor(404, 3, "new name", "new description", 2);

    deleteTestDescriptor(204, 2)
    deleteTestDescriptor(422, "a")
    deleteTestDescriptor(422, undefined)
    deleteTestDescriptor(422, 3)
});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/testDescriptor/emergenza/superermergenza (deleting data...)', async () => {
        await agent.delete('/api/testDescriptor/emergenza/superermergenza')
            .then(function (res) {
                console.log(res.status)
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function postTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('test post /api/testDescriptor', async () => {
        let testDescriptor = {
            "name": name,
            "procedureDescription": procedureDescription,
            "idSKU": idSKU
        }
        await agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    })
}

function getTestDescriptorbyID() {
    it('test get /api/testDescriptors/:id (correct id)', async () => {
        await agent.get('/api/testDescriptors/1')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    {
                        "id":1,
                        "name": "test descriptor 1",
                        "procedureDescription": "This test is described by...",
                        "idSKU": 1
                    }
                )
            });
    });
}

function getTestDescriptorbyIDError(expectedHTTPStatus, id) {
    it('test get /api/testDescriptors/:id (wrong id)', async () => {
        await agent.get('/api/testDescriptors/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
        });
    });
}

function getTestDescriptors() {
    it('test get /api/testDescriptors', async () => {
        await agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql([
                    {
                        "id": 1,
                        "name": "test descriptor 1",
                        "procedureDescription": "This test is described by...",
                        "idSKU": 1
                    },
                    {
                        "id": 2,
                        "name": "test descriptor 2",
                        "procedureDescription": "This test is described by...",
                        "idSKU":  2
                    },
                ])
            })
    })
}

function putTestDescriptor(expectedHTTPStatus, id, newName, newProcedureDescription, newIdSKU) {
    it('test put /api/testDescriptor/:id', async () => {
        updates = {
            "newName":newName,
            "newProcedureDescription":newProcedureDescription,
            "newIdSKU":newIdSKU
        }
        await agent.put(`/api/testDescriptor/${id}`)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function deleteTestDescriptor(expectedHTTPStatus, id) {
    it('test delete /api/testDescriptor/:id', async () => {
        await agent.delete('/api/testDescriptor/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}
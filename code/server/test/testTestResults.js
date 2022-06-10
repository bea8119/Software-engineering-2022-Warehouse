const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test testResult apis', () => {

    beforeEach(async () => {
        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let skuitem1 = {
            RFID: "12345678901234567890123456789747",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let testDescriptor1 = {
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testDescriptor2 = {
            name: "test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testResult1 = {
            rfid: "12345678901234567890123456789747",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: true
        }

        let testResult2 = {
            rfid: "12345678901234567890123456789747",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: true
        }

        await agent.delete('/api/skuitem/emergenza');
        await agent.delete('/api/sku/emergenza')
        await agent.delete('/api/testDescriptor/emergenza/superermergenza')
        await agent.delete('/api/skuitems/rfid/testResults/emergenza')

        await agent.post('/api/sku').send(sku)
        await agent.post('/api/skuitem').send(skuitem1)
        await agent.post('/api/testDescriptor').send(testDescriptor1)
        await agent.post('/api/testDescriptor').send(testDescriptor2)
        await agent.post('/api/skuitems/testResult').send(testResult1)
        await agent.post('/api/skuitems/testResult').send(testResult2)

    })
    
    deleteAllData(204); 

    postTestResult(201, "12345678901234567890123456789747", 1, "2021/11/29 12:30", true);
    postTestResult(201, "12345678901234567890123456789747", 1, "2021/11/29", true);
    postTestResult(422, "12345678901234567890123456789747", 1, "", true);
    postTestResult(422, "12345678901234567890123456789747", 1, undefined, true);
    postTestResult(422, "12345678901234567890123456789747", 1, "2021/11/29 12:30", "not boolean");
    postTestResult(422, "1234567890123456789012345678974", 1, "2021/11/29 12:30", true);
    postTestResult(422, 12345678901234567890123456789747, 1, "2021/11/29 12:30", true);
    postTestResult(404, "12345678901234567890123456789747", 0, "2021/11/29 12:30", true);
    postTestResult(404, "12345678901234567890123456789777", 1, "2021/11/29 12:30", true);

    getTestResultByRFID()
    getTestResultByRFIDError(422, "1234567890123456789012345678974")
    getTestResultByRFIDError(422, "abcd")
    getTestResultByRFIDError(404, "12345678901234567890123456789777")
    
    getTestResultByRFIDandID()
    //getTestResultByRFIDandIDError(422, "1234567890123456789012345678974", 1)
    //getTestResultByRFIDandIDError(422, "abcd", 1)
    //getTestResultByRFIDandIDError(422, "12345678901234567890123456789747", "abcd")
    //getTestResultByRFIDandIDError(404, "12345678901234567890123456789777", 1)
    //getTestResultByRFIDandIDError(404, "12345678901234567890123456789747", 0)

    putTestResult(200, "12345678901234567890123456789747", 1, 2, "2021/11/29 12:30", false) //--> ya no pasa porque the system is not populating (borré el test descriptor 2 en el test anterior y no se recuperó)
    putTestResult(200, "12345678901234567890123456789747", 1, 2, "2021/11/29", false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, "", false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, undefined, false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, "2021/11/29 12:30", "not boolean")
    putTestResult(422, "1234567890123456789012345678974", 1, 2, "2021/11/29 12:30", true)
    putTestResult(422, 12345678901234567890123456789747, 1, 2, "2021/11/29 12:30", true)
    putTestResult(422, "12345678901234567890123456789747", undefined, 2, "2021/11/29 12:30", true)
    putTestResult(422, "12345678901234567890123456789747", null, 2, "2021/11/29 12:30", true)
    putTestResult(404, "12345678901234567890123456789777", 1, 1, "2021/11/29 12:30", true)
    putTestResult(404, "12345678901234567890123456789747", 3, 1, "2021/11/29 12:30", true)

    deleteTestResult(204, "12345678901234567890123456789747", 1)
    deleteTestResult(422, "1234567890123456789012345678974", 1)
    deleteTestResult(422, 12345678901234567890123456789747, 1)
    deleteTestResult(422, "12345678901234567890123456789747", undefined)
    deleteTestResult(422, "12345678901234567890123456789747", null)
    deleteTestResult(422, "12345678901234567890123456789777", 1)
    deleteTestResult(422, "12345678901234567890123456789747", 3)
});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/skuitems/rfid/testResults/emergenza (deleting data...)', async () => {
        await agent.delete('/api/skuitems/rfid/testResults/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function postTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result) {
    it('test /api/skuitems/testResult', async () => {
        let testResult = {
            "rfid": rfid,
            "idTestDescriptor": idTestDescriptor,
            "Date": Date,
            "Result": Result
        }
        await agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    })
}

function getTestResultByRFID() {
    it('test get /api/skuitems/:rfid/testResults (correct rfid)', async () => {
        await agent.get('/api/skuitems/12345678901234567890123456789747/testResults')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    [
                        {
                            "id":1,
                            "idTestDescriptor": 1,
                            "Date": "2021/11/28",
                            "Result": true
                
                        },
                        {
                            "id":2,
                            "idTestDescriptor": 1,
                            "Date": "2021/11/28",
                            "Result": true
                        }
                    ]
                )
            });
    });
}

function getTestResultByRFIDError(expectedHTTPStatus, rfid) {
    it('test get /api/skuitems/:rfid/testResults (wrong rfid)', async () => {
        await agent.get('/api/skuitems/' + rfid + '/testResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function getTestResultByRFIDandID() {
    it('test get /api/skuitems/:rfid/testResults/:id (correct rfid and id)', async () => {
        await agent.get('/api/skuitems/12345678901234567890123456789747/testResults/1')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    {
                        "id":1,
                        "idTestDescriptor": 1,
                        "Date": "2021/11/28",
                        "Result": true
                    }
                )
            });
    });
}

function getTestResultByRFIDandIDError(expectedHTTPStatus, rfid, id) {
    it('test get /api/skuitems/:rfid/testResults/:id (wrong rfid and/or id)', async () => {
        await agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function putTestResult(expectedHTTPStatus, rfid, id, newIdTestDescriptor, newDate, newResult) {
    it('test put /api/skuitems/:rfid/testResult/:id', async () => {
        updates = {
            "newIdTestDescriptor":newIdTestDescriptor,
            "newDate":newDate,
            "newResult":newResult
        }
        await agent.put(`/api/skuitems/${rfid}/testResult/${id}`)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}

function deleteTestResult(expectedHTTPStatus, rfid, id) {
    it('test delete /api/skuitems/:rfid/testResult/:id', async () => {
        await agent.delete(`/api/skuitems/${rfid}/testResult/${id}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}
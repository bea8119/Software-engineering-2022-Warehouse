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
        await agent.delete('/api/testDescriptor/emergenza')
        await agent.delete('/api/skuitems/testResult/emergenza')

        await agent.post('/api/sku').send(sku)
        await agent.post('/api/skuitem').send(skuitem1)
        await agent.post('/api/testDescriptor').send(testDescriptor1)
        await agent.post('/api/testDescriptor').send(testDescriptor2)
        await agent.post('/api/skuitems/testResult').send(testResult1)
        await agent.post('/api/skuitems/testResult').send(testResult2)

    })
    
    //deleteAllData(204); //--> No pasa

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
    getTestResultByRFIDError(422, 12345678901234567890123456789747)
    getTestResultByRFIDError(404, "12345678901234567890123456789777")
    
    getTestResultByRFIDandID()
    getTestResultByRFIDandIDError(422, "1234567890123456789012345678974", 1)
    getTestResultByRFIDandIDError(422, 12345678901234567890123456789747, 1)
    getTestResultByRFIDandIDError(422, "12345678901234567890123456789747", undefined)
    getTestResultByRFIDandIDError(422, "12345678901234567890123456789747", null)
    getTestResultByRFIDandIDError(404, "12345678901234567890123456789777", 1)
    getTestResultByRFIDandIDError(404, "12345678901234567890123456789747", 0)

    putTestResult(200, "12345678901234567890123456789747", 1, 2, "2021/11/29 12:30", false)
    putTestResult(200, "12345678901234567890123456789747", 1, 2, "2021/11/29", false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, "", false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, undefined, false)
    putTestResult(422, "12345678901234567890123456789747", 1, 2, "2021/11/29 12:30", "not boolean")
    putTestResult(422, "1234567890123456789012345678974", 1, 2, "2021/11/29 12:30", true)
    putTestResult(422, 12345678901234567890123456789747, 1, 2, "2021/11/29 12:30", true)
    putTestResult(422, "12345678901234567890123456789747", undefined, 2, "2021/11/29 12:30", true)
    putTestResult(422, "12345678901234567890123456789747", null, 2, "2021/11/29 12:30", true)
    putTestResult(404, "12345678901234567890123456789777", 1, 2, "2021/11/29 12:30", true)
    putTestResult(404, "12345678901234567890123456789747", 3, 2, "2021/11/29 12:30", true)
});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/skuitems/testResult (deleting data...)', function (done) {
        agent.delete('/api/skuitems/testResult')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function postTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result) {
    it('test /api/skuitems/testResult', function (done) {
        let testResult = {
            "rfid": rfid,
            "idTestDescriptor": idTestDescriptor,
            "Date": Date,
            "Result": Result
        }
        agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    })
}

function getTestResultByRFID() {
    it('test get /api/skuitems/:rfid/testResults (correct rfid)', function (done) {
        agent.get('/api/skuitems/12345678901234567890123456789747/testResults')
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
                done();
            });
    });
}

function getTestResultByRFIDError(expectedHTTPStatus, rfid) {
    it('test get /api/skuitems/:rfid/testResults (wrong rfid)', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getTestResultByRFIDandID() {
    it('test get /api/skuitems/:rfid/testResults/:id (correct rfid and id)', function (done) {
        agent.get('/api/skuitems/12345678901234567890123456789747/testResults/1')
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
                done();
            });
    });
}

function getTestResultByRFIDandIDError(expectedHTTPStatus, rfid, id) {
    it('test get /api/skuitems/:rfid/testResults/:id (wrong rfid and/or id)', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function putTestResult(expectedHTTPStatus, rfid, id, newIdTestDescriptor, newDate, newResult) {
    it('test put /api/skuitems/:rfid/testResult/:id', function (done) {
        updates = {
            "newIdTestDescriptor":newIdTestDescriptor,
            "newDate":newDate,
            "newResult":newResult
        }
        agent.put('/api/skuitems/'+rfid+'/testResult/'+id)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });

}
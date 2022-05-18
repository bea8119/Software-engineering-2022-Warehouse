'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import TESTRESULT_DAO datainterface */
const TESTRESULT_DAO = require('../../datainterface/INTERNAL/TESTRESULT_DAO');
const tr =  new TESTRESULT_DAO();


/* testResult Post */

app.post('/api/skuitems/testResult', async (req, res) => {

    let testResult = req.body;
    if (Object.keys(req.body).length === 0 ||
        testResult === undefined ||
        /* RFID must be 32 DIGITS long */
        testResult.rfid === undefined || testResult.rfid.length !== 32 || !(/^\d+$/.test(testResult.rfid)) ||
        testResult.idTestDescriptor === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    //Test for date and result needed
    try {
        await tr.newTableName(db);
        await tr.storeTestResult(db, testResult);
        return res.status(201).end();
    }

    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end();
        } else {
            res.status(503).end();
        }
    }
});


/* testResults by SkuItemRfid Get */

app.get('/api/skuitems/:rfid/testResults', async (req, res) => {
    let rfid = req.params.rfid;
    if ((rfid.length !== 32) || !(/^\d+$/.test(rfid))) {
        res.status(422).json("Unprocessable entity");
    }
    try {
        const testResults = await tr.getTestResultsArraybySkuitemRfid(db, rfid);
        return res.status(200).json(testResults);
    } 
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end();
        } else {
            res.status(500).end();
        }
    }
});

/* testResult by id and by SkuItemRfid Get */
app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
    let rfid = req.params.rfid;
    let id = req.params.id;
    //Test id
    if ((rfid.length !== 32) || !(/^\d+$/.test(rfid)) ||
    isNaN(id)) {
        res.status(422).json("Unprocessable entity");
    }
    try {
        const testResults = await tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, id);
        res.status(200).json(testResults);
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end();
        } else {
            res.status(500).end();
        }
    }
});

/* testResult Update */

app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {

    let rfid = req.params.rfid;
    let id = req.params.id;
    let testResult = req.body;
    
    if ((rfid.length !== 32) || !(/^\d+$/.test(rfid)) ||
    isNaN(id) ||
    testResult.newIdTestDescriptor === undefined || isNaN(testResult.newIdTestDescriptor) ||
    testResult.newDate === undefined ||
    testResult.newResult === undefined || typeof testResult.newResult != "boolean") {
        res.status(422).json("Unprocessable entity");
    }
    
    try {
        await tr.updateTestResult(db, id, rfid, testResult);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});

/* TestResult Delete */

app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {

    let rfid = req.params.rfid;
    let id = req.params.id;

    try {
        await tr.deleteTestResult(db, rfid, id);
        res.status(204).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(422).end()
        } else {
            res.status(503).end()
        }
    }
});

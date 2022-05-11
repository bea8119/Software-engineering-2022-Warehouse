'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import TESTRESULT_DAO datainterface */
const TESTRESULT_DAO = require('../datainterface/TESTRESULT_DAO');
const tr =  new TESTRESULT_DAO();

const res = require("express/lib/response");


/* testResult Post */

app.post('/api/skuitems/testResult', async (req, res) => {

    let testResult = req.body.testResult;
    if (Object.keys(req.body).length === 0 ||
        testResult === undefined ||
        /* RFID must be 32 DIGITS long */
        testResult.rfid === undefined || testResult.rfid.length !== 32 || !(/^\d+$/.test(testResult.rfid)) ||
        testResult.idTestDescriptor === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    //Not sure this (Date) should be different
    console.log("ho superato il check della validità dei dati")
    if (testResult.Date === undefined || testResult.Date === "") {
        testResult.Date = "YYYY/MM/DD HH:MM";
    }
    try {
        console.log("sono nel try e faccio partire le funzioni")
        await tr.newTableName(db);
        tr.storeTestResult(db, testResult);
        return res.status(201).end();
    }

    catch (err) {
        console.log("messaggio di errore"+err.message)
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});


/* testResults by SkuItemRfid Get */

app.get('api/skuitems/:rfid/testResults', async (req, res) => {
    let rfid = req.params.rfid;
    if (Object.keys(req.params).length === 0 ||
        /* RFID must be 32 DIGITS long */
        rfid === undefined || rfid.length !== 32 || !(/^\d+$/.test(rfid))) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        const testResults = await tr.getTestResultsArraybySkuitemRfid(db, rfid);
        res.status(200).json(testResults);
    } catch (err) {
        res.status(500).end();
    }
});

/* testResult by id and by SkuItemRfid Get */
app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
    let rfid = req.params.rfid;
    let id = req.params.id;
    if (Object.keys(req.params).length === 0 ||
        /* RFID must be 32 DIGITS long */
        rfid === undefined || rfid.length !== 32 || !(/^\d+$/.test(rfid)) || id === undefined || !(/^\d+$/.test(id))) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        const testResults = await tr.getTestResultArraybyidandbySkuitemRfid(db, id, rfid);
        res.status(200).json(testResults);
    } catch (err) {
        res.status(500).end();
    }
});

/* testResult Update */

app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {

    let rfid = req.params.rfid;
    let id = req.params.id;
    let testResult = req.body.testResult;

    if (Object.keys(req.body).length === 0 ||
        testResult === undefined ||
        /* rfid (header) must be 32 DIGITS long */
        rfid === undefined || rfid.length !== 32 || !(/^\d+$/.test(rfid)) || id === undefined || !(/^\d+$/.test(id))
        ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    if (testResult.newDate === undefined || testResult.newDate === "") {
        testResult.newDate = "YYYY/MM/DD HH:MM";
    }

    try {
        await tr.updateTestResult(db, id, rfid, testResult);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message = "ID not found") {
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
        await tr.deleteTestResult(db, id, rfid);
        res.status(204).end();
    }
    catch (err) {
        if (err.message = "ID not found") {
            res.status(422).end()
        } else {
            res.status(503).end()
        }
    }
});

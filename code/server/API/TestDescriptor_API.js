'use strict'

const server = require("../server");
const app = server.app;
const db = server.db;

/* Import testDescriptor_DAO datainterface */
const TestDescriptor_DAO = require('../datainterface/TestDescriptor_DAO');
const t =  new TestDescriptor_DAO();

app.post('/api/testDescriptor', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }

    let TD = req.body.TestDescriptor;

    if (TD === undefined || TD.name === undefined || TD.procedureDescription === undefined || TD.skuId === undefined ) {
        return res.status(422).json({ error: 'Invalid TestDescriptor data' });
    }

    try {
        await t.newTableName(db);
        t.storeTestDescriptor(db, TD);
        return res.status(201).end();
    } 

    catch (err) {
        res.status(503).end();
    }
});


app.get('/api/testDescriptors/:id', async (req, res) => {

    if (Object.keys(req.header).length === 0) {
        return res.status(422).json({ error: 'Empty header request' });
    }
    let id = req.header.id;
    if (id === undefined) {
        return res.status(404).json({ error: 'Data not found' });
    }
        try{
    const TD =await t.getTestDescriptorbyID(db, id);
    return res.status(200).json(TD);
        }  catch (err) {
            res.status(500).end();
        }

}   

);

app.get('/api/testDescriptors', async (req, res) => {
    try {
        const TDist = await t.getStoredTestDescriptors(db);
        res.status(200).json(TDlist);
    } catch (err) {
        res.status(500).end();
    }
});


app.delete('/api/testDescriptors/:id', async (req, res) => {

    let id = req.params.id;

    try {
        await p.deleteTesDescriptor(db, id);
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

app.put('/api/testDescriptor/:id', async (req, res) => {

    let id = req.params.id;
    let TD = req.body.TestDescriptor;

    if (Object.keys(req.body).length === 0 || TD === undefined || TD.name === undefined || TD.procedureDescription === undefined || TD.skuId === undefined ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    

    try {
        await s.updateTestDescriptor(db, id, TD);
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
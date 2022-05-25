'use strict'

const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import testDescriptor_DAO datainterface */
const TestDescriptor_DAO = require('../../datainterface/INTERNAL/TestDescriptor_DAO');
const t =  new TestDescriptor_DAO();

app.post('/api/testDescriptor', async (req, res) => {

    let TD = req.body;

    if (Object.keys(req.body).length === 0 || TD === undefined || TD.name === undefined || TD.procedureDescription === undefined || TD.idSKU === undefined ) {
        return res.status(422).json({ error: 'Invalid TestDescriptor data' });
    }

    try {
        await t.newTableName(db);
        await t.storeTestDescriptor(db, TD);
        return res.status(201).end();
    } 

    catch (err) {
        if(err.message === "ID sku not found")
        res.status(404).end();
        
        else
        res.status(503).end();
    }
});


app.get('/api/testDescriptors/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Empty header request' });
    }

    let id = req.params.id;

    if (isNaN(id)) {
        return res.status(422).json({ error: 'Empty header request' });
    }
    
    try {
        const TD = await t.getTestDescriptorbyID(db, id);
        return res.status(200).json(TD);
    } catch (err) {
        if (err.message = 'ID not found') {
            res.status(404).end()
        } else {
            res.status(500).end();
        }
    }

}   

);

app.get('/api/testDescriptors', async (req, res) => {
    try {
        const TDlist = await t.getStoredTestDescriptors(db);
        res.status(200).json(TDlist);
    } catch (err) {
        res.status(500).end();
    }
});


app.delete('/api/testDescriptor/:id', async (req, res) => {

    let id = req.params.id;

    if (id === undefined) {
        return res.status(422).json({ error: 'Empty header request' });
    }

    try {
        await t.deleteTestDescriptor(db, id);
        res.status(204).end();
    }
    catch (err) {
        if (err.message = "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});

app.put('/api/testDescriptor/:id', async (req, res) => {

    let id = req.params.id;
    let TD = req.body;

    if (Object.keys(req.body).length === 0 || TD === undefined || TD.newName === undefined || TD.newProcedureDescription === undefined || TD.newIdSKU === undefined ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    

    try {
        await t.updateTestDescriptor(db, id, TD);
        return res.status(200).end();
    }
    catch (err) {
        if(err.message === "ID sku not found")
        res.status(404).end();
        
        else if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            
            res.status(503).end()
        }
    }
});


app.delete('/api/testDescriptors', async (req, res) => {
    try {
        await t.dropTable(db);
        res.status(204).end()
    }
    catch (err) {
        res.status(500).end()
    }
});
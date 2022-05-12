'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import RESTOCKORDER_DAO datainterface */
const RESTOCKORDER_DAO = require('../datainterface/RESTOCKORDER_DAO');
const r = new RESTOCKORDER_DAO();

/* RestockOrder Post */

app.post('/api/restockOrder', async (req, res) => {

    let restockOrder = req.body;
    if (Object.keys(req.body).length === 0 ||
        restockOrder === undefined ||
        restockOrder.issueDate === undefined ||
        restockOrder.products === undefined || 
        restockOrder.supplierId === undefined){
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await r.newTableName(db);
        r.storeRestockOrder(db, restockOrder);
        return res.status(201).end();
    }

    catch (err) {
        res.status(503).end();
    }
});


/* RestockOrder Get */

app.get('/api/restockOrders', async (req, res) => {
    try {
        const restockOrders = await r.getStoredRestockOrder(db);
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});


/* RestockOrder where state = "ISSUED" Get */

app.get('/api/restockOrdersIssued', async (req, res) => {
    try {
        const restockOrdersIssued = await r.getStoredRestockOrderIssued(db);
        res.status(200).json(restockOrdersIssued);
    } catch (err) {
        res.status(500).end();
    }
});

/* ---- API DI CONTROLLO (NON RICHIESTE): ---- */

/* visione restockorder table */

app.get('/api/prova1', async (req, res) => {
    try {
        const prova1 = await r.restockorder(db);
        res.status(200).json(prova1);
    } catch (err) {
        res.status(500).end();
    }
});

/* visione restockorder_item table */

app.get('/api/prova2', async (req, res) => {
    try {
        const prova2 = await r.restockorder_item(db);
        res.status(200).json(prova2);
    } catch (err) {
        res.status(500).end();
    }
});

/* ------------------------------------------- */

/* Position Delete */

app.delete('/api/position/:positionID', async (req, res) => {

    let pID = req.params.positionID

    try {
        await p.deletePosition(db, pID);
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

/* Position Update */

app.put('/api/position/:positionID', async (req, res) => {

    let positionID = req.params.positionID;
    let position = req.body;

    if (Object.keys(req.body).length === 0 ||
    position === undefined || 
    position.newAisleID === undefined || position.newAisleID.length !== 4 || !(/^\d+$/.test(position.newAisleID)) ||
    position.newRow === undefined || position.newRow.length !== 4 || !(/^\d+$/.test(position.newRow)) ||
    position.newCol === undefined || position.newCol.length !== 4 || !(/^\d+$/.test(position.newCol)) ||
    position.newMaxWeight === undefined ||
    position.newMaxVolume === undefined ||
    position.newOccupiedWeight === undefined ||
    position.newOccupiedVolume === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    try {
        await p.updatePosition(db, positionID, position);
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

/* positionID Update */

app.put('/api/position/:positionID/changeID', async (req, res) => {

    let pID = req.params.positionID;
    let newPositionID = req.body;

    try {
        await p.updatePositionID(db, pID, newPositionID);
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end();
        }
    }
});


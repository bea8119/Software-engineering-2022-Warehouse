'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import RESTOCKORDER_DAO datainterface */
const RESTOCKORDER_DAO = require('../../datainterface/SUPPLIERINTERFACE/RESTOCKORDER_DAO');
const r = new RESTOCKORDER_DAO();

/* Import DAYJS module + customParseFormat plugin */
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)



/* RestockOrder Post */

app.post('/api/restockOrder', async (req, res) => {

    let restockOrder = req.body;
    if (Object.keys(req.body).length === 0 ||
        restockOrder === undefined ||
        restockOrder.issueDate === undefined || !((dayjs(restockOrder.issueDate, 'YYYY/MM/DD', true).isValid()) || (dayjs(restockOrder.issueDate, 'YYYY/MM/DD HH:mm', true).isValid())) ||
        restockOrder.products === undefined ||
        restockOrder.supplierId === undefined || isNaN(restockOrder.supplierId)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await r.newTableName(db);
        let s = 0;
        let result = 0;
        for(let prod of restockOrder.products)
        { 
        s = await r.checkProducts(db, prod, restockOrder);
        result += s;
        }
        if (result < restockOrder.products.length){
            return res.status(422).json({ error: 'Unprocessable entity' })  
        }
        await r.storeRestockOrder(db, restockOrder);
        return res.status(201).end();
    }

    catch (err) {
        if (err.message === 'Unprocessable itemId') {
            return res.status(422).json({ error: 'Unprocessable entity' })
        } else {
            res.status(503).end();
        }
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

/* RestockOrder Get by ID */

app.get('/api/restockOrders/:id', async (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.status(422).json("Unprocessable entity")
    }
    try {
        const restockOrderById = await r.getStoredRestockOrderById(db, id);
        res.status(200).json(restockOrderById);
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(500).end();
        }
    }
});


/* RestockOrder Get skuitems to return */

app.get('/api/restockOrders/:id/returnItems', async (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.status(422).json("Unprocessable entity")
    }
    try {
        const restockOrderById = await r.getSkuItemsToReturn(db, id);
        res.status(200).json(restockOrderById);
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Not COMPLETEDRETURN state") {
            res.status(422).json({ error: 'Unprocessable entity' });
        } else {
            res.status(500).end();
        }
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

/* RestockOrder state Update */

app.put('/api/RestockOrder/:id', async (req, res) => {

    let id = req.params.id;
    let state = req.body;

    if (Object.keys(req.body).length === 0 ||
        isNaN(id) ||
        state === undefined ||
        (state.newState !== "ISSUED" &&
            state.newState !== "DELIVERY" &&
            state.newState !== "TESTED" &&
            state.newState !== "COMPLETEDRETURN" &&
            state.newState !== "COMPLETED" &&
            state.newState !== "DELIVERED")
    ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    try {
        await r.updateRestockOrderState(db, id, state);
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

/* Restockorder update: add skuitems to restockorder */

app.put('/api/restockOrder/:id/skuItems', async (req, res) => {

    let id = req.params.id;
    let skuitems = req.body;

    if (Object.keys(req.body).length === 0 || isNaN(id)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    skuitems.skuItems.forEach(element => {
        if (element.SKUId === undefined || element.rfid.length !== 32 || !(/^\d+$/.test(element.rfid))) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }
    });

    try {
        await r.updateRestockOrderSkuItems(db, id, skuitems);
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Not DELIVERED state") {
            res.status(422).json({ error: 'Unprocessable entity' });
        } else {
            res.status(503).end();
        }
    }
});


/* Restockorder update: add transportNote */

app.put('/api/restockOrder/:id/transportNote', async (req, res) => {

    let id = req.params.id;
    let transportNote = req.body;

    if (Object.keys(req.body).length === 0 ||
        isNaN(id) ||
        transportNote.transportNote === undefined ||
        transportNote.transportNote.deliveryDate === undefined || !((dayjs(transportNote.transportNote.deliveryDate, 'YYYY/MM/DD', true).isValid()) || (dayjs(transportNote.transportNote.deliveryDate, 'YYYY/MM/DD HH:mm', true).isValid()))) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await r.updateRestockOrderTransportNote(db, id, transportNote);
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Not DELIVERY state" || err.message === "Delivery date before issue date") {
            res.status(422).json({ error: 'Unprocessable entity' });
        } else {
            res.status(503).end();
        }
    }
});


/* RestockOrder Delete */

app.delete('/api/restockOrder/:id', async (req, res) => {

    let id = req.params.id

    if (isNaN(id)) {
        res.status(422).end()
    }

    try {
        await r.deleteRestockOrder(db, id);
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



app.delete('/api/emergenza/emergenza', async (req, res) => {
    try {
        await r.dropTable(db);
        res.status(204).end()
    }
    catch (err) {
        res.status(500).end()
    }
});

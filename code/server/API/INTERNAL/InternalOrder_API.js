'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import ITEM_DAO datainterface */
const InternalOrder_DAO = require('../../datainterface/INTERNAL/InternalOrder_DAO');
const i = new InternalOrder_DAO();


/* Import DAYJS module + customParseFormat plugin */
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


/* InternalOrder Post */
app.post('/api/internalOrders', async (req, res) => {

    let internalOrder = req.body;

    if (Object.keys(req.body).length === 0 || internalOrder === undefined || 
    internalOrder.issueDate === undefined || !((dayjs(internalOrder.issueDate, 'YYYY/MM/DD', true).isValid()) || (dayjs(internalOrder.issueDate, 'YYYY/MM/DD HH:mm', true).isValid())|| (dayjs(internalOrder.issueDate, 'YYYY/MM/DD H:mm', true).isValid()))  ||
    internalOrder.products === undefined ||  
    internalOrder.customerId === undefined || isNaN(internalOrder.customerId)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    //Unauthorized Error Management 

    try {
        await i.newTableName(db);
        await i.storeInternalOrder(db, internalOrder);
        return res.status(201).end();
    }

    catch (err) {
        console.log(err)
        res.status(503).end();
    }
});

/* InternalOrder get */
app.get('/api/internalOrders', async (req, res) => {
    try {
        await i.newTableName(db);
        const internalOrderList = await i.getStoredInternalOrder(db);
        res.status(200).json(internalOrderList);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

/* Get InternalOrder where state = "ISSUED" */
app.get('/api/internalOrdersIssued', async (req, res) => {
    try {
        const internalOrderIssued = await i.getStoredInternalOrderIssued(db);
        res.status(200).json(internalOrderIssued);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* Get InternalOrder where state = "ACCEPTED" */
app.get('/api/internalOrdersAccepted', async (req, res) => {
    try {
        const internalOrderIssued = await i.getStoredInternalOrderAccepted(db);
        res.status(200).json(internalOrderIssued);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* InternalOrder Get by ID */
app.get('/api/internalOrders/:id', async (req, res) => {
    let id = req.params.id
    if (isNaN(id) || id===undefined) {
        res.status(422).json("Unprocessable entity")
    }
    try {
        const internalOrderById = await i.getStoredInternalOrderById(db, id);
        res.status(200).json(internalOrderById);
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(500).end();
        }
    }
});

/* InternalOrder update: add skuitems to restockorder */
app.put('/api/internalOrders/:id', async (req, res) => {

    let id = req.params.id;
    //let skuitems = req.body;
    let skuproduckt = req.body;
    console.log(req.body);
    if (isNaN(id)) {
        res.status(404).json("Not Found")
    }
    else if (Object.keys(req.body).length === 0 || 
    skuproduckt === undefined || 
    skuproduckt.newState === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    else if (skuproduckt.newState === "COMPLETED") {
        if (skuproduckt.products === undefined) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }
    } 

    try {
        if (skuproduckt.newState === "COMPLETED") {
            await i.updateInternalOrderSkuProducts(db, id, skuproduckt);
        }
        else {
            await i.updateInternalOrderState(db, id, skuproduckt.newState);
        }
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Uncorrect product") {
            res.status(422).json({ error: 'Unprocessable entity' });
        } else {
            res.status(503).end();
        }
    }
});

/* InternalOrder Delete */
app.delete('/api/internalOrders/:id', async (req, res) => {

    let id = req.params.id

    if (isNaN(id)){
        res.status(422).end()
    }

    try {
        await i.deleteInternalOrder(db, id);
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

app.delete('/api/internalOrder/emergenza', async (req, res) => {
    try {
        await i.dropTable(db);
        res.status(204).end();
    }
    catch (err){
        res.status(500).end();
    }
});
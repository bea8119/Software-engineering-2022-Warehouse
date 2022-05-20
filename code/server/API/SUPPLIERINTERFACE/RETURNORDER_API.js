'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

const ReturnOrder_DAO = require('../../datainterface/SUPPLIERINTERFACE/RETURNORDER_DAO');
const r = new ReturnOrder_DAO();

/* Import DAYJS module + customParseFormat plugin */
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

app.post('/api/returnOrder', async (req, res) => {

    let returnOrder = req.body;
    if (Object.keys(req.body).length === 0 ||
    returnOrder === undefined ||
    returnOrder.returnDate === undefined || !((dayjs(returnOrder.returnDate, 'YYYY/MM/DD', true).isValid()) || (dayjs(returnOrder.returnDate, 'YYYY/MM/DD hh:mm', true).isValid()))  ||
    returnOrder.products === undefined || 
    returnOrder.restockOrderId === undefined){
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await r.newTableName(db);
        await r.storeReturnOrder(db, returnOrder);
        return res.status(201).end();
    }

    catch (err) {
        console.log(err)
        res.status(503).end();
    }
});

app.get('/api/returnOrders', async (req, res) => {

    try {
        const returnOrders = await r.getStoredReturnOrders(db);
        res.status(200).json(returnOrders);
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
});

app.get('/api/returnOrders/:id', async (req, res) => {
    let id = req.params.id
    if (isNaN(id)){
        res.status(422).json("Unprocessable entity")
    }
    try {
        const returnOrderById = await r.getStoredReturnOrderById(db, id);
        res.status(200).json(returnOrderById);
    } catch (err) {
        if (err.message === "ID not found"){
            res.status(404).end()
        } else {
            res.status(500).end();
        }
    }
}); 



app.delete('/api/returnOrder/:id', async (req, res) => {

    let id = req.params.id;

    if (isNaN(id)){
        res.status(422).end()
    }

    try {
        await r.deleteReturnOrder(db, id);
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
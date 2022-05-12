'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import ITEM_DAO datainterface */
const InternalOrder_DAO = require('../datainterface/InternalOrder_DAO');
const i = new InternalOrder_DAO();

/* InternalOrder get */
app.get('/api/internalOrders', async (req, res) =>{
    try {
        const internalOrderList = await i.getStoredInternalOrder(db);
        res.status(200).json(internalOrderList);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

app.get('/api/internalOrdersIssued', async (req, res) => {
    try {
        const internalOrderIssued = await r.getStoredInternalOrderIssued(db);
        res.status(200).json(internalOrderIssued);
    } catch (err) {
        res.status(500).end();
    }
});
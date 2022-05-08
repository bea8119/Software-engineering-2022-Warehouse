'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import POSITION_DAO datainterface */
const POSITION_DAO = require('../datainterface/ITEM_DAO');
const p = new ITEM_DAO();

/* ITEMS get */
app.get('/api/items', async (req, res) =>{
    try {
        const ITEMlist = await s.getStoredITEM(db);
        res.status(200).json(ITEMlist);
        /*Manage unauthorized response (401)*/
    } catch (err) {
        res.status(500).end();
    }
});

/* ITEM get by ID */
app.get('/api/items/:id', async (req, res) => {

});

/* ITEM post */
app.post('/api/item', async (req, res) => {

});

/* ITEM put */
app.put('/api/item/:id', async (req, res) => {

});

/* ITEM delete */
app.delete('/api/items/:id', async (req, res) => {

});
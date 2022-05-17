'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;
const db = server.db;

/* Import ITEM_DAO datainterface */
const ITEM_DAO = require('../../datainterface/EXTERNAL/ITEM_DAO');
const i = new ITEM_DAO();


/* ITEMS get */
app.get('/api/items', async (req, res) =>{
    try {
        const ITEMlist = await i.getStoredITEM(db);
        res.status(200).json(ITEMlist);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* ITEM get by ID */
app.get('/api/items/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    let id = req.params.id;

    if (id === undefined) {
        return res.status(422).json({ error: 'Invalid data' });
    }

    /*Manage unauthorized response (401)*/

    try {
        const itemFound = await i.getITEMbyID(db, id);
        if (itemFound === undefined) {
            res.status(404).end()
        }
        return res.status(200).json(itemFound);

    } catch (err) {
        res.status(500).end();
    }
});

/* ITEM post */
app.post('/api/item', async (req, res) => {

    let item = req.body;

    /* Undefined data check NB manca se il supplier ha gia item con quello skuID*/
    if (Object.keys(req.body).length === 0 || item === undefined ||  item.description === undefined || item.price === undefined || item.SKUId === undefined || item.supplierId === undefined) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
    }
    /* Unauthorized check */

    try {
        await i.newTableName(db);
        await i.storeITEM(db, item);
        return res.status(201).end();
    } 
    catch (err) {
        if (err.message === "SKU not Found") { /* Sku ID check */
            res.status(404).json({ error: 'Not Found' });
        } else {
            res.status(503).end()
        }
    }
});

/* ITEM Update by ID*/
app.put('/api/item/:id', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }

    let item = req.body;
    let id=req.params.id;
    /* Undefined data check NB manca se il supplier ha gia item con quello skuID*/
     if (item === undefined /*item.newId==undefined || item.newDescription === undefined || item.newPrice === undefined || item.newSKUId === undefined || item.newSupplier === undefined*/) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    /* Unauthorized check */

    try {
        await i.updateItem(db, id, item);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === 'Item not found') {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});

/* ITEM delete */
app.delete('/api/items/:id', async (req, res) => {
    let item = req.body;
    let id=req.params.id;
    /* Unauthorized check */

    try {
        await i.deleteItem(db, id);
        res.status(204).end();
    }
    catch (err) { 
        if (err.message === "Item not found") {
            res.status(422).end()
        } else {
            res.status(503).end()
        }
    }
});
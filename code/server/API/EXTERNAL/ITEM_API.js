'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import ITEM_DAO datainterface */
const ITEM_DAO = require('../../datainterface/EXTERNAL/ITEM_DAO');
const i = new ITEM_DAO();


/* ITEMS get */
app.get('/api/items', async (req, res) => {
    try {
        await i.newTableName(db);
        const ITEMlist = await i.getStoredITEM(db);
        res.status(200).json(ITEMlist);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* ITEM get by ID and Supplier ID */
app.get('/api/items/:id/:supplierId', async (req, res) => {
    let supplierId = req.params.supplierId
    let id = req.params.id;
    if (Object.keys(req.params).length === 0 || id === undefined || isNaN(id)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    /*Manage unauthorized response (401)*/

    try {
        const itemFound = await i.getStoredITEMbyIDAndSupplierId(db, id, supplierId);
        return res.status(200).json(itemFound);

    } catch (err) {
        if (err.message === 'ID not found') {
            res.status(404).end();
        } else {
            res.status(500).end();
        }
    }

});

/* ITEM post */
app.post('/api/item', async (req, res) => {

    let item = req.body;
    /* Undefined data check NB controllo se il supplier ha gia item con quello skuID sotto */
    if (Object.keys(req.body).length === 0 || item === undefined || item.id === undefined || item.description === undefined || item.price === undefined || item.SKUId === undefined || item.supplierId === undefined) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
    }
    /* Unauthorized check */
    else {
        try {
            await i.newTableName(db);
            await i.storeITEM(db, item);
            return res.status(201).end();
        }
        catch (err) {
            if (err.message === "SKU not found") { /* Sku ID check */
                res.status(404).json({ error: 'Not Found' });
            }
            else if (err.message === "Item already sells") {
                res.status(422).json({ error: 'Unprocessable Entity' });
            }
            else {
                res.status(503).end()
            }
        }
    }

});

/* ITEM Update by ID and supplierId*/
app.put('/api/item/:id/:supplierId', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }
    else {
        let item = req.body;
        let supplierId = req.params.supplierId;
        let id = req.params.id;
        /* Undefined data check NB manca se il supplier ha gia item con quello skuID*/
        if (item === undefined || id===undefined || isNaN(id) /*item.newId==undefined || item.newDescription === undefined || item.newPrice === undefined || item.newSKUId === undefined || item.newSupplier === undefined*/) {
            return res.status(422).json({ error: 'Unprocessable Entity' });
        }

        /* Unauthorized check */

        else {
            try {
                await i.updateItem(db, id, supplierId, item);
                return res.status(200).end();
            }
            catch (err) {
                if (err.message === 'ID not found') {
                    res.status(404).end()
                } else {
                    res.status(503).end()
                }
            }
        }

    }
});

/* ITEM delete */
app.delete('/api/items/:id/:supplierId', async (req, res) => {
    let supplierId = req.params.supplierId;
    let id = req.params.id;
    /* Unauthorized check */
    if (id===undefined || isNaN(id)){
        return res.status(422).json({ error: 'Unprocessable Entity' });
    }
    try {
        await i.deleteItem(db, id, supplierId);
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

app.delete('/api/item/emergenza', async (req, res) => {
    try {
        await i.dropTable(db);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).end();
    }
})
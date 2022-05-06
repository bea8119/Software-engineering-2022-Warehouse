'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import SKU_DAO datainterface */
const SKU_DAO = require('../datainterface/SKU_DAO');
const s = new SKU_DAO();


/* SKU Post */

app.post('/api/sku', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }

    let sku = req.body.sku;

    if (sku === undefined || sku.description === undefined || sku.weight === undefined || sku.volume === undefined || sku.price === undefined || sku.availableQuantity === undefined ) {
        return res.status(422).json({ error: 'Invalid sku data' });
    }

    try {
        await s.newTableName(db);
        s.storeSKU(db, sku);
        return res.status(201).end();
    } 

    catch (err) {
        res.status(503).end();
    }
});


/* SKU Get */

app.get('/api/skus', async (req, res) => {
    try {
        const SKUlist = await s.getStoredSKU(db);
        res.status(200).json(SKUlist);
    } catch (err) {
        res.status(500).end();
    }
});


/* SKU Delete */

app.delete('/api/skus', (req, res) => {
    try {
        db.dropTable();
        res.status(204).end();
    }
    catch (err) {
        res.status(500).end();
    }
});


/* SKU get by ID */

app.get('/api/skus/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    let id = req.params.id;

    if (id === undefined) {
        return res.status(422).json({ error: 'Invalid data' });
    }

    try {
        const skuFound = await s.getSKUbyID(db, id);
        if (skuFound === undefined) {
            res.status(404).end()
        }
        return res.status(200).json(skuFound);

    } catch (err) {
        res.status(500).end();
    }

}

);


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
    if (sku === undefined) {
        return res.status(422).json({ error: 'Invalid user data' });
    }
    await s.newTableName(db);
    s.storeSKU(db, sku);
    return res.status(201).end();
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


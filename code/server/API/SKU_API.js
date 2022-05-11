'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import SKU_DAO datainterface */
const SKU_DAO = require('../datainterface/SKU_DAO');
const s =  new SKU_DAO();
const POSITION_DAO = require('../datainterface/POSITION_DAO');
const res = require("express/lib/response");
const p = new POSITION_DAO();


/* SKU Post */

app.post('/api/sku', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }

    let sku = req.body;

    if (sku === undefined || sku.description === undefined || sku.weight === undefined || sku.volume === undefined || sku.price === undefined || sku.availableQuantity === undefined ) {
        return res.status(422).json({ error: 'Invalid sku data' });
    }

    try {
        await s.newTableName(db);
        await s.storeSKU(db, sku);
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

/* SKU Get by ID */

app.get('/api/skus/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Empty header request' });
    }
    let id = req.params.id;
    if (id === undefined) {
        return res.status(404).json({ error: 'Data not found' });
    }
        try{
    const skuFound =await s.getSKUbyID(db, id);
    return res.status(200).json(skuFound);
        }  catch (err) {
            res.status(500).end();
        }

}   

);


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

app.delete('/api/skus/:id', async (req, res) => {

    let id = req.params.id;

    try {
        await s.deleteSKU(db, id);
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




/* SKU PUT */
// modify fields given an id

app.put('/api/sku/:id', async (req, res) => {

    let id = req.params.id;
    let sku = req.body;

    if (Object.keys(req.body).length === 0 || sku === undefined || sku.newDescription === undefined || sku.newWeight === undefined || sku.newVolume === undefined || sku.newPrice === undefined || sku.newAvailableQuantity === undefined ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    

    try {
        await s.updateSKU(db, id, sku);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Maximum position capacity exceeded") {
            res.status(422).end()
        } else {
            res.status(503).end()
        }
    }
});

/* Update position by id */
 ///NEEDS TO GO TO POSITION AND UPDATE STUFF THERE ALSO
 app.put('/api/sku/:id/position' , async (req, res) => {

    let id = req.params.id;
    let position = req.body;

    if (Object.keys(req.body).length === 0 || position === undefined  ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    

    try {
        await s.updateSKUposition(db, id, position);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }

    //Position update part
    const weightVol =await s.getWeightVolumeByID(db, id);

    try {
        await p.updatePositionWV(db, id, weightVol);
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

app.delete('/api/sku/emergenza', async (req, res) => {
    try {
    await s.dropTable(db);
    res.status(200).end()
    }
    catch (err) {
    res.status(500).end()
    }
});


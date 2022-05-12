'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import SKU_DAO datainterface */
const SKU_DAO = require('../datainterface/SKU_DAO');
const s =  new SKU_DAO();

const res = require("express/lib/response");



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
        s.storeSKU(db, sku);
        return res.status(201).end();
    } 

    catch (err) {
        console.log(err);
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
        s.dropTable(db);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

app.delete('/api/skus/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    let id = req.params.id;


    if (id === undefined) {
        res.status(422).json("Unprocessable entity")
    }

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

    if (s.findSKUbyID(db, id) === 0) { // check sku id existence
        return res.status(404).json({error: 'Sku ID not found in database'})
    } 

    try {
        const skuFound = await s.getSKUbyID(db, id);
        return res.status(200).json(skuFound);

    } catch (err) {
        res.status(500).end();
    }
}
);




/* SKU PUT */
// modify fields given an id

app.put('/api/sku/:id', async (req, res) => {

    let id = req.params;
    let sku = req.body;

    if (Object.keys(req.body).length === 0 || sku === undefined || sku.newDescription === undefined || sku.newWeight === undefined || sku.newVolume === undefined || sku.newPrice === undefined || sku.newAvailableQuantity === undefined ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    if (s.findSKUbyID(db, id) === 0) { // check sku id existence
        return res.status(404).json({error: 'Sku ID not found in database'})
    }

    try {
        await s.updateSKU(db, id, sku);
        return res.status(200).end();
    }
    catch (err) {
         if (err.message === "Maximum position capacity exceeded") {
            res.status(422).json({error: 'Maximum position capacity exceeded'});
        } else {
            console.log(err);
            res.status(503).json({error: 'Generic error'});
        }
    }
});

/* Update position by id

*/
 ///NEEDS TO GO TO POSITION AND UPDATE STUFF THERE ALSO
 app.put('/api/sku/:id/position' , async (req, res) => {

    let id = req.params.id;
    let position = req.body;

    if (Object.keys(req.body).length === 0 || position === undefined  ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    if (s.findSKUbyID(db, id) === 0) { // check sku id existence
        return res.status(404).json({error: 'Sku ID not found in database'});
    }
    if(s.findPosbyID(db, position) === 0){ // check position id existence
        return res.status(404).json({error: 'Position ID not found in database'});
    }

    

    try {
        const oldSku = await s.getSKUbyID(db, id);
        await s.updateSKUposition(db, oldSku, position);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "Maximum position capacity exceeded") {
            res.status(422).json({error: 'Maximum position capacity exceeded'});
        } else {
            res.status(503).json({error: 'Generic error'});
        }
    }

   
    
});




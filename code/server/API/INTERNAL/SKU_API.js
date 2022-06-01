'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import SKU_DAO datainterface */
const SKU_DAO = require('../../datainterface/INTERNAL/SKU_DAO');
const s =  new SKU_DAO();




/* SKU Post */

app.post('/api/sku', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: 'Empty body request' });
    }

    let sku = req.body;

    if (sku === undefined || 
        sku.description === undefined || sku.description === "" || 
        sku.notes === undefined || sku.notes === "" ||
        sku.weight === undefined || isNaN(sku.weight) || sku.weight < 0 || !Number.isInteger(sku.weight) ||
        sku.volume === undefined || isNaN(sku.volume) || sku.volume < 0 || !Number.isInteger(sku.volume) ||
        sku.price === undefined ||  isNaN(sku.price) || sku.price < 0 || 
        sku.availableQuantity === undefined || isNaN(sku.availableQuantity) || sku.availableQuantity < 0 || !Number.isInteger(sku.availableQuantity)
        ) {
        return res.status(422).json({ error: 'Invalid sku data' });
    }

    try {
        await s.newTableName(db);
        await s.storeSKU(db, sku);
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
        console.log(err);
        res.status(500).end();
    }
});







/* SKU get by ID */

app.get('/api/skus/:id', async (req, res) => {
    let id = req.params.id;

    if (isNaN(id)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

   

    try {
        const skuFound = await s.getSKUbyID(db, id);
        return res.status(200).json(skuFound);

    } catch (err) {
        console.log(err)
        if (err.message === "ID not found"){
            res.status(404).end()
        } else {
            console.log(err);
            res.status(500).end();
        }
    }
}
);




/* SKU PUT */
// modify fields given an id

app.put('/api/sku/:id', async (req, res) => {

    let id = req.params.id;
    let sku = req.body;

    if (Object.keys(req.body).length === 0 || 
    isNaN(id) || 
    sku === undefined || 
    sku.newDescription === undefined || sku.newDescription === "" ||
    sku.newNotes === undefined || sku.newNotes === "" || 
    sku.newWeight === undefined || 
    sku.newVolume === undefined || 
    sku.newPrice === undefined || 
    sku.newAvailableQuantity === undefined ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    

    try {
        await s.updateSKU(db, id, sku);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found"){
            res.status(404).end()
        } else if (err.message === "ID position not found"){
            res.status(404).end()
        }else if (err.message === "Maximum position capacity exceeded") {
            res.status(422).json({error: 'Maximum position capacity exceeded'});
        } else {
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

    if (Object.keys(req.body).length === 0 || position.position.length !== 12 || position === undefined || isNaN(id)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }


    

    try {
      
        await s.updateSKUposition(db, id, position);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found"){
            res.status(404).end()
        } else if (err.message === "ID position not found"){
            res.status(404).end()
        }
        else if (err.message === "ID sku not found"){
            res.status(404).end()
        }
        else if (err.message === "Maximum position capacity exceeded") {
            res.status(422).json({error: 'Maximum position capacity exceeded'});
        } else {
            console.log(err)
            res.status(503).end();
        }
    }

   
    
});


/* SKU Delete */

app.delete('/api/skus', (req, res) => {
    try {
        s.dropTable(db);
        res.status(204).end();
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.delete('/api/skus/:id', async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

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






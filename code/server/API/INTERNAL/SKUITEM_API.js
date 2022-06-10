'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import SKUITEM_DAO datainterface */
const SKUITEM_DAO = require('../../datainterface/INTERNAL/SKUITEM_DAO');
const s = new SKUITEM_DAO();

/* Import DAYJS module + customParseFormat plugin */
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


/* SKUItem Post */

app.post('/api/skuitem', async (req, res) => {
    

    let skuitem = req.body;


    
    if (Object.keys(req.body).length === 0 ||
        skuitem === undefined ||
        /* RFID must be 32 DIGITS long */
        skuitem.RFID === undefined || 
        skuitem.SKUId === undefined ||

        /* block if date is not within one of these formats: */

        !((dayjs(skuitem.DateOfStock, 'YYYY/MM/DD', true).isValid()) || (dayjs(skuitem.DateOfStock, 'YYYY/MM/DD HH:mm', true).isValid())) ||
            skuitem.DateOfStock === undefined || skuitem.DateOfStock === ""
    ) {

        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    if (skuitem.RFID !== undefined && (skuitem.RFID.length !== 32 || !(/^\d+$/.test(skuitem.RFID)))) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    if (skuitem.DateOfStock === undefined || skuitem.DateOfStock === '') {
        skuitem.DateOfStock = "YYYY/MM/DD HH:MM";
    }
    try {
        await s.newTableName(db);
        await s.storeSKUItem(db, skuitem);
        return res.status(201).end();
    }

    catch (err) {
        if (err.message === 'ID not found') {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});


/* SKUItem Get */

app.get('/api/skuitems', async (req, res) => {
    try {
        const skuitems = await s.getStoredSKUItem(db);
        res.status(200).json(skuitems);
    } catch (err) {
        res.status(500).end();
    }
});

/* Get SKUItem where available = 1 */

app.get('/api/skuitems/sku/:id', async (req, res) => {
    let SKUId = req.params.id

    /* SKUId validation fails if SKUId is undefined or isn't an integer, as defined in the database */
    if (isNaN(SKUId)) {
        res.status(422).json("Unprocessable entity")
    }
    try {
        const skuitems = await s.getAvailableStoredSKUItem(db, SKUId);
        res.status(200).json(skuitems);
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(500).end()
        }
    }
});

/* Get SKUItem by RFID*/

app.get('/api/skuitems/:rfid', async (req, res) => {
    let rfid = req.params.rfid

    /* RFID Validation: as requested in the NFRs, the RFID must be 32 DIGITS long  */
    if ((rfid.length !== 32) || !(/^\d+$/.test(rfid))) {
        res.status(422).json("Unprocessable entity")
    }
    try {
        const skuitems = await s.getStoredSKUItemByRFID(db, rfid);
        res.status(200).json(skuitems);
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(500).end()
        }
    }
});


/* SKUItem Delete */

app.delete('/api/skuitems/:rfid', async (req, res) => {

    let rfid = req.params.rfid

    try {
        await s.deleteSKUItem(db, rfid);
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

/* SKUItem Update */

app.put('/api/skuitems/:rfid', async (req, res) => {

    let rfid = req.params.rfid;
    let skuitem = req.body;

    if (Object.keys(req.body).length === 0 ||
        skuitem === undefined ||
        rfid === undefined || 
        skuitem.newRFID === undefined || 
        skuitem.newAvailable === undefined || (skuitem.newAvailable !== 0 && skuitem.newAvailable !== 1) ||

        /* block if date is not within one of these formats: */

        !((dayjs(skuitem.newDateOfStock, 'YYYY/MM/DD', true).isValid()) || (dayjs(skuitem.newDateOfStock, 'YYYY/MM/DD HH:mm', true).isValid())) ||
        skuitem.newDateOfStock === undefined || skuitem.newDateOfStock === ""
    ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    if (rfid !== undefined && (rfid.length !== 32 || !(/^\d+$/.test(rfid))) ||
        skuitem.newRFID !== undefined && (skuitem.newRFID.length !== 32 || !(/^\d+$/.test(skuitem.newRFID)))   
    ) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    
    if (skuitem.newDateOfStock === undefined || skuitem.newDateOfStock === "") {
        skuitem.newDateOfStock = "YYYY/MM/DD HH:MM";
    }

    try {
        await s.updateSKUItem(db, rfid, skuitem);
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

app.delete('/api/skuitem/emergenza', async (req, res) => {
    try {
        await s.dropTable(db);
        res.status(204).end()
    }
    catch (err) {
        res.status(500).end()
    }
});


'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;
const db = server.db;

/* Import ITEM_DAO datainterface */
const InternalOrder_DAO = require('../../datainterface/INTERNAL/InternalOrder_DAO');
const i = new InternalOrder_DAO();

/* InternalOrder Post */
app.post('/api/internalOrders', async (req, res) => {

    let internalOrder = req.body;
    
    if (Object.keys(req.body).length === 0 || internalOrder === undefined || internalOrder.issueDate === undefined || internalOrder.products === undefined || internalOrder.customerId === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    //Unauthorized Error Management 

    try {
        await i.newTableName(db);
        i.storeInternalOrder(db, internalOrder);
        return res.status(201).end();
    }

    catch (err) {
        console.log(err)
        res.status(503).end();
    }
});

/* InternalOrder get */
app.get('/api/internalOrders', async (req, res) =>{
    try {
        const internalOrderList = await i.getStoredInternalOrder(db);
        res.status(200).json(internalOrderList);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

/* Get InternalOrder where state = "ISSUED" */
app.get('/api/internalOrdersIssued', async (req, res) => {
    try {
        const internalOrderIssued = await i.getStoredInternalOrderIssued(db);
        res.status(200).json(internalOrderIssued);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* Get InternalOrder where state = "ACCEPTED" */
app.get('/api/internalOrdersAccepted', async (req, res) => {
    try {
        const internalOrderIssued = await i.getStoredInternalOrderAccepted(db);
        res.status(200).json(internalOrderIssued);

        /*Manage unauthorized response (401)*/

    } catch (err) {
        res.status(500).end();
    }
});

/* InternalOrder Get by ID */
app.get('/api/internalOrders/:id', async (req, res) => {
    let id = req.params.id
    if (isNaN(id)){
        res.status(422).json("Unprocessable entity")
    }
    try {
        const internalOrderById = await i.getStoredInternalOrderById(db, id);
        res.status(200).json(internalOrderById);
    } catch (err) {
        if (err.message === "ID not found"){
            res.status(404).end()
        } else {
            res.status(500).end();
        }
    }
});

/* InternalOrder update: add skuitems to restockorder */
app.put('/api/internalOrders/:id', async (req, res) => {

    let id = req.params.id;
    //let skuitems = req.body;
    let skuproduckt = req.body;
    if (isNaN(id)){
        res.status(404).json("Not Found")
    }
    else if (Object.keys(req.body).length === 0 || internalOrder === undefined || skuproduckt.newState === undefined) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    else if(skuproduckt.newState==="COMPLETED"){
        if(skuproduckt.products === undefined) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }
    }
    // skuproduckt.skuItems.forEach( element => {
    //     if (element.SKUId === undefined || element.rfid.length !== 32 || !(/^\d+$/.test(element.rfid))) {
    //         return res.status(422).json({error: 'Unprocessable entity'});
    //     }
    // }); 

    try {
        await i.updateRestockOrderSkuItems(db, id, skuproduckt);
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Not DELIVERED state"){
            res.status(422).json({error: 'Unprocessable entity'});
        } else {
            res.status(503).end();
        }
    }
});
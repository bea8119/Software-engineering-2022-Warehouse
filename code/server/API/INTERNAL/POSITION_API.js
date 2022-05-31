'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import POSITION_DAO datainterface */
const POSITION_DAO = require('../../datainterface/INTERNAL/POSITION_DAO');
const p = new POSITION_DAO();


/* Position Post */

app.post('/api/position', async (req, res) => {

    let position = req.body;
    if (Object.keys(req.body).length === 0 ||
        position === undefined || position.positionID === undefined || position.positionID !== position.aisleID + position.row + position.col ||
        position.aisleID === undefined || position.aisleID.length !== 4 || !(/^\d+$/.test(position.aisleID)) ||
        position.row === undefined || position.row.length !== 4 || !(/^\d+$/.test(position.row)) ||
        position.col === undefined || position.col.length !== 4 || !(/^\d+$/.test(position.col)) ||
        position.maxWeight === undefined || isNaN(position.maxWeight) || position.maxWeight < 0 ||
        position.maxVolume === undefined || isNaN(position.maxVolume) || position.maxVolume < 0) 
        {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await p.newTableName(db);
        await p.storePosition(db, position);
        return res.status(201).end();
    }

    catch (err) {
        if(err.message === "Position code already existing"){
            res.status(422).end();
        }
        res.status(503).end();
    }
});


/* Position Get */

app.get('/api/positions', async (req, res) => {
    try {
        const positionList = await p.getStoredPosition(db);
        res.status(200).json(positionList);
    } catch (err) {
        
        res.status(500).end();
    }
});




/* Position Update */

app.put('/api/position/:positionID', async (req, res) => {

    let positionID = req.params.positionID;
    let position = req.body;

    if (positionID.length !== 12 || !(/^\d+$/.test(positionID)) ||
    Object.keys(req.body).length === 0 ||
    position === undefined || 
    position.newAisleID === undefined || position.newAisleID.length !== 4 || !(/^\d+$/.test(position.newAisleID)) ||
    position.newRow === undefined || position.newRow.length !== 4 || !(/^\d+$/.test(position.newRow)) ||
    position.newCol === undefined || position.newCol.length !== 4 || !(/^\d+$/.test(position.newCol)) ||
    position.newMaxWeight === undefined || isNaN(position.newMaxWeight) || position.newMaxWeight < 0 || 
    position.newMaxVolume === undefined || isNaN(position.newMaxVolume) || position.newMaxVolume < 0 ||
    position.newOccupiedWeight === undefined || isNaN(position.newOccupiedWeight) || position.newOccupiedWeight < 0 ||
    position.newOccupiedVolume === undefined || isNaN(position.newOccupiedVolume) || position.newOccupiedVolume < 0) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    try {
        await p.updatePosition(db, positionID, position);
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

/* positionID Update */

app.put('/api/position/:positionID/changeID', async (req, res) => {

    let pID = req.params.positionID;
    let newPositionID = req.body;

    if (pID.length !== 12 ||  !(/^\d+$/.test(pID)) ||
        Object.keys(req.body).length === 0 ||
        newPositionID === undefined || 
          newPositionID.newPositionID.length !== 12 
           || !(/^\d+$/.test(newPositionID.newPositionID)) 
          ) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }



    try {
        await p.updatePositionID(db, pID, newPositionID.newPositionID);
        return res.status(200).end();
    } catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end();
        }
    }
});


/* Position Delete */

app.delete('/api/position/:positionID', async (req, res) => {

    let pID = req.params.positionID

    if (pID.length !== 12 ||  !(/^\d+$/.test(pID)) ) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }

    try {
        await p.deletePosition(db, pID);
        res.status(204).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else {
            res.status(503).end()
        }
    }
});


app.delete('/api/positions/emergenza', async (req, res) => {
    try {
        await p.dropTable(db);
        res.status(204).end()
    }
    catch (err) {
        res.status(500).end()
    }
});


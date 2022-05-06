'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import POSITION_DAO datainterface */
const POSITION_DAO = require('../datainterface/POSITION_DAO');
const p = new POSITION_DAO();


/* Position Post */

app.post('/api/position', async (req, res) => {

    try {
        let position = req.body.position;
        if (Object.keys(req.body).length === 0 || position === undefined || position.positionID === undefined || position.aisleID === undefined || position.row === undefined || position.col === undefined || position.maxWeight === undefined || position.maxVolume === undefined) {
            return res.status(422).json({ error: 'Unprocessable entity' });
        }
        await p.newTableName(db);
        p.storePosition(db, position);
        return res.status(201).end();
    }

    catch (err) {
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


/* Position Delete */

app.delete('/api/position/:positionID', (req, res) => {
    try {
        let pID = req.params.positionID
        p.deletePosition(db, pID);
        res.status(204).end();
    }
    catch (err) {
        res.status(503).end();
    }
});

/* Position Update */

app.post('/api/position/:positionID', async (req, res) => {

    const params = useParams()

    try {
        const count = await p.findID(db, params.positionID);
        if (count == 0) {
            return res.status(404).end();
        } else {
            let position = req.body.position;
            if (Object.keys(req.body).length === 0 || position === undefined || position.positionID === undefined || position.aisleID === undefined || position.row === undefined || position.col === undefined || position.maxWeight === undefined || position.maxVolume === undefined) {
                return res.status(422).json({ error: 'Unprocessable entity' });
            } else {
                await p.updatePosition(db, position, params.positionID);
                return res.status(200).end();
            }
        }
    }
    catch (err) {
        res.status(503).end();
    }
});

/* positionID Update */

app.post('/api/position/:positionID/changeID', async (req, res) => {

    const params = useParams()

    try {
        const count = await p.findID(db, params);
        if (count == 0) {
            return res.status(404).end();
        } else {
            let positionID = req.body.positionID;
            if (Object.keys(req.body).length === 0 || positionID === undefined) {
                return res.status(422).json({ error: 'Unprocessable entity' });
            } else {
                await p.updatePosition(db, sku);
                return res.status(200).end();
            }
        }
    }
    catch (err) {
        res.status(503).end();
    }
});


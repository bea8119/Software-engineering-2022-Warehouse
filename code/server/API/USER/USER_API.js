'use strict';

/* Import server module */
const server = require("../../server");
const app = server.app;

/* Import database module */
const database = require("../../database")
const db = database.db;

/* Import USERS_DAO datainterface */
const USER_DAO = require('../../datainterface/USER/USER_DAO');
const u = new USER_DAO();


/* user Post */

app.post('/api/newUser', async (req, res) => {

    let newUser = req.body;
    if (Object.keys(req.body).length === 0 ||
        newUser === undefined ||
        newUser.username === undefined || newUser.username === "" ||
        newUser.name === undefined || newUser.name === "" ||
        newUser.surname === undefined || newUser.surname === "" ||
        newUser.password.length < 8 ||
        (newUser.type !== "customer" && newUser.type !== "qualityEmployee" && newUser.type !== "clerk" && newUser.type !== "deliveryEmployee" && newUser.type !== "supplier" && newUser.type)) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await u.newTableName(db);
        await u.storeUser(db, newUser);
        return res.status(201).end();
    }

    catch (err) {
        console.log(err);
        if (err.message === "Conflict"){
            res.status(409).end()
        } else {
            res.status(503).end()
        }
    }
});


/* user Get users*/

app.get('/api/users', async (req, res) => {
    try {
        const users = await u.getStoredUsers(db);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).end();
    }
});


/* user Get suppliers*/

app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await u.getStoredSuppliers(db);
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).end();
    }
});


/* User Delete */

app.delete('/api/users/:username/:type', async (req, res) => {

    let username = req.params.username
    let type = req.params.type
    //console.log(!username.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
    
    if (username === undefined || username === null || type === null 
        || (type !== "customer" && type !== "qualityEmployee" && type !== "clerk" && type !== "deliveryEmployee" && type !== "supplier") 
        || (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username))) {
        return res.status(422).json({ error: 'Unprocessable entity' });
    }

    try {
        await u.deleteUser(db, username, type);
        res.status(204).end();
    }
    catch (err) {
        if(err.message === 'User not found'){
            return res.status(422)
        } else  
            res.status(503).end()
        
    }
});

/* user Update */

app.put('/api/users/:username', async (req, res) => {

    let username = req.params.username;
    let type = req.body;

    if (Object.keys(req.body).length === 0 || username === undefined ||
    (type.oldType !== "customer" && type.oldType !== "qualityEmployee" && type.oldType !== "clerk" && type.oldType !== "deliveryEmployee" && type.oldType !== "supplier") ||
    (type.newType !== "customer" && type.newType !== "qualityEmployee" && type.newType !== "clerk" && type.newType !== "deliveryEmployee" && type.newType !== "supplier")
    ){
        return res.status(422).json({ error: 'Unprocessable entity' });
    }
    try {
        await u.updateUserType(db, username, type);
        return res.status(200).end();
    }
    catch (err) {
        if (err.message === "ID not found") {
            res.status(404).end()
        } else if (err.message === "Permission not allowed"){
            res.status(422).end()
        } else {
            res.status(503).end()
        }
    }
})


/* SESSIONS */

/* CUSTOMER SESSIONS */

app.post('/api/customerSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.customerSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end()
        }
        else {
            res.status(500).end();
        }
    }
})

/* SUPPLIER SESSIONS */

app.post('/api/supplierSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.supplierSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end()
        }
        else {
            res.status(500).end();
        }
    }
})

/* MANAGER SESSIONS */

app.post('/api/managerSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.managerSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end();
        }
        else {
            res.status(500).end();
        }
    }
})


/* CLERK SESSIONS */

app.post('/api/clerkSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.clerkSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end();
        }
        else {
            res.status(500).end();
        }
    }
})


/* QUALITY EMPLOYEE SESSIONS */

app.post('/api/qualityEmployeeSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.qualityEmployeeSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end();
        }
        else {
            res.status(500).end();
        }
    }
})

/* DELIVERY EMPLOYEE SESSIONS */

app.post('/api/deliveryEmployeeSessions', async(req, res) => {
    let credentials = req.body;
    if (credentials.length === 0 ||
        credentials.username === undefined ||
        credentials.password === undefined){
        res.status(422).json("Undefined credentials")
    }
    try {
        const user = await u.deliveryEmployeeSession(db, credentials);
        res.status(200).json(user);
    }
    catch(err){
        if(err.message === "Wrong credentials"){
            res.status(401).end();
        }
        else {
            res.status(500).end();
        }
    }
})



/* Delete table */

app.delete('/api/user/emergenza/emergenza', async (req, res) => {
    try {
    await u.dropTable(db);
    res.status(204).end()
    }
    catch (err) {
    res.status(500).end()
    }
});


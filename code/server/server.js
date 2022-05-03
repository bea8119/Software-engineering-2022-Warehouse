'use strict';
const express = require('express');
const SKU_DAO = require('./SKU_DAO');
// init express
const app = new express();
const port = 3001;

const db = new SKU_DAO('Prova');

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

app.post('/api/sku', async (req, res) => {
  if (Object.keys (req.body).length === 0) {
  return res.status(422).json({error: 'Empty body request'});
  }
  let sku = req.body.sku;
  if (sku === undefined ) {
  return res.status (422).json({error: 'Invalid user data'});
  }
  await db.newTableName();
  db.storeSKU(sku);
  return res.status (201).end();
});


app.get('/api/skus', async (req, res) => {
try {
const SKUlist = await db.getStoredSKU();
res.status(200).json(SKUlist);
} catch (err) {
res.status(500).end();
}
});

app.delete('/api/skus', (req, res) => {
try {
db.dropTable();
res.status(204).end();
}
catch (err) {
  res.status(500).end();
}
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
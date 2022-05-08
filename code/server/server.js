'use strict';

const express = require('express');
const sqlite = require('sqlite3');

/* Express and database initialization */
const app = new express();
const port = 3001;
const dbname = 'Prova';
const db = new sqlite.Database(dbname, (err) => { if (err) throw err; });

app.use(express.json());


/* Server activation */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


/* Objects to export */
module.exports = {
  app: app, 
  db: db
};

/* API modules to import */ 
require('./API/SKU_API');
require('./API/POSITION_API');
require('./API/SKUITEM_API');
require('./API/TestDescriptor_API');
require('./API/ITEM_API');


'use strict';

const express = require('express');


/* Express and database initialization */
const app = new express();
const port = 3001;
app.use(express.json());

/* Server activation */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


/* Objects to export */
module.exports = {
  app: app, 
};




/* API modules to import */ 
require('./dbinit')
require('./API/INTERNAL/SKU_API');
require('./API/INTERNAL/POSITION_API');
require('./API/INTERNAL/SKUITEM_API');
require('./API/INTERNAL/TestDescriptor_API');
require('./API/EXTERNAL/ITEM_API');
require('./API/INTERNAL/InternalOrder_API');
require('./API/SUPPLIERINTERFACE/RESTOCKORDER_API');
require('./API/USER/USER_API');
require('./API/SUPPLIERINTERFACE/RETURNORDER_API');
require('./API/INTERNAL/TESTRESULT_API');

module.exports = app;
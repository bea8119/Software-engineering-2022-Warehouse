'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

/* Import ITEM_DAO datainterface */
const ITEM_DAO = require('../datainterface/InternalOrder_DAO');
const i = new InternalOrder_DAO();
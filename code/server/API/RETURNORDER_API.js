'use strict';

/* Import server module */
const server = require("../server");
const app = server.app;
const db = server.db;

const ReturnOrder_DAO = require('../datainterface/ReturnOrder_DAO');
const r = new ReturnOrder_DAO();
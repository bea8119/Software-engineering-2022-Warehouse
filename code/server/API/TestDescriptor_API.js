'use strict'

const server = require("../server");
const app = server.app;
const db = server.db;

/* Import testDescriptor_DAO datainterface */
const SKU_DAO = require('../datainterface/TestDescriptor_DAO');
const s =  new SKU_DAO();
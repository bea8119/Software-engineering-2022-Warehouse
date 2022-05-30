const ITEM_DAO = require("./datainterface/EXTERNAL/ITEM_DAO");
const i = new ITEM_DAO()

const InternalOrder_DAO = require("./datainterface/INTERNAL/InternalOrder_DAO");
const io = new InternalOrder_DAO()

const POSITION_DAO = require("./datainterface/INTERNAL/POSITION_DAO");
const p = new POSITION_DAO()

const SKUITEM_DAO = require("./datainterface/INTERNAL/SKUITEM_DAO");
const si = new SKUITEM_DAO()

const SKU_DAO = require("./datainterface/INTERNAL/SKU_DAO");
const s = new SKU_DAO()

const TestDescriptor_DAO = require("./datainterface/INTERNAL/TestDescriptor_DAO");
const td = new TestDescriptor_DAO()

const TESTRESULT_DAO = require("./datainterface/INTERNAL/TESTRESULT_DAO");
const tr = new TESTRESULT_DAO()

const RESTOCKORDER_DAO = require("./datainterface/SUPPLIERINTERFACE/RESTOCKORDER_DAO");
const rko = new RESTOCKORDER_DAO()

const ReturnOrder_DAO = require("./datainterface/SUPPLIERINTERFACE/RETURNORDER_DAO");
const rno = new ReturnOrder_DAO()

const USER_DAO = require("./datainterface/USER/USER_DAO");
const u = new USER_DAO()

/* Import database module */
const database = require("./database")
const db = database.db;

/* Database cleaning */

async function cleanDatabase(db) {
    await i.dropTable(db);
    await io.dropTable(db);
    await p.dropTable(db);
    await si.dropTable(db);
    await s.dropTable(db);
    await td.dropTable(db);
    await tr.dropTable(db);
    await rko.dropTable(db);
    await rno.dropTable(db);
    await u.dropTable(db);
    await i.newTableName(db);
    await io.newTableName(db);
    await p.newTableName(db);
    await si.newTableName(db);
    await s.newTableName(db);
    await td.newTableName(db);
    await tr.newTableName(db);
    await rko.newTableName(db);
    await rno.newTableName(db);
    await u.newTableName(db);
    await u.storeUser(db, user1)
    await u.storeUser(db, user2)
    await u.storeUser(db, user3)
    await u.storeUser(db, user4)
    await u.storeUser(db, user5)
    await u.storeUser(db, user6)
}

/* Users */

user1 = {
    username: "user1@ezwh.com",
    name: "John",
    surname: "Smith1",
    password: "testpassword",
    type: "customer"
}

user2 = {
    username: "qualityEmployee1@ezwh.com",
    name: "John",
    surname: "Smith2",
    password: "testpassword",
    type: "qualityEmployee"
}

user3 = {
    username: "clerk1@ezwh.com",
    name: "John",
    surname: "Smith3",
    password: "testpassword",
    type: "clerk"
}

user4 = {
    username: "deliveryEmployee1@ezwh.com",
    name: "John",
    surname: "Smith4",
    password: "testpassword",
    type: "deliveryEmployee"
}

user5 = {
    username: "supplier1@ezwh.com",
    name: "John",
    surname: "Smith5",
    password: "testpassword",
    type: "supplier"
}

user6 = {
    username: "manager1@ezwh.com",
    name: "John",
    surname: "Smith6",
    password: "testpassword",
    type: "manager"
}

cleanDatabase(db)

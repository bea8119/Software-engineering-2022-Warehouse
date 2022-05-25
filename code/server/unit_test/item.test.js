const ITEM_DAO = require('../datainterface/External/ITEM_DAO');
const i = new ITEM_DAO();
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO');
const t = new SKU_DAO();
const RESTOCKORDER_DAO = require('../datainterface/SUPPLIERINTERFACE/RESTOCKORDER_DAO');
const ro = new RESTOCKORDER_DAO;
const database = require("../database");
const db = database.db;

describe("Test items", () => {
    beforeEach(async () => {
        await t.dropTable(db);
        await i.dropTable(db);
        await ro.dropTable(db);

        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        let restockOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{SKUId: 12, description: "a product", price: 10.99, qty: 30},
                        {SKUId: 180, description: "another product", price: 11.99, qty: 20}],
            supplierId : 1
        }
        let item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }
        try {
            await t.newTableName(db);
            await t.storeSKU(db, sku);
            await ro.newTableName(db);
            await ro.storeRestockOrder(db, restockOrder);
            await i.newTableName(db);
            await i.storeITEM(db, item);
        }
        catch (err) {
            console.log(err);
        }
    });

    // testTry(); 

    testGetStoredITEM(1, "a new item", 10.99, 1, 1);
    testStoreITEM(2, "a new item", 10.99, 1, 1, 13, 180);
    testGetStoredITEMbyID(1, "a new item", 10.99, 1, 1, 2, null);
    testUpdateItem(1, "a new item", 10.99, 1, 1, 13);
    testDeleteItem(1, 13);
    
    
});

function testGetStoredITEM(Id, Description, Price, SKUID, SupplierId) {
    test("Testing getStoredITEM", async () => {
        let res = await i.getStoredITEM(db);
        //console.log(res);
        expect(res).toEqual([{
            id: Id,
            description: Description,
            price: Price,
            SKUId: SKUID,
            supplierId: SupplierId
        }]);
    });
}

function testStoreITEM(Id, Description, Price, SKUID, SupplierId, wrongskuid, alreadySellsSkuid) {
    describe("Testing storeITEM", () => {
        test('SKUId existing', async () => {
            const data = {
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            }
            await i.storeITEM(db, data);
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('SKUId existing; Item already sells', async () => {
            const alreadySells = {
                id: alreadySellsSkuid,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            }
            await expect(i.storeITEM(db, alreadySells)).rejects.toThrow('Item already sells');
        });

        test('SKUId not existing', async () => {
            const wrongdata = {
                id: Id,
                description: Description,
                price: Price,
                SKUId: wrongskuid,
                supplierId: SupplierId
            }
            await expect(i.storeITEM(db, wrongdata)).rejects.toThrow('SKU not found');
        });

    });
}

function testGetStoredITEMbyID(Id, Description, Price, SKUID, SupplierId, wrongId, wrongDb) {
    describe('Testing getStoredITEMbyID', () => {
        test('Item ID existing', async () => {
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('Item ID not existing', async () => {
            await expect(i.getStoredITEMbyID(db, wrongId)).rejects.toThrow('ID not found');
        });
    });
}

function testUpdateItem(Id, Description, Price, SKUID, SupplierId, wrongId) {
    describe('Testing updateItem', () => {
        test('Item found; description undefined', async () => {
            let newItem = {
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            }
            await i.updateItem(db, Id, newItem);
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('Item found; price undefined', async () => {
            let newItem = {
                id: Id,
                description: Description,
                SKUId: SKUID,
                supplierId: SupplierId
            }
            await i.updateItem(db, Id, newItem);
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('Item found; SKUID undefined', async () => {
            let newItem = {
                id: Id,
                description: Description,
                price: Price,
                supplierId: SupplierId
            }
            await i.updateItem(db, Id, newItem);
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('Item found; supplier ID undefined', async () => {
            let newItem = {
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID
            }
            await i.updateItem(db, Id, newItem);
            var res = await i.getStoredITEMbyID(db, Id);
            expect(res).toEqual({
                id: Id,
                description: Description,
                price: Price,
                SKUId: SKUID,
                supplierId: SupplierId
            });
        });

        test('No Item ID found exception', async () => {
            await expect(i.updateItem(db, wrongId)).rejects.toThrow('ID not found');
        });
    });
}

function testDeleteItem(Id, wrongId) {
    describe('Testing deleteItem', () => {
        test('Item ID existing', async () => {
            await i.deleteItem(db, Id)
            await expect(i.getStoredITEMbyID(db, Id)).rejects.toThrow('ID not found');
        })

        test('Item ID not existing', async () => {
            await expect(i.deleteItem(db, wrongId)).rejects.toThrow('ID not found');
        })
    })
}

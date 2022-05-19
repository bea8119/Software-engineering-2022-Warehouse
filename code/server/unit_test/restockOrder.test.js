const RESTOCKORDER_DAO = require('../datainterface/SUPPLIERINTERFACE/RESTOCKORDER_DAO')
const r = new RESTOCKORDER_DAO()
const database = require("../database");
const db = database.db;

describe("test restockOrders", () => {
    beforeEach(async () => {
        await r.dropTable(db);
        let restockOrder =
        {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
            supplierId: 1
        }
        try {
            await r.newTableName(db);
            await r.storeRestockOrder(db, restockOrder);
        } catch (err) {
            console.log(err)
        }
    })
    testGetStoredRestockOrder();
    testStoreRestockOrder(2);
    /*
    testGetStoredSkuItemByRFID("12345678901234567890123456789041", "12345678901234567890123456789626")
    testGetAvailableStoredSKUItem(1, 2)
    testUpdateSKUItem("12345678901234567890123456789041", "12345678901234567890123456789626")
    testDeleteSKUItem("12345678901234567890123456789041", "12345678901234567890123456789626")*/
});


function testGetStoredRestockOrder() {
    test("Testing getStoredRestockOrder", async () => {
        let res = await r.getStoredRestockOrder(db)
        expect(res).toEqual(
            [
                {
                    id: 1,
                    issueDate: "2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    transportNote: {},
                    skuItems: []
                }
            ]
        )
    })
}

function testStoreRestockOrder(id) {
    test("Testing storeRestockOrder", async () => {
        restockOrder = {
            issueDate: "2021/11/29 10:30",
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 180, description: "another product", price: 8.99, qty: 20 }],
            supplierId: 1
        }

        await r.storeRestockOrder(db, restockOrder);

        var res = await r.getStoredRestockOrderById(db, id);
        expect(res).toEqual(
            {
                issueDate: "2021/11/29 10:30",
                state: "ISSUED",
                products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
                {SKUId: 180, description: "another product", price: 8.99, qty: 20 }],
                supplierId: 1,
                transportNote: {},
                skuItems: []

            }
        );

    })
}


function testGetStoredRestockOrderById(id, wrongrfid) {
    describe('Testing getStoredRestockOrderById', () => {

        test('ID existing', async () => {
            var res = await r.getStoredRestockOrderById(db, id);
            expect(res).toEqual(
                {
                    issueDate:"2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{SKUId:12,description:"a product",price:10.99,qty:30},
                                {SKUId:180,description:"another product",price:11.99,qty:20}],
                    supplierId : 1,
                    transportNote:{},
                    skuItems : []
        
                }
        
            )
        });

        test('RFID note existing', async () => {
            await expect(s.getStoredSKUItemByRFID(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}

/*
function testGetAvailableStoredSKUItem(skuid, wrongskuid) {
    describe('Testing getAvailableStoredSkuItem', () => {

        test('No available skuitems found', async () => {
            var res = await s.getAvailableStoredSKUItem(db, skuid);
            expect(res).toEqual([])
        });

        test('Available skuitem found', async () => {
            let newskuitem = {
                newRFID: "12345678901234567890123456789041",
                newAvailable: 1,
                newDateOfStock: "2021/11/29 12:30"
            }
            await s.updateSKUItem(db, "12345678901234567890123456789041", newskuitem)
            var res = await s.getAvailableStoredSKUItem(db, skuid);
            expect(res).toEqual([{
                RFID: "12345678901234567890123456789041",
                SKUId: 1,
                DateOfStock: "2021/11/29 12:30"
            }])
        })

        test('No SKUId found exception', async () => {
            await expect(s.getAvailableStoredSKUItem(db, wrongskuid)).rejects.toThrow('ID not found');

        })
    })
}

function testUpdateSKUItem(rfid, wrongrfid) {
    describe('Testing getAvailableStoredSkuItem', () => {
        test('Available skuitem found', async () => {
            let newskuitem = {
                newRFID: "12345678901234567890123456789321",
                newAvailable: 0,
                newDateOfStock: "2021/11/29 12:35"
            }
            await s.updateSKUItem(db, rfid, newskuitem)
            var res = await s.getStoredSKUItemByRFID(db, newskuitem.newRFID);
            expect(res).toEqual({
                RFID: newskuitem.newRFID,
                SKUId: 1,
                Available: newskuitem.newAvailable,
                DateOfStock: newskuitem.newDateOfStock
            })
        });

        test('No SKUId found exception', async () => {
            await expect(s.updateSKUItem(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}

function testDeleteSKUItem(rfid, wrongrfid) {
    describe('Testing deleteSKUItem', () => {
        test('RFID existing', async () => {
            await s.deleteSKUItem(db, rfid)
            await expect(s.getStoredSKUItemByRFID(db, rfid)).rejects.toThrow('ID not found');
        })

        test('RFID not existing', async () => {
            await expect(s.deleteSKUItem(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}*/
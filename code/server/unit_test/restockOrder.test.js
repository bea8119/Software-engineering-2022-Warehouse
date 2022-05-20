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
    testGetStoredRestockOrderById(1, 2)
    testStoreRestockOrder(2);
    testUpdateRestockOrderState(1, 2, "DELIVERED")
    testGetStoredRestockOrderIssued();
    /*
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
            products: [
                { SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                { SKUId: 180, description: "another product", price: 8.99, qty: 20 }
            ],
            supplierId: 1
        }

        await r.storeRestockOrder(db, restockOrder);

        var res = await r.getStoredRestockOrderById(db, id);
        expect(res).toEqual(
            {
                issueDate: "2021/11/29 10:30",
                state: "ISSUED",
                products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                { SKUId: 180, description: "another product", price: 8.99, qty: 20 }],
                supplierId: 1,
                transportNote: {},
                skuItems: []

            }
        );

    })
}


function testGetStoredRestockOrderById(id, wrongid) {
    describe('Testing getStoredRestockOrderById', () => {

        test('ID existing', async () => {
            var res = await r.getStoredRestockOrderById(db, id);
            expect(res).toEqual(
                {
                    issueDate: "2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    transportNote: {},
                    skuItems: []

                }

            )
        });

        test('ID not existing', async () => {
            await expect(r.getStoredRestockOrderById(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}



function testUpdateRestockOrderState(id, wrongid, newstate) {
    let state = {
        newState: newstate
    }
    describe('Testing updateRestockOrderState', () => {
        test('ID found', async () => {
            await r.updateRestockOrderState(db, id, state);
            var res = await r.getStoredRestockOrderById(db, id)
            expect(res).toEqual(
                {
                    issueDate: "2021/11/29 09:33",
                    state: state.newState,
                    products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    transportNote: {},
                    skuItems: []

                }
            );
        })

        test('ID not found', async () => {
            await expect(r.updateRestockOrderState(db, wrongid, state)).rejects.toThrow('ID not found');
        })
    })
}


function testGetStoredRestockOrderIssued() {
    test('Testing GetStoredRestockOrderIssued', async () => {
        restockOrder = {
            issueDate: "2021/11/30 12:30",
            products: [
                { SKUId: 17, description: "a product", price: 10.99, qty: 30 },
                { SKUId: 125, description: "another product", price: 8.99, qty: 20 }
            ],
            supplierId: 1
        }
        await r.storeRestockOrder(db, restockOrder);
        await r.updateRestockOrderState(db, 1, "DELIVERED")
        var res = await r.getStoredRestockOrderIssued(db);
        expect(res).toEqual(
            [
                {
                    id: 2,
                    issueDate: "2021/11/30 12:30",
                    state: "ISSUED",
                    products: [{ SKUId: 17, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 125, description: "another product", price: 8.99, qty: 20 }],
                    supplierId: 1,
                    skuItems: []
                },
            ]
        )
    })
}

/*
function testUpdateRestockOrderTransportNote(id, wrongid) {
    describe('Testing UpdateRestockOrderTransportNote', () => {
        restockOrder = {
            issueDate: "2021/11/30 12:30",
            products: [
                { SKUId: 17, description: "a product", price: 10.99, qty: 30 },
                { SKUId: 125, description: "another product", price: 8.99, qty: 20 }
            ],
            supplierId: 1
        }
        await r.storeRestockOrder(db, restockOrder);
        await r.updateRestockOrderState(db, 1, "DELIVERED")
    test('Delivered RO and ROID existing', async () => {
        transportNote = 
            {
                transportNote:{deliveryDate:"2021/12/29"}
            }

        await r.updateRestockOrderTransportNote(db, id, restockOrder);
        var res = await r.getStoredRestockOrderIssued(db);
        expect(res).toEqual(
            [
                {
                    id: 2,
                    issueDate: "2021/11/30 12:30",
                    state: "ISSUED",
                    products: [{ SKUId: 17, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 125, description: "another product", price: 8.99, qty: 20 }],
                    supplierId: 1,
                    skuItems: []
                },
            ]
        )
    })
})
}*/

/*
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
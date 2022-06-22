const RESTOCKORDER_DAO = require('../datainterface/SUPPLIERINTERFACE/RESTOCKORDER_DAO')
const TestDescriptor_DAO = require('../datainterface/INTERNAL/TestDescriptor_DAO')
const TESTRESULT_DAO = require('../datainterface/INTERNAL/TESTRESULT_DAO')
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO');
const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const ITEM_DAO = require('../datainterface/External/ITEM_DAO');
const i = new ITEM_DAO();
const r = new RESTOCKORDER_DAO()
const td = new TestDescriptor_DAO()
const tr = new TESTRESULT_DAO()
const s = new SKU_DAO()
const si = new SKUITEM_DAO()
const database = require("../database");
const db = database.db;

describe("test restockOrders", () => {
    beforeEach(async () => {
        await tr.dropTable(db);
        await td.dropTable(db);
        await r.dropTable(db);
        await s.dropTable(db);
        await si.dropTable(db);
        await i.dropTable(db);

        let item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }
        let item2 = {
            id: 2,
            description: "a new item2",
            price: 10.99,
            SKUId: 2,
            supplierId: 1
        }

        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        let sku2 = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let skuitem1 =
        {
            RFID: "12345678901234567890123456789747",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let skuitem2 =
        {
            RFID: "12345678901234567890123456789748",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let testDescriptor = {
            name: "test descriptor 3",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testResult1 =
        {
            rfid: "12345678901234567890123456789747",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: true
        }

        let testResult2 = {
            rfid: "12345678901234567890123456789747",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: true
        }
        let testResult3 = {
            rfid: "12345678901234567890123456789748",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: true
        }
        let testResult4 = {
            rfid: "12345678901234567890123456789748",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: false
        }
        let restockOrder =
        {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 } ],
            supplierId: 1
        }
        try {
            await tr.newTableName(db);
            await td.newTableName(db);
            await s.newTableName(db);
            await si.newTableName(db);
            await r.newTableName(db);
            await i.newTableName(db);

            await r.storeRestockOrder(db, restockOrder);
            await s.storeSKU(db, sku);
            await s.storeSKU(db, sku2);
            await si.storeSKUItem(db, skuitem1);
            await si.storeSKUItem(db, skuitem2);
            await i.storeITEM(db, item);
            await i.storeITEM(db, item2);
            await td.storeTestDescriptor(db, testDescriptor);
            await tr.storeTestResult(db, testResult1);
            await tr.storeTestResult(db, testResult2);
            await tr.storeTestResult(db, testResult3);
            await tr.storeTestResult(db, testResult4);


        } catch (err) {
            console.log(err)
        }
    })
    testGetStoredRestockOrder();
    testGetStoredRestockOrderById(1, 2)
    testStoreRestockOrder(2);
    testUpdateRestockOrderState(1, 2, "DELIVERED")
    testGetStoredRestockOrderIssued();
    testUpdateRestockOrderTransportNote(1, 2)
    testUpdateRestockOrderSkuItems(1, 2)
    testGetSkuItemsToReturn(1, 2)
    testDeleteRestockOrder(1, 2)
});


function testGetStoredRestockOrder() {

    describe("Testing getStoredRestockOrder", () => {
        test("Testing getStoredRestockOrder (0 restockOrders)", async () => {
            await r.deleteRestockOrder(db, 1)
            let res = await r.getStoredRestockOrder(db)
            expect(res).toEqual(
                []
            )
        })
        test("Testing getStoredRestockOrder (1 restockOrder)", async () => {
            let res = await r.getStoredRestockOrder(db)
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        issueDate: "2021/11/29 09:33",
                        state: "ISSUED",
                        products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                        supplierId: 1,
                        transportNote: {},
                        skuItems: []
                    }
                ]
            )
        })
        test("Testing getStoredRestockOrder (2 restockOrders)", async () => {
            restockOrder = {
                issueDate: "2021/11/29 10:31",
                products: [
                    { SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }
                ],
                supplierId: 1
            }
    
            await r.storeRestockOrder(db, restockOrder);
            let res = await r.getStoredRestockOrder(db)
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        issueDate: "2021/11/29 09:33",
                        state: "ISSUED",
                        products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                        supplierId: 1,
                        transportNote: {},
                        skuItems: []
                    },
                    {
                        id: 2,
                        issueDate: "2021/11/29 10:31",
                        state: "ISSUED",
                        products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                        supplierId: 1,
                        transportNote: {},
                        skuItems: []
                    }
                ]
            )
        }) 
    })
}

function testStoreRestockOrder(id) {
    test("Testing storeRestockOrder", async () => {
        restockOrder = {
            issueDate: "2021/11/29 10:30",
            products: [
                { SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }
            ],
            supplierId: 1
        }

        await r.storeRestockOrder(db, restockOrder);

        var res = await r.getStoredRestockOrderById(db, id);
        expect(res).toEqual(
            {
                issueDate: "2021/11/29 10:30",
                state: "ISSUED",
                products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
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
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
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
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
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
                { SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }
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
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                    supplierId: 1,
                    skuItems: []
                },
            ]
        )
    })
}

function testUpdateRestockOrderTransportNote(id, wrongid) {
    let state = {
        newState: "DELIVERY"
    }

    let wrongstate = {
        newState: "COMPLETEDRETURN"
    }
    describe('Testing UpdateRestockOrderTransportNote', () => {
        test('State DELIVERY and ROID existing and DeliveryDate >= IssueDate', async () => {
            await r.updateRestockOrderState(db, id, state)
            transportNote =
            {
                transportNote: { deliveryDate: "2021/11/30" }
            }
            await r.updateRestockOrderTransportNote(db, id, transportNote)
            var res = await r.getStoredRestockOrderById(db, id);
            expect(res).toEqual(
                {
                    issueDate: "2021/11/29 09:33",
                    state: "DELIVERY",
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                    supplierId: 1,
                    transportNote: { deliveryDate: "2021/11/30" },
                    skuItems: []
                },
            )
        })

        test('State DELIVERY and ROID existing and DeliveryDate < IssueDate', async () => {
            await r.updateRestockOrderState(db, id, state)
            transportNote =
            {
                transportNote: { deliveryDate: "2021/11/28" }
            }
            await expect(r.updateRestockOrderTransportNote(db, id, transportNote)).rejects.toThrow('Delivery date before issue date');

        })

        test('ROID not existing', async () => {
            transportNote =
            {
                transportNote: { deliveryDate: "2021/11/30" }
            }
            await expect(r.updateRestockOrderTransportNote(db, wrongid, transportNote)).rejects.toThrow('ID not found');

        })

        test('State NOT DELIVERY', async () => {
            await r.updateRestockOrderState(db, id, wrongstate)
            transportNote =
            {
                transportNote: { deliveryDate: "2021/11/30" }
            }
            await expect(r.updateRestockOrderTransportNote(db, id, transportNote)).rejects.toThrow('Not DELIVERY state');

        })
    })
}

function testUpdateRestockOrderSkuItems(id, wrongid) {
    let state = {
        newState: "DELIVERED"
    }
    let wrongstate = {
        newState: "COMPLETEDRETURN"
    }
    let skuitems1 =
    {
        skuItems: [{ SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789016" }, { SKUId: 2, itemId: 2, rfid: "12345678901234567890123456789017" }]
    }
    let skuitems2 =
    {
        skuItems: [{ SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789011" }, { SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789014" }]
    }

    describe('Testing UpdateRestockOrderSkuItems', () => {
        test('State DELIVERED, ROID existing, single array of skuItems added', async () => {
            await r.updateRestockOrderState(db, id, state)
            await r.updateRestockOrderSkuItems(db, id, skuitems1)
            var res = await r.getStoredRestockOrderById(db, id);
            expect(res).toEqual(
                {
                    issueDate: "2021/11/29 09:33",
                    state: "DELIVERED",
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
                    supplierId: 1,
                    transportNote: {},
                    skuItems: [{ SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789016" }, { SKUId: 2, itemId: 2, rfid: "12345678901234567890123456789017" }]
                },
            )
        })

       /* test('State DELIVERED, ROID existing, multiple array of skuItems added', async () => {
            await r.updateRestockOrderState(db, id, state)
            await r.updateRestockOrderSkuItems(db, id, skuitems1)
            await r.updateRestockOrderSkuItems(db, id, skuitems2)
            var res = await r.getStoredRestockOrderById(db, id);
            expect(res).toEqual(
                {
                    issueDate: "2021/11/29 09:33",
                    state: "DELIVERED",
                    products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    transportNote: {},
                    skuItems: [
                        { SKUId: 12, rfid: "12345678901234567890123456789016" },
                        { SKUId: 12, rfid: "12345678901234567890123456789017" },
                        { SKUId: 13, rfid: "12345678901234567890123456789011" },
                        { SKUId: 8, rfid: "12345678901234567890123456789014" }
                    ]
                },
            )
        })*/


        test('ROID not existing', async () => {
            await expect(r.updateRestockOrderSkuItems(db, wrongid, skuitems1)).rejects.toThrow('ID not found');

        })

        test('State NOT DELIVERED', async () => {
            await r.updateRestockOrderState(db, id, wrongstate)
            await expect(r.updateRestockOrderSkuItems(db, id, skuitems1)).rejects.toThrow('Not DELIVERED state');

        })
    })
}

function testGetSkuItemsToReturn(id, wrongid) {
    let state1 = {
        newState: "DELIVERED"
    }
    let state2 = {
        newState: "COMPLETEDRETURN"
    }
    let wrongstate = {
        newState: "ISSUED"
    }
    let skuitems1 =
    {
        skuItems: [{ SKUId: 2, itemId: 2, rfid: "12345678901234567890123456789747" }, { SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789748" }]
    }

    describe('Testing UpdateRestockOrderSkuItems', () => {
        test('State COMPLETEDRETURN, ROID existing', async () => {
            await r.updateRestockOrderState(db, id, state1)
            await r.updateRestockOrderSkuItems(db, id, skuitems1)
            await r.updateRestockOrderState(db, id, state2)
            var res = await r.getSkuItemsToReturn(db, id);
            expect(res).toEqual(
                [{ SKUId: 1, itemId: 1,  rfid: "12345678901234567890123456789748" }]
            )
        })

        test('ROID not existing', async () => {
            await expect(r.getSkuItemsToReturn(db, wrongid)).rejects.toThrow('ID not found');

        })

        test('State NOT COMPLETEDRETURN', async () => {
            await r.updateRestockOrderState(db, id, wrongstate)
            await expect(r.getSkuItemsToReturn(db, id)).rejects.toThrow('Not COMPLETEDRETURN state');

        })
    })
}


function testDeleteRestockOrder(id, wrongid) {
    describe('Testing deleteRestockOrder', () => {
        test('ROID existing', async () => {
            await r.deleteRestockOrder(db, id)
            await expect(r.getStoredRestockOrderById(db, id)).rejects.toThrow('ID not found');
        })

        test('ROID not existing', async () => {
            await expect(r.deleteRestockOrder(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}
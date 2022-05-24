const RETURNORDER_DAO = require('../datainterface/SUPPLIERINTERFACE/RETURNORDER_DAO')
const r = new RETURNORDER_DAO()
const database = require("../database");
const db = database.db;

describe("test RETURNORDER", () => {
    beforeEach(async () => {

        await r.dropTable(db);


        let returnOrder = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 12, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
            { SKUId: 180, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }],
            restockOrderId: 1
        }

        try {
            await r.newTableName(db);
            await r.storeReturnOrder(db, returnOrder);
        } catch (err) {
            console.log(err);
        }
    });

    testStoreReturnOrders(2);
    testGetStoredReturnOrders();
    testDeleteReturnOrders(1, 10);

});

function testGetStoredReturnOrders() {
    test("Testing getStoredReturnOrders", async () => {

        var res = await r.getStoredReturnOrders(db);

        expect(res).toEqual([{
            id: 1,
            returnDate: "2021/11/29 09:33",
            products: [{
                SKUId: 12,
                description: "a product",
                price: 10.99,
                RFID: "12345678901234567890123456789016"
            },
            {
                SKUId: 180,
                description: "another product",
                price: 11.99,
                RFID: "12345678901234567890123456789038"
            }],
            restockOrderId: 1
        }])
    })
}


function testStoreReturnOrders(id) {

    test("Testing storeReturnOrder", async () => {
        let rO = {
            returnDate: "2021/11/23 09:33",
            products: [{ SKUId: 1, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
            { SKUId: 2, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }],
            restockOrderId: 2
        }

        await r.storeReturnOrder(db, rO);

        var res = await r.getStoredReturnOrderById(db, id);

        expect(res).toEqual({
            id: 2,
            returnDate: "2021/11/23 09:33",
            products: [{
                SKUId: 1,
                description: "a product",
                price: 10.99,
                RFID: "12345678901234567890123456789016"
            },
            {
                SKUId: 2,
                description: "another product",
                price: 11.99,
                RFID: "12345678901234567890123456789038"
            }],
            restockOrderId: 2
        })

    });

}

function testDeleteReturnOrders(id, wrongid) {

    describe("Testing deleteReturnOrder", () => {
        test('id existing', async () => {
            await r.deleteReturnOrder(db, id)
            await expect(r.getStoredReturnOrderById(db, id)).rejects.toThrow('ID not found');
        })

        test('id not existing', async () => {
            await expect(r.deleteReturnOrder(db, wrongid)).rejects.toThrow('ID not found');
        })
    });
}
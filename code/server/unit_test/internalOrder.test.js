const InternalOrder_DAO = require('../datainterface/INTERNAL/InternalOrder_DAO');
const i = new InternalOrder_DAO()
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO');
const t = new SKU_DAO();
const database = require("../database");
const db = database.db;

describe("Test internal order", () => {
    beforeEach(async () => {
        await i.dropTable(db);
        await t.dropTable(db);

        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 },
            { SKUId: 180, description: "another product", price: 11.99, qty: 3 }],
            customerId: 1
        }
        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        try {
            await i.newTableName(db);
            await i.storeInternalOrder(db, internalOrder);
            await t.newTableName(db);
            await t.storeSKU(db, sku);

            console.log("InternalOrder");
            console.log(await i.getStoredInternalOrder(db));
        }
        catch (err) {
            console.log(err);
        }
    });
    const products = [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 },
            { SKUId: 180, description: "another product", price: 11.99, qty: 3 }];
    testGetStoredInternalOrder(1, "2021/11/29 09:33", "ACCEPTED", products, 1 );
});

function testGetStoredInternalOrder(Id, IssueDate, State, Products, RestockOrderId){
    test("Testing getStoresInternalOrder", async () => {
        let res = await i.getStoredInternalOrder(db);
        expect(res).toEqual([{
            id: Id,
            issueDate: IssueDate,
            state: State,
            products: Products,
            restockOrderId: RestockOrderId
        }]); 
    });

}
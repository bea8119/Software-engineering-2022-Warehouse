const InternalOrder_DAO = require('../datainterface/INTERNAL/InternalOrder_DAO');
const i = new InternalOrder_DAO();
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
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 }],
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
        }
        catch (err) {
            console.log(err);
        }
    });
    const products = [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 }];
    const completedProducts = [{ SkuId: 12, RFID: "12345678901234567890123456789016" }];
    const wrongCompletedProducts = [{ SkuId: 12, RFID: "12345678901234567890123456789014" }];
    const expectedProduct = [{ SKUId: 12, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" }];

    testGetStoredInternalOrder(1, "2021/11/29 09:33", "ACCEPTED", products, 1);
    testStoreInternalOrder(2, "2021/11/29 09:33", "ACCEPTED", products, 1);
    testGetStoredInternalOrderById(1, "2021/11/29 09:33", "ACCEPTED", products, 1, 13);
    testGetStoredInternalOrderIssued(1, "2021/11/29 09:33", "ISSUED", products, 1, "ACCEPTED");
    testGetStoredInternalOrderAccepted(1, "2021/11/29 09:33", "ACCEPTED", products, 1, "ISSUED");
    testUpdateInternalOrderSkuProducts(1, "2021/11/29 09:33", "COMPLETED", completedProducts, 1, 13, expectedProduct, wrongCompletedProducts);
    testUpdateInternalOrderState(1, "2021/11/29 09:33", "ACCEPTED", products, 1, 13);
    testDeleteInternalOrder(1, 13);


    let internalOrder = {
        id: 1,
        state: "ACCEPTED",
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 }],
        customerId: 1
    }
    let internalOrder1 = {
        id: 2,
        state: "ACCEPTED",
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 }],
        customerId: 1
    }
    testLoopGetStoredInternalOrder(internalOrder, internalOrder1);
});

function testGetStoredInternalOrder(Id, IssueDate, State, Products, CustomerId) {
    test("Testing getStoredInternalOrder", async () => {
        let res = await i.getStoredInternalOrder(db);
        expect(res).toEqual([{
            id: Id,
            issueDate: IssueDate,
            state: State,
            products: Products,
            customerId: CustomerId
        }]);
    });

}

function testStoreInternalOrder(Id, IssueDate, State, Products, CustomerId) {
    test('Internal order existing', async () => {
        const internalOrder = {
            issueDate: IssueDate,
            products: Products,
            customerId: CustomerId
        }
        await i.storeInternalOrder(db, internalOrder);
        var res = await i.getStoredInternalOrderById(db, Id);
        expect(res).toEqual({
            id: Id,
            issueDate: IssueDate,
            state: State,
            products: Products,
            customerId: CustomerId
        });
    });
}

function testGetStoredInternalOrderById(Id, IssueDate, State, Products, CustomerId, wrongId) {
    describe('Testing getStoredInternalOrderById', () => {
        test('Internal order ID existing', async () => {
            var res = await i.getStoredInternalOrderById(db, Id);
            expect(res).toEqual({
                id: Id,
                issueDate: IssueDate,
                state: State,
                products: Products,
                customerId: CustomerId
            });
        });

        test('Internal order ID not existing', async () => {
            await expect(i.getStoredInternalOrderById(db, wrongId)).rejects.toThrow('ID not found');
        });
    });
}

function testGetStoredInternalOrderIssued(Id, IssueDate, NewState, Products, CustomerId, wrongState) {
    describe('Testing getStoredInternalOrderIssued', () => {
        test('Correct new state', async () => {
            await i.updateInternalOrderState(db, Id, NewState);
            var res = await i.getStoredInternalOrderIssued(db);
            expect(res).toEqual([{
                id: Id,
                issueDate: IssueDate,
                state: NewState,
                products: Products,
                customerId: CustomerId
            }]);
        });

        test('Wrong new state', async () => {
            await i.updateInternalOrderState(db, Id, wrongState);
            var res = await i.getStoredInternalOrderIssued(db);
            expect(res).toEqual([]);
        });
    });
}

function testGetStoredInternalOrderAccepted(Id, IssueDate, NewState, Products, CustomerId, wrongState) {
    describe('Testing getStoredInternalOrderAccepted', () => {
        test('Correct new state', async () => {
            await i.updateInternalOrderState(db, Id, NewState);
            var res = await i.getStoredInternalOrderAccepted(db);
            expect(res).toEqual([{
                id: Id,
                issueDate: IssueDate,
                state: NewState,
                products: Products,
                customerId: CustomerId
            }]);
        });

        test('Wrong new state', async () => {
            await i.updateInternalOrderState(db, Id, wrongState);
            var res = await i.getStoredInternalOrderAccepted(db);
            expect(res).toEqual([]);
        });
    });
}

function testUpdateInternalOrderSkuProducts(Id, IssueDate, NewState, Products, CustomerId, wrongId, expectedProduct, wrongCompletedProducts) {
    describe('Testing updateInternalOrderSkuProducts', () => {
        test('Internal order ID existing', async () => {
            const skuproduct = {
                newState: NewState,
                products: Products
            }
            await i.updateInternalOrderSkuProducts(db, Id, skuproduct);
            var res = await i.getStoredInternalOrderById(db, Id);
            expect(res).toEqual({
                id: Id,
                issueDate: IssueDate,
                state: NewState,
                products: expectedProduct,
                customerId: CustomerId
            });
        });

        test('Internal order ID not existing', async () => {
            const skuproduct = {
                newState: NewState,
                products: Products
            }
            await expect(i.updateInternalOrderSkuProducts(db, wrongId, skuproduct)).rejects.toThrow('ID not found');
        });

        /*test('Product sku ID not existing', async () => {
            const skuproduct = {
                newState: NewState,
                products: wrongCompletedProducts
            }
            await expect(i.updateInternalOrderSkuProducts(db, Id, skuproduct)).rejects.toThrow('Uncorrect product');
        });*/
    });
}

function testUpdateInternalOrderState(Id, IssueDate, NewState, Products, CustomerId, wrongId) {
    describe('Testing updateInternalOrderState', () => {
        test('Internal order ID existing', async () => {
            await i.updateInternalOrderState(db, Id, NewState);
            var res = await i.getStoredInternalOrderById(db, Id);
            expect(res).toEqual({
                id: Id,
                issueDate: IssueDate,
                state: NewState,
                products: Products,
                customerId: CustomerId
            });
        });

        test('Internal order ID not existing', async () => {
            await expect(i.updateInternalOrderState(db, wrongId, NewState)).rejects.toThrow('ID not found');
        });
    });
}

function testDeleteInternalOrder(Id, wrongId) {
    describe('Testing deleteInternalOrder', () => {
        test('ROID existing', async () => {
            await i.deleteInternalOrder(db, Id);
            await expect(i.getStoredInternalOrderById(db, Id)).rejects.toThrow('ID not found');
        })

        test('ROID not existing', async () => {
            await expect(i.deleteInternalOrder(db, wrongId)).rejects.toThrow('ID not found');
        })
    })
}

function testLoopGetStoredInternalOrder(internalOrder, internalOrder1) {
    describe('Testing getStoredITEM in loop', () => {
        test('2 Items', async () => {
            await i.storeInternalOrder(db, internalOrder1);
            let res = await i.getStoredInternalOrder(db);
            //console.log(res);
            expect(res).toEqual([internalOrder, internalOrder1]);
        });

        test('1 Items', async () => {
            let res = await i.getStoredInternalOrder(db);
            //console.log(res);
            expect(res).toEqual([internalOrder]);
        });

        test('0 Items', async () => {
            await i.deleteInternalOrder(db, 1);
            let res = await i.getStoredInternalOrder(db);
            //console.log(res);
            expect(res).toEqual([]);
        });
    });
}

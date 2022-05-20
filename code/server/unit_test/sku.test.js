const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO')
const s = new SKU_DAO()
const testDescriptor_DAO = require('../datainterface/INTERNAL/testDescriptor_DAO')
const t = new testDescriptor_DAO()
const database = require("../database");
const db = database.db;


describe("test sku", () => {
    beforeEach(async () => {
        await s.dropTable(db);
        await t.dropTable(db);
        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            availableQuantity: 50,
            price: 10.99
           
        }

        let testDesc1 = {
            
                name: "test descriptor 1",
                procedureDescription: "This test is described by...",
                idSKU :1
            
        }
        
        try {
            await s.newTableName(db);
            await s.storeSKU(db, sku);
            await t.newTableName(db);
            await t.storeTestDescriptor(db, sku);
        } catch (err) {
            console.log(err)
        }
    })
    testGetStoredSKU(1, "sku1", 100, 50, "first SKU", 50, 10.99, 1);
   
});


function testGetStoredSKU(id, description, weight, volume, notes,  price, testDesc) {
    test("Testing getStoredSKUItem", async () => {
        let res = await s.getStoredSKU(db)
        expect(res).toEqual([{
            id: id,
            description: description,
            weight: weight,
            volume: volume,
            notes: notes,
            position: null,
            availableQuantity: availableQuantity,
            price: price,
            testDescriptors: [testDesc]
        }])
    })
}
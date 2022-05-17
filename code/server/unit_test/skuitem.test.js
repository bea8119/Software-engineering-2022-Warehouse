const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const s = new SKUITEM_DAO()
const server = require("../server");
const db = server.db;

describe("test skuitems", () => {
    beforeEach(async () => {
        await s.dropTable(db);
        console.log("1")
        let skuitem = {
            RFID:"12345678901234567890123456789041",
            SKUId:3,
            DateOfStock:"2021/11/29 12:30"
        }
        try {
        await s.newTableName(db);
        await s.storeSKUItem(db, skuitem)
        } catch(err){
            console.log(err)
        }
    })
    testSkuitem("12345678901234567890123456789041", 3, "2021/11/29 12:30");
    testStoreSKUItem("12345678901234567890123456789014", 1, "2021/11/29 12:30");
});


function testSkuitem(id, skuid, dateOfStock){
        test("test of get stored SKUItem", async () => {
            let res = await s.getStoredSKUItem(db)
            expect(res).toEqual([{
                RFID:id,
                SKUId:skuid,
                Available:0,
                DateOfStock:dateOfStock
            }])
        })
}

function testStoreSKUItem(rfid, skuid, dateOfStock) {
    test('Store new SKU Item', async () => {
        
        const data ={
            RFID: rfid,
            SKUId: skuid,
            DateOfStock: dateOfStock,
        }
        await s.storeSKUItem(db, data);
        
        var res = await s.getStoredSKUItemByRFID(db, rfid);
        expect(res.length).toStrictEqual(1);
        expect(res).toEqual([{
            RFID:rfid,
            SKUId:skuid,
            Available:0,
            DateOfStock:dateOfStock
        }])
    });
}

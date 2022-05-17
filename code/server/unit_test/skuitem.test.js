const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const s = new SKUITEM_DAO()
const server = require("../server");
const db = server.db;

describe("get skuitems", () => {
    beforeEach(async () => {
        await s.dropTable(db);
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
    //testSkuItem("12345678901234567890123456789041", 3, "2021/11/29 12:30");
    testStoreSKUItem("12345678901234567890123456789014", 1, "2021/11/29 12:30");
});


function testSkuitem(id, skuid, dateOfStock){
    describe("get skuitem list", () => {
        test("test of get stored SKUItem", async () => {
            let res = await s.getStoredSKUItem(db)
            expect(res).toEqual([{
                RFID:id,
                SKUId:skuid,
                Available:0,
                DateOfStock:dateOfStock
            }])
        })
    })
}

function testStoreSKUItem(rfid, skuItem, available, dateOfStock) {
    test('Store new SKU Item', async () => {
        
        const data ={
            RFID: rfid,
            SKUItem: skuItem,
            Available: available,
            DateOfStock: dateOfStock,
        }
        await s.storeSKUItem(db, data);
        
        var res = await s.getStoredSKUItemByRFID(db, rfid);
        expect(res.length).toStrictEqual(1);

        expect(res.RFID).toStrictEqual(data.RFID);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.Available).toStrictEqual(data.Available);
        expect(res.DateOfStock).toStrictEqual(data.DateOfStock);
    });
}

const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const s = new SKUITEM_DAO()
const server = require("../server");
const db = server.db;

describe("get skuitems", () => {
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
    testSkuitem("12345678901234567890123456789041", 3, "2021/11/29 12:30")
});


function testSkuitem(id, skuid, dateOfStock){
    describe("get skuitem list", () => {
        test("get skuitem", async () => {
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
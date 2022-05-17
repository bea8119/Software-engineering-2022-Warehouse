const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const s = new SKUITEM_DAO()
const server = require("../../server");
const db = server.db;

describe("get skuitems", () => {
    beforeEach(() => {
        s.dropTable();
        let skuitem = {
            "RFID":"12345678901234567890123456789041",
            "SKUId":1,
            "Available":0,
            "DateOfStock":"2021/11/29 12:30",
        }
        s.storeSKUItem(db, skuitem)
    })

    testSkuitem("12345678901234567890123456789041", 1, 0, "2021/11/29 12:30")
});


function testSkuitem(id, skuid, available, dateOfStock){
    describe("get skuitem list", () => {
        test("get skuitem", async () => {
            let res = await s.getStoredSKUItem()
            expect(res).toEqual({
                RFID:id,
                SKUId:skuid,
                Available:available,
                DateOfStock:dateOfStock,
            })
        })
    })
}
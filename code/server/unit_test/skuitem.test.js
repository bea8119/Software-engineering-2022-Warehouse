const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const s = new SKUITEM_DAO()
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO')
const t = new SKU_DAO()
const database = require("../database");
const db = database.db;

describe("test skuitems", () => {
    beforeEach(async () => {
        await t.dropTable(db);
        await s.dropTable(db);
        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        let skuitem = {
            RFID: "12345678901234567890123456789041",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }
        try {
            await t.newTableName(db);
            await t.storeSKU(db, sku);
            await s.newTableName(db);
            await s.storeSKUItem(db, skuitem);
        } catch (err) {
            console.log(err)
        }
    })
    testGetStoredSKUItem("12345678901234567890123456789041", 1, "2021/11/29 12:30",);
    testStoreSKUItem("12345678901234567890123456789014", 1, "2021/11/29 12:30", 13);
    testGetStoredSkuItemByRFID("12345678901234567890123456789041", "12345678901234567890123456789626")
    testGetAvailableStoredSKUItem(1, 2)
    testUpdateSKUItem("12345678901234567890123456789041", "12345678901234567890123456789626")
    testDeleteSKUItem("12345678901234567890123456789041", "12345678901234567890123456789626")
});


function testGetStoredSKUItem(id, skuid, dateOfStock) {
    test("Testing getStoredSKUItem", async () => {
        let res = await s.getStoredSKUItem(db)
        expect(res).toEqual([{
            RFID: id,
            SKUId: skuid,
            Available: 0,
            DateOfStock: dateOfStock
        }])
    })
}

function testStoreSKUItem(rfid, skuid, dateOfStock, wrongskuid) {

    describe("Testing storeSKUItem", () => {
        test('SKUId existing', async () => {
            const data = {
                RFID: rfid,
                SKUId: skuid,
                DateOfStock: dateOfStock,
            }
            await s.storeSKUItem(db, data);

            var res = await s.getStoredSKUItemByRFID(db, rfid);
            expect(res).toEqual({
                RFID: rfid,
                SKUId: skuid,
                Available: 0,
                DateOfStock: dateOfStock
            })
        });

        test('SKUId not existing', async () => {
            const wrongdata = {
                RFID: rfid,
                SKUId: wrongskuid,
                DateOfStock: dateOfStock,
            }
            await expect(s.getStoredSKUItemByRFID(db, wrongdata)).rejects.toThrow('ID not found');
        })

    })
}


function testGetStoredSkuItemByRFID(rfid, wrongrfid, wrongdb) {
    describe('Testing getStoredSKUItemByRFID', () => {

        test('RFID existing', async () => {
            var res = await s.getStoredSKUItemByRFID(db, rfid);
            expect(res).toEqual({
                RFID: rfid,
                SKUId: 1,
                Available: 0,
                DateOfStock: "2021/11/29 12:30"
            })
        });

        test('RFID note existing', async () => {
            await expect(s.getStoredSKUItemByRFID(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}

function testGetAvailableStoredSKUItem(skuid, wrongskuid) {
    describe('Testing getAvailableStoredSkuItem', () => {

        test('No available skuitems found', async () => {
            var res = await s.getAvailableStoredSKUItem(db, skuid);
            expect(res).toEqual([])
        });

        test('Available skuitem found', async () => {
            let newskuitem = {
                newRFID: "12345678901234567890123456789041",
                newAvailable: 1,
                newDateOfStock: "2021/11/29 12:30"
            }
            await s.updateSKUItem(db, "12345678901234567890123456789041", newskuitem)
            var res = await s.getAvailableStoredSKUItem(db, skuid);
            expect(res).toEqual([{
                RFID: "12345678901234567890123456789041",
                SKUId: 1,
                DateOfStock: "2021/11/29 12:30"
            }])
        })

        test('No SKUId found exception', async () => {
            await expect(s.getAvailableStoredSKUItem(db, wrongskuid)).rejects.toThrow('ID not found');

        })
    })
}

function testUpdateSKUItem(rfid, wrongrfid) {
    describe('Testing getAvailableStoredSkuItem', () => {
        test('Available skuitem found', async () => {
            let newskuitem = {
                newRFID: "12345678901234567890123456789321",
                newAvailable: 0,
                newDateOfStock: "2021/11/29 12:35"
            }
            await s.updateSKUItem(db, rfid, newskuitem)
            var res = await s.getStoredSKUItemByRFID(db, newskuitem.newRFID);
            expect(res).toEqual({
                RFID: newskuitem.newRFID,
                SKUId: 1,
                Available: newskuitem.newAvailable,
                DateOfStock: newskuitem.newDateOfStock
            })
        });

        test('No SKUId found exception', async () => {
            await expect(s.updateSKUItem(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}

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
}
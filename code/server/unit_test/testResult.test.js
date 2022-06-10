const TestDescriptor_DAO = require('../datainterface/INTERNAL/TestDescriptor_DAO')
const TESTRESULT_DAO = require('../datainterface/INTERNAL/TESTRESULT_DAO')
const SKUITEM_DAO = require('../datainterface/INTERNAL/SKUITEM_DAO')
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO');

const td = new TestDescriptor_DAO()
const tr = new TESTRESULT_DAO()
const si = new SKUITEM_DAO()
const s = new SKU_DAO()

const database = require("../database");
const db = database.db;

describe("test testResult", () => {
    beforeEach(async () => {
        await tr.dropTable(db);
        await td.dropTable(db);
        await si.dropTable(db);
        await s.dropTable(db);

        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let skuitem1 = {
            RFID: "12345678901234567890123456789747",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let skuitem2 = {
            RFID: "12345678901234567890123456789748",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let testDescriptor1 = {
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testDescriptor2 = {
            name: "test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testResult1 = {
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

        try {
            await tr.newTableName(db);
            await td.newTableName(db);
            await s.newTableName(db);
            await si.newTableName(db);

            await s.storeSKU(db, sku);
            
            await si.storeSKUItem(db, skuitem1);
            await si.storeSKUItem(db, skuitem2);
            await td.storeTestDescriptor(db, testDescriptor1)
            await td.storeTestDescriptor(db, testDescriptor2)
            await tr.storeTestResult(db, testResult1);
            await tr.storeTestResult(db, testResult2);
            await tr.storeTestResult(db, testResult3);

        } catch (err) {
            console.log(err)
        }
    })

    testgetTestResultsArraybySkuitemRfid("12345678901234567890123456789747", "12345678901234567890123456789777"); //rfid correct, then rfid incorrect
    testgetTestResultArraybyidandbySkuitemRfid("12345678901234567890123456789747", 2, "12345678901234567890123456789777", 4); //rfid and id correct, then rfid and id incorrect
    teststoreTestResult(4);
    testupdateTestResult("12345678901234567890123456789747", 2, "12345678901234567890123456789777", 4); //rfid and id correct, then rfid and id incorrect
    testdeleteTestResult("12345678901234567890123456789747", 2, "12345678901234567890123456789777", 4); //rfid and id correct, then rfid and id incorrect
});


function testgetTestResultsArraybySkuitemRfid(rfid, wrongrfid) {
    describe('Testing getTestResultsArraybySkuitemRfid', () => {
        test('rfid existing', async () => {
            let res = await tr.getTestResultsArraybySkuitemRfid(db, rfid);
            expect(res).toEqual(
                [
                    {
                        id:1,
                        idTestDescriptor: 1,
                        Date: "2021/11/28",
                        Result: true
            
                    },
                    {
                        id:2,
                        idTestDescriptor: 1,
                        Date: "2021/11/28",
                        Result: true
                    }
                ]
            )
        })
        test('rfid not existing', async () => {
            await expect(tr.getTestResultsArraybySkuitemRfid(db, wrongrfid)).rejects.toThrow('ID not found');
        })
    })
}

function testgetTestResultArraybyidandbySkuitemRfid(rfid, id, wrongrfid, wrongid) {
    describe('Testing getTestResultArraybyidandbySkuitemRfid', () => {
        test('rfid and id existing', async () => {
            let res = await tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, id);
            expect(res).toEqual(
                {
                    id:2,
                    idTestDescriptor: 1,
                    Date: "2021/11/28",
                    Result: true
            
                }
            )
        })

       /* test('rfid not existing and id existing', async () => {
            await expect(tr.getTestResultArraybyidandbySkuitemRfid(db, wrongrfid, id)).rejects.toThrow('ID not found');
        })

        test('rfid existing and id not existing', async () => {
            await expect(tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, wrongid)).rejects.toThrow('ID not found');
        })

        test('rfid and id not existing', async () => {
            await expect(tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, wrongid)).rejects.toThrow('ID not found');
        })*/
    })
}

function teststoreTestResult(id) {
    test("Testing storeTestResult", async () => {
        testResult = {
            rfid: "12345678901234567890123456789748",
            idTestDescriptor: 1,
            Date: "2021/11/28",
            Result: false
        }
        await tr.storeTestResult(db, testResult);

        var res = await tr.getTestResultArraybyidandbySkuitemRfid(db, "12345678901234567890123456789748", id);
        expect(res).toEqual(
            {
                id: 4,
                idTestDescriptor: 1,
                Date: "2021/11/28",
                Result: false
            }
        );
    })
}

function testupdateTestResult(rfid, id, wrongrfid, wrongid) {
   
    testResultUpdate = {
            newIdTestDescriptor: 1,
            newDate: "2021/11/28",
            newResult: true
        }

    wrongtestResultUpdate = {
        newIdTestDescriptor: 12, //This id doesn't exist
        newDate: "2021/11/28",
        newResult: true
    }

    describe('Testing updateTestResult', () => {
        test('rfid, id and idTestDescriptor exist', async () => {
            await tr.updateTestResult(db, id, rfid, testResultUpdate);
            var res = await tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, id);
            expect(res).toEqual(
                {
                    id:2,
                    idTestDescriptor: 1,
                    Date: "2021/11/28",
                    Result: true
                }
            )
        })

        //Many possible cases but I this 3 represent all possibilities

        test('rfid and id existing and idTestDescriptor not existing', async () => {
            await expect(tr.updateTestResult(db, id, rfid, wrongtestResultUpdate)).rejects.toThrow('ID not found');
        })

        test('rfid not existing, id and idTestDescriptor existing', async () => {
            await expect(tr.updateTestResult(db, id, wrongrfid, testResultUpdate)).rejects.toThrow('ID not found');
        })

        test('rfid and idTestDescriptor existing, id not existing ', async () => {
            await expect(tr.updateTestResult(db, wrongid, rfid, testResultUpdate)).rejects.toThrow('ID not found');
        })
    })
}

function testdeleteTestResult(rfid, id, wrongrfid, wrongid) {
    describe('Testing deleteTestResult', () => {
        test('rfid and id existing', async () => {
            await tr.deleteTestResult(db, rfid, id);
            await expect(tr.getTestResultArraybyidandbySkuitemRfid(db, rfid, id)).rejects.toThrow('ID not found');
        })

        /*test('rfid not existing and id existing', async () => {
            await expect(tr.deleteTestResult(db, wrongrfid, id)).rejects.toThrow('ID not found');
        })

        test('rfid existing and id not existing', async () => {
            await expect(tr.deleteTestResult(db, rfid, wrongid)).rejects.toThrow('ID not found');
        })

        test('rfid and id not existing', async () => {
            await expect(tr.deleteTestResult(db, rfid, wrongid)).rejects.toThrow('ID not found');
        })*/ 
    })
}
const TestDescriptor_DAO = require('../datainterface/INTERNAL/TestDescriptor_DAO')
const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO');

const td = new TestDescriptor_DAO()
const s = new SKU_DAO()

const database = require("../database");
const db = database.db;

describe("test testDesciptors", () => {
    beforeEach(async () => {
        await td.dropTable(db);
        await s.dropTable(db);

        //position, testDescriptors --> Not needed for the post
        let sku1 = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let sku2 = {
            description : "another sku",
            weight : 101,
            volume : 60,
            notes : "second SKU",
            price : 10.99,
            availableQuantity : 55
        }

        let testDescriptor1 = {
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }

        let testDescriptor2 = {
            name:"test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU :2
        }

        try {
            //Create the tables and store the values
            await td.newTableName(db);
            await s.newTableName(db);

            await s.storeSKU(db, sku1);
            await s.storeSKU(db, sku2);
            await td.storeTestDescriptor(db, testDescriptor1);
            await td.storeTestDescriptor(db, testDescriptor2);


        } catch (err) {
            console.log(err)
        }
    })

    testgetStoredTestDescriptors();
    testgetTestDescriptorbyID(1, 4); //first id correct, second doesn't exist
    teststoreTestDescriptor(3);
    testdeleteTestDescriptor(1, 4); //first id correct, second doesn't exist
    testupdateTestDescriptor(1, 4); //first id correct, second doesn't exist

    testLoopGetStoredTestDescriptor()
});


function testgetStoredTestDescriptors() {
    test("Testing getStoredTestDescriptors", async () => {
        let res = await td.getStoredTestDescriptors(db);
        expect(res).toEqual([{
                    id:1,
                    name:"test descriptor 1",
                    procedureDescription: "This test is described by...",
                    idSKU :1
        
                },{
                    id:2,
                    name:"test descriptor 2",
                    procedureDescription: "This test is described by...",
                    idSKU :2
                }
            ]
        )
    })
}

function testgetTestDescriptorbyID(id, wrongid) {
    describe('Testing getTestDescriptorbyID', () => {

        test('ID existing', async () => {
            var res = await td.getTestDescriptorbyID(db, id);
            expect(res).toEqual(
                {
                    id:1,
                    name:"test descriptor 1",
                    procedureDescription: "This test is described by...",
                    idSKU :1
                }

            )
        });

        test('ID not existing', async () => {
            await expect(td.getTestDescriptorbyID(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}

function teststoreTestDescriptor(id) {
    test("Testing storeTestDescriptor", async () => {
        testDescriptor3 = {
            name:"test descriptor 3",
            procedureDescription:"This test is described by...",
            idSKU :1
        }

        await td.storeTestDescriptor(db, testDescriptor3);

        var res = await td.getTestDescriptorbyID(db, id);
        expect(res).toEqual(
            {
                id: 3,
                name:"test descriptor 3",
                procedureDescription:"This test is described by...",
                idSKU :1
            }
        );
    })
}

function testupdateTestDescriptor(id, wrongid) {
    testDescriptorUpdate = {
        newName: "test descriptor 1.0",
        newProcedureDescription: "This test is described by...",
        newIdSKU: 2
    }

    wrongSKUidtestDescriptorUpdate = {
        newName: "test descriptor 1.0",
        newProcedureDescription: "This test is described by...",
        newIdSKU: 4
    }

    describe('Testing updateTestDescriptor', () => {
        test('ID existing: SKUid exists', async () => {
            await td.updateTestDescriptor(db, id, testDescriptorUpdate);
            var res = await td.getTestDescriptorbyID(db, id);
            expect(res).toEqual(
                {
                    id: 1,
                    name:"test descriptor 1.0",
                    procedureDescription:"This test is described by...",
                    idSKU: 2
                }
            )
        })

        test('ID existing: wrong SKUid', async () => {
            await expect(td.updateTestDescriptor(db, id, wrongSKUidtestDescriptorUpdate)).rejects.toThrow('ID sku not found');
        })

        test('ID not existing', async () => {
            await expect(td.updateTestDescriptor(db, wrongid, testDescriptorUpdate)).rejects.toThrow('ID not found');
        })
    })
}

function testdeleteTestDescriptor(id, wrongid) {
    describe('Testing deleteTestDescriptor', () => {
        test('id existing', async () => {
            await td.deleteTestDescriptor(db, id);
            await expect(td.getTestDescriptorbyID(db, id)).rejects.toThrow('ID not found');
        })

        test('id not existing', async () => {
            await expect(td.deleteTestDescriptor(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}

function testLoopGetStoredTestDescriptor() {
    let testDescriptor1 = {
        id: 1,
        name: "test descriptor 1",
        procedureDescription: "This test is described by...",
        idSKU: 1
    }

    let testDescriptor2 = {
        id: 2,
        name:"test descriptor 2",
        procedureDescription: "This test is described by...",
        idSKU :2
    }

    describe('Testing getStoredTestDescriptor in loop', () => {
        test('2 TestDescriptors', async () => {
            let res = await td.getStoredTestDescriptors(db);
            //console.log(res);
            expect(res).toEqual([testDescriptor1, testDescriptor2]);
        });

        test('1 TestDescriptor', async () => {
            await td.deleteTestDescriptor(db, 2);
            let res = await td.getStoredTestDescriptors(db);
            //console.log(res);
            expect(res).toEqual([testDescriptor1]);
        });

        test('0 TestDescriptors', async () => {
            await td.deleteTestDescriptor(db, 1);
            await td.deleteTestDescriptor(db, 2);
            let res = await td.getStoredTestDescriptors(db);
            //console.log(res);
            expect(res).toEqual([]);
        });
    });
}
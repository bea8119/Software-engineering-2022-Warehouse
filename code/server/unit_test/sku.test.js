const SKU_DAO = require('../datainterface/INTERNAL/SKU_DAO')
const s = new SKU_DAO()
const testDescriptor_DAO = require('../datainterface/INTERNAL/testDescriptor_DAO')
const t = new testDescriptor_DAO()
const POSITION_DAO = require('../datainterface/INTERNAL/POSITION_DAO')
const p = new POSITION_DAO()
const database = require("../database");
const db = database.db;


describe("test sku", () => {
    beforeEach(async () => {
        await s.dropTable(db);
        await t.dropTable(db);
        await p.dropTable(db);
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
                idSKU: 1
            
        }
        let testDesc2 = {
            
            name: "test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU: 1
        
    }
    let position = {
        positionID :"800234546669",
        aisleID: "8002",
        row: "3454",
        col: "6669",
        maxWeight: 10000,
        maxVolume: 10000
    }
    let position2 = {
        positionID :"800234546660",
        aisleID: "8002",
        row: "3454",
        col: "6660",
        maxWeight: 1000,
        maxVolume: 1000
    }
    let position3 = {
        positionID :"800234546661",
        aisleID: "8002",
        row: "3454",
        col: "6661",
        maxWeight: 10000,
        maxVolume: 10000
    }
    
        
        try {
            await s.newTableName(db);
            await s.storeSKU(db, sku);
            await t.newTableName(db);
            await t.storeTestDescriptor(db, testDesc1);
            await t.storeTestDescriptor(db, testDesc2);
            await p.newTableName(db);
            await p.storePosition(db, position);
            await p.storePosition(db, position2);
            await p.storePosition(db, position3);
        } catch (err) {
            console.log(err)
        }
    })

    let sku1 = {
        id:1,
        description: "sku1",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        availableQuantity: 50,
        price: 10.99
       
    }
    let sku2 = {
        id: 2,
        description: "sku1",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        availableQuantity: 50,
        price: 10.99
       
    }
   
    testGetStoredSKU(1, sku1, sku2);
    testStoreSKU(2, "sku2", 1, 50, "second SKU", 5, 11.99);
    testUpdateSKU(1, 10);
    testUpdateSKUposition(1, 10);
    testDeleteSKU(1, 10);
   
});


function testGetStoredSKU(id, sku1, sku2) {
    describe("Testing getStoredSKU",  () => {
        test("One sku stored", async () => {

            let res = await s.getStoredSKU(db);
        
        let td = await t.getStoredTestDescriptors(db);
        
        expect(res).toEqual([{
            id: sku1.id,
            description: sku1.description,
            weight: sku1.weight,
            volume: sku1.volume,
            notes: sku1.notes,
            position: null,
            availableQuantity: sku1.availableQuantity,
            price: sku1.price,
            testDescriptors: Object.values(td).filter((t) => t.idSKU === sku1.id).map((i) => i.id)
        }])

        })

        test("Two sku stored", async () => {
        
            await s.storeSKU(db, sku2);

         let res = await s.getStoredSKU(db);
        
        let td = await t.getStoredTestDescriptors(db);
        
        expect(res).toEqual([{
            id: sku1.id,
            description: sku1.description,
            weight: sku1.weight,
            volume: sku1.volume,
            notes: sku1.notes,
            position: null,
            availableQuantity: sku1.availableQuantity,
            price: sku1.price,
            testDescriptors: Object.values(td).filter((t) => t.idSKU === sku1.id).map((i) => i.id)
        },
        {
            id: sku2.id,
            description: sku2.description,
            weight: sku2.weight,
            volume: sku2.volume,
            notes: sku2.notes,
            position: null,
            availableQuantity: sku2.availableQuantity,
            price: sku2.price,
            testDescriptors: Object.values(td).filter((t) => t.idSKU === sku2.id).map((i) => i.id)
        }])

        })

        test("Zero sku stored", async () => {
            await s.deleteSKU(db, sku1.id);

            let res = await s.getStoredSKU(db);
        
        let td = await t.getStoredTestDescriptors(db);
        
        expect(res).toEqual([])

        })
        
        
    })
}

function testStoreSKU(id, description, weight, volume, notes, availableQuantity, price) {

        test('Testing StoreSKU', async () => {
            const data = {
                description: description,
                weight: weight,
                volume: volume,
                notes: notes,
                availableQuantity: availableQuantity,
                price: price,
            }
            await s.storeSKU(db, data);
            let td = await t.getStoredTestDescriptors(db);

            var res = await s.getSKUbyID(db, id);
            expect(res).toEqual({
             id: id,
            description: description,
            weight: weight,
            volume: volume,
            notes: notes,
            position: null,
            availableQuantity: availableQuantity,
            price: price,
            testDescriptors: Object.values(td).filter((t) => t.idSKU === id).map((i) => i.id)
            })
        });

  
}

function testUpdateSKU(id, wrongid) {
    describe('Testing updateSKU', () => {
        test('SKU id found, position is null', async () => {
            let newsku = {
                newDescription : "test1",
                newWeight : 400,
                newVolume : 400,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 1
            }
            await s.updateSKU(db, id, newsku)
            var res = await s.getSKUbyID(db, id);
            let td = await t.getStoredTestDescriptors(db);
            expect(res).toEqual({
                id: id,
                description: newsku.newDescription,
                weight: newsku.newWeight,
                volume: newsku.newVolume,
                notes: newsku.newNotes,
                position: null,
                availableQuantity: newsku.newAvailableQuantity,
                price: newsku.newPrice,
                testDescriptors: Object.values(td).filter((t) => t.idSKU === id).map((i) => i.id)
            })
        });

        test('SKU id found, position is NOT null, Maximum position capacity NOT exceeded', async () => {
            let pos = {
                position: "800234546669"
            }
            await s.updateSKUposition(db, id, pos);
            
            let newsku = {
                newDescription : "test1",
                newWeight : 400,
                newVolume : 400,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 1
            }
            await s.updateSKU(db, id, newsku)
            var res = await s.getSKUbyID(db, id);
            let td = await t.getStoredTestDescriptors(db);
            expect(res).toEqual({
                id: id,
                description: newsku.newDescription,
                weight: newsku.newWeight,
                volume: newsku.newVolume,
                notes: newsku.newNotes,
                position: pos.position,
                availableQuantity: newsku.newAvailableQuantity,
                price: newsku.newPrice,
                testDescriptors: Object.values(td).filter((t) => t.idSKU === id).map((i) => i.id)
            })
        });

        test('SKU id found, position is NOT null, Maximum position capacity exceeded', async () => {
            let pos = {
                position: "800234546669"
            }
            await s.updateSKUposition(db, id, pos);
            let newsku = {
                newDescription : "test1",
                newWeight : 400,
                newVolume : 400,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 40
            }
            await expect(s.updateSKU(db, id, newsku)).rejects.toThrow('Maximum position capacity exceeded');
            
            
        });

        test('SKU id found, position is NOT null, but positionID is not found', async () => {
            let pos = {
                position: "800234546669"
            }
            await s.updateSKUposition(db, id, pos);
            await p.deletePosition(db, pos.position);
            let newsku = {
                newDescription : "test1",
                newWeight : 400,
                newVolume : 400,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 40
            }
            await expect(s.updateSKU(db, id, newsku)).rejects.toThrow('ID position not found');
            
            
        });

        test('SKU id not found', async () => {
            let newsku = {
                newDescription : "test1",
                newWeight : 400,
                newVolume : 400,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 40
            }
            await expect(s.updateSKU(db, wrongid, newsku)).rejects.toThrow('ID not found');
        })
    })
}

function testUpdateSKUposition(id, wrongid) {
    describe('Testing updateSKUposition', () => {
        test('SKU id found, position found, old position null', async () => {
            let newposition = {
                position: "800234546669"
            }
            let pre = await s.getSKUbyID(db, id);
            await s.updateSKUposition(db, id, newposition)
            var res = await s.getSKUbyID(db, id);
            let td = await t.getStoredTestDescriptors(db);
            expect(res.position).toEqual( newposition.position)
        });

        test('SKU id found, position found, old position not null', async () => {
            let pos = {
                position: "800234546661"
            }
            await s.updateSKUposition(db, id, pos);

            let newposition = {
                position: "800234546669"
            }
            let pre = await s.getSKUbyID(db, id);
            await s.updateSKUposition(db, id, newposition)
            var res = await s.getSKUbyID(db, id);
            let td = await t.getStoredTestDescriptors(db);
            expect(res.position).toEqual( newposition.position)
        });

       
        
        test('Maximum capacity exceeded exception', async () => {
            let newposition = {
                position: "800234546660"
            }
            await expect(s.updateSKUposition(db, id, newposition)).rejects.toThrow('Maximum position capacity exceeded');
        })

        test('No position found exception', async () => {
            let wrongposition = {
                position: "800234543333"
            }
            await expect(s.updateSKUposition(db, id, wrongposition)).rejects.toThrow('ID position not found');
        })

        test('SKU Id not found', async () => {
            let newposition = {
                position: "800234546669"
            }
            await expect(s.updateSKUposition(db, wrongid, newposition )).rejects.toThrow('ID sku not found');
        })
    })
}


function testDeleteSKU(id) {
    describe('Testing deleteSKU', () => {
        test('Sku id found', async () => {
            await s.deleteSKU(db, id)
            await expect(s.getSKUbyID(db, id)).rejects.toThrow('ID not found');
        })
    })
}
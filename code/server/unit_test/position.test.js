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
        await p.dropTable(db);
    let position = {
        positionID :"800234546669",
        aisleID: "8002",
        row: "3454",
        col: "6669",
        maxWeight: 10000,
        maxVolume: 10000
    }
    
    
        
        try {
            await p.newTableName(db);
            await p.storePosition(db, position);
            
        } catch (err) {
            console.log(err)
        }
    })
   
    testGetStoredPosition("800234546669", "8002", "3454", "6669", 10000, 10000);
    testStorePosition("800234546660", "8002", "3454", "6660", 1000, 1000);
    testUpdatePosition("800234546669", "8003", "3454", "6661", 1000, 1000, 200, 100, "800334540000" );
    testDeletePosition("800234546669", "80023454600" );
   
});


function testGetStoredPosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test("Testing getStoredPosition", async () => {
        
        let res = await p.getStoredPosition(db);
        
        
        expect(res).toEqual([{
            positionID : positionID,
            aisleID: aisleID,
            row: row,
            col: col,
            maxWeight: maxWeight,
            maxVolume: maxVolume,
            occupiedWeight : 0,
            occupiedVolume: 0
        }])
    })
}

function testStorePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {

        test('Testing StorePosition', async () => {
            const data = {
                        positionID: positionID,
                        aisleID: aisleID,
                        row: row,
                        col: col,
                        maxWeight: maxWeight,
                        maxVolume: maxVolume
            }
            await p.storePosition(db, data);
            

            var res = await p.getStoredPosByID(db, positionID);
            expect(res).toEqual({
                positionID: positionID,
                aisleID: aisleID,
                row: row,
                col: col,
                maxWeight: maxWeight,
                maxVolume: maxVolume,
                occupiedWeight: 0,
                occupiedVolume: 0
            })
        });

  
}

function testUpdatePosition(oldPositionID, newaisleID, newrow, newcol, newmaxWeight, newmaxVolume, newOccupiedWeight, newOccupiedVolume, wrongid) {
    describe('Testing updatePosition', () => {
        test('id found', async () => {
            let newPosition = {
                newAisleID: newaisleID,
                newRow: newrow,
                newCol: newcol,
                newMaxWeight: newmaxWeight,
                newMaxVolume: newmaxVolume,
                newOccupiedWeight: newOccupiedWeight,
                newOccupiedVolume:newOccupiedVolume
            }
            const newPositionID = newaisleID + newrow + newcol;
            await p.updatePosition(db, oldPositionID, newPosition)
            var res = await p.getStoredPosByID(db, newPositionID);
            
            expect(res).toEqual({
                positionID: newPositionID,
                aisleID: newPosition.newAisleID,
                row: newPosition.newRow,
                col: newPosition.newCol,
                maxWeight: newPosition.newMaxWeight,
                maxVolume: newPosition.newMaxVolume,
                occupiedWeight: newPosition.newOccupiedWeight,
                occupiedVolume: newPosition.newOccupiedVolume
            })
        });

        test('No position id found exception', async () => {
            await expect(p.updatePosition(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}




function testDeletePosition(id, wrongid) {
    describe('Testing deletePosition', () => {
        test('id existing', async () => {
            await p.deletePosition(db, id)
            await expect(p.getStoredPosByID(db, id)).rejects.toThrow('ID not found');
        })

        test('id not existing', async () => {
            await expect(p.deletePosition(db, wrongid)).rejects.toThrow('ID not found');
        })
    })
}
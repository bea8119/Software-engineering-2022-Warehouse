const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test position apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/positions/emergenza');
        let pos={
            "positionID":"800234543410",
            "aisleID": "8002",
            "row": "3454",
            "col": "3410",
            "maxWeight": 1000,
            "maxVolume": 1000
        }

        await agent.post('/api/position').send(pos);
    })


    describe('test position post api', () =>{

        postPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
        postPosition(201, "800234543411", "8002", "3454", "3411", 0, 0);
        postPosition(422, "80023454341", "8002", "3454", "3412", 1000, 1000);
        postPosition(422, "8002345434121", "8002", "3454", "3412", 1000, 1000);
        postPosition(422, "800234543413", "800", "3454", "3413", 1000, 1000);
        postPosition(422, "800234543414", "8002", "345", "3414", 1000, 1000);
        postPosition(422, "800234543414", "8002", "3454", "341", 1000, 1000);
        postPosition(422, "800234543414", "80021", "3454", "3414", 1000, 1000);
        postPosition(422, "800234543414", "8002x", "3454", "3414", 1000, 1000);
        postPosition(422, "800234543414", "8002", "3454", undefined, 1000, 1000);
        postPosition(422, "800234543414", "800", "3454", "3414", undefined, 1000);
        postPosition(422, "80023454341x", "800", "3454", "3414", 1000, 1000);
        postPosition(422, "800234543414", "800", "3454", "3414", 1000, undefined);
        postPosition(503, "800234543410", "8002", "3454", "3410", 1000, 1000);
    
    });

    describe('test position get ', () =>{

        getPositions(200);

    });

    describe('test position put ', () =>{
        


        putPositiondata(200,"800234543410", "8002", "3454", "3412", 1300, 1300, 200, 200);
        putPositiondata(200,"800234543410", "8002", "3454", "3412", 0, 0, 0, 0);
        putPositiondata(422,"800234543410x", "8002", "3454", "3412", 0, 0, 0, 0);
        putPositiondata(422,"80023454341", "8002", "3454", "3412", 0, 0, 0, 0);
        putPositiondata(422,"800234543410", "8002x", "3454", "3412", 0, 0, 0, 0);
        putPositiondata(422,"800234543410", "8002", "34545", "3412", 0, 0, 0, 0);
        putPositiondata(422,"800234543410", "8002", "3454", "341", 0, 0, 0, 0);
        putPositiondata(422,"800234543410", "8002", "3454", "3412", undefined, 0, 0, 0);
        putPositiondata(404,"800234543419", "8002", "3454", "3412", 0, 0, 0, 0);

        putPositionNewID(200,"800234543410", "800234543419");
        putPositionNewID(422,"800234543410", undefined);
        putPositionNewID(422,"800234543410", "800234543419x");
        putPositionNewID(422,"800234543410", "80023454341");
        putPositionNewID(422,"80023454341", "800234543419");
        putPositionNewID(422, undefined, "800234543419");
        putPositionNewID(422,"800234543410x", "800234543419");
        putPositionNewID(404,"800234543418", "800234543419");
        
    });

    describe('test position delete ', () =>{

        deletePosition(204, "800234543410");
        deletePosition(422, "80023454341");
        deletePosition(404, "800234543419");

    });
    

   

});



async function postPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('test post /api/position --- body:data', async function () {
        let position = {
            "positionID": positionID,
            "aisleID": aisleID,
            "row": row,
            "col": col,
            "maxWeight": maxWeight,
            "maxVolume": maxVolume
        }

        await agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}

async function getPositions(expectedHTTPStatus) {
    it('test get /api/positions', async function () {
        
        await agent.get('/api/positions')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        "positionID":"800234543410",
            "aisleID": "8002",
            "row": "3454",
            "col": "3410",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedVolume": 0,
            "occupiedWeight": 0
                    }
                ])
            
            
            });
    })
}




async function putPositiondata(expectedHTTPStatus, oldPositionId,  newaisleID, newrow, newcol,newmaxWeight, newmaxVolume, newoccupiedWeight, newoccupiedVolume) {
    it('test put /api/position/:positionID  --- body:data', async function () {
       let newpos= {
            "newAisleID": newaisleID ,
            "newRow": newrow,
            "newCol": newcol,
            "newMaxWeight": newmaxWeight,
            "newMaxVolume": newmaxVolume,
            "newOccupiedWeight": newoccupiedWeight,
            "newOccupiedVolume": newoccupiedVolume
        }

        await agent.put('/api/position/' + oldPositionId)
            .send(newpos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}


async function putPositionNewID(expectedHTTPStatus, oldPositionId,  newPositionId) {
    it('test put /api/position/:positionID/changeID  --- body:data', async function () {
       let newpos= {
            "newPositionID": newPositionId 
           
        }

        await agent.put('/api/position/' + oldPositionId + '/changeID')
            .send(newpos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}

async function deletePosition(expectedHTTPStatus, positionID) {
    it('test delete /api/position/:positionID', async function () {
        
        await agent.delete('/api/position/' + positionID)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}
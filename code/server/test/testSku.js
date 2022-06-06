const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test SKU apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/skus');
        await agent.delete('/api/testDescriptor/emergenza/superermergenza');
        
       let sku1 = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 5
        }
        let sku2 = {
            description: "a new sku2",
            weight: 100,
            volume: 100,
            notes: "second SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let testDesc1 ={
            "name":"test descriptor 1",
            "procedureDescription":"This test is described by...",
            "idSKU" :1
        }
        let testDesc2 ={
            "name":"test descriptor 2",
            "procedureDescription":"This test is described by...",
            "idSKU" :1
        }


        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/sku').send(sku2);
        await agent.post('/api/testDescriptor').send(testDesc1);
        await agent.post('/api/testDescriptor').send(testDesc2);
    })


    describe('test sku post api', () =>{

        postSku(201, "a new sku 3", 100, 100, "an SKU", 10.99, 40);
        postSku(422, "a new sku 3", 100, 100, undefined, 10.99, 40);
        postSku(422, undefined, 100, 100, "an SKU", 10.99, 40);
        postSku(422, "a new sku 3", undefined, 100, "an SKU", 10.99, 40);
        postSku(422, "a new sku 3", 100, undefined, "an SKU", 10.99, 40);   
        postSku(422, "a new sku 3", 100, 100, "an SKU", undefined, 40);
        postSku(422, "a new sku 3", 100, 100, "an SKU", 10.99, undefined);
    });

    describe('test sku get ', () =>{

        getSkus(200);

    });

    describe('test sku put ', () =>{
        
        putSkudata(200, 1, "a new sku", 100, 100, "an SKU", 10.99, 40);
        putSkudata(422, 1, "a new sku", 100, 100, undefined, 10.99, 40);
        putSkudata(422, 1, undefined, 100, 100, "an SKU", 10.99, 40);
        putSkudata(422, 1, "a new sku", undefined, 100, "an SKU", 10.99, 40);
        putSkudata(422, 1, "a new sku", 100, undefined, "an SKU", 10.99, 40);   
        putSkudata(422, 1, "a new sku", 100, 100, "an SKU", undefined, 40);
        putSkudata(422, 1, "a new sku", 100, 100, "an SKU", 10.99, undefined);

        beforeEach(async () => {
            await agent.delete('/api/positions/emergenza');
        let pos={
            "positionID":"800234543410",
            "aisleID": "8002",
            "row": "3454",
            "col": "3410",
            "maxWeight": 10000,
            "maxVolume": 10000
        }

        await agent.post('/api/position').send(pos);

        })

        putSkuPosition(200, 1, "800234543410");
        putSkuPosition(404, 5, "800234543410");
        putSkuPosition(404, 1, "800234543411");
        putSkuPosition(422, 'x', "800234543410");
        putSkuPosition(422, 1, "80023454341");
        putSkuPosition(422, 1, "8002345434100");
        putSkuPosition(422, undefined, "800234543410");
        putSkuPosition(422, 1, undefined);        
    });

    describe('test sku delete ', () =>{

        deletesku(204, 1);
        deletesku(204, "x");
        deletesku(204, 5);

    });
    

   

});



async function postSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('test post /api/sku --- body:data', async function () {
        let sku = {
            "description": description,
            "weight": weight,
            "volume": volume,
            "notes": notes,
            "price": price,
            "availableQuantity": availableQuantity
        }

        await agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}


async function getSkus(expectedHTTPStatus) {
    it('test get /api/skus', async function () {

      
        
        await agent.get('/api/skus')
            .then(function (res) { 
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        id: 1,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "first SKU",
                position: null,
                availableQuantity: 5,
                price: 10.99,
                testDescriptors: [1, 2]
                    },
                    {
                        id: 2,
                description: "a new sku2",
                weight: 100,
                volume: 100,
                notes: "second SKU",
                position: null,
                availableQuantity: 50,
                price: 10.99,
                testDescriptors: []
                    }
                ])
            });
    })
}


async function putSkudata(expectedHTTPStatus, skuId,  newDescription, newWeight, newVolume,newNotes, newPrice, newAvailableQuantity) {
    it('test put /api/sku/:skuId  --- body:data', async function () {
        let newsku = {
            "newDescription" : newDescription,
            "newWeight" : newWeight,
            "newVolume" : newVolume,
            "newNotes" : newNotes,
            "newPrice" : newPrice,
            "newAvailableQuantity" : newAvailableQuantity
        }

        await agent.put('/api/sku/' + skuId)
            .send(newsku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}

async function putSkuPosition(expectedHTTPStatus, skuId, newPosition) {
    it('test put /api/sku/:skuId/position  --- body:data', async function () {
        let newPos = {
            "position": newPosition
        }

        await agent.put('/api/sku/' + skuId + '/position')
            .send(newPos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}


async function deletesku(expectedHTTPStatus, id) {
    it('test delete /api/skus/:skuId', async function () {
        
        await agent.delete('/api/skus/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}
const chai = require('chai');
const chaiHttp = require('chai-http');
const res = require('express/lib/response');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test skuitem apis', () => {

    beforeEach(async () => {
        sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        let skuitem1 = {
            RFID: "12345678901234567890123456789595",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }
        let skuitem2 = {
            RFID: "12345678901234567890123456789596",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        await agent.delete('/api/skuitem/emergenza');
        await agent.delete('/api/skus')
        await agent.post('/api/sku').send(sku)
        await agent.post('/api/skuitem').send(skuitem1)
        await agent.post('/api/skuitem').send(skuitem2)
    })

    deleteAllData(204);

    postSkuItem(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    postSkuItem(422, "12345678901234567890123456789015", 1, "");
    postSkuItem(422, "12345678901234567890123456789015", 1, undefined);
    postSkuItem(201, "12345678901234567890123456789015", 1, "2021/11/29");
    postSkuItem(422, "12345678901234567890123456789015", 1, "2021/1");
    postSkuItem(422, "12345678901234567890123456789015", 1, "2021/1/29 12:");
    postSkuItem(422, "1234567890123456789012345678901", 1, "2021/11/29 12:30");
    postSkuItem(422, "123456789012345678901234567890155", 1, "2021/11/29 12:30");
    postSkuItem(422, "1234567890123456789012345678901x", 1, "2021/11/29 12:30");
    postSkuItem(422, undefined, 1, "2021/11/29 12:30");
    postSkuItem(422, "12345678901234567890123456789015", undefined, "2021/11/29 12:30");
    postSkuItem(404, "12345678901234567890123456789015", 123, "2021/11/29");

    getSkuItem()

    getSkuItemByRFID1()
    getSkuItemByRFID2(422, "1234567890123456789012345678959")
    getSkuItemByRFID2(404, "12345678901234567890123456789666")

    putSkuItem(200, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, "2021/11/29 12:30")
    putSkuItem(200, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, "2021/11/29")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, "")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, undefined)
    putSkuItem(200, '12345678901234567890123456789595', "12345678901234567890123456789595", 0, "2021/11/29 12:30")
    putSkuItem(422, '12345678901234567890123456789595', "1234567890123456789012345678959", 1, "2021/11/11 11:11")
    putSkuItem(422, '12345678901234567890123456789595', "1234567890123456789012345678959x", 1, "2021/11/11 11:11")
    putSkuItem(422, '12345678901234567890123456789595', "123456789012345678901234567895952", 1, "2021/11/11 11:11")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", -1, "2021/11/11 11:11")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", 2, "2021/11/11 11:11")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, "2021/11/")
    putSkuItem(422, '12345678901234567890123456789595', "12345678901234567890123456789595", 1, "2021/11/11 11:")
    putSkuItem(422, '123456789012345678901234567895951', "12345678901234567890123456789595", 1, "2021/11/11 11:11")
    putSkuItem(422, '1234567890123456789012345678959', "12345678901234567890123456789595", 1, "2021/11/11 11:11")
    putSkuItem(422, '1234567890123456789012345678959x', "12345678901234567890123456789595", 1, "2021/11/11 11:11")
    putSkuItem(404, '12345678901234567890123456789599', "12345678901234567890123456789595", 1, "2021/11/11 11:11")

    deleteSkuItem(204, "12345678901234567890123456789595")
    deleteSkuItem(422, "1234567890123456789012345678959")
    deleteSkuItem(422, "123456789012345678901234567895955")
    deleteSkuItem(422, "1234567890123456789012345678959x")
    deleteSkuItem(422, "12345678901234567890123456789666")

    getAvailableSkuItemsBySkuId(200, "12345678901234567890123456789595", 1)
    getAvailableSkuItemsBySkuId(404, "12345678901234567890123456789595", 2)
    getAvailableSkuItemsBySkuId(422, "12345678901234567890123456789595", "x")

});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/skuitem/emergenza (deleting data...)', async function () {
        await agent.delete('/api/skuitem/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    });
}

function postSkuItem(expectedHTTPStatus, rfid, skuid, dateofstock) {
    it('test /api/skuitem', async function () {
        let skuitem = {
            "RFID": rfid,
            "SKUId": skuid,
            "DateOfStock": dateofstock
        }
       await agent.post('/api/skuitem')
            .send(skuitem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}


function getSkuItem() {
    it('test /api/skuitems', async function () {
        await agent.get('/api/skuitems')
            .then(function (res) {
                res.body.should.eql([
                    {
                        "RFID": "12345678901234567890123456789595",
                        "SKUId": 1,
                        "Available": 0,
                        "DateOfStock": "2021/11/29 12:30",
                    },
                    {
                        "RFID": "12345678901234567890123456789596",
                        "SKUId": 1,
                        "Available": 0,
                        "DateOfStock": "2021/11/29 12:30"
                    },
                ])
            
            })
    })
}


function getSkuItemByRFID1() {
    it('test get /api/skuitems/:rfid (correct rfid)', async function () {
        await agent.get('/api/skuitems/12345678901234567890123456789595')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    {
                        "RFID": "12345678901234567890123456789595",
                        "SKUId": 1,
                        "Available": 0,
                        "DateOfStock": "2021/11/29 12:30"
                    }

                )
            
            });
    });
}

function getSkuItemByRFID2(expectedHTTPStatus, rfid) {
    it('test get /api/skuitems/:rfid (wrong rfid)', async function () {
        await agent.get('/api/skuitems/' + rfid)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
               
            });
    });

}


function putSkuItem(expectedHTTPStatus, rfid, newRFID, newAvailable, newDateOfStock) {
    it('test put /api/skuitems/:rfid', async function () {
        updates = {
            "newRFID": newRFID,
            "newAvailable": newAvailable,
            "newDateOfStock": newDateOfStock
        }
        await agent.put(`/api/skuitems/${rfid}`)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);      
            });
    });

}


function deleteSkuItem(expectedHTTPStatus, rfid) {
    it('test delete /api/skuitems/:rfid', async function () {
        await agent.delete(`/api/skuitems/${rfid}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                
            });
    });

}

function getAvailableSkuItemsBySkuId(expectedHTTPStatus, rfid, skuid) {
    it('test /api/skuitems/sku/:id', async function () {
        updates = {
            "newRFID": rfid,
            "newAvailable": 1,
            "newDateOfStock": "2021/10/12 12:30"
        }
        await agent.put('/api/skuitems/' + rfid).send(updates).then(async function (res) {
            await agent.get('/api/skuitems/sku/' + skuid)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus)
                    if (res.status === 200) {
                        res.body.should.eql(
                            [
                                {
                                    "RFID": rfid,
                                    "SKUId": skuid,
                                    "DateOfStock": "2021/10/12 12:30"
                                }
                            ]
                        )
                    }
                
                });
        });
    })


}

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test restockOrder apis', () => {

    beforeEach(async () => {

        await agent.delete('/api/emergenza/emergenza')

        const ro1 = {
            "issueDate": "2021/11/29 09:33",
            "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
            "supplierId": 1
        }

        const ro2 = {
            "issueDate": "2021/11/29 09:34",
            "products": [{ "SKUId": 13, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 181, "description": "another product", "price": 11.99, "qty": 20 }],
            "supplierId": 1
        }

        const ro3 = {
            "issueDate": "2021/11/29 09:35",
            "products": [{ "SKUId": 14, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 182, "description": "another product", "price": 11.99, "qty": 20 }],
            "supplierId": 1
        }

        await agent.post('/api/restockOrder').send(ro1)
        await agent.post('/api/restockOrder').send(ro2)
        await agent.post('/api/restockOrder').send(ro3)
    })

    deleteAllData(204);

    const products1 = [
        { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 },
        { "SKUId": 181, "description": "another product", "price": 11.99, "qty": 20 }
    ]

    const products2 = []

    postRestockOrder(201, "2021/10/21 11:33", products1, 1);
    postRestockOrder(201, "2021/10/21", products2, 1);
    postRestockOrder(201, "2021/10/21", products2, 1);
    postRestockOrder(422, "2021/10/", products1, 1);
    postRestockOrder(422, "2021/10/1", products1, 1);
    postRestockOrder(422, "2021/10/21 10:3", products1, 1);
    postRestockOrder(422, "2021/10/21", products1, "xx");
    postRestockOrder(422, undefined, products1, 1);
    postRestockOrder(422, "2021/10/21 11:33", undefined, 1);
    postRestockOrder(422, "2021/10/21 11:33", products1, undefined);


    putRestockOrderState(200, 1, "DELIVERED")
    putRestockOrderState(200, 2, "DELIVERY")
    putRestockOrderState(200, 1, "ISSUED")
    putRestockOrderState(200, 2, "TESTED")
    putRestockOrderState(200, 1, "COMPLETEDRETURN")
    putRestockOrderState(200, 2, "COMPLETED")
    putRestockOrderState(422, 1, "COMPLETEDRET")
    putRestockOrderState(422, 2, 646)
    putRestockOrderState(422, 1, undefined)
    putRestockOrderState(422, undefined, "DELIVERED")
    putRestockOrderState(422, "xx", "DELIVERED")
    putRestockOrderState(404, 4, "DELIVERED")

    const si1 = {
        "skuItems": [{ "SKUId": 12, "rfid": "12345678901234567890123456789017" }]
    }
    const si2 = {
        "skuItems": [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }]
    }

    putRestockOrderSkuitem(200, 1, "DELIVERED", si1)
    putRestockOrderSkuitem(200, 2, "DELIVERED", si2)
    putRestockOrderSkuitem(422, 2, "DELI", si2)
    putRestockOrderSkuitem(422, 1, "DELIVERY", si1)
    putRestockOrderSkuitem(422, 1, "ISSUED", si1)
    putRestockOrderSkuitem(422, 1, "TESTED", si1)
    putRestockOrderSkuitem(422, 1, "COMPLETEDRETURN", si1)
    putRestockOrderSkuitem(422, 1, "COMPLETED", si1)
    putRestockOrderSkuitem(422, 1, undefined, si1)
    putRestockOrderSkuitem(422, 1, "DELIVERED", undefined)
    putRestockOrderSkuitem(422, undefined, "DELIVERED", si1)
    putRestockOrderSkuitem(422, "xx", "DELIVERED", si1)
    putRestockOrderSkuitem(404, 4, "DELIVERED", si1)

    //ro1 issuedate = 2021/11/29
    putRestockOrderTransportNote(200, 1, "DELIVERY", "2021/11/30")
    putRestockOrderTransportNote(200, 1, "DELIVERY", "2021/11/29 09:34")
    putRestockOrderTransportNote(200, 1, "DELIVERY", "2021/11/30 11:59")
    putRestockOrderTransportNote(422, 1, "DELIVERY", "2021/11/28")
    putRestockOrderTransportNote(422, 1, "DELIVERY", "2021/11/28 11:59")
    putRestockOrderTransportNote(422, 1, "DELIVERY", "2021/11")
    putRestockOrderTransportNote(422, 1, "DELIVERY", "2021/11/30 11:")
    putRestockOrderTransportNote(422, 1, "DELIVERY", undefined)
    putRestockOrderTransportNote(422, 1, "ISSUED", "2021/11/30")
    putRestockOrderTransportNote(422, 1, "prova", "2021/11/30")
    putRestockOrderTransportNote(422, 1, undefined, "2021/11/30")
    putRestockOrderTransportNote(422, "xx", "DELIVERY", "2021/11/30")
    putRestockOrderTransportNote(422, undefined, "DELIVERY", "2021/11/30")
    putRestockOrderTransportNote(404, 4, "DELIVERY", "2021/11/30")
    
    getRestockOrdersIssued()

    getRestockOrdersById1()
    getRestockOrdersById2(422, "xx")
    getRestockOrdersById2(422, undefined)

    deleteRestockOrderSkuItem(204, 1)
    deleteRestockOrderSkuItem(422, 4)

    getRestockOrdersById2(404, 4)
    
});

function deleteAllData(expectedHTTPStatus) {
    it('test /api/restockOrder/emergenza (deleting data...)', async function () {
        await agent.delete('/api/emergenza/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}


function getRestockOrdersById1() {
    it('test /api/restockOrders', async function () {
       await agent.get('/api/restockOrders')
            .then(function (res) {
                res.should.have.status(200);
                console.log(res.body)
                res.body.should.eql(
                    
                    [
                        {
                            "id":1,
                            "issueDate":"2021/11/29 09:33",
                            "state": "ISSUED",
                            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                                        {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
                            "supplierId" : 1,
                            "transportNote":{},
                            "skuItems" : []
                        },
                        {
                            "id":2,
                            "issueDate":"2021/11/29 09:34",
                            "state": "ISSUED",
                            "products": [{"SKUId":13,"description":"a product","price":10.99,"qty":30},
                                        {"SKUId":181,"description":"another product","price":11.99,"qty":20}],
                            "supplierId" : 1,
                            "transportNote":{},
                            "skuItems" : []
                        },
                        {
                            "id":3,
                            "issueDate":"2021/11/29 09:35",
                            "state": "ISSUED",
                            "products": [{"SKUId":14,"description":"a product","price":10.99,"qty":30},
                                        {"SKUId":182,"description":"another product","price":11.99,"qty":20}],
                            "supplierId" : 1,
                            "transportNote":{},
                            "skuItems" : []
                        }
                        
                    ]
                
                )
               
            })
        })
}


function getRestockOrdersById1() {
    it('test /api/restockOrders/:id', async function () {
        await agent.get('/api/restockOrders/1')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    
                        {
                                "issueDate":"2021/11/29 09:33",
                                "state": "ISSUED",
                                "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                                            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
                                "supplierId" : 1,
                                "transportNote":{},
                                "skuItems" : []
                    
                        }
                )
            })
        })
}

function getRestockOrdersById2(expectedHTTPStatus, wrongid) {
    it('test /api/restockOrders/:id', async function () {
        await agent.get('/api/restockOrders/'+wrongid)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            })
        })
}

function getRestockOrdersIssued() {
    it('test /api/restockOrdersIssued', async function () {
        updates =
        {
            "newState": "DELIVERY"
        }
        await agent.put('/api/restockOrder/' + 3).send(updates).then( async function () {
         await agent.get('/api/restockOrdersIssued')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.eql(
                    [
                        {
                            "id":1,
                            "issueDate":"2021/11/29 09:33",
                            "state": "ISSUED",
                            "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
                            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
                            "supplierId" : 1,
                            "skuItems" : []
                        },{
                            "id":2,
                            "issueDate":"2021/11/29 09:34",
                            "state": "ISSUED",
                            "products": [{ "SKUId": 13, "description": "a product", "price": 10.99, "qty": 30 },
                            { "SKUId": 181, "description": "another product", "price": 11.99, "qty": 20 }],
                            "supplierId" : 1,
                            "skuItems" : []
                        },
                ])
            })
        })
    })
}

function postRestockOrder(expectedHTTPStatus, issueDate, products, supplierId) {
    it('test /api/restockOrder', async function () {
        let ro = {
            "issueDate": issueDate,
            "products": products,
            "supplierId": supplierId
        }

        await agent.post('/api/restockOrder')
            .send(ro)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    })
}

function putRestockOrderState(expectedHTTPStatus, id, newstate) {
    it('test put /api/restockOrder/:id', async function () {
        updates =
        {
            "newState": newstate
        }

        await agent.put('/api/restockOrder/' + id)
            .send(updates)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}

function putRestockOrderSkuitem(expectedHTTPStatus, id, newstate, skuitems) {

    it('test put /api/restockOrder/:id/skuItems', async function () {
        updates =
        {
            "newState": newstate
        }
        await agent.put('/api/restockOrder/' + id).send(updates).then(async function () {
             await agent.put('/api/restockOrder/' + id + '/skuItems')
                .send(skuitems)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                });
        })
    });

}

function putRestockOrderTransportNote(expectedHTTPStatus, id, newstate, deliveryDate) {

    it('test put /api/restockOrder/:id/transportNote', async function () {
        updates =
        {
            "newState": newstate
        }
        transportNote = {
            "transportNote": { "deliveryDate": deliveryDate }
        }

        await agent.put('/api/restockOrder/' + id).send(updates).then(async function () {
             await agent.put('/api/restockOrder/' + id + '/transportNote')
                .send(transportNote)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                });
        })
    });

}



function deleteRestockOrderSkuItem(expectedHTTPStatus, id) {
    it('test delete /api/restockOrder/:id', async function () {
        await agent.delete('/api/restockOrder/'+id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}

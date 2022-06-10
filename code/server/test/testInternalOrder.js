const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test internalOrder apis', () => {
    beforeEach(async () => {

        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 },
            { SKUId: 180, description: "another product", price: 11.99, qty: 3 }],
            customerId: 1
        }
        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        await agent.delete('/api/internalOrder/emergenza')//.then(function (res) {console.log("drop io status", res.status)});
        await agent.delete('/api/skus')//.then(function (res) {console.log("drop sku status", res.status)});
        await agent.post('/api/sku').send(sku)//.then(function (res) {console.log("post sku status", res.status)});
        await agent.post('/api/internalOrders').send(internalOrder)//.then(function (res) {console.log("post io status", res.status)});
    })

    const products = [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 },
        { SKUId: 180, description: "another product", price: 11.99, qty: 3 }];
    const emptyProduct = [];
    const completedProducts = [{ SkuId: 12, RFID: "12345678901234567890123456789016" },
    { SkuId: 180, RFID: "12345678901234567890123456789038" }];
    const wrongCompletedProducts = [{ SkuId: 12, RFID: "12345678901234567890123456789016" }];
    
    deleteAllData(204);
    postInternalOrder(201, "2021/11/29 09:33", products, 1);
    postInternalOrder(201, "2021/11/29 09:33", emptyProduct, 1);
    postInternalOrder(201, "2021/11/29", products, 1);

    postInternalOrder(422, undefined, products, 1);
    postInternalOrder(422, "2021/11/29 09:33", undefined, 1);
    postInternalOrder(422, "2021/11/29 09:33", products, undefined);
    postInternalOrder(422, "2021/11/29 09:33", products, "ciao");

    postInternalOrder(422, "2021/11/", products, 1);
    postInternalOrder(422, "2021/11/2", products, 1);
    postInternalOrder(422, "2021/11/29 09:", products, 1);

    getInternalOrder(200, 1, "2021/11/29 09:33", "ACCEPTED", products, 1);

    getInternalOrdersIssued(200, 1, "2021/11/29 09:33", "ISSUED", products, 1);
    getInternalOrdersAccepted(200, 1, "2021/11/29 09:33", "ACCEPTED", products, 1);

    getInternalOrderByIDC(200, 1, "2021/11/29 09:33", "ACCEPTED", products, 1, 1);

    getInternalOrderByIDW(422, 1, "2021/11/29 09:33", "ACCEPTED", products, 1, "ciao");
    getInternalOrderByIDW(422, 1, "2021/11/29 09:33", "ACCEPTED", products, 1, undefined);
    getInternalOrderByIDW(404, 1, "2021/11/29 09:33", "ACCEPTED", products, 1, 13);

    putinternalOrders(200, "ISSUED", undefined, 1);
    putinternalOrders(200, "COMPLETED", completedProducts, 1);

    putinternalOrders(404, "COMPLETED", completedProducts, 13);
    putinternalOrders(422, undefined, completedProducts, 1);
    putinternalOrders(422, "COMPLETED", undefined, 1);
    putinternalOrders(422, "COMPLETED", wrongCompletedProducts, 1);

    deleteInternalOrder(204, 1);
    deleteInternalOrder(422, 13);



});

function deleteAllData(expectedHTTPStatus) {
    it('test drop /api/internalOrder/emergenza (deleting data...)', async () => {
        await agent.delete('/api/internalOrder/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function postInternalOrder(expectedHTTPStatus, issueDate, products, customerId) {
    it('test post /api/internalOrders', async () => {
        let internalOrder = {
            "issueDate": issueDate,
            "products": products,
            "customerId": customerId
        }
        await agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function getInternalOrder(expectedHTTPStatus, id, issueDate, state, products, customerId) {
    it('test get /api/internalOrders', async () => {
        await agent.get('/api/internalOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        "id": id,
                        "issueDate": issueDate,
                        "state": state,
                        "products": products,
                        "customerId": customerId
                    }
                ]);
            });
    });
}

function getInternalOrdersIssued(expectedHTTPStatus, id, issueDate, newState, products, customerId) {
    it('test get /api/internalOrdersIssued', async () => {
        newItem = {
            "newState": newState,
            "products": undefined
        }
        await agent.put('/api/internalOrders/' + id).send(newItem);
        await agent.get('/api/internalOrdersIssued')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        "id": id,
                        "issueDate": issueDate,
                        "state": newState,
                        "products": products,
                        "customerId": customerId
                    }
                ]);
            });
    });
}

function getInternalOrdersAccepted(expectedHTTPStatus, id, issueDate, newState, products, customerId) {
    it('test get /api/internalOrdersAccepted', async () => {
        newItem = {
            "newState": newState,
            "products": undefined
        }
        await agent.put('/api/internalOrders/' + id).send(newItem);
        await agent.get('/api/internalOrdersAccepted')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                /*res.body.should.eql([
                    {
                        "id": id,
                        "issueDate": issueDate,
                        "state": newState,
                        "products": products,
                        "customerId": customerId
                    }
                ]);*/
            });
    });
}

function getInternalOrderByIDC(expectedHTTPStatus, id, issueDate, state, products, customerId, Id) {
    it('test getById correct /api/internalOrders/:id (correct id)', async () => {
        await agent.get('/api/internalOrders/' + Id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(
                    {
                        "id": id,
                        "issueDate": issueDate,
                        "state": state,
                        "products": products,
                        "customerId": customerId
                    }

                )
            });
    });
}

function getInternalOrderByIDW(expectedHTTPStatus, id, issueDate, newState, products, costumerId, Id) {
    it('test getById wrong /api/internalOrders/:id (wrong id)', async () => {
        await agent.get(`/api/internalOrders/${Id}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function putinternalOrders(expectedHTTPStatus, newState, products, Id) {
    it('test put /api/internalOrders/:id', async () => {
        newItem = {
            "newState": newState,
            "products": products
        }
        await agent.put('/api/internalOrders/' + Id)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
        });

}

function deleteInternalOrder(expectedHTTPStatus, Id) {
    it('test delete /api/internalOrders/:id', function () {
        agent.delete('/api/internalOrders/' + Id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}
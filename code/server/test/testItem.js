const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test item apis', () => {

    beforeEach(async () => {
        let sku = {
            description: "sku1",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        let restockOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 180, description: "another product", price: 11.99, qty: 20 }],
            supplierId: 1
        }
        let item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        await agent.delete('/api/item/emergenza');
        await agent.delete('/api/skus');
        await agent.delete('/api/emergenza/emergenza');
        await agent.post('/api/sku').send(sku);
        await agent.post('/api/restockOrder').send(restockOrder);
        await agent.post('/api/item').send(item);

    })

    deleteAllData(204);

    postItem(201, 2, "a new item", 10.99, 1, 1);
    postItem(201, 2, "", 10.99, 1, 1);

    postItem(404, 2, "a new item", 10.99, 2, 1);
    postItem(422, 12, "a new item", 10.99, 1, 1);

    postItem(422, undefined, "a new item", 10.99, 1, 2);
    postItem(422, 1, undefined, 10.99, 1, 2);
    postItem(422, 1, "a new item", undefined, 1, 2);
    postItem(422, 1, "a new item", 10.99, undefined, 2);
    postItem(422, 1, "a new item", 10.99, 1, undefined);

    getItem(200, 1, "a new item", 10.99, 1, 1);

    getItemByIDC(200, 1, "a new item", 10.99, 1, 1, 1);
    getItemByIDW(422, 1, "a new item", 10.99, 1, 1, undefined);
    getItemByIDW(422, 1, "a new item", 10.99, 1, 1, "ciao");
    getItemByIDW(404, 1, "a new item", 10.99, 1, 1, 2);

    putItem(200, 11, 1, 1, 1);
    putItem(404, 11, 1, 1, 2);
    putItem(422, 11, 1, 1, undefined);
    putItem(422, 11, 1, 1, "ciao");

    deleteItem(204, 1);
    deleteItem(422, 2);
    deleteItem(422, undefined);
    deleteItem(422, "ciao");
});

function deleteAllData(expectedHTTPStatus) {
    it('test drop /api/item/emergenza (deleting data...)', async () => {
        await agent.delete('/api/item/emergenza')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function postItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('test post /api/item', async () => {
        let item = {
            "id": id,
            "description": description,
            "price": price,
            "SKUId": SKUId,
            "supplierId": supplierId
        }
        await agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function getItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('test get /api/items', async () => {
        await agent.get('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        "id": id,
                        "description": description,
                        "price": price,
                        "SKUId": SKUId,
                        "supplierId": supplierId
                    }
                ]);
            });
    });
}

function getItemByIDC(expectedHTTPStatus, id, description, price, SKUId, supplierId, Id) {
    it('test getById correct /api/items/:id (wrong correct id)', async () => {
        await agent.get('/api/items/' + Id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(
                    {
                        "id": id,
                        "description": description,
                        "price": price,
                        "SKUId": SKUId,
                        "supplierId": supplierId
                    }

                )
            });
    });
}

function getItemByIDW(expectedHTTPStatus, id, description, price, SKUId, supplierId, Id) {
    it('test getById wrong /api/items/:id (wrong correct id)', async () => {
        await agent.get(`/api/items/${Id}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });
}

function putItem(expectedHTTPStatus, price, SKUId, supplierId, Id) {
    it('test put /api/item/:id', async () => {
        newItem = {
            "price": price,
            "SKUId": SKUId,
            "supplierId": supplierId
        }
        await agent.put('/api/item/' + Id)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}

function deleteItem(expectedHTTPStatus, Id) {
    it('test delete /api/items/:id', function () {
        agent.delete('/api/items/' + Id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
    });

}
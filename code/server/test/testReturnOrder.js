const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../server');
var agent = chai.request.agent(app);

describe('test ReturnOrder apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/returnOrders');

        let ro1 = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }
        await agent.post('/api/returnOrder').send(ro1)
        
    })


    describe('test returnOrder post api', () =>{
        beforeEach(async () => {
            await agent.delete('/api/emergenza/emergenza');

            const restockO = {
                "issueDate": "2021/11/29 09:33",
                "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
                { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
                "supplierId": 1
            }

            await agent.post('/api/restockOrder').send(restockO);
        })

        let ro1 = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }
        postReturnOrder(201, ro1);

        let ro2 = {
            "returnDate":"2021/11/29 09:",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }

        postReturnOrder(422, ro2);

        let ro3 = {
            "returnDate":"2021/11/",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }

        postReturnOrder(422, ro3);

        let ro4 = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 3
        }

        postReturnOrder(404, ro4);

        let ro5 = {
            "returnDate":"2021/11/29 09:33",
            "products": undefined,
            "restockOrderId" : 1
        }

        postReturnOrder(422, ro5);

        let ro6 = {
            "returnDate":undefined,
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }

        postReturnOrder(422, ro6);

        let ro7 = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : undefined
        }

        postReturnOrder(422, ro7);

        let ro8 = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 'x'
        }

        postReturnOrder(422, ro2);




    });

    describe('test returnOrder get ', () =>{

        getReturnOrders(200)
        
    });



    describe('test returnOrder delete ', () =>{

         deletereturnOrder(204, 1);
         deletereturnOrder(422, "x");
         deletereturnOrder(422, 5);

    });
    

   

});


async function postReturnOrder(expectedHTTPStatus, data) {
    it('test post /api/returnOrder --- body:data', async function () {
        

        await agent.post('/api/returnOrder')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}

async function getReturnOrders(expectedHTTPStatus) {
    it('test get /api/returnOrders', async function () {

        
        
        await agent.get('/api/returnOrders')
            .then(function (res) { 
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql([
                    {
                        "id" : 1,
                        "returnDate":"2021/11/29 09:33",
                        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                        "restockOrderId" : 1
                    }
                ])
            });
    })
}


async function deletereturnOrder(expectedHTTPStatus, id) {
    it('test delete /api/returnOrder/:id', async function () {
        
        await agent.delete('/api/returnOrder/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            
            });
    })
}
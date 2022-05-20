# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

### Class *SKUITEM_DAO* - method **storeSKUItem(db, data)**

**Criteria for method *storeSKUItem(db, data)*
 1. SKUId existing

| Criteria | Predicate |
| -------- | --------- |
|  SKUId existing      | YES |
|  SKUId existing      | NO  |

**Boundaries**: No boundaries, only boolean predicates to test

**Combination of predicates**:


| SKUId existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Creates a new SKUItem belonging to an existing SKU and gets the created SKUItem |Suite: "Testing storeSKUItem", Case: "SKUId existing"|
| NO | NO | Creates a new SKUItem belonging to a not existing SKU and catches a "ID not found" exception |Suite: "Testing storeSKUItem", Case: "SKUId not existing"|


### Class *SKUITEM_DAO* - method **getStoredSKUItemByRFID(db, rfid)**

**Criteria for method *getStoredSKUItemByRFID(db, rfid)*:**
 1. RFID existing


**Predicates for method *getStoredSKUItemByRFID(db, rfid)*:**

| Criteria | Predicate |
| -------- | --------- |
|  RFID existing  | YES   |
|  RFID existing  |  NO   |

**Boundaries**: No boundaries, only boolean predicates to test

**Combination of predicates**:


| RFID existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Searches for a SKUItem whose RFID exists and should return the proper SKUItem |Suite: "Testing getStoredSKUItemByRFID", Case: "RFID existing"|
| NO | NO | Searches for a SKUItem whose RFID doesn't exist and should catch an "ID not found" exception |Suite: "Testing getAvailableStoredSkuItem", Case: "RFID not existing"|

### Class *SKUITEM_DAO* - method **getAvailableStoredSKUItem(db)**

**Criteria for method *getAvailableStoredSKUItem(db)*:**
 1. SKUId existing
 2. Available = 1 (*note*: available can never assume values which aren't 1 or 0 due to API level checks)


**Predicates for method *getAvailableStoredSKUItem(db)*:**

| Criteria | Predicate |
| -------- | --------- |
|  SKUId existing      | YES |
|  SKUId existing        |  NO   |
|  Available = 1 |  YES  |
|  Available = 1 |  NO   |


**Boundaries**: No boundaries, only boolean predicates to test



**Combination of predicates**:


| SKUId existing | Available | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| YES | YES | YES | Creates an SKU with given SKUId, creates a SKUItem with given ID, existing SKUId, and puts Available = 1, the function should return an array with it |Suite: "Testing getAvailableStoredSkuItem", Case: "Available skuitem found"|
| YES | NO | YES | Creates an SKU with given SKUId, creates a SKUItem with given ID, existing SKUId and Available = 0, the function should return an empty array |Suite: "Testing getAvailableStoredSkuItem", Case: "No available skuitems found"|
| NO | ... | NO | Creates a SKUItem with given ID but with a non-existing SKUId (value of Available is unrelevant), the function should catch an "ID not found" exception|Suite: "Testing getAvailableStoredSkuItem", Case: "No SKUId found exception"|

### Class *SKUITEM_DAO* - method **updateSKUItem(db, rfid, data)**

**Criteria for method *updateSKUItem(db, rfid, data)*:**
 1. RFID existing


**Predicates for method *updateSKUItem(db, rfid, data)*:**

| Criteria | Predicate |
| -------- | --------- |
|  RFID existing  | YES   |
|  RFID existing  |  NO   |


**Boundaries**: No boundaries, only boolean predicates to test



**Combination of predicates**:


| RFID existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Searches for a SKUItem whose RFID exists and should update the proper SKUItem, so by searching by id the same SKUItem it should have updated values |Suite: "Testing updateSKUItem", Case: "RFID existing"|
| NO | NO | Searches for a SKUItem whose RFID doesn't exist and should catch an "ID not found" exception |Suite: "Testing updateSKUItem", Case: "RFID not existing"|

### Class *SKUITEM_DAO* - method **deleteSKUItem(db, rfid)**
**Criteria for method *deleteSKUItem(db, rfid)*:**
 1. RFID existing

**Predicates for method *deleteSKUItem(db, rfid)*:**

| Criteria | Predicate |
| -------- | --------- |
|  RFID existing  | YES   |
|  RFID existing  |  NO   |

**Boundaries**: No boundaries, only boolean predicates to test

| RFID existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Deletes a SKUItem whose RFID exists and searches for it in the database: an 'ID not found' exception should be catched |Suite: "Testing deleteSKUItem", Case: "RFID existing"|
| NO | NO | Tries to delete a SKUItem whose RFID doesn't exist and should catch an "ID not found" exception |Suite: "Testing deleteSKUItem", Case: "RFID not existing"|

### Class *RESTOCKORDER_DAO* - method **getStoredRestockOrderById(db, id)**
**Criteria for method *getStoredRestockOrderById(db, id)*:**
 1. ROID existing

 | Criteria | Predicate |
| -------- | --------- |
|  ROID existing  | YES   |
|  ROID existing  |  NO   |

**Boundaries**: No boundaries, only boolean predicates to test

| ROID existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Creates a restockOrder and searches for it given the specific ID: the expected result is to find the restockOrder |Suite: "Testing getStoredRestockOrderById", Case: "ROID existing"|
| NO | NO | Searches for a restockOrder whose ROID doesn't exist and should catch an "ID not found" exception |Suite: "Testing getStoredRestockOrderById", Case: "ROID not existing"|

### Class *RESTOCKORDER_DAO* - method **updateRestockOrderState(db, id, state)**
**Criteria for method *getStoredRestockOrderById(db, id)*:**
 1. ROID existing

 *Note:* State correctness tested at the API level

 | Criteria | Predicate |
| -------- | --------- |
|  ROID existing  | YES   |
|  ROID existing  |  NO   |

**Boundaries**: No boundaries, only boolean predicates to test

| ROID existing | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| YES | YES | Creates a restockOrder, updates a restockOrder given a correct ID and a proper state, expects to find the same restockOrder with the updated state |Suite: "Testing updateRestockOrderState", Case: "ROID existing"|
| NO | NO | Tries to update a restockOrder whose ROID doesn't exist and should catch an "ID not found" exception |Suite: "Testing updateRestockOrderState", Case: "ROID not existing"|

### Class *RESTOCKORDER_DAO* - method **updateRestockOrderTransportNote(db, id, transportNote)**
**Criteria for method *updateRestockOrderTransportNote(db, id, transportNote)*:**
 1. ROID existing
 2. State "DELIVERY"
 3. Transport note DeliveryDate >= restockOrder issueDate

 *Note:* State correctness tested at the API level

 | Criteria | Predicate |
| -------- | --------- |
| ROID existing  | YES   |
| ROID existing  |  NO   |
| State delivery | YES |
| State delivery | NO |
| Transport note DeliveryDate >= restockOrder issueDate | DeliveryDate < issueDate | 
| Transport note DeliveryDate >= restockOrder issueDate | DeliveryDate >= issueDate | 

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------- |
| Transport note DeliveryDate >= restockOrder issueDate  | DeliveryDate = issueDate |
| Transport note DeliveryDate >= restockOrder issueDate  | DeliveryDate = new Date(-8640000000000000).toUTCString() // Tue, 20 Apr 271,822 B.C. 00:00:00 UTC |
| Transport note DeliveryDate >= restockOrder issueDate  | DeliveryDate = new Date(8640000000000000).toUTCString() // Sat, 13 Sep 275,760 00:00:00 UTC 00:00:00 UTC |

| ROID existing | State delivery | DeliveryDate >= issueDate |Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| YES | YES | YES | YES | Creates a restockOrder, updates a restockOrder given a correct ID with a DELIVERY state, inserts a transportNote whose DeliveryDate >= issueDate (boundaries to test are deliveryDate = issueDate, and deliveryDate = maxDate): in all the cases the function expects to find the same restockOrder with a transportNote | Suite: "Testing UpdateRestockOrderTransportNote", Case: "State DELIVERY and ROID existing and DeliveryDate > IssueDate"<br>Case: "DeliveryDate = maxDate"<br> Case: "DeliveryDate = issueDate"|
| YES | YES | NO | NO | Inserts a transportNote whose DeliveryDate < issueDate (boundary to test: DeliveryDate = minDate): expects to catch a 'Delivery before issue' exception |Suite: "Testing UpdateRestockOrderTransportNote", Case: "State DELIVERY and ROID existing and DeliveryDate < IssueDate"<br>Case: "DeliveryDate = minDate"|
| YES | NO | ... | NO | Tries to insert a transportNote in a restockOrder having state != DELIVERY: expects to catch a 'Not DELIVERY state' exception |Suite: "Testing UpdateRestockOrderTransportNote", Case: "State not DELIVERY and ROID existing" |
| NO | ... | ... | NO | Tries to insert a transportNote in a non existing restockOrder: should catch an 'ID not found' exception |Suite: "Testing UpdateRestockOrderTransportNote", Case: "ROID not existing" |


# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|SKUITEM_DAO > getStoredSKUItem(db)|Testing getStoredSKUItem|
|SKUITEM_DAO > storeSKUItem(db, data)|Testing storeSKUItem > SKUId existing|
|SKUITEM_DAO > storeSKUItem(db, data)|Testing storeSKUItem > SKUId not existing|
|SKUITEM_DAO > getStoredSKUItemByRFID(db, rfid)|Testing getStoredSKUItemByRFID > RFID existing|
|SKUITEM_DAO > getStoredSKUItemByRFID(db, rfid)|Testing getStoredSKUItemByRFID > RFID not existing|
|SKUITEM_DAO > getAvailableStoredSKUItem(db)|Testing getAvailableStoredSKUItem > No available skuitems found|
|SKUITEM_DAO > getAvailableStoredSKUItem(db)|Testing getAvailableStoredSKUItem > Available skuitem found|
|SKUITEM_DAO > getAvailableStoredSKUItem(db)|Testing getAvailableStoredSKUItem > No SKUId found exception|
|SKUITEM_DAO > updateSKUItem(db, rfid, data)|Testing updateSKUItem > RFID existing|
|SKUITEM_DAO > updateSKUItem(db, rfid, data)|Testing updateSKUItem > RFID not existing|
|SKUITEM_DAO > deleteSKUItem(db, rfid)|Testing deleteSKUItem > RFID existing|
|SKUITEM_DAO > deleteSKUItem(db, rfid)|Testing deleteSKUItem > RFID not existing|
|RESTOCKORDER_DAO > getStoredRestockOrder(db) | Testing getStoredRestockOrder |
|RESTOCKORDER_DAO > storeRestockOrder(db, restockOrder) | Testing storeRestockOrder |
|RESTOCKORDER_DAO > getStoredRestockOrderById(db, id) | Testing getStoredRestockOrderById > ID existing |
|RESTOCKORDER_DAO > getStoredRestockOrderById(db, id) | Testing getStoredRestockOrderById > ID not existing |
|RESTOCKORDER_DAO > updateRestockOrderState(db, wrongid, state) | Testing updateRestockOrderState > ID found |
|RESTOCKORDER_DAO > updateRestockOrderState(db, wrongid, state) | Testing updateRestockOrderState > ID not found |
|RESTOCKORDER_DAO > getStoredRestockOrderIssued(db) | Testing GetStoredRestockOrderIssued |
|RESTOCKORDER_DAO > updateRestockOrderTransportNote(db, id, transportNote) | Testing UpdateRestockOrderTransportNote > State DELIVERY and ROID existing and DeliveryDate >= IssueDate |
|RESTOCKORDER_DAO > updateRestockOrderTransportNote(db, id, transportNote) | Testing UpdateRestockOrderTransportNote > State DELIVERY and ROID existing and DeliveryDate < IssueDate |
|RESTOCKORDER_DAO > updateRestockOrderTransportNote(db, id, transportNote) | Testing UpdateRestockOrderTransportNote > State NOT DELIVERY and ROID not existing |
|RESTOCKORDER_DAO > updateRestockOrderTransportNote(db, id, transportNote) | Testing UpdateRestockOrderTransportNote > ROID not existing |



### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >

* Coverage considering untestable branches (those related to generic errors (sql errors, constraints violated, server connection failures...))
* Effective coverage (without considering generic error branches)

### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||




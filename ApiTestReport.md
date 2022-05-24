# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>

<img src="./Img/dependencygraph.png" alt="low level diagram" width="1500">

     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>
    
The integration approach that the team adopted is a **bottom up** approach, where:
* the lowest layer is that of the *DAO classes* which have been individually tested by means of unit tests

* the upper layer is that of the API, whose integration has been directly tested through API testing.

The team opted for an *incremental integration* strategy instead of designing mockups. The reason for this choice is due to one main reason:

since we deployed a 2-level software design, the underlying layer has already been completely tested by unit testing, performed with the goal of obtaining an as high as possible coverage. This strategy makes the API layer integration faster and easier, since we are almost sure that the underlying DAO layer behaves as expected. This was also a point in our favor, considering the tighness of the deadlines.

The strategy was to test the highest number of cases in order to guarantee an high scenario coverage and a reliabile software (scrivere bene): an high effort has been dedicated both in the unit test (for guaranteeing an high statements, branches, functions and lines coverage)


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||


## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||


## Step n 

   
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Use case 5.0.1 (before UC 5.1) - Supplier adds transport note to restock order

|Actors involved|Supplier |
|---------------|---------------|
|Precondition   | Supplier S logged in |
|               | Restock order RO exists and state = DELIVERY |
|Post condition | RO updated with transport note |
|Nominal scenario| S adds transport note containing delivery date to a restock order RO |
|Variants| Delivery date < RO issue date, abort transaction|
|        | RO not in DELIVERY state, abort transaction |


## Scenario UC5-0-1-1

| Scenario | Add new transport note |
| ------------- |:-------------:| 
|  Precondition     | Supplier S logged in |
| | Restock order RO exists and state = DELIVERY |
|  Post condition     | RO updated with transport note |
| Step#        | Description  |
|  1     |  S inserts new transport note |  
|  2     |  S fills the TN with the delivery date |
|  3     |  S updates the RO with the transport note|

## Scenario UC5-0-1-2


| Scenario | Add new transport note |
| ------------- |:-------------:| 
|  Precondition     | Supplier S logged in |
| | Restock order RO exists and state = DELIVERY |
|  Post condition     | RO updated with transport note |
| Step#        | Description  |
|  1     |  S inserts new transport note |  
|  2     |  S fills the TN with the delivery date |
|  3     | Transaction aborted: delivery date < RO issue date |

*Also the other variants are tested by the proper API test*


## Use case 13 - Manage sku items

|Actors involved| Clerk |
|---------------|---------------|
|Precondition   | Clerk C logged in |
|Post condition | SKU item created, modified or deleted |
|Nominal scenario| C defines a new sku item SI and its fields |
|Variants        | C modifies fields of an existing sku item SI |

## Scenario UC13-1


| Scenario |  Create Sku item SI |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
|  Post condition     | SI into the system with an associated SKU and no availability |
| Step#        | Description  |
|  1     |  C inserts new SKU item rfid |  
|  2     |  C inserts new SKU id |
|  3     |  C inserts new date of stock|

## Scenario UC13-2


| Scenario |  Modify Sku item |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | Sku item SI exists |
|  Post condition     | Sku item RFID, availability, date of stock modified  |
| Step#        | Description  |
|  1     |  C sets new SKU item rfid |  
|  2     |  C sets new availability value |
|  3     |  C selects new date of stock|

## Scenario UC13-3


| Scenario |  Delete Sku item |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | Sku item SI exists |
|  Post condition     | Sku item SI deleted |
| Step#        | Description  |
|  1     |  C selects Sku item SI |  
|  2     |  C confirms the cancellation of SI |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test

*Note*: (p) stands for partially (i.e. just one or few more steps of the scenario are covered by the specific test)

*Note*: Scenarios marked with (new) tag are the scenarios which have been added in the document

Only the portion of API tests that satisfied (at least partially) the scenarios provided in the officialRequirements.md document has been inserted in the table.
Instead, in the code there are further tests that verify the correct behaviour of most of the APIs

| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| 13-1 (new), 10-1 (p), 5-1-1(p)             | 5.8.1, 5.8.3                    |  testRestockOrder.js > test /api/skuitem                        |             
| 13-2 (new), 6-1 (p), 6-2 (p), 10-1 (p)     | -                               |  testRestockOrder.js > test put /api/skuitems/:rfid             |             
| 13-3 (new)                                 | 6.10                            |  testRestockOrder.js > test /api/skuitems/sku/:id               |             
| 3-1, 3-2                                   | 5.1, 5.2, 5.3, 5.4, 5.5, 5.6    |  testRestockOrder.js > test /api/restockOrder                   |             
| 5-1-1                                      | 5.8                             |  testRestockOrder.js > test /api/restockOrder/:id/skuItems      |             
| 5-1-1 (p), 5-3-1 (p), 5-3-2 (p), 5-3-3 (p) | 5.7                             |  testRestockOrder.js > test /api/restockOrder/:id               |  
| 6-1 (p), 6-2 (p)                           | 5.10                            |  testRestockOrder.js > test /api/restockOrders/:id/returnItems  |             
| 5-0-1-1, 5-0-1-2 (new)                     |                                 |  testRestockOrder.js > test put /api/restockOrder/:id/transportNote |  
| ...                                        |                                 |                                                                 |             
| ...                                        |                                 |                                                                 |  
| ...                                        |                                 |                                                                 |             
| ...                                        |                                 |                                                                 |  
| ...                                        |                                 |                                                                 |             
| ...                                        |                                 |                                                                 |  
| ...                                        |                                 |                                                                 |             
| ...                                        |                                 |                                                                 |  
| ...                                        |                                 |                                                                 |             
| ...                                        |                                 |                                                                 |             
                         


# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
| RFID is a string of 32 digits    | testSkuItem.js > test /api/skuitem |
|                                  | testSkuItem.js > test put /api/skuitems/:rfid |
|                                  | testSkuItem.js > test get /api/skuitems/:rfid (both correct and wrong case) |
|                                  | testSkuItem.js > test delete /api/skuitems/:rfid|
| Date Format is YYYY/MM/GG HH:MM  | testRestockOrder.js > test put /api/restockOrder/:id/transportNote |
|                                  | testRestockOrder.js > test /api/restockOrders          |
|                                  | testSkuItem.js > test /api/skuitem |
|                                  | testSkuItem.js > test /api/skuitem |
|                                  | testSkuItem.js > test put /api/skuitems/:rfid |


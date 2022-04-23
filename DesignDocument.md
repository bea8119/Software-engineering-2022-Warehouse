# Design Document 


Authors: 

Date: 23/04/2022

Version: 1


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

<discuss architectural styles used, if any>
<report package diagram, if needed>






# Low level design

<for each package in high level design, report class diagram. Each class should detail attributes and operations>









# Verification traceability matrix

\<for each functional requirement from the requirement document, list which classes concur to implement it>

| ----- |-------|-------|-------|-------|------|-------|-------|-------|-------|-------|-------|------|-------|-------|
| | Warehouse | SKU | SKUItem | Position | Test Descriptor | Test Result | Internal Order | Return Order | Restock Order | Transport Note | User | Item | Supplier | Customer |
| FR1 Manage users and rights (users are Administrator, Manager, Clerk, Delivery Employee, Quality Check Employee, Internal customers) | X |   |   |   |   |   |   |   |   |   | X |   |   |   |


FR1.1
Define a new user, or modify an existing user


FR1.2
Delete a user


FR1.3
List all users


FR1.4
Search a user


FR1.5
Manage rights. Authorize access to functions to specific actors according to access rights


FR2
Manage SKU


FR2.1
Define a new SKU, or modify an existing SKU


FR2.2
Delete a SKU


FR2.3
List all SKUs


FR2.4
Search a SKU (by ID, by description)


FR3
Manage Warehouse


FR3.1
Manage positions


FR3.1.1
Define a new position, or modify an existing position


FR3.1.2
Delete a position


FR3.1.3
List all positions


FR3.1.4
Modify attributes of a position


FR3.2
Manage quality tests


FR3.2.1
Add a quality test


FR3.2.2
Modify a quality test


FR3.2.3
Delete a quality test


FR 4
Manage internal customers


FR4.1
Register or modify a customer


FR4.2
Delete a customer


FR4.3
Search a customer


FR4.4
List  all customers


FR5
Manage a restock order


FR5.1
Start a restock order


FR5.2
Add a SKU to a restock order


FR5.3
Define quantity of SKU to be ordered


FR5.4
Delete a SKU from a restock order


FR5.5
Select a Supplier for the restock order


FR5.6
Issue  a restock order


FR5.7
Change state of a restock order


FR5.8
Manage reception of a restock order


FR5.8.1
Create and tag a SKU item with an RFID


FR5.8.2
Store result of a quality test on a SKU Item


FR5.8.3
Store a SKU Item


FR5.9
Start  a return order


FR5.10
Return a SKU item listed in a restock order


FR5.11
Commit a return order


FR5.12
Change state of a return order


FR6
Manage internal orders


FR6.1
Start an internal order


FR6.2
Add a SKU to an internal order


FR6.3
Define quantity of SKU to be ordered


FR6.4
Delete a SKU from an internal order


FR6.5
Issue an internal order


FR6.6
Accept, reject or cancel an internal order


FR6.7
Change state of an internal order


FR6.8
Manage delivery of an internal order


FR6.9
Select SKU Item with a FIFO criterion


FR6.10
Remove SKU Item from warehouse


FR7
Manage Items









# Verification sequence diagrams 
\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>


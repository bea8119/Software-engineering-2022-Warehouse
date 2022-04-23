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


| | Warehouse | SKU | SKUItem | Position | Test Descriptor | Test Result | Internal Order | Return Order | Restock Order | Transport Note | User | Item | Supplier | Customer |
| ----- |-------|-------|-------|-------|------|-------|-------|-------|-------|-------|-------|------|-------|-------|
| FR1     | X |   |   |   |   |   |   |   |   |   | X |   |   |   |
| FR1.1   | X |   |   |   |   |   |   |   |   |   | X |   |   |   |
| FR1.2   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR1.3   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR1.4   | X |   |   |   |   |   |   |   |   |   | X |   |   |   |
| FR1.5   | X |   |   |   |   |   |   |   |   |   | X |   |   |   |
| FR2     | X | X |   |   |   |   |   |   |   |   |   |   |   |   |
| FR2.2   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR2.1   | X | X |   |   |   |   |   |   |   |   |   |   |   |   |
| FR2.2   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR2.3   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR2.4   | X | X |   |   |   |   |   |   |   |   |   |   |   |   |
| FR3     | X |   |   | X |   |   |   |   |   |   |   |   |   |   |
| FR3.1   | X |   |   | X |   |   |   |   |   |   |   |   |   |   |
| FR3.1.1 | X |   |   | X |   |   |   |   |   |   |   |   |   |   |
| FR3.1.2 | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR3.1.3 | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR3.1.4 | X |   |   | X |   |   |   |   |   |   |   |   |   |   |
| FR3.2   | X |   |   |   | X |   |   |   |   |   |   |   |   |   |
| FR3.2.1 | X |   |   |   | X |   |   |   |   |   |   |   |   |   |
| FR3.2.2 | X |   |   |   | X | X |   |   |   |   |   |   |   |   |
| FR3.2.3 | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR 4    | X |   |   |   |   |   |   |   |   |   |   |   |   | X |
| FR4.1   | X |   |   |   |   |   |   |   |   |   | X |   |   | X |
| FR4.2   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR4.3   | X |   |   |   |   |   |   |   |   |   | X |   |   |   |
| FR4.4   | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| FR5     | X | X | X |   |   |   |   | X |   |   |   |   | X |   |
Manage a restock order
| FR5.1   | X |   |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.2   | X | X |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.3   | X | X |   |   |   |   |   |   |   |   |   |   |   |   |
| FR5.4   | X | X |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.5   | X |   |   |   |   |   |   | X |   |   |   |   | X |   |
| FR5.6   | X |   |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.7   | X |   |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.8   | X |   | X |   |   |   |   |   |   |   |   |   |   |   |
| FR5.8.1 | X |   | X |   |   |   |   |   |   |   |   |   |   |   |
| FR5.8.2 | X |   | X |   |   |   |   |   |   |   |   |   |   |   |
| FR5.8.3 | X |   | X |   |   |   |   |   |   |   |   |   |   |   |
| FR5.9   | X |   |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.10  | X |   | X |   |   |   |   | X |   |   |   |   |   |   |
| FR5.11  | X |   |   |   |   |   |   | X |   |   |   |   |   |   |
| FR5.12  | X |   |   |   |   |   |   | X |   |   |   |   |   |   |


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


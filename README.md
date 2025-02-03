## prm

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
<!-- START -->

## 1. Step 1: Create Site Columns (Reusable across lists)
  
  Text Columns

Title - as Customer Name (Single line of text default item content type title)
Email (Single line of text)
WorkPhone Contact Phone (Single line of text)
WorkAddress (Multiple lines of text)
Activity (Single line of text)
Choice Columns
Customer Type (Choices: Individual, Corporate, Government)
Item Type (Choices: Material, Labor, Machinery)
Department Name (Choices: Civil, Electrical, Mechanical, etc.)
Status (Choices: New, In Progress, Completed, Priced)
Technical Assessment Status (Choices: Not Started, In Progress, Completed)
Pricing Status (Choices: Pending, Finalized)
Lookup Columns
Customer → Lookup to Customer List
Request ID → Lookup to Project Requests List
Item ID → Lookup to Inventory Items List
Number & Currency Columns
Estimated Duration (Number)
Estimated Cost (Currency)
Man Hours (Number)
Price Per Unit (Currency)
Worker Cost Per Hour (Currency)
Machine Cost Per Hour (Currency)
Quantity (Number)
Unit Price (Currency)
Total Cost (Calculated: Quantity * Unit Price)
Step 2: Create Lists

1. CustomerList (Existing)
Title (Single line of text) → Customer Name
Email
WorkPhone
WorkAddress
CustomerType

2. InventoryItems List
Title → Item Name
ItemCategory
PricePerUnit
WorkerCostPerHour
MachineCostPerHour
Activity

3. Project Requests List
Title → Request Title
Customer (Lookup)
RequestDate (Date and Time)
EstimatedDuration
EstimatedCost
Status
DocumentSetID (Single line of text)

4. Technical Assessments List
Title → Assessment Title
Project-Code (Metadata)
DepartmentM (Metadata)
Man Hours
Materials (Multiple lines of text)
*Machinery (Multiple lines of text)*
*Dependencies (Multiple lines of text)*
*SpecialConsiderations (Multiple lines of text)*

5. Pricing Details List
Title → Item Title
Request ID (Lookup)
Item ID (Lookup)
Quantity
Unit Price
Total Cost (Calculated)
Activity



Step 3: Create Document Library for Project Documentation
Library Name: Project Documentation
Enable Document Sets
Metadata Fields:
Project ID (Single line of text)
Customer (Lookup)
Technical Assessment Status
Pricing Status
Step 4: Permissions Setup
Commerce Department: Can create/edit project requests but cannot modify technical assessments.
Engineering Teams: Can only update their respective assessments.
Pricing Team: Can only edit pricing details.
Management: Full control over all lists.

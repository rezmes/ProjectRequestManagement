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

## Step 1: Create Site Columns (Reusable across lists)
  
### Text Columns

Title - as Customer Name (Single line of text default item content type title)
Email (Single line of text)
WorkPhone Contact Phone (Single line of text)
WorkAddress (Multiple lines of text)
Activity (Single line of text)

### Choice Columns

Customer Type (Choices: Individual, Corporate, Government)
Item Type (Choices: Material, Labor, Machinery)
Department Name (Choices: Civil, Electrical, Mechanical, etc.)
Status (Choices: New, In Progress, Completed, Priced)
TechnicalAssessmentStatus (Choices: Not Started, In Progress, Completed)
PricingStatus (Choices: Pending, Finalized)

### Lookup Columns

Customer → Lookup to Customer List
RequestID → Lookup to ProjectRequests List
ItemID → Lookup to InventoryItems List
### Number & Currency Columns
EstimatedDuration (Number)
EstimatedCost (Currency)
ManHours (Number)
PricePerUnit (Currency)
WorkerCostPerHour (Currency)
MachineCostPerHour (Currency)
Quantity (Number)
UnitPrice (Currency)
TotalCost (Calculated: Quantity * Unit Price)

## Step 2: Create Lists

1. 'CustomerList' (Existing)
Title (Single line of text) → Customer Name
Email
WorkPhone
WorkAddress
CustomerType

2. 'InventoryItems' List
Title → Item Name
ItemCategory
PricePerUnit
WorkerCostPerHour
MachineCostPerHour
Activity

3. 'ProjectRequests' List
Title → Request Title
Customer (Lookup)
RequestDate (Date and Time)
EstimatedDuration
EstimatedCost
Status
DocumentSetID (Single line of text)

4. 'TechnicalAssessments' List
Title → Assessment Title
ProjectID (Lookup)
DepartmentM (Metadata)
Man Hours
Materials (Multiple lines of text)
*Machinery (Multiple lines of text)*
*Dependencies (Multiple lines of text)*
*SpecialConsiderations (Multiple lines of text)*

5. 'PricingDetails' List
Title → Item Title
Project-Code (Metadata)
Item ID (Lookup)
Quantity
Unit Price
Total Cost (Calculated)
Activity

## Step 3: Create Document Library for Project Documentation

Library Name: 'ProjectDocumentation'
Enable Document Sets
Metadata Fields:
Project-Code (Metadata)
Customer (Lookup)
Technical Assessment Status
Pricing Status

## Step 4: Permissions Setup

Commerce Department: Can create/edit project requests but cannot modify technical assessments.
Engineering Teams: Can only update their respective assessments.
Pricing Team: Can only edit pricing details.
Management: Full control over all lists.

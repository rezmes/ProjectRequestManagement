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
TechnicalAssessmentStatus
PricingStatus

## Step 4: Permissions Setup

Commerce Department: Can create/edit project requests but cannot modify technical assessments.
Engineering Teams: Can only update their respective assessments.
Pricing Team: Can only edit pricing details.
Management: Full control over all lists.

# Implementation Plan

1. SPFx Form Development

* Develop custom forms for request submission, technical assessments, and pricing details using SPFx.

* Ensure forms are dynamically populated with items from the InventoryItems list.

2. Document Set Management

* Configure Document Sets in the Project Documentation Library to group related project documents.

3. Workflow Automation with Nintex

* Implement workflows to automate notifications, approvals, and status updates.

* Ensure workflows correctly link list items and documents using the Current Item ID.
<!-- Re-Confirm -->
Step 1: Create Site Columns (Reusable across lists)
Text Columns
Title: (Default column, use for Customer Name in Customer List and Item Name in InventoryItems List)

Email: (Single line of text)

WorkPhone: (Single line of text)

WorkAddress: (Multiple lines of text)

Activity: (Single line of text)

Choice Columns
CustomerType: (Choices: Individual, Corporate, Government)

ItemType: (Choices: Material, Labor, Machinery)

DepartmentName: (Choices: Civil, Electrical, Mechanical, etc.)

Status: (Choices: New, In Progress, Completed, Priced)

TechnicalAssessmentStatus: (Choices: Not Started, In Progress, Completed)

PricingStatus: (Choices: Pending, Finalized)

Lookup Columns
Customer: Lookup to Customer List

RequestID: Lookup to ProjectRequests List

ItemID: Lookup to InventoryItems List

Number & Currency Columns
EstimatedDuration: (Number)

EstimatedCost: (Currency)

ManHours: (Number)

PricePerUnit: (Currency)

WorkerCostPerHour: (Currency)

MachineCostPerHour: (Currency)

Quantity: (Number)

UnitPrice: (Currency)

TotalCost: (Calculated: Quantity * Unit Price)

Step 2: Create Lists
CustomerList (Existing)

Title (Single line of text) → Customer Name

Email

WorkPhone

WorkAddress

CustomerType

InventoryItems List

Title → Item Name

ItemType

PricePerUnit

WorkerCostPerHour

MachineCostPerHour

Activity

ProjectRequests List

Title → Request Title

Customer (Lookup)

RequestDate (Date and Time)

EstimatedDuration

EstimatedCost

Status

DocumentSetID (Single line of text)

TechnicalAssessments List

Title → Assessment Title

RequestID (Lookup)

DepartmentName

ManHours

Materials (Multiple lines of text)

Machinery (Multiple lines of text)

Dependencies (Multiple lines of text)

SpecialConsiderations (Multiple lines of text)

PricingDetails List

Title → Item Title

RequestID (Lookup)

ItemID (Lookup)

Quantity

UnitPrice

TotalCost (Calculated)

Activity

Step 3: Create Document Library for Project Documentation
Library Name: ProjectDocumentation

Enable Document Sets

Metadata Fields:

Project-Code

Customer (Lookup)

TechnicalAssessmentStatus

PricingStatus
<!-- Installing som packages -->
`npm install office-ui-fabric-react@5.134.0 moment@2.24.0 moment-jalaali@0.8.3`


<!-- Start Implementation -->

### Step 1: SPFx Form Development

* We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

## Project Request Submission Form

```tsx
import * as React from 'react';
import { Dropdown, IDropdownOption, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as moment from 'moment';
import styles from './ProjectRequestForm.module.scss';
import { IProjectRequestFormProps } from './IProjectRequestFormProps';
import { IProjectRequestFormState } from './IProjectRequestFormState';

export default class ProjectRequestForm extends React.Component<IProjectRequestFormProps, IProjectRequestFormState> {
  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.state = {
      customerOptions: [],
      selectedCustomer: undefined,
      requestTitle: '',
      requestDate: moment().format('YYYY-MM-DD'),
      estimatedDuration: 0,
      estimatedCost: 0,
      status: 'New'
    };
  }

  public componentDidMount(): void {
    this.loadCustomerOptions();
  }

  private loadCustomerOptions(): void {
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('CustomerList')/items`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data: any) => {
        const customerOptions: IDropdownOption[] = data.value.map((item: any) => ({
          key: item.Id,
          text: item.Title
        }));
        this.setState({ customerOptions });
      });
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as any);
  };

  private handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    const { name } = event.currentTarget as any;
    this.setState({ [name]: option?.key } as any);
  };

  private handleSubmit = (): void => {
    const { requestTitle, selectedCustomer, requestDate, estimatedDuration, estimatedCost, status } = this.state;

    const requestData = {
      Title: requestTitle,
      CustomerId: selectedCustomer,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      Status: status
    };

    this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('ProjectRequests')/items`, SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-type': 'application/json;odata=verbose'
      },
      body: JSON.stringify(requestData)
    })
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {
        alert('Request submitted successfully!');
        this.resetForm();
      } else {
        alert('Error submitting request');
      }
    });
  };

  private resetForm = (): void => {
    this.setState({
      requestTitle: '',
      selectedCustomer: undefined,
      requestDate: moment().format('YYYY-MM-DD'),
      estimatedDuration: 0,
      estimatedCost: 0,
      status: 'New'
    });
  };

  public render(): React.ReactElement<IProjectRequestFormProps> {
    const { customerOptions, requestTitle, selectedCustomer, requestDate, estimatedDuration, estimatedCost } = this.state;

    return (
      <div className={styles.projectRequestForm}>
        <TextField label="Request Title" name="requestTitle" value={requestTitle} onChange={this.handleInputChange} />
        <Dropdown label="Customer" name="selectedCustomer" options={customerOptions} selectedKey={selectedCustomer} onChange={this.handleDropdownChange} />
        <TextField label="Request Date" name="requestDate" value={requestDate} onChange={this.handleInputChange} />
        <TextField label="Estimated Duration (days)" name="estimatedDuration" value={estimatedDuration} onChange={this.handleInputChange} type="number" />
        <TextField label="Estimated Cost" name="estimatedCost" value={estimatedCost} onChange={this.handleInputChange} type="number" />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

```

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
**Project Request Management (PRM)**: **Scenario: Project Request and Execution Process** This document outlines the process for handling project requests, from initial customer contact to project pricing and initiation. The process involves several departments, including the Commerce Department and the Technical & Engineering Department. **1. Customer Request:** The process begins with the customer informing the Commerce Department of their need for products and services. This communication can occur through various channels: a. Verbal communication b. Formal letter c. Participation in tenders **Note:** The primary deliverable is typically multi-month, sometimes multi-year projects. These projects encompass both goods consumed during the project and the execution of project services. **2. Initial Response (Commerce Department):** Upon receiving a request, the Commerce Department must provide the customer with the following information: a. Estimated project duration b. Project cost estimate **3. Request Submission and Referral (Commerce Department):** The Commerce Department formally registers the customer request within the system and forwards it to the Technical & Engineering Department. **4. Technical Assessment (Technical & Engineering Department):** The Technical & Engineering Department shares the request with relevant engineering sub-departments and solicits input regarding their specific areas of expertise. This assessment covers the following aspects: a. List of necessary activities to fulfill the customer request b. Required man-hours, broken down by expertise level (e.g., expert, technician, general worker) c. Required materials and tools, with quantities d. Required machinery and estimated usage hours e. Activity dependencies (predecessor, concurrent, successor) f. Any special considerations or potential challenges **5. Compilation and Review (Technical & Engineering Department):** The Technical & Engineering Department consolidates the input from the various sub-departments and creates a draft document, which is then submitted to the respective sub-departments for review and approval. **6. Finalization and Handover (Technical & Engineering Department):** Once the consolidated document is approved, it is finalized and returned to the Commerce Department for pricing. **7. Pricing (Commerce Department):** The Commerce Department individually prices each item listed in the document and multiplies it by the corresponding quantity to determine the total cost per item. These totals are then summed to calculate the overall project cost (similar to a pro forma invoice). This total cost, along with the project duration provided by the Technical & Engineering Department, forms the basis for the final price and timeline presented to the customer. **Key Considerations:** 1. **Supporting Documentation:** This process will undoubtedly involve supporting documents. It is recommended to utilize SharePoint's Document Set feature, along with a form or other suitable mechanism, to manage these documents efficiently. 2. **Workflow Automation:** The Nintex Workflow Designer 2019 tool is available for workflow automation. 3. **Environment:** The solution will be implemented in SharePoint 2019 On-Premises. The online version is not available. 4. **Customization:** Customizations will be developed using the SPFx@1.4.1 framework. **Crucially:** SharePoint 2019 - On-premises Dev. Env.: `SPFx@1.4.1 (node@8.17.0, react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2; updates and upgrades are not options)` **Pay close attention to the limitations imposed by the framework version and avoid using commands or external tools incompatible with it.**
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
RequestStatus (Choices: New, In Progress, Completed, Priced)
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
RequestStatus
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

RequestStatus: (Choices: New, In Progress, Completed, Priced)

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

RequestStatus

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

<!-- -------------------------------------------------------------------------------------------------------------------------------------------------- -->

import * as React from "react"; import { Dropdown, IDropdownOption } from "office-ui-fabric-react"; interface ICustomerDropdownProps { customerOptions: IDropdownOption[]; selectedCustomer: string | number | undefined; onChange: (option?: IDropdownOption) => void; // Corrected to use onChanged } export class CustomerDropdown extends React.Component<ICustomerDropdownProps, {}> { public render(): React.ReactElement<ICustomerDropdownProps> { const { customerOptions, selectedCustomer, onChange } = this.props; const placeHolderText = "انتخاب مشتری"; return ( <Dropdown placeHolder={placeHolderText} label="Customer" options={customerOptions} selectedKey={selectedCustomer} onChanged={onChange} /> ); } } export default CustomerDropdown; and handleDropdownChange = ( option?: IDropdownOption ): void => { console.log("Dropdown Change Event:", option); // Log the dropdown change event this.setState({ selectedCustomer: option ? option.key.toString() : undefined, },()=>{ console.log("Updated selectedCustomer in state:", this.state.selectedCustomer); // Log the updated state }); }; why the placeHolder do not change after selecting item?

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)



The issue with the placeholder not updating after selecting an item in your dropdown is caused by the incorrect use of the onChanged property in the Dropdown component from the office-ui-fabric-react library. Specifically, the placeHolder property does not automatically update based on the selected item—it remains static. Instead, the selectedKey property is responsible for controlling the currently selected value.

Explanation of the Problem:
placeHolder is Static:
The placeHolder property is intended to display a default placeholder text when no item is selected. It does not change dynamically when a selection is made. Once a user selects an item, the dropdown relies on the selectedKey property to determine the displayed value.
selectedKey is Missing State Update:
Your current implementation is trying to set the selectedCustomer in the parent state, but the Dropdown component is not properly bound to the updated selectedKey. The Dropdown component needs its selectedKey property to be updated dynamically based on the state.
Solution:
To fix this, you need to:

Ensure that the selectedKey property of the Dropdown is tied to the selectedCustomer state.
Update the state when an item is selected using the onChanged callback.
Here's the corrected implementation:

Fixed Code:
CustomerDropdown Component:

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined; // Controlled by parent
  onChange: (option?: IDropdownOption) => void; // Callback to parent
}

export class CustomerDropdown extends React.Component<ICustomerDropdownProps, {}> {
  public render(): React.ReactElement<ICustomerDropdownProps> {
    const { customerOptions, selectedCustomer, onChange } = this.props;

    return (
      <Dropdown
        placeHolder="انتخاب مشتری" // Static placeholder text
        label="Customer"
        options={customerOptions}
        selectedKey={selectedCustomer} // Controlled by parent state
        onChanged={onChange} // Trigger parent callback on change
      />
    );
  }
}

export default CustomerDropdown;
Parent Component:
Your parent component should:

Manage the selectedCustomer state.
Pass it as the selectedCustomer prop.
Update the state in the onChange handler.
Here’s how the parent component should look:


import * as React from "react";
import { CustomerDropdown } from "./CustomerDropdown";
import { IDropdownOption } from "office-ui-fabric-react";

interface IParentComponentState {
  selectedCustomer: string | number | undefined;
}

export class ParentComponent extends React.Component<{}, IParentComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedCustomer: undefined // Initial state
    };
  }

  private handleDropdownChange = (option?: IDropdownOption): void => {
    console.log("Dropdown Change Event:", option);

    // Update the state with the selected option key
    this.setState(
      {
        selectedCustomer: option ? option.key : undefined
      },
      () => {
        console.log("Updated selectedCustomer in state:", this.state.selectedCustomer);
      }
    );
  };

  public render(): React.ReactElement<{}> {
    const customerOptions: IDropdownOption[] = [
      { key: "1", text: "Customer 1" },
      { key: "2", text: "Customer 2" },
      { key: "3", text: "Customer 3" }
    ];

    return (
      <div>
        <CustomerDropdown
          customerOptions={customerOptions}
          selectedCustomer={this.state.selectedCustomer} // Pass current state
          onChange={this.handleDropdownChange} // Pass handler
        />
      </div>
    );
  }
}
Key Changes:
selectedKey Binding:
The selectedKey property of the Dropdown is now dynamically bound to the selectedCustomer state in the parent component. This ensures that the displayed value in the dropdown updates when the state changes.
State Management in Parent:
The parent component manages the state of the selected customer (selectedCustomer). The child component (CustomerDropdown) is stateless and controlled by the parent.
Static placeHolder:
The placeHolder property remains static and is only shown when no item is selected. Once a selection is made, the dropdown automatically displays the selected item's text, as dictated by the selectedKey.
Key Notes for SharePoint 2019:
Since you are using an older version of SPFx with React 15.6.2 and TypeScript 2.4.2, ensure the following:

Avoid using TypeScript features that are not supported in TypeScript 2.4.2 (e.g., newer syntax like ?. and ??).
The Dropdown component in office-ui-fabric-react for SPFx 1.4.1 uses onChanged instead of onChange. Ensure you’re using the correct prop name.
Expected Behavior:
Initially, the placeholder text ("انتخاب مشتری") is shown.
When a user selects an item, the selected item's text is displayed in the dropdown.
The selectedCustomer state is updated in the parent component.
The dropdown reflects the updated state via the selectedKey property.
Let me know if you have any further questions!


<!-- Installing som packages -->
`npm install office-ui-fabric-react@5.134.0 moment@2.24.0 moment-jalaali@0.8.3`
uninstalled
<!-- Start Implementation -->

### Step 1: SPFx Form Development

* We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

```json
//package.json
{
  "name": "prm",
  "version": "0.0.1",
  "private": true,
  "main": "lib/index.js",
  "engines": {
    "node": ">=0.10.0"
  },
  "scripts": {
    "build": "gulp bundle",
    "clean": "gulp clean",
    "test": "gulp test"
  },
  "dependencies": {
    "@microsoft/sp-core-library": "~1.4.0",
    "@microsoft/sp-lodash-subset": "~1.4.0",
    "@microsoft/sp-office-ui-fabric-core": "~1.4.0",
    "@microsoft/sp-webpart-base": "~1.4.0",
    "@pnp/sp": "^2.0.9",
    "@types/es6-promise": "0.0.33",
    "@types/react": "15.6.6",
    "@types/react-dom": "15.5.6",
    "@types/webpack-env": "1.13.1",
    "moment": "^2.24.0",
    "moment-jalaali": "^0.8.3",
    "office-ui-fabric-react": "^5.21.0",
    "react": "15.6.2",
    "react-dom": "15.6.2"
  },
  "resolutions": {
    "@types/react": "15.6.6"
  },
  "devDependencies": {
    "@microsoft/sp-build-web": "~1.4.1",
    "@microsoft/sp-module-interfaces": "~1.4.1",
    "@microsoft/sp-webpart-workbench": "~1.4.1",
    "gulp": "~3.9.1",
    "@types/chai": "3.4.34",
    "@types/mocha": "2.2.38",
    "ajv": "~5.2.2"
  }
}
```


## Project Request Submission Form

```tsx
//CustomDropdown.tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined;
  onChange: (option?: IDropdownOption) => void; // Corrected to use onChanged
}

export class CustomerDropdown extends React.Component<ICustomerDropdownProps, {}> {
  public render(): React.ReactElement<ICustomerDropdownProps> {
    const { customerOptions, selectedCustomer, onChange } = this.props;
    const placeHolderText = "انتخاب مشتری";
    return (
      <Dropdown
        placeHolder={placeHolderText}
        label="Customer"
        options={customerOptions}
        selectedKey={selectedCustomer}
        onChanged={onChange}
      />
    );
  }
}

export default CustomerDropdown;

```

```tsx
//ProjectRequestForm.tsx
import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import CustomerDropdown from "./CustomerDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import { IDropdownOption } from "office-ui-fabric-react";
import * as moment from "moment";
import "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";



class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService();
    this.state = {
      customerOptions: [],
      selectedCustomer: undefined,
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"), // Set default date to today
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
    };
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      this.setState({ customerOptions });
    });
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    // Convert to number if the field expects a number
    const newValue = name === "estimatedDuration" || name === "estimatedCost"
      ? parseFloat(value) || 0
      : value;

    this.setState({ [name]: newValue } as unknown as Pick<IProjectRequestFormState, keyof IProjectRequestFormState>);
  };


  handleDropdownChange = (
    option?: IDropdownOption
  ): void => {

    console.log("Dropdown Change Event:", option); // Log the dropdown change event
    this.setState({
      selectedCustomer: option ? option.key : undefined,
    },()=>{
      console.log("Updated selectedCustomer in state:", this.state.selectedCustomer); // Log the updated state
    });
  };


  handleSubmit = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      RequestStatus,
    } = this.state;
    console.log("Selected Customer:", selectedCustomer); // Log the selectedCustomer value
    // Convert the requestDate to Gregorian format
    const formattedRequestDate = moment(requestDate, "jYYYY-jMM-jDD").format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    ); // Format date as ISO string
    // const formattedRequestDate = moment(
    //   requestDate,
    //   "jYYYY-jMM-jDD"
    // ).toISOString();

    // const requestData = {
    //   Title: requestTitle,
    //   CustomerId: selectedCustomer || null, // Lookup fields must have the "Id" suffix
    //   RequestDate: formattedRequestDate,
    //   EstimatedDuration: estimatedDuration,
    //   EstimatedCost: estimatedCost,
    //   RequestStatus: RequestStatus,
    // };

    const requestData = {
      Title: requestTitle.trim(), // Ensure text field is not empty
      CustomerId: selectedCustomer ? selectedCustomer : null, // Ensure lookup is valid
      RequestDate: formattedRequestDate,
      EstimatedDuration: isNaN(estimatedDuration) ? 0 : estimatedDuration, // Ensure numeric
      EstimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost, // Ensure numeric
      RequestStatus: RequestStatus.trim(),
    };

    // Log the requestData object for debugging
    console.log("Request Data:", requestData);

    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response.data) {
          alert("Request submitted successfully!");
          this.resetForm();
        } else {
          alert("Error submitting request");
        }
      })
      .catch((error) => {
        console.error("Error details:", error);
        alert(
          "There was an error submitting your request. Please check the console for details."
        );
      });
  };



  resetForm = (): void => {
    this.setState({
      requestTitle: "",
      selectedCustomer: undefined,
      requestDate: moment().format("YYYY-MM-DD"), // Reset to default date
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
    });
  };

  render() {
    const {
      customerOptions,
      selectedCustomer,
      requestTitle,
      requestDate,
      estimatedDuration,
      estimatedCost,
    } = this.state;

    return (
      <div>
<TextField
  label="Request Title"
  value={this.state.requestTitle}
  onChanged={(newValue: string) => {

    this.setState({ requestTitle: newValue || "" });
  }}
/>
        <CustomerDropdown
          customerOptions={customerOptions}
          selectedCustomer={selectedCustomer}
          onChange={this.handleDropdownChange}
        />
        <TextField
          label="Request Date"
          name="requestDate"
          value={this.state.requestDate}
          onChanged={(newValue: string) => {

            this.setState({ requestDate: newValue || "" });
          }}
        />
<TextField
  label="Estimated Duration (days)"
  value={this.state.estimatedDuration.toString()} // Ensure it’s a string
  onChanged={(newValue: string) => this.setState({ estimatedDuration: parseInt(newValue) || 0 })}
  type="number"
/>



<TechnicalAssessmentTable
  projectRequestService={this.projectRequestService}
  requestId={this.state.requestId} // Assuming we have requestId in state
/>


<TextField
  label="Estimated Cost"
  name="estimatedCost"
  value={this.state.estimatedCost.toString()} // Convert number to string for display
  onChanged={(newValue: string) => this.setState({ estimatedCost: parseInt(newValue) || 0 })}
  type="number"
/>

        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default ProjectRequestForm;


```

```ts
// IPrmProps.ts
export interface IPrmProps {
  description: string;
}
```

```ts
//PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/ProjectRequestForm';
import { sp } from "@pnp/sp";
import { IProjectRequestFormProps } from './components/IProjectRequestFormProps';

export interface IPrmWebPartProps {
  description: string;
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(ProjectRequestForm, {
      spHttpClient: this.context.spHttpClient,
      siteUrl: this.context.pageContext.web.absoluteUrl,

    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

```

```ts
//src\webparts\prm\services\ProjectRequestService.ts

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<any[]> {
    return sp.web.lists.getByTitle('Customer').items.get()
      .then(data => data.map(item => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists.getByTitle('ProjectRequests').items.add(requestData);
  }

  public getTechnicalAssessments(requestId: number): Promise<any[]> {
    return sp.web.lists.getByTitle('TechnicalAssessments').items.filter(`ProjectID eq ${requestId}`).get()
      .then(data => data.map(item => ({
        title: item.Title,
        department: item.DepartmentM,
        manHours: item.ManHours,
        materials: item.Materials,
        machinery: item.Machinery,
        dependencies: item.Dependencies,
        specialConsiderations: item.SpecialConsiderations
      })));
    }
}

```

```ts
//IProjectRequestFormProps.ts
import { SPHttpClient } from '@microsoft/sp-http';

export interface IProjectRequestFormProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
```

```ts
//IProjectRequestFormState.ts
import { IDropdownOption } from 'office-ui-fabric-react';

export interface IProjectRequestFormState {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  RequestStatus: string;
  requestId?: number;
}
```

```ts
//ITechnicalAssessmentState.ts
export interface ITechnicalAssessmentState {
  assessments: Array<{
    title: string;
    department: string;
    manHours: number;
    materials: string;
    machinery: string;
    dependencies: string;
    specialConsiderations: string;
  }>;
}

```

```tsx
//TechnicalAssessmentTable.tsx
import * as React from "react";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";

class TechnicalAssessmentTable extends React.Component<ITechnicalAssessmentProps, ITechnicalAssessmentState> {
  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.state = {
      assessments: []
    };
  }

  componentDidMount() {
    this.loadAssessments();
  }

  loadAssessments() {
    // Load assessments from the ProjectRequestService
    this.props.projectRequestService.getTechnicalAssessments(this.props.requestId)
      .then((assessments) => {
        this.setState({ assessments });
      });
  }

  render() {
    const { assessments } = this.state;

    return (
      <div>
        <h3>Technical Assessments</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Man Hours</th>
              <th>Materials</th>
              <th>Machinery</th>
              <th>Dependencies</th>
              <th>Special Considerations</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr key={index}>
                <td>{assessment.title}</td>
                <td>{assessment.department}</td>
                <td>{assessment.manHours}</td>
                <td>{assessment.materials}</td>
                <td>{assessment.machinery}</td>
                <td>{assessment.dependencies}</td>
                <td>{assessment.specialConsiderations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TechnicalAssessmentTable;
```


```tsx
//Prm.tsx
import * as React from 'react';
import styles from './Prm.module.scss';
import { IPrmProps } from './IPrmProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Prm extends React.Component < IPrmProps, {} > {
  public render(): React.ReactElement<IPrmProps> {
    return(
      <div className = { styles.prm } >
  <div className={styles.container}>
    <div className={styles.row}>
      <div className={styles.column}>
        <span className={styles.title}>Welcome to SharePoint!</span>
        <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
        <p className={styles.description}>{escape(this.props.description)}</p>
        <a href='https://aka.ms/spfx' className={styles.button}>
          <span className={styles.label}>Learn more</span>
        </a>
      </div>
    </div>
  </div>
      </div >
    );
  }
}
```
# Notable Reminder: 

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)



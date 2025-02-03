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
<!-- Installing som packages -->
`npm install office-ui-fabric-react@5.134.0 moment@2.24.0 moment-jalaali@0.8.3`

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
    "office-ui-fabric-react": "^5.134.0",
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
  selectedCustomer: string | undefined;
  onChange: (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => void;
}

export class CustomerDropdown extends React.Component<
  ICustomerDropdownProps,
  {}
> {
  public render(): React.ReactElement<ICustomerDropdownProps> {
    return (
      <Dropdown
        label="Customer"
        options={this.props.customerOptions}
        selectedKey={this.props.selectedCustomer}
        onChange={this.props.onChange}
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
    this.setState({ [name]: value } as any);
  };

  handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    this.setState({
      selectedCustomer: option ? option.key.toString() : undefined,
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

    // Convert the requestDate to Gregorian format
    const formattedRequestDate = moment(requestDate, "jYYYY-jMM-jDD").format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    ); // Format date as ISO string

    const requestData = {
      Title: requestTitle,
      CustomerId: parseInt(selectedCustomer, 10), // Ensure CustomerId is an integer
      RequestDate: formattedRequestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus, // Use the correct field name
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
          name="requestTitle"
          value={requestTitle}
          onChange={this.handleInputChange}
        />
        <CustomerDropdown
          customerOptions={customerOptions}
          selectedCustomer={selectedCustomer}
          onChange={this.handleDropdownChange}
        />
        <TextField
          label="Request Date"
          name="requestDate"
          value={requestDate}
          onChange={this.handleInputChange}
        />
        <TextField
          label="Estimated Duration (days)"
          name="estimatedDuration"
          value={estimatedDuration.toString()}
          onChange={this.handleInputChange}
          type="number"
        />
        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={estimatedCost.toString()}
          onChange={this.handleInputChange}
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
      siteUrl: this.context.pageContext.web.absoluteUrl
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
  selectedCustomer: string | undefined;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  RequestStatus: string;
}
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



Problem, up to here is that it create a record in RequestProject list, but it doesn't insert the fileds values. all values of fileds are either the default value or empty.

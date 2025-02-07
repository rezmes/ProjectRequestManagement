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

- lib/\* - intermediate-stage commonjs build artifacts
- dist/\* - the bundled script, along with other resources
- deploy/\* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

<!-- START -->

# Project Request Management (PRM)

## Scenario: Project Request and Execution Process

This document outlines the process for handling project requests, from initial customer contact to project pricing and initiation. The process involves several departments, including the Commerce Department and the Technical & Engineering Department.

**1. Customer Request:**
The process begins with the customer informing the Commerce Department of their need for products and services. This communication can occur through various channels: a. Verbal communication b. Formal letter c. Participation in tenders

**Note:** The primary deliverable is typically multi-month, sometimes multi-year projects. These projects encompass both goods consumed during the project and the execution of project services.

**2. Initial Response (Commerce Department):**
Upon receiving a request, the Commerce Department must provide the customer with the following information:
a. Estimated project duration
b. Project cost estimate

**3. Request Submission and Referral (Commerce Department):**
The Commerce Department formally registers the customer request within the system and forwards it to the Technical & Engineering Department.

**4. Technical Assessment (Technical & Engineering Department):**
The Technical & Engineering Department shares the request with relevant engineering sub-departments and solicits input regarding their specific areas of expertise.

This assessment covers the following aspects:
a. List of necessary activities to fulfill the customer request
b. Required man-hours, broken down by expertise level (e.g., expert, technician, general worker)
c. Required materials and tools, with quantities
d. Required machinery and estimated usage hours
e. Activity dependencies (predecessor, concurrent, successor)
f. Any special considerations or potential challenges

**5. Compilation and Review (Technical & Engineering Department):**
The Technical & Engineering Department consolidates the input from the various sub-departments and creates a draft document, which is then submitted to the respective sub-departments for review and approval.

**6. Finalization and Handover (Technical & Engineering Department):**
Once the consolidated document is approved, it is finalized and returned to the Commerce Department for pricing.

**7. Pricing (Commerce Department):**
The Commerce Department individually prices each item listed in the document and multiplies it by the corresponding quantity to determine the total cost per item. These totals are then summed to calculate the overall project cost (similar to a pro forma invoice). This total cost, along with the project duration provided by the Technical & Engineering Department, forms the basis for the final price and timeline presented to the customer.

**Key Considerations:**

1. **Supporting Documentation:**
   This process will undoubtedly involve supporting documents. It is recommended to utilize SharePoint's Document Set feature, along with a form or other suitable mechanism, to manage these documents efficiently.

2. **Workflow Automation:**
   The Nintex Workflow Designer 2019 tool is available for workflow automation.

3. **Environment:**
   The solution will be implemented in SharePoint 2019 On-Premises. The online version is not available.

4. **Customization:**
   Customizations will be developed using the SPFx@1.4.1 framework.

**_Crucially:_**
SharePoint 2019 - On-premises Dev. Env.:
`SPFx@1.4.1 (node@8.17.0, react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2; updates and upgrades are not options)`

**Pay close attention to the limitations imposed by the framework version and avoid using commands or external tools incompatible with it.**

<!-- # Road-Map

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
DepartmentName (Metadata)
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
TotalCost (Calculated: Quantity \* Unit Price) -->

## Step 2: Create Lists

1. 'Customer'
   Title (Single line of text) → Customer Name
   Email (text)
   WorkPhone (single line of text)
   WorkAddress (single line of text)
   CustomerType (Choices: Individual, Corporate, Government)

2. 'InventoryItems' List
   Title → Item Name
   ItemCategory (Choice)
   PricePerUnit (Currency)
   Activity (single line of text)
   Type (Choices)
   Description (single line of text)
   Image (hyperlink)
   Brand (single line of text)
   ItemCode (single line of text)

3. 'ProjectRequests' List
   Title → Request Title
   Customer (Lookup)
   RequestDate (Date and Time)
   EstimatedDuration(day) (number)
   EstimatedCost (currency)
   RequestStatus (Choices: New, In Progress, Completed, Priced)
   DocumentSetID (lookup to ProjectDocumentation library)

4. 'TechnicalAssessments' List
   Title → Assessment Title
   RequestID (Lookup)
   DepartmentName (Metadata)
   HumanResource (Lookup to InventoryItems list -Title filter on Type(HumanResource))
   Material (Lookup to InventoryItems list -Title filter on Type(Material))
   Machine (Lookup to InventoryItems list -Title filter on Type(Machine))
   Quantity (number)
   _Dependencies (Multiple lines of text)_
   _SpecialConsiderations (Multiple lines of text)_
   UnitPrice (Currency)
   TotalCost (Calculated)

<!-- 5. 'PricingDetails' List
RequestID (Lookup to ProjectRequests )
Title → Item Title
Project-Code (Metadata)
Item ID (Lookup)
Quantity
UnitPrice
TotalCost (Calculated)
Activity (Single line of text) -->

## Step 3: Create Document Library for Project Documentation

Library Name: 'ProjectDocumentation'
Enable Document Sets

- Metadata Fields:
  Project-Code (Metadata)
  Customer (Lookup to Customer list)
  TechnicalAssessmentStatus (Choices: Not Started, In Progress, Completed)
  PricingStatus (Choices: Pending, Finalized)

## Step 4: Permissions Setup

Commerce Department: Can create/edit project requests but cannot modify technical assessments.
Engineering Teams: Can only update their respective assessments.
Pricing Team: Can only edit pricing details.
Management: Full control over all lists.

# Implementation Plan

1. SPFx Form Development
   Develop custom forms for request submission, technical assessments, and pricing details using SPFx.
   Ensure forms are dynamically populated with items from the InventoryItems list.

2. Document Set Management
   Configure Document Sets in the Project Documentation Library to group related project documents.

3. Workflow Automation with Nintex
   Implement workflows to automate notifications, approvals, and status updates.
   Ensure workflows correctly link list items and documents using the Current Item ID.

<!-- Installing some packages -->

<!-- `npm install office-ui-fabric-react@5.134.0 moment@2.24.0 moment-jalaali@0.8.3` -->

uninstalled

<!-- Start Implementation -->

### Step 1: SPFx Form Development

- We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

<!-- Code -->

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

<!-- ## tsx -->

````tsx
// GenericDropdown.tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | undefined;
  onChange: (option?: IDropdownOption) => void;
  placeHolder?: string;
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChange, placeHolder } = this.props;
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChange}
        placeHolder={placeHolder}
      />
    );
  }
}

export default GenericDropdown;

```ts
// IPrmProps.ts
export interface IPrmProps {
  description: string;
}
````

```ts
//PrmWebPart.ts
import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  BaseClientSideWebPart,
} from "@microsoft/sp-webpart-base";
import * as strings from "PrmWebPartStrings";
import ProjectRequestForm from "./components/ProjectRequestForm";
import { sp } from "@pnp/sp";
import { IProjectRequestFormProps } from "./components/IProjectRequestFormProps";

export interface IPrmWebPartProps {
  description: string;
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context,
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IProjectRequestFormProps> =
      React.createElement(ProjectRequestForm, {
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
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
```

```ts
//IProjectRequestFormProps.ts
import { SPHttpClient } from "@microsoft/sp-http";

export interface IProjectRequestFormProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
```

```ts
//IProjectRequestFormState.ts
import { IDropdownOption } from "office-ui-fabric-react";

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
// ITechnicalAssessmentState.ts
import ProjectRequestService, {
  IDropdownOptionWithCategory,
} from "../services/ProjectRequestService";
// Import IDropdownOption interface
import { IDropdownOption } from "office-ui-fabric-react";

export interface IAssessment {
  activity: string;
  humanResources: IDropdownOption[];
  machines: IDropdownOption[];
  materials: IDropdownOption[];
}

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
}
```

```ts
//src\webparts\prm\services\ProjectRequestService.ts

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAssessment } from "../components/ITechnicalAssessmentState";

interface ISaveAssessment {
  Activity: string;
  HumanResourcesId: { results: (string | number)[] };
  MachinesId: { results: (string | number)[] };
  MaterialsId: { results: (string | number)[] };
  // Other fields as needed
}

// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<any[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists.getByTitle("ProjectRequests").items.add(requestData);
  }

  public getTechnicalAssessments(requestId: number): Promise<IAssessment[]> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.filter(`RequestID eq ${requestId}`)
      .expand("HumanResources", "Machines", "Materials")
      .select(
        "Activity",
        "HumanResources/Id",
        "HumanResources/Title",
        "Machines/Id",
        "Machines/Title",
        "Materials/Id",
        "Materials/Title"
      )
      .get()
      .then((data) =>
        data.map((item) => ({
          activity: item.Activity,
          humanResources: item.HumanResources
            ? item.HumanResources.map((hr) => ({ key: hr.Id, text: hr.Title }))
            : [],
          machines: item.Machines
            ? item.Machines.map((machine) => ({
                key: machine.Id,
                text: machine.Title,
              }))
            : [],
          materials: item.Materials
            ? item.Materials.map((material) => ({
                key: material.Id,
                text: material.Title,
              }))
            : [],
        }))
      );
  }

  public getDepartmentOptions(): Promise<any[]> {
    return sp.web.lists
      .getByTitle("Departments")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public getInventoryItems(): Promise<IDropdownOptionWithCategory[]> {
    return sp.web.lists
      .getByTitle("InventoryItems")
      .items.select("Id", "Title", "ItemCategory")
      .get()
      .then((data) =>
        data.map((item) => ({
          key: item.Id,
          text: item.Title,
          itemCategory: item.ItemCategory, // Assumes ItemCategory is a text field
        }))
      );
  }
  public saveAssessments(
    assessments: IAssessment[],
    requestId: number
  ): Promise<void> {
    const batch = sp.web.createBatch();

    assessments.forEach((assessment) => {
      const data = {
        Title: assessment.activity,
        RequestID: requestId,
        HumanResourcesId: {
          results: assessment.humanResources.map((hr) => hr.key),
        },
        MachinesId: {
          results: assessment.machines.map((machine) => machine.key),
        },
        MaterialsId: {
          results: assessment.materials.map((material) => material.key),
        },
        // Include other necessary fields
      };
      // Add to batch
      sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(data);
    });

    return batch
      .execute()
      .then(() => {
        console.log("Assessments saved successfully");
      })
      .catch((error) => {
        console.error("Error saving assessments", error);
        throw error;
      });
  }
}
```

```tsx
//ProjectRequestForm.tsx
import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
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
      requestId: null, // Assuming requestId is part of the state
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
    const newValue =
      name === "estimatedDuration" || name === "estimatedCost"
        ? parseFloat(value) || 0
        : value;

    this.setState({ [name]: newValue } as unknown as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    console.log("Dropdown Change Event:", option); // Log the dropdown change event
    this.setState(
      {
        selectedCustomer: option ? option.key : undefined,
      },
      () => {
        console.log(
          "Updated selectedCustomer in state:",
          this.state.selectedCustomer
        ); // Log the updated state
      }
    );
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

    // Prepare the request data
    const requestData = {
      Title: requestTitle.trim(),
      CustomerId: selectedCustomer ? selectedCustomer : null,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus.trim(),
    };

    // Create the project request
    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response.data) {
          const requestId = response.data.Id;
          this.setState({ requestId }, () => {
            alert(
              "Project request created successfully! You can now add assessments."
            );
            // You might navigate to a different view or enable the assessments section
          });
        } else {
          alert("Error creating project request");
        }
      })
      .catch((error) => {
        console.error("Error details:", error);
        alert(
          "There was an error creating your project request. Please check the console for details."
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
      requestId: null, // Reset requestId if needed
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
        <GenericDropdown
          label="Customer"
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChange={this.handleDropdownChange}
          placeHolder="انتخاب مشتری"
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
          onChanged={(newValue: string) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
        />

        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={this.state.estimatedCost.toString()} // Convert number to string for display
          onChanged={(newValue: string) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
        />
        {this.state.requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={this.state.requestId}
          />
        )}

        <div>
          <PrimaryButton text="Submit" onClick={this.handleSubmit} />
          <PrimaryButton text="Cancel" onClick={this.resetForm} />
        </div>
      </div>
    );
  }
}

export default ProjectRequestForm;
```

```tsx
//TechnicalAssessmentTable.tsx
import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import {
  IAssessment,
  ITechnicalAssessmentState,
} from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import ProjectRequestService, {
  IDropdownOptionWithCategory,
} from "../services/ProjectRequestService";

// interface ITechnicalAssessmentState {
//   assessments: IAssessment[];
//   inventoryItems: IDropdownOptionWithCategory[];
// }

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService();
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
  }

  loadInventoryItems = () => {
    this.projectRequestService.getInventoryItems().then((items) => {
      this.setState({ inventoryItems: items });
    });
  };

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;
    return inventoryItems
      .filter((item) => categories.indexOf(item.itemCategory) > -1)
      .map((item) => ({ key: item.key, text: item.text }));
  };

  handleInputChange = (
    newValue: string,
    field: string,
    index: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field] = newValue;
      return { assessments };
    });
  };

  handleDropdownChange = (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field][partIndex] = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].push({ key: "", text: "" });
      return { assessments };
    });
  };

  removeRow = (field: string, index: number, partIndex: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].splice(partIndex, 1);
      return { assessments };
    });
  };

  addAssessment = () => {
    this.setState((prevState) => ({
      assessments: [
        ...prevState.assessments,
        {
          activity: "",
          humanResources: [],
          machines: [],
          materials: [],
        },
      ],
    }));
  };

  handleSaveAssessments = () => {
    const { assessments } = this.state;
    const { requestId } = this.props;

    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then(() => {
        alert("Assessments saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving assessments", error);
        alert(
          "Error saving assessments. Please check the console for details."
        );
      });
  };

  render() {
    const { assessments } = this.state;

    return (
      <div>
        <h3>Technical Assessments</h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <TextField
              label={`Activity ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
            />

            {/* Human Resources */}
            <h4>Human Resources</h4>
            {assessment.humanResources.map((hr, partIndex) => (
              <div key={partIndex}>
                <GenericDropdown
                  label={`Human Resource ${partIndex + 1}`}
                  options={this.filterInventoryItems(["نیروی انسانی"])}
                  selectedKey={hr.key}
                  onChange={(option) =>
                    this.handleDropdownChange(
                      "humanResources",
                      option!,
                      index,
                      partIndex
                    )
                  }
                />
                <PrimaryButton
                  text="Remove"
                  onClick={() =>
                    this.removeRow("humanResources", index, partIndex)
                  }
                />
              </div>
            ))}
            <PrimaryButton
              text="Add Human Resource"
              onClick={() => this.addRow("humanResources", index)}
            />

            {/* Machines */}
            <h4>Machines</h4>
            {assessment.machines.map((machine, partIndex) => (
              <div key={partIndex}>
                <GenericDropdown
                  label={`Machine ${partIndex + 1}`}
                  options={this.filterInventoryItems(["ماشین آلات"])}
                  selectedKey={machine.key}
                  onChange={(option) =>
                    this.handleDropdownChange(
                      "machines",
                      option!,
                      index,
                      partIndex
                    )
                  }
                />
                <PrimaryButton
                  text="Remove"
                  onClick={() => this.removeRow("machines", index, partIndex)}
                />
              </div>
            ))}
            <PrimaryButton
              text="Add Machine"
              onClick={() => this.addRow("machines", index)}
            />

            {/* Materials */}
            <h4>Materials</h4>
            {assessment.materials.map((material, partIndex) => (
              <div key={partIndex}>
                <GenericDropdown
                  label={`Material ${partIndex + 1}`}
                  options={this.filterInventoryItems([
                    "ابزار",
                    "محصول",
                    "مواد اولیه",
                  ])}
                  selectedKey={material.key}
                  onChange={(option) =>
                    this.handleDropdownChange(
                      "materials",
                      option!,
                      index,
                      partIndex
                    )
                  }
                />
                <PrimaryButton
                  text="Remove"
                  onClick={() => this.removeRow("materials", index, partIndex)}
                />
              </div>
            ))}
            <PrimaryButton
              text="Add Material"
              onClick={() => this.addRow("materials", index)}
            />

            <hr />
          </div>
        ))}
        <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
        <PrimaryButton
          text="Save Assessments"
          onClick={this.handleSaveAssessments}
        />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;
```

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)

```tsx
//Prm.tsx
import * as React from "react";
import styles from "./Prm.module.scss";
import { IPrmProps } from "./IPrmProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class Prm extends React.Component<IPrmProps, {}> {
  public render(): React.ReactElement<IPrmProps> {
    return (
      <div className={styles.prm}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>
                Customize SharePoint experiences using Web Parts.
              </p>
              <p className={styles.description}>
                {escape(this.props.description)}
              </p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
```

# Notable Reminder

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)

<!-- ------------------Problem placeHolder didn't Update------------------- -->

```tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined;
  onChange: (option?: IDropdownOption) => void; // Corrected to use onChanged
}
export class CustomerDropdown extends React.Component<
  ICustomerDropdownProps,
  {}
> {
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

AND

```tsx
handleDropdownChange = (option?: IDropdownOption): void => {
  console.log("Dropdown Change Event:", option); // Log the dropdown change event
  this.setState(
    { selectedCustomer: option ? option.key.toString() : undefined },
    () => {
      console.log(
        "Updated selectedCustomer in state:",
        this.state.selectedCustomer
      ); // Log the updated
      state;
    }
  );
};
```

**Why the placeHolder do not change after selecting item?**

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)

**Answer**

```txt
  The issue with the placeholder not updating after selecting an item in your dropdown is caused by the incorrect use of the onChanged property in the Dropdown component from the office-ui-fabric-react library. Specifically, the placeHolder property does not automatically update based on the selected item—it remains static. Instead, the selectedKey property is responsible for controlling the currently selected value.
```

```txt
Explanation of the Problem:
placeHolder is Static:
The placeHolder property is intended to display a default placeholder text when no item is selected. It does not change dynamically when a selection is made. Once a user selects an item, the dropdown relies on the selectedKey property to determine the displayed value.
selectedKey is Missing State Update:
Your current implementation is trying to set the selectedCustomer in the parent state, but the Dropdown component is not properly bound to the updated selectedKey.
```

**The Dropdown component needs its selectedKey property to be updated dynamically based on the state.**

**Solution:**
To fix this, you need to:

Ensure that the selectedKey property of the Dropdown is tied to the selectedCustomer state.
_Update the state when an item is selected using the onChanged callback._
Here's the corrected implementation:

Fixed Code:
CustomerDropdown Component:

```tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined; // Controlled by parent
  onChange: (option?: IDropdownOption) => void; // Callback to parent
}

export class CustomerDropdown extends React.Component<
  ICustomerDropdownProps,
  {}
> {
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
```

**Parent Component:**
Your parent component should:

Manage the selectedCustomer state.
Pass it as the selectedCustomer prop.
Update the state in the onChange handler.
Here’s how the parent component should look:

```tsx
import * as React from "react";
import { CustomerDropdown } from "./CustomerDropdown";
import { IDropdownOption } from "office-ui-fabric-react";

interface IParentComponentState {
  selectedCustomer: string | number | undefined;
}

export class ParentComponent extends React.Component<
  {},
  IParentComponentState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedCustomer: undefined, // Initial state
    };
  }

  private handleDropdownChange = (option?: IDropdownOption): void => {
    console.log("Dropdown Change Event:", option);

    // Update the state with the selected option key
    this.setState(
      {
        selectedCustomer: option ? option.key : undefined,
      },
      () => {
        console.log(
          "Updated selectedCustomer in state:",
          this.state.selectedCustomer
        );
      }
    );
  };

  public render(): React.ReactElement<{}> {
    const customerOptions: IDropdownOption[] = [
      { key: "1", text: "Customer 1" },
      { key: "2", text: "Customer 2" },
      { key: "3", text: "Customer 3" },
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
```

### Key Changes

**selectedKey Binding:**
The selectedKey property of the Dropdown is now dynamically bound to the selectedCustomer state in the parent component. This ensures that the displayed value in the dropdown updates when the state changes.

**State Management in Parent:**
The parent component manages the state of the selected customer (selectedCustomer). The child component (CustomerDropdown) is stateless and controlled by the parent.

**Static placeHolder:**
The placeHolder property remains static and is only shown when no item is selected. Once a selection is made, the dropdown automatically displays the selected item's text, as dictated by the selectedKey.
Key Notes for SharePoint 2019:
Since you are using an older version of SPFx with React 15.6.2 and TypeScript 2.4.2, ensure the following:

- Avoid using TypeScript features that are not supported in TypeScript 2.4.2 (e.g., newer syntax like ?. and ??).
  The Dropdown component in office-ui-fabric-react for SPFx 1.4.1 uses onChanged instead of onChange. Ensure you’re using the correct prop name.
  Expected Behavior:
  Initially, the placeholder text ("انتخاب مشتری") is shown.
  When a user selects an item, the selected item's text is displayed in the dropdown.
  The selectedCustomer state is updated in the parent component.
  The dropdown reflects the updated state via the selectedKey property.

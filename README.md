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

## Step 1: SPFx Form Development

We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

# Code
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

```tsx
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
```

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
// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IAssessment {
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
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
// IProjectRequestFormState.ts
import { IDropdownOption } from 'office-ui-fabric-react';
import { IAssessment } from './IAssessment';

export interface IProjectRequestFormState {
  // Flags
  isProjectCreated: boolean;
  showProjectForm: boolean;

  // Project Request Information
  requestId: number | null;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  RequestStatus: string;

  // Customer Information
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  customerOptions: IDropdownOption[];

  // Assessments
  assessments: IAssessment[];
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
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";

// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export interface IPricingDetails {
  RequestID: number;
  UnitPrice: number;
  Quantity: number;
  AssessmentItemID: number;
  TotalCost: number;
}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.add(requestData)
      .then((result) => {
        // console.log("Create Response:", result);
        return result.data;
      })
      .catch((error) => {
        console.error("Create Error:", error);
        throw error;
      });
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
          itemCategory: item.ItemCategory,
        }))
      );
  }

  public createTechnicalAssessment(assessmentData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.add(assessmentData);
  }
public saveAssessments(
  assessments: IAssessment[],
  requestId: number
): Promise<void> {
  const batch = sp.web.createBatch();

  assessments.forEach((assessment) => {
    const createData = (resource: IResource, type: string) => ({
      Title: assessment.activity || "No Activity",
      RequestIDId: requestId,
      [`${type}Id`]: resource.item ? resource.item.key : null,
      [`${type}Quantity`]: resource.quantity,
      [`${type}PricePerUnit`]: resource.pricePerUnit, // Add PricePerUnit field
    });

    assessment.humanResources.forEach((resource) =>
      sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "HumanResource"))
    );

    assessment.machines.forEach((resource) =>
      sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Machine"))
    );

    assessment.materials.forEach((resource) =>
      sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Material"))
    );
  });

  return batch
    .execute()
    .then(() => {
      // console.log("Assessments saved successfully");
    })
    .catch((error) => {
      console.error("Error saving assessments", error);
      throw error;
    });
}


// ProjectRequestService.ts

public savePricingDetails(pricingDetails: IPricingDetails[]): Promise<void> {
  const batch = sp.web.createBatch();

  pricingDetails.forEach((detail) => {
    const data = {
      RequestIDId: detail.RequestID, // Lookup field: Use RequestIDId and pass the ID of the referenced item
      UnitPrice: parseFloat(detail.UnitPrice as any), // Ensure it's a number
      Quantity: parseInt(detail.Quantity as any), // Ensure it's a number
      AssessmentItemIDId: detail.AssessmentItemID, // Lookup field: Use AssessmentItemIDId and pass the ID of the referenced item
      // Do not include TotalCost as it is a calculated column
    };

    // console.log("Pricing Detail Data to Add:", data);

    sp.web.lists
      .getByTitle("PricingDetails")
      .items.inBatch(batch)
      .add(data);
  });

  return batch
    .execute()
    .then(() => {
      // console.log("Pricing details saved successfully");
    })
    .catch((error) => {
      console.error("Error saving pricing details", error);
      throw error;
    });
}





}

```

```tsx
//PricingDetails.tsx
handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    const pricingDetails: IPricingDetails[] = [];

    assessments.forEach((assessment, index) => {
      ["humanResources", "machines", "materials"].forEach((field) => {
        if (Array.isArray(assessment[field])) {
          assessment[field].forEach((item: any) => {
            pricingDetails.push({
              RequestID: requestId,
              UnitPrice: parseFloat(item.pricePerUnit), // Ensure it's a number
              Quantity: parseInt(item.quantity), // Ensure it's a number
              AssessmentItemID: index, // Adjust as needed
              TotalCost:
                parseFloat(item.quantity) * parseFloat(item.pricePerUnit), // Ensure it's a number
            });
          });
        }
      });
    });

    // console.log("Pricing Details to Save:", pricingDetails);

    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then(() => {
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        alert("Assessments and pricing details saved successfully!");
        resetForm(); // Reset the form after saving
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(
          "Error saving assessments and pricing details. Please check the console for details."
        );
      });
  };

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
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (partIndex !== undefined && field) {
        const items = [...(assessments[index][field] || [])];
        const updatedItem = { ...items[partIndex] };

        updatedItem[nestedField] = newValue;

        items[partIndex] = updatedItem;
        assessments[index][field] = items;
      } else {
        assessments[index] = { ...assessments[index], [nestedField]: newValue };
      }

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
      assessments[index][field][partIndex].item = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0,
      });

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

  renderTable = (
    label: string,
    field: string,
    options: IDropdownOption[],
    assessment: any,
    index: number
  ) => (
    <PricingDetails
      label={label}
      field={field}
      options={options}
      assessment={assessment}
      index={index}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
    />
  );

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

            {this.renderTable(
              "Human Resource",
              "humanResources",
              this.filterInventoryItems(["نیروی انسانی"]),
              assessment,
              index
            )}
            {this.renderTable(
              "Machine",
              "machines",
              this.filterInventoryItems(["ماشین آلات"]),
              assessment,
              index
            )}
            {this.renderTable(
              "Material",
              "materials",
              this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]),
              assessment,
              index
            )}

            <hr />
          </div>
        ))}
        <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
        <PrimaryButton text="Final Submit" onClick={this.handleFinalSubmit} />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;
```

```tsx
// ProjectRequestForm.tsx

import * as React from "react";
import {
  TextField,
  PrimaryButton,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
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
      isProjectCreated: false,
      showProjectForm: true,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
      customerOptions: [],
      assessments: [], // Add this line
    };

    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      this.setState({ customerOptions });
    });
  }

  handleInputChange = (
    newValue: string,
    field: keyof IProjectRequestFormState
  ): void => {
    let parsedValue: any = newValue;

    // Check if the field expects a number
    if (field === "estimatedDuration" || field === "estimatedCost") {
      parsedValue = parseFloat(newValue) || 0;
    }

    this.setState({ [field]: parsedValue } as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    this.setState({
      selectedCustomer: option ? option.key : null,
      selectedCustomerName: option ? option.text : "",
    });
  };

  handleCreateProjectRequest = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      RequestStatus,
    } = this.state;

    // Prepare the request data
    const requestData = {
      Title: requestTitle.trim(),
      CustomerId: selectedCustomer || null,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus.trim(),
    };

    // Create the project request
    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response && response.Id) {
          const requestId = response.Id;
          this.setState(
            {
              isProjectCreated: true,
              requestId,
            },
            () => {
              // console.log("New project created with ID:", requestId);
              alert(
                "Project request created successfully! You can now add assessments."
              );
            }
          );
        } else {
          alert("Error creating project request");
        }
      })
      .catch((error) => {
        console.error("Error creating project request:", error);
        alert(
          "There was an error creating your project request. Please check the console for details."
        );
      });
  };

  resetForm = (): void => {
    this.setState({
      isProjectCreated: false,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      requestNote: "",
      RequestStatus: "New",
      // Reset any other state variables as needed
    });
  };

  render() {
    const {
      isProjectCreated,
      requestId,
      selectedCustomer,
      selectedCustomerName,
      requestTitle,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      customerOptions,
    } = this.state;

    return (
      <div>
        <h2>
          {isProjectCreated ? "Add Assessments" : "Create Project Request"}
        </h2>

        {isProjectCreated && (
          <div>
            <h3>Project Information</h3>
            <p>
              <strong>Project ID:</strong> {requestId}
            </p>
            <p>
              <strong>Title:</strong> {requestTitle}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedCustomerName}
            </p>
            <p>
              <strong>Request Date:</strong> {requestDate}
            </p>
            <p>Request Note:</p> {requestNote}
            {/* Include other information as needed */}
          </div>
        )}

        {/* Project Request Form */}
        <TextField
          label="Request Title"
          value={requestTitle}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestTitle")
          }
          readOnly={isProjectCreated}
        />
        <GenericDropdown
          label="Customer"
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={this.handleDropdownChange}
          placeHolder="Select Customer"
          disabled={isProjectCreated}
        />
        <TextField
          label="Request Date"
          value={requestDate}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestDate")
          }
          readOnly={isProjectCreated}
        />
        <TextField
          label="Estimated Duration (days)"
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label="Estimated Cost"
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />

        {/* Create Button */}
        {!isProjectCreated && (
          <PrimaryButton
            text="Create"
            onClick={this.handleCreateProjectRequest}
          />
        )}

        {/* Technical Assessment Table */}
        {isProjectCreated && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
          />
        )}

        {/* Cancel Button */}
        <div>
          <PrimaryButton text="Cancel" onClick={this.resetForm} />
        </div>
      </div>
    );
  }
}

export default ProjectRequestForm;


```

```ts
// ITechnicalAssessmentProps.ts
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void; // Make this required
}
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
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import PricingDetails from "./PricingDetails";

import ProjectRequestService, {
  IPricingDetails,
} from "../services/ProjectRequestService";

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

  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    const pricingDetails: IPricingDetails[] = [];

    assessments.forEach((assessment, index) => {
      ["humanResources", "machines", "materials"].forEach((field) => {
        if (Array.isArray(assessment[field])) {
          assessment[field].forEach((item: any) => {
            pricingDetails.push({
              RequestID: requestId,
              UnitPrice: parseFloat(item.pricePerUnit), // Ensure it's a number
              Quantity: parseInt(item.quantity), // Ensure it's a number
              AssessmentItemID: index, // Adjust as needed
              TotalCost:
                parseFloat(item.quantity) * parseFloat(item.pricePerUnit), // Ensure it's a number
            });
          });
        }
      });
    });

    // console.log("Pricing Details to Save:", pricingDetails);

    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then(() => {
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        alert("Assessments and pricing details saved successfully!");
        resetForm(); // Reset the form after saving
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(
          "Error saving assessments and pricing details. Please check the console for details."
        );
      });
  };

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
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (partIndex !== undefined && field) {
        const items = [...(assessments[index][field] || [])];
        const updatedItem = { ...items[partIndex] };

        updatedItem[nestedField] = newValue;

        items[partIndex] = updatedItem;
        assessments[index][field] = items;
      } else {
        assessments[index] = { ...assessments[index], [nestedField]: newValue };
      }

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
      assessments[index][field][partIndex].item = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0,
      });

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

  renderTable = (
    label: string,
    field: string,
    options: IDropdownOption[],
    assessment: any,
    index: number
  ) => (
    <PricingDetails
      label={label}
      field={field}
      options={options}
      assessment={assessment}
      index={index}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
    />
  );

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

            {this.renderTable(
              "Human Resource",
              "humanResources",
              this.filterInventoryItems(["نیروی انسانی"]),
              assessment,
              index
            )}
            {this.renderTable(
              "Machine",
              "machines",
              this.filterInventoryItems(["ماشین آلات"]),
              assessment,
              index
            )}
            {this.renderTable(
              "Material",
              "materials",
              this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]),
              assessment,
              index
            )}

            <hr />
          </div>
        ))}
        <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
        <PrimaryButton text="Final Submit" onClick={this.handleFinalSubmit} />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

```
<!-- ///////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\ -->
<!-- //////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\ -->
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
  // console.log("Dropdown Change Event:", option); // Log the dropdown change event
  this.setState(
    { selectedCustomer: option ? option.key.toString() : undefined },
    () => {
      // console.log(
        "Updated selectedCustomer in state:",
        this.state.selectedCustomer
      ); // Log the updated
      state;
    }
  );
};
```

SharePoint 2019 - On-premises
dev.env. : SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)
# *As soon as typing any value in 'Quantity' or 'PricePerValue it returns this error in the console,*

```ts
handleInputChange = (
newValue: string,
field: string,
index: number,
partIndex?: number
): void => {
this.setState((prevState) => {
const assessments = [...prevState.assessments]; // Shallow copy of assessments


  if (partIndex !== undefined) {
    // Update a nested property (quantity or pricePerUnit)
    const items = [...assessments[index][field]]; // Shallow copy of nested array
    const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

    // Update the corresponding property dynamically
    updatedItem[field === "quantity" ? "quantity" : "pricePerUnit"] =
      newValue;

    // Replace the updated item in the array
    items[partIndex] = updatedItem;
    assessments[index][field] = items; // Update the nested array
  } else {
    // Update top-level properties (e.g., activity)
    assessments[index] = { ...assessments[index], [field]: newValue };
  }

  return { assessments }; // Update state
});
};
```


The issue arises due to the way you are handling `setState` and updating nested properties in the `handleInputChange` function. Specifically, in your `handleInputChange` function, the `field` parameter is being used as an array key, and there's a mismatch in how the nested object structure is being updated, leading to issues with undefined values.

Let's debug and fix this step by step.

---

### **Problem in `handleInputChange`**
Here is the problematic part of the function:

```typescript
if (partIndex !== undefined) {
  const items = [...assessments[index][field]]; // Shallow copy of nested array
  const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

  updatedItem[field === "quantity" ? "quantity" : "pricePerUnit"] = newValue;

  items[partIndex] = updatedItem; // Replace the updated item in the array
  assessments[index][field] = items; // Update the nested array
}
```

#### **What's wrong?**
- The `field` parameter refers to the name of the property (`humanResources`, `machines`, or `materials`) in the `assessments` array.
- However, inside the nested array (`humanResources`, `machines`, or `materials`), you're trying to dynamically update `quantity` or `pricePerUnit` using the same `field` variable, which doesn't work because `field` is referring to the parent property, not the nested property.

This results in undefined values being accessed or updated, leading to the error.

---

### **Solution: Correct `handleInputChange`**
Update the `handleInputChange` function to distinguish between the parent property (`field`) and the nested property (`quantity` or `pricePerUnit`) being updated. Here's the fixed code:

```typescript
handleInputChange = (
  newValue: string,
  nestedField: string, // field being updated (e.g., "quantity" or "pricePerUnit")
  index: number,
  partIndex?: number
): void => {
  this.setState((prevState) => {
    const assessments = [...prevState.assessments]; // Shallow copy of assessments

    if (partIndex !== undefined) {
      // Update a nested property (e.g., quantity or pricePerUnit)
      const items = [...assessments[index].humanResources || []]; // Ensure the nested array exists
      const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

      // Update the corresponding property dynamically
      updatedItem[nestedField] = newValue;

      // Replace the updated item in the array
      items[partIndex] = updatedItem;
      assessments[index].humanResources = items; // Update the nested array
    } else {
      // Update top-level properties (e.g., activity)
      assessments[index] = { ...assessments[index], [nestedField]: newValue };
    }

    return { assessments }; // Update state
  });
};
```

---

### **Changes in `renderTable`**
Update the `onChanged` callbacks in the `renderTable` method to pass the correct `nestedField` value (`quantity` or `pricePerUnit`) to `handleInputChange`:

```tsx
<TextField
  value={item.quantity.toString()}
  onChanged={(newValue: string) =>
    this.handleInputChange(newValue, "quantity", index, partIndex)
  }
/>
<TextField
  value={item.pricePerUnit.toString()}
  onChanged={(newValue: string) =>
    this.handleInputChange(newValue, "pricePerUnit", index, partIndex)
  }
/>
```

---

### **Additional Fix: Guard for Empty Arrays**
In your `renderTable` method, you're assuming that `assessment[field]` is always an array. However, during initialization or unexpected scenarios, it may be `undefined`. Add a guard to ensure it’s treated as an empty array if undefined:

```tsx
{Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
  assessment[field].map((item: any, partIndex: number) => (
    // Render table rows
  ))
) : (
  <tr>
    <td colSpan={4}>No {label.toLowerCase()} added yet.</td>
  </tr>
)}
```

---

### **Testing the Fix**
1. **Test Typing in TextFields**:
   - When you type in the `Quantity` or `Price Per Unit` fields, the `handleInputChange` function should correctly update the corresponding nested property in the state without throwing errors.

2. **Test Adding/Removing Rows**:
   - Add or remove rows and ensure the updates are correctly reflected in the `assessments` state.

3. **Test Final Submit**:
   - Ensure the final `assessments` state is structured as expected and contains the correct nested data.

---

### **Final Code for `handleInputChange`**
Here's the final implementation of `handleInputChange`:

```typescript
handleInputChange = (
  newValue: string,
  nestedField: string, // "quantity" or "pricePerUnit"
  index: number,
  partIndex?: number
): void => {
  this.setState((prevState) => {
    const assessments = [...prevState.assessments]; // Shallow copy of assessments

    if (partIndex !== undefined) {
      // Update a nested property (quantity or pricePerUnit)
      const items = [...assessments[index].humanResources || []]; // Ensure the nested array exists
      const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

      updatedItem[nestedField] = newValue; // Dynamically update the nested property

      items[partIndex] = updatedItem; // Replace the updated item in the array
      assessments[index].humanResources = items; // Update the nested array
    } else {
      // Update top-level properties (e.g., activity)
      assessments[index] = { ...assessments[index], [nestedField]: newValue };
    }

    return { assessments }; // Update state
  });
};
```

This should resolve the issue and prevent any further errors related to undefined values when typing in the `Quantity` or `Price Per Unit` fields.

To avoid duplicating code for handling `Machines` and `Materials`. The goal is to make the code reusable and maintainable while supporting all three types (`humanResources`, `machines`, and `materials`). Fortunately, we don't need separate methods for each type. Instead, we can generalize the logic to handle all fields dynamically.

---

### **Generalizing `handleInputChange`**

The key is to treat `humanResources`, `machines`, and `materials` as dynamic fields. We will pass the `field` (e.g., `humanResources`, `machines`, or `materials`) as a parameter to the `handleInputChange` method. Here's the updated method:

```typescript
handleInputChange = (
  newValue: string,
  nestedField: string, // "quantity" or "pricePerUnit"
  index: number,
  partIndex?: number,
  field?: string // The parent field: "humanResources", "machines", or "materials"
): void => {
  this.setState((prevState) => {
    const assessments = [...prevState.assessments]; // Shallow copy of assessments

    if (partIndex !== undefined && field) {
      // Update a nested property (e.g., quantity or pricePerUnit)
      const items = [...(assessments[index][field] || [])]; // Ensure the nested array exists
      const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

      updatedItem[nestedField] = newValue; // Dynamically update the nested property

      items[partIndex] = updatedItem; // Replace the updated item in the array
      assessments[index][field] = items; // Update the nested array
    } else {
      // Update top-level properties (e.g., activity)
      assessments[index] = { ...assessments[index], [nestedField]: newValue };
    }

    return { assessments }; // Update state
  });
};
```

---

### **Changes in `renderTable`**

Now, when rendering the table for `humanResources`, `machines`, or `materials`, we simply pass the `field` dynamically. Update the `TextField` callbacks in the `renderTable` method:

```tsx
<TextField
  value={item.quantity.toString()}
  onChanged={(newValue: string) =>
    this.handleInputChange(newValue, "quantity", index, partIndex, field)
  }
/>
<TextField
  value={item.pricePerUnit.toString()}
  onChanged={(newValue: string) =>
    this.handleInputChange(newValue, "pricePerUnit", index, partIndex, field)
  }
/>
```

Here, the `field` is passed dynamically as `humanResources`, `machines`, or `materials`.

---

### **Full Updated `renderTable`**
Here is the full updated `renderTable` implementation:

```tsx
renderTable = (
  label: string, // Label for the table (e.g., "Human Resource", "Machine", "Material")
  field: string, // Parent field (e.g., "humanResources", "machines", "materials")
  options: IDropdownOption[], // Dropdown options for the field
  assessment: any, // Current assessment object
  index: number // Index of the current assessment
) => (
  <table>
    <tbody>
      <tr>
        <th>{label}</th>
        <th>Quantity</th>
        <th>Price Per Unit</th>
      </tr>
      {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
        assessment[field].map((item: any, partIndex: number) => (
          <tr key={partIndex}>
            <td>
              <GenericDropdown
                label={`${label} ${partIndex + 1}`}
                options={options}
                selectedKey={item.item ? item.item.key : undefined}
                onChanged={(option) =>
                  this.handleDropdownChange(field, option!, index, partIndex)
                }
              />
            </td>
            <td>
              <TextField
                value={item.quantity.toString()}
                onChanged={(newValue: string) =>
                  this.handleInputChange(newValue, "quantity", index, partIndex, field)
                }
              />
            </td>
            <td>
              <TextField
                value={item.pricePerUnit.toString()}
                onChanged={(newValue: string) =>
                  this.handleInputChange(newValue, "pricePerUnit", index, partIndex, field)
                }
              />
            </td>
            <td>
              <PrimaryButton
                text="Remove"
                onClick={() => this.removeRow(field, index, partIndex)}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4}>No {label.toLowerCase()} added yet.</td>
        </tr>
      )}
    </tbody>
  </table>
);
```

---

### **Rendering Human Resources, Machines, and Materials**
Now, in your `render` method, you can dynamically handle `humanResources`, `machines`, and `materials` without any duplication. Here's how to use the updated `renderTable`:

```tsx
{/* Human Resources */}
{this.renderTable(
  "Human Resource",
  "humanResources",
  this.filterInventoryItems(["نیروی انسانی"]), // Filtered dropdown options
  assessment,
  index
)}
<PrimaryButton
  text="Add Human Resource"
  onClick={() => this.addRow("humanResources", index)}
/>

{/* Machines */}
{this.renderTable(
  "Machine",
  "machines",
  this.filterInventoryItems(["ماشین آلات"]), // Filtered dropdown options
  assessment,
  index
)}
<PrimaryButton
  text="Add Machine"
  onClick={() => this.addRow("machines", index)}
/>

{/* Materials */}
{this.renderTable(
  "Material",
  "materials",
  this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]), // Filtered dropdown options
  assessment,
  index
)}
<PrimaryButton
  text="Add Material"
  onClick={() => this.addRow("materials", index)}
/>
```

---

### **How It Works**

1. **Dynamic Field Handling**:
   - The `field` parameter in `renderTable` ensures that the same `handleInputChange` and `handleDropdownChange` methods are reused for `humanResources`, `machines`, and `materials`.

2. **Nested Updates**:
   - The `handleInputChange` method dynamically updates the correct parent field and nested property (`quantity` or `pricePerUnit`) based on the `field` and `nestedField` parameters.

3. **Adding Rows**:
   - The `addRow` method works without modification since the `field` parameter determines which array (`humanResources`, `machines`, or `materials`) will get the new row.

4. **Removing Rows**:
   - The `removeRow` method also works dynamically based on the `field` parameter.

---

### **Final Thoughts**
With these changes, your code is now dynamic, reusable, and well-structured. You no longer need separate methods for `humanResources`, `machines`, or `materials`. Everything is driven by the `field` parameter, making the code easier to maintain and extend in the future (e.g., adding new categories).






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
    // console.log("Dropdown Change Event:", option);

    // Update the state with the selected option key
    this.setState(
      {
        selectedCustomer: option ? option.key : undefined,
      },
      () => {
        // console.log(
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

```html
<tbody>
  <th>
    <tr>Human Resource</tr>
    <tr>Quantity</tr>
    </th>
</tbody>
...
<tbody>
  <th>
    <tr>
      Machine
      </tr>
      <tr>
        Quantity
        </tr>
  </th>
  ...
```

<!-- ===================================================================================== -->

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)`
Exercise caution regarding versioning limitations and incompatibilities.
Be acutely aware of versioning limitations and compatibility pitfalls.
Pay close attention to versioning limitations and compatibility issues.

import * as React from "react";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";

export interface IGenericComboBoxProps {
  label: string;
  options: IComboBoxOption[];
  onChanged: (option?: IComboBoxOption, index?: number, value?: string) => void;
  onMenuOpen: () => void;
  disabled?: boolean;
  allowFreeform?: boolean;
  autoComplete?: "on" | "off";
}

export default class GenericComboBox extends React.Component<IGenericComboBoxProps, {}> {
  public render(): React.ReactElement<IGenericComboBoxProps> {
    const { label, options, onChanged, onMenuOpen, disabled, allowFreeform, autoComplete } = this.props;
    return (
      <ComboBox
        label={label}
        options={options}
        onChanged={onChanged}
        onMenuOpen={onMenuOpen}
        disabled={disabled}
        allowFreeform={allowFreeform}
        autoComplete={autoComplete}
      />
    );
  }
}

// GenericDropdown.tsx

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

export interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | null;
  onChanged: (option?: IDropdownOption) => void;
  placeHolder?: string;
  disabled?: boolean; // Add this line
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChanged, placeHolder, disabled } =
      this.props;
      // console.log("Dropdown Options:", this.props.options); // Debugging
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChanged}
        placeHolder={placeHolder}
        disabled={disabled} // Add this prop
      />
    );
  }
}

export default GenericDropdown;

// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IAssessment {
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
}

import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDocSetProps {
    context: WebPartContext;
}
import { Guid } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';

import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectRequestFormProps {
  context: WebPartContext;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  termSetId: string;
}

// IProjectRequestFormState.ts
import { IDropdownOption } from 'office-ui-fabric-react';
import { IAssessment } from './IAssessment';

export interface IProjectRequestFormState {
  // Flags
  isProjectCreated: boolean;
  showProjectForm: boolean;

  // Project Request Information
  requestId: number | null;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  RequestStatus: string;

  // Customer Information
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  customerOptions: IDropdownOption[];
  
  // PojectCode1 Information
  ProjectCode1: {id:string; label: string} | null;
  selectedTerm: { id: string; label: string } | null;
  projectCodeTerm: { id: string; label: string } | null;
  terms: { id: string; label: string }[];

  // Assessments
  assessments: IAssessment[];
  formNumber: Number | null;

  // Document Set Link
  documentSetLink?: {
    url: string;
    text: string;
  };



}
// ITechnicalAssessmentProps.ts
import { Guid } from "@microsoft/sp-core-library";
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void; // Make this required

}

// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

// ITechnicalAssessmentState.ts
import { IAssessment } from './IAssessment';
import { IDropdownOptionWithCategory } from "../services/ProjectRequestService";

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
}
import * as React from "react";
import GenericComboBox from "./GenericComboBox";
import { IComboBoxOption } from "office-ui-fabric-react";
import ProjectRequestService from "../services/ProjectRequestService";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IManagedMetadataPickerProps {
  label: string;
  onTermSelected: (term: { id: string; label: string }) => void;
  disabled?: boolean;
  context: WebPartContext;
  placeHolder?: string; // Note: if your ComboBox version doesn't support placeholder, ignore it.
}

export interface IManagedMetadataPickerState {
  options: IComboBoxOption[];
}

export default class ManagedMetadataPicker extends React.Component<IManagedMetadataPickerProps, IManagedMetadataPickerState> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IManagedMetadataPickerProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      options: []
    };
    this._onMenuOpen = this._onMenuOpen.bind(this);
    this._onChanged = this._onChanged.bind(this);
  }

  private _onMenuOpen(): void {
    // Fetch taxonomy terms using the service method
    this.projectRequestService.getTaxonomyTerms('5863383a-85c5-4fbd-8114-11ef83bf9175')
      .then((terms) => {
        const options: IComboBoxOption[] = terms.map(term => ({
          key: term.id,
          text: term.label
        }));
        this.setState({ options });
      })
      .catch(error => {
        console.error("Error fetching taxonomy terms", error);
        this.setState({ options: [] });
      });
  }

  private _onChanged(option?: IComboBoxOption, index?: number, value?: string): void {
    if (option && this.props.onTermSelected) {
      this.props.onTermSelected({ id: option.key as string, label: option.text });
    }
  }

  public render(): React.ReactElement<IManagedMetadataPickerProps> {
    return (
      <GenericComboBox
        label={this.props.label}
        options={this.state.options}
        onChanged={this._onChanged}
        onMenuOpen={this._onMenuOpen}
        disabled={this.props.disabled}
        allowFreeform={true}
        autoComplete="on"
      />
    );
  }
}

import * as React from "react";
import {
  TextField,
  IDropdownOption,
  IconButton,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";
import styles from "./TechnicalAssessmentTable.module.scss";

interface IPricingDetailsProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  assessment: any;
  index: number;
  handleDropdownChange: (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ) => void;
  handleInputChange: (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ) => void;
  addRow: (field: string, index: number) => void;
  removeRow: (field: string, index: number, partIndex: number) => void;
}




class PricingDetails extends React.Component<IPricingDetailsProps> {
  renderTable() {
    const {
      field,
      options,
      assessment,
      index,
      handleDropdownChange,
      handleInputChange,
      removeRow,
      label,
    } = this.props;
    // console.log(`Options for ${label}:`, options); // Debugging
    return (
      <table className="technicalAssessmentTable">
        <tbody>
          <tr>
            <th className="resourceColumn">{label}</th>
            <th>{strings.Quantity}</th>
            <th>{strings.PricePerUnit}</th>
            <th>{strings.TotalCost}</th>
            <th>{strings.Action}</th>
          </tr>
          {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
            assessment[field].map((item: any, partIndex: number) => {
              const totalCost = item.quantity * item.pricePerUnit;
              return (
                <tr key={partIndex}>
                  <td className="resourceColumn">
                    <GenericDropdown
                      label={`${label} ${partIndex + 1}`}
                      options={options}
                      selectedKey={item.item ? item.item.key : undefined}
                      onChanged={(option) =>
                        handleDropdownChange(field, option!, index, partIndex)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      value={item.quantity.toString()}
                      onChanged={(newValue: string) =>
                        handleInputChange(
                          newValue,
                          "quantity",
                          index,
                          partIndex,
                          field
                        )
                      }
                      type="number"
                    />
                  </td>
                  <td>
                    <TextField
                      value={item.pricePerUnit.toString()}
                      onChanged={(newValue: string) =>
                        handleInputChange(
                          newValue,
                          "pricePerUnit",
                          index,
                          partIndex,
                          field
                        )
                      }
                      type="number"
                    />
                  </td>
                  <td>{totalCost.toFixed(0)}</td>
                  <td>
                    <IconButton
                      iconProps={{ iconName: "Delete" }}
                      title={strings.Remove}
                      ariaLabel={strings.Remove}
                      onClick={() => removeRow(field, index, partIndex)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>{`${strings.No} ${label.toLowerCase()} ${
                strings.AddedYet
              }`}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  

  render() {
    const { label, field, index, addRow } = this.props;

    return (
      <div>
        {this.renderTable()}
        <IconButton
          iconProps={{ iconName: "Add" }}
          title={`${strings.Add} ${label}`}
          ariaLabel={`${strings.Add} ${label}`}
          onClick={() => addRow(field, index)}
        />
      </div>
    );
  }
}

export default PricingDetails;
// ProjectRequestForm.tsx

import * as React from "react";
import {
  TextField,
  PrimaryButton,
  IDropdownOption,
  Link,
  Icon,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService"; // ✅ مطمئن شو مسیر درسته
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import UIFabricWizard from "./UIFabricWizard";
import ManagedMetadataPicker from "./ManagedMetadataPicker";

import * as strings from "PrmWebPartStrings";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context); // ✅ context رو پاس بده
    this.state = {
      isProjectCreated: false,
      showProjectForm: true,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("jYYYY/jM/jD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      requestNote: "",
      RequestStatus: "New",
      customerOptions: [],
      assessments: [],
      formNumber: null,
      documentSetLink: null,
      projectCodeTerm: null,
      selectedTerm: null,
      terms: [],
      ProjectCode1: null,
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  // private handleSubmit(): void {
  //   // console.log("Form submitted with data:", this.state); // Log form data
  // }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  private handleTermSelected(term: { id: string; label: string }): void {
    this.setState({ selectedTerm: term });
    // console.log("Selected Term:", term); // Log selected term
  }




  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      this.setState({ customerOptions });
    });
  }

  handleInputChange = (
    newValue: string,
    field: keyof IProjectRequestFormState
  ): void => {
    let parsedValue: any = newValue;

    // Check if the field expects a number
    if (field === "estimatedDuration" || field === "estimatedCost") {
      parsedValue = parseFloat(newValue) || 0;
    }

    this.setState({ [field]: parsedValue } as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    this.setState({
      selectedCustomer: option ? option.key : null,
      selectedCustomerName: option ? option.text : "",
    });
  };

  calculateEstimatedCost = async () => {
    const { requestId } = this.state; // Assuming requestId is stored in the state

    if (!requestId) {
      console.error("RequestID is not available.");
      return;
    }

    try {
      // Fetch all PricingDetails for this RequestID
      const pricingDetails =
        await this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );

      // Sum up the TotalCost values
      const estimatedCost = pricingDetails.reduce((sum, item) => {
        return sum + (item.TotalCost || 0); // Ensure TotalCost is treated as a number
      }, 0);

      // console.log("Calculated Estimated Cost:", estimatedCost);

      // Update the state with the calculated cost
      this.setState({ estimatedCost });

      // Optionally, save the calculated cost to the ProjectRequests list
      await this.projectRequestService.updateProjectRequestEstimatedCost(
        requestId,
        estimatedCost
      );
    } catch (error) {
      console.error("Error calculating estimated cost:", error);
    }
  };

  handleCreateProjectRequest = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      RequestStatus,
      ProjectCode1,
    } = this.state;

    // Step 1: Get the next form number
    this.projectRequestService
      .getNextFormNumber()
      .then((formNumber) => {
        // console.log("Next Form Number:", formNumber);
        const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();
        // console.log("requestDate:", requestDate); // Check the initial value
        // console.log("requestDateISO:", requestDateISO); // Check the converted ISO string
        // console.log("Type of requestDateISO:", typeof requestDateISO); // Should be "string"
        // Step 2: Prepare the request data
        const requestData = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer || null,
          RequestDate: requestDateISO,
          EstimatedDuration: estimatedDuration,
          EstimatedCost: estimatedCost,
          Description1: requestNote,
          RequestStatus: RequestStatus.trim(),
          FormNumber: formNumber,
          ProjectCode1: ProjectCode1 ? ProjectCode1.id: null,
        };

        // Step 3: Create the project request
        return this.projectRequestService.createProjectRequest(requestData);
      })
      .then((response) => {
        if (response && response.requestId) {
          // console.log("New project created with ID:", response.requestId);

          // Update state to include documentSetLink for rendering
          this.setState(
            {
              isProjectCreated: true,
              requestId: response.requestId,
              formNumber: response.FormNumber, // if needed
              documentSetLink: response.documentSetLink,
            },
            () => {
              alert("Project request created successfully!");
            }
          );
        } else {
          throw new Error(
            "Error creating project request. Response was invalid."
          );
        }
      })
      .catch((error) => {
        console.error("Error creating project request or Document Set:", error);
        console.warn(
          "There was an error creating your project request or its associated Document Set. Please check the console for details."
        );
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
      });
  };

  // // Handler when a term is selected
  // handleTermSelected = (term) => {
  //   this.setState({ projectCodeTerm: term });
  //   // Additional logic to handle the selected term can be added here
  // };
  private handleProjectCodeSelected(term: { id: string; label: string }): void {
    // Handle the selected term
  }
  resetForm = (): void => {
    this.setState({
      isProjectCreated: false,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("jYYYY/jM/jD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      requestNote: "",
      RequestStatus: "New",

      // Reset any other state variables as needed
    });
  };

  render() {
    const {
      isProjectCreated,
      requestId,
      selectedCustomer,
      selectedCustomerName,
      requestTitle,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      customerOptions,
      formNumber,
      documentSetLink,
    } = this.state;

    const locale =
      this.props.context.pageContext.cultureInfo.currentCultureName;
    const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

    return (
      <div className={`${containerClass} ${styles.projectRequestForm}`}>
        <UIFabricWizard />
        <h2 className={styles.header}>
          {isProjectCreated
            ? strings.AddAssessments
            : strings.CreateProjectRequest}
        </h2>

        {isProjectCreated && (
          <div>
            <h3>{strings.ProjectInformation}</h3>
            <p>
              <strong>{strings.ProjectID}:</strong> {requestId}
            </p>
            <p>
              <strong>{strings.FormNumber}:</strong> {formNumber}
            </p>
            <p>
              <strong>{strings.Title}:</strong> {requestTitle}
            </p>
            <p>
              <strong>{strings.CustomerName}:</strong> {selectedCustomerName}
            </p>
            <p>
              <strong>{strings.RequestDate}:</strong> {requestDate}
            </p>
            <p>{strings.RequestNote}:</p> {requestNote}
          </div>
        )}

        {isProjectCreated && (
          <div>
            {/* Document Set Link */}
            {documentSetLink && (
              <div className={styles.docSetLink}>
                <Icon iconName="OpenFolderHorizontal" />
                <Link href={documentSetLink.url} target="_blank">
                  {documentSetLink.text}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Project Request Form */}
        <TextField
          label={strings.RequestTitle}
          value={requestTitle}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestTitle")
          }
          readOnly={isProjectCreated}
        />


        <ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          context={this.props.context}
          placeHolder="Select Project Code"
          disabled={isProjectCreated}
        />
        <GenericDropdown
          label={strings.Customer}
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={this.handleDropdownChange}
          placeHolder={strings.SelectCustomer}
          disabled={isProjectCreated}
        />
        <TextField
          label={strings.RequestDate}
          value={requestDate}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestDate")
          }
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedDuration}
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedCost}
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.RequestNote}
          value={requestNote}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestNote")
          }
          multiline
          rows={4}
          readOnly={isProjectCreated}
        />

        {/* Create Button */}
        <div className={styles.buttonGroup}>
          {!isProjectCreated && (
            <PrimaryButton
              text={strings.Create}
              onClick={this.handleCreateProjectRequest}
            />
          )}
          {/* Cancel Button */}
          <div>
            <PrimaryButton text={strings.Cancel} onClick={this.resetForm} />
          </div>
        </div>
        {/* Technical Assessment Table */}
        {isProjectCreated && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
          />
        )}


      </div>
    );
  }
}

export default ProjectRequestForm;

// TechnicalAssessmentTable.tsx

import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import PricingDetails from "./PricingDetails";
import styles from "./TechnicalAssessmentTable.module.scss";

import * as strings from "PrmWebPartStrings";

import ProjectRequestService, {
  IPricingDetails,
} from "../services/ProjectRequestService";

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.context);
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
  }

  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    const pricingDetails: IPricingDetails[] = [];

    // Save assessments and get their IDs
    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then((assessmentIds) => {
        // console.log("Assessment IDs:", assessmentIds);

        // Map assessments to pricing details using the created IDs
        assessments.forEach((assessment, index) => {
          ["humanResources", "machines", "materials"].forEach((field) => {
            if (Array.isArray(assessment[field])) {
              assessment[field].forEach((item: any) => {
                pricingDetails.push({
                  RequestID: requestId,
                  UnitPrice: parseFloat(item.pricePerUnit),
                  Quantity: parseInt(item.quantity),
                  AssessmentItemID: assessmentIds[index],
                });
              });
            }
          });
        });

        // console.log("Pricing Details to Save:", pricingDetails);

        // Save pricing details
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        // console.log("Pricing details saved successfully.");
        return this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );
      })
      .then((pricingDetails) => {
        // console.log("Fetched Pricing Details After Save:", pricingDetails);

        // Calculate the total estimated cost
        const totalEstimatedCost = pricingDetails.reduce(
          (sum, detail) => sum + detail.TotalCost,
          0
        );

        // console.log("Total Estimated Cost:", totalEstimatedCost);

        // Update the ProjectRequest with the estimated cost
        return this.projectRequestService
          .updateProjectRequestEstimatedCost(requestId, totalEstimatedCost)
          .then(() => {
            alert("Assessments and pricing details saved successfully!");
            resetForm();
          });
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(
          "Error saving assessments and pricing details. Please check the console for details."
        );
      });
  };

  loadInventoryItems = () => {
    this.projectRequestService.getInventoryItems().then((items) => {
      // console.log("Inventory Items:", items); // Debugging
      this.setState({ inventoryItems: items });
    });
  };
  
  // filterInventoryItems = (categories: string[]): IDropdownOption[] => {
  //   const { inventoryItems } = this.state;
  //   const filteredItems = inventoryItems
  //     .filter((item) => categories.indexOf(item.itemCategory) > -1)
  //     .map((item) => ({ key: item.key, text: item.text }));
  //   // console.log("Filtered Items:", filteredItems); // Debugging
  //   return filteredItems;
  // };
  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;
  
      // Debug: Log categories and inventory items
  // console.log("Filtering for categories:", categories);
  // console.log("All inventory items:", inventoryItems);

    // Map English category keys to their Persian equivalents
    const categoryMap: { [key: string]: string[] } = {
      HumanResource: [strings.HumanResource,"نیروی انسانی"], // English & Persian
      Machine: [strings.Machine, "ماشین آلات"], 
      Material: [strings.Material,"ابزار","محصول","مواد اولیه" ]
    };
  
    // Get all valid category names for the requested categories
    const validCategories = categories.reduce((acc, category) => {
      return acc.concat(categoryMap[category] || [category]);
    }, [] as string[]);
  
    // Filter items using indexOf for SPFx 1.4.1 compatibility
    const filteredItems = inventoryItems.filter((item) => 
      validCategories.indexOf(item.itemCategory) > -1
    );
  
    // console.log("Filtered Items:", filteredItems);
    return filteredItems.map((item) => ({ key: item.key, text: item.text }));
  };

  
  handleInputChange = (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (partIndex !== undefined && field) {
        const items = [...(assessments[index][field] || [])];
        const updatedItem = { ...items[partIndex] };

        updatedItem[nestedField] = newValue;

        items[partIndex] = updatedItem;
        assessments[index][field] = items;
      } else {
        assessments[index] = { ...assessments[index], [nestedField]: newValue };
      }

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
      assessments[index][field][partIndex].item = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0,
      });

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

  renderTable = (
    label: string,
    field: string,
    options: IDropdownOption[],
    assessment: any,
    index: number
  ) => (
    <PricingDetails
      label={label}
      field={field}
      options={options}
      assessment={assessment}
      index={index}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
    />
  );

  render() {
    const { assessments } = this.state;

    return (
      <div className={styles.assessmentContainer}>
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
            />

            {this.renderTable(
              strings.HumanResource,
              "humanResources",
              this.filterInventoryItems([strings.HumanResource]),
              assessment,
              index
            )}
            {this.renderTable(
              strings.Machine,
              "machines",
              this.filterInventoryItems([strings.Machine]),
              assessment,
              index
            )}
            {this.renderTable(
              strings.Material,
              "materials",
              this.filterInventoryItems([strings.Material]),
              assessment,
              index
            )}

            <hr />
          </div>
        ))}
        <PrimaryButton
          className={styles.addAssessmentButton}
          text={strings.AddAssessment}
          onClick={this.addAssessment}
        />
        <PrimaryButton
          className={styles.finalSubmitButton}
          text={strings.FinalSubmit}
          onClick={this.handleFinalSubmit}
        />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;
import * as React from "react";
import { PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import styles from "./UIFabricWizard.module.scss";

interface IUIFabricWizardState {
  currentStep: number;
}

export default class UIFabricWizard extends React.Component<
  {},
  IUIFabricWizardState
> {
  constructor(props: {}) {
    super(props);
    this.state = { currentStep: 1 };
  }

  private _goToNextStep = (): void => {
    this.setState({ currentStep: 2 });
  };

  private _goToPreviousStep = (): void => {
    this.setState({ currentStep: 1 });
  };

  public render(): React.ReactElement<{}> {
    const { currentStep } = this.state;
    return (
      <div>
        <div className={styles.progressContainer}>
          <ProgressIndicator
            label={`Step ${currentStep} of 2`}
            description={
              currentStep === 1 ? "Create Project Request" : "Add Assessments"
            }
          />
        </div>

        {currentStep === 1 && (
          <div>
            {/* Render your Project Request Form components here */}
            <PrimaryButton text="Next" onClick={this._goToNextStep} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {/* Render your Technical Assessments components here */}
            <div>
              <PrimaryButton text="Back" onClick={this._goToPreviousStep} />
              {/* <PrimaryButton
                text="Submit"
                onClick={() => alert("Final submission")}
                style={{ marginLeft: 10 }}
              /> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

// ProjectRequestService.ts


import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";

import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, IHttpClientOptions, HttpClientResponse, HttpClient } from '@microsoft/sp-http';




// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export interface IPricingDetails {
  RequestID: number;
  UnitPrice: number;
  Quantity: number;
  AssessmentItemID: number;
  TotalCost?: number; // Optional if not always included

}

export default class ProjectRequestService {
  private context: any;

  constructor(context:any) {
  this.context = context;
}



  public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

    // Replace with your actual Term Store GUID (sspId)
    const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

    const soapEnvelope = `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
            <sspId>${sspId}</sspId>
            <termSetId>${termSetId}</termSetId>
            <lcid>1065</lcid>
            <termIds/>
          </GetChildTermsInTermSet>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      // console.log('Fetching terms with Term Set ID:', termSetId);
      const response = await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Content-Type': 'text/xml;charset="UTF-8"',
            'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
          },
          body: soapEnvelope
        }
      );

      const responseText = await response.text();
      // console.log('Response Text:', responseText);

      const parser = new DOMParser();
      const xmlDoc: Document = parser.parseFromString(responseText, 'text/xml');
      const resultNode = xmlDoc.querySelector("GetChildTermsInTermSetResult");
      if (!resultNode) {
        console.error("No GetChildTermsInTermSetResult node found");
        return [];
      }
      const innerXmlEncoded = resultNode.textContent || "";
      const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const innerDoc = parser.parseFromString(innerXml, "text/xml");

      const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
      const terms: { id: string; label: string }[] = [];
      termNodes.forEach((termNode) => {
        const labelAttr = termNode.getAttribute("a12");
        const idAttr = termNode.getAttribute("a45");
        if (idAttr && labelAttr) {
          terms.push({ id: idAttr, label: labelAttr });
        }
      });

      // console.log('Fetched Terms:', terms);

      if (searchText) {
        return terms.filter(term => term.label.indexOf(searchText) >= 0);
      }
      return terms;
    } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
    }
  }


public async getTermsByFieldInternalName(fieldInternalName: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
  const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/fields/getbyinternalnameortitle('${fieldInternalName}')`;
  const response = await this.context.spHttpClient.get(
    `${endpoint}?$expand=TaxonomyField`,
    SPHttpClient.configurations.v1
  );

  if (!response.ok) {
    throw new Error(`Failed to get field: ${response.statusText}`);
  }

  const fieldData = await response.json();
  return this.getTermsByTermSetId(fieldData.TaxonomyField.SspId, searchText);
}



public async getTaxonomyTerms(termSetId: string): Promise<{ id: string; label: string }[]> {

  
  const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('TaxonomyHiddenList')/items?` + 
    `$select=Path,Id&` +
    `$filter=IdForTermSet eq `+ `'` + termSetId + `'`;

  const options: IHttpClientOptions = {
    headers: {
      'Accept': 'application/json;odata=verbose'
    }
  };

  try {
    const response = await this.context.httpClient.get(endpoint, HttpClient.configurations.v1, options);
    const data = await response.json();
    return data.d.results.map((item: any) => ({
      id: item.Id,
      label: item.Path
    }));
  } catch (error) {
    console.error("Error retrieving terms:", error);
    return [];
  }
}





// Update the updateProjectCode method for SharePoint 2019 compatibility
public async updateProjectCode(listTitle: string, itemId: number, termLabel: string, termGuid: string): Promise<void> {
  const listEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')`;

  // Get the list item type name first
  const listInfo = await this.context.spHttpClient.get(
    `${listEndpoint}?$select=ListItemEntityTypeFullName`,
    SPHttpClient.configurations.v1
  );

  const listData = await listInfo.json();
  const entityType = listData.ListItemEntityTypeFullName;

  const body = JSON.stringify({
    __metadata: { type: entityType },
    ProjectCode1: {
      __metadata: { type: 'SP.Taxonomy.TaxonomyFieldValue' },
      Label: termLabel,
      TermGuid: termGuid,
      WssId: '-1'
    }
  });

  const response = await this.context.spHttpClient.post(
    `${listEndpoint}/items(${itemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*'
      },
      body: body
    }
  );

  if (!response.ok) {
    throw new Error(`Update failed: ${response.statusText}`);
  }
}



  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public getNextFormNumber(): Promise<number> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.orderBy("FormNumber", false).top(1).get()
      .then((items) => {
        if (items.length === 0) {
          return 1; // Start with 1 if no items exist
        }
        return items[0].FormNumber + 1;
      });
    }



public createProjectRequest(requestData: any): Promise<any> {
  return sp.web.lists
    .getByTitle("ProjectRequests")
    .items.add(requestData)
    .then(async (result) => {
      // console.log("Raw API Response:", result);
      const requestId = result.data.Id;
      if (!requestId) {
          throw new Error("Error: requestId is undefined!");
      }
      const documentSetName = `Request-${requestId}`;
      const documentSetLink = await this.createDocumentSet(documentSetName);
      if (!documentSetLink) {
          throw new Error("Document Set creation failed. No valid link returned.");
      }
      await this.updateDocumentSetLink(requestId, documentSetLink);
      // Return both the requestId and documentSetLink
      return { success: true, requestId, documentSetLink, FormNumber: result.data.FormNumber };
    })
    .catch((error) => {
      console.error("Project request creation failed:", error);
      throw error;
    });
}


  public async getFormDigest(): Promise<string> {
    try {
      const digestElement = document.getElementById("__REQUESTDIGEST");
      const digestValue = digestElement ? digestElement.getAttribute("value") : "";

      const response = await fetch(
        `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digestValue || "" // Use extracted form digest if available
          },
          credentials: "include" // Ensures authentication
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Form Digest. HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.d.GetContextWebInformation.FormDigestValue;

    } catch (error) {
      console.error("❌ FormDigest fetch failed:", error);
      throw error;
    }
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
          itemCategory: item.ItemCategory,
        }))
      );
  }

  public createTechnicalAssessment(assessmentData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.add(assessmentData);
  }

  public saveAssessments(
  assessments: IAssessment[],
  requestId: number
): Promise<number[]> {
  const batch = sp.web.createBatch();
  const createdItems: Promise<any>[] = []; // Store promises for created items

  assessments.forEach((assessment) => {
    const createData = (resource: IResource, type: string) => ({
      Title: assessment.activity || "No Activity",
      RequestIDId: requestId, // Associate with the ProjectRequest
      [`${type}Id`]: resource.item ? resource.item.key : null, // Lookup field for resource
      [`${type}Quantity`]: resource.quantity,
      [`${type}PricePerUnit`]: resource.pricePerUnit,
    });

    assessment.humanResources.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "HumanResource"));
      createdItems.push(promise);
    });

    assessment.machines.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Machine"));
      createdItems.push(promise);
    });

    assessment.materials.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Material"));
      createdItems.push(promise);
    });
  });

  // Execute the batch and collect the created item IDs
  return batch
    .execute()
    .then(() => Promise.all(createdItems))
    .then((results) => results.map((result) => result.data.Id)) // Extract IDs
    .catch((error) => {
      console.error("Error saving assessments", error);
      throw error;
    });
  }

public getPricingDetailsByRequestID(requestId: number): Promise<any[]> {
  // console.log("Fetching Pricing Details for RequestID:", requestId);
  return sp.web.lists
    .getByTitle("PricingDetails")
    .items.filter(`RequestIDId eq ${requestId}`)
    .select("Id", "UnitPrice", "Quantity", "AssessmentItemIDId")
    .get()
    .then(items => {
      // console.log("Raw Fetched Items:", items);
      const calculatedItems = items.map(item => ({
        ...item,
        TotalCost: item.UnitPrice * item.Quantity
      }));
      // console.log("Calculated Items (with TotalCost):", calculatedItems);
      return calculatedItems;
    })
    .catch(error => {
      console.error("Error fetching pricing details:", error);
      throw error;
    });
}

  public updateProjectRequestEstimatedCost(requestId: number, estimatedCost: number): Promise<void> {
  return sp.web.lists
    .getByTitle("ProjectRequests")
    .items.getById(requestId)
    .update({ EstimatedCost: estimatedCost }) // Update the EstimatedCost field
    .then(() => {
      // console.log("Estimated cost updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating estimated cost:", error);
      throw error;
    });
  }

  public savePricingDetails(pricingDetails: IPricingDetails[]): Promise<void> {
    const batch = sp.web.createBatch();

    pricingDetails.forEach((detail) => {
      const data = {
        RequestIDId: detail.RequestID, // Lookup field
        UnitPrice: parseFloat(detail.UnitPrice.toString()), // Ensure it's a number
        Quantity: parseInt(detail.Quantity.toString()), // Ensure it's a number
        AssessmentItemIDId: detail.AssessmentItemID, // Lookup field
        TotalCost: detail.UnitPrice * detail.Quantity // Add TotalCost here
      };

      // console.log("Pricing Detail Data to Add:", data);

      sp.web.lists
        .getByTitle("PricingDetails")
        .items.inBatch(batch)
        .add(data);
    });

    return batch
      .execute()
      .then(() => {
        // console.log("Pricing details saved successfully");
      })
      .catch((error) => {
        console.error("Error saving pricing details", error);
        throw error;
      });
  }






public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string } | null> {
  try {
      const libraryName = "RelatedDocuments";
      const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
      const siteUrl = this.context.pageContext.web.absoluteUrl;
      const endpoint = `${siteUrl}/_vti_bin/listdata.svc/${libraryName}`;

      // console.log("DEBUG: siteUrl from pageContext:", this.context.pageContext.web.absoluteUrl);

      // ✅ Use getFormDigest() instead of making a direct API call
      const requestDigest = await this.getFormDigest();
      if (!requestDigest) {
          throw new Error("Failed to retrieve X-RequestDigest.");
      }


      const headers = {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
          "X-RequestDigest": requestDigest // ✅ Now properly set
      };

      const postBody = JSON.stringify({
          Title: documentSetName,
          Path: libraryName
      });



      const response: SPHttpClientResponse = await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          { headers, body: postBody }
      );

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      // console.log("[DOCSET CREATION SUCCESS] API Response:", result); // ✅  این  خط  قبلاً  بود

      // console.log("Full response from createDocumentSet:", response); // ✅ خط جدید - اضافه کردن این خط برای بررسی پاسخ کامل سرور


      if (!result.d || !result.d["شناسهسند"]) {
          throw new Error("Error: Document Set ID (شناسهسند) is missing in the response.");
      }

      const docIdFullUrl = result.d["شناسهسند"];
      // console.log("Raw شناسهسند:", docIdFullUrl);

      const docIdUrlPart = docIdFullUrl.split(',')[0];
      // console.log("Extracted Document Set URL:", docIdUrlPart);

      return {
          url: docIdUrlPart,
          text: `Documents for ${documentSetName}`
      };

  } catch (error) {
      console.error("[DOCSET CREATION ERROR]", error);
      return null;
  }
}



public async updateDocumentSetLink(
  requestId: number,
  documentSetLink: { url: string; text: string }
): Promise<void> {
  // console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

  // SharePoint hyperlink field requires this specific format
  const hyperlinkValue = {
      __metadata: { type: "SP.FieldUrlValue" },
      Url: documentSetLink.url,
      Description: documentSetLink.text
  };

  try {
      // console.log("[DEBUG - SITE URL BEFORE CONCAT]:", this.context.pageContext.web.absoluteUrl);
      const updateUrl = sp.web.lists
          .getByTitle('ProjectRequests')
          .items.getById(requestId).toUrl();
      // console.log("[DEBUG - UPDATE URL (TOURL) BEFORE CONCAT]:", updateUrl);

      let fullUpdateUrl = this.context.pageContext.web.absoluteUrl + updateUrl; // ساخت URL کامل و مطلق با استفاده از siteUrl


      await sp.web.lists  // ❌ کامنت کردن خط update برای جلوگیری از ارسال درخواست واقعی و فقط دیدن URL
          .getByTitle("ProjectRequests")
          .items.getById(requestId)
          .update({
              DocumentSetLink: hyperlinkValue
          });


      // console.log("DocumentSetLink updated successfully.");

  } catch (error) {
      console.error("Error updating DocumentSetLink:", error);
      throw error;
  }
}


}


// PrmWebPart.ts
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

termSetId: '5863383a-85c5-4fbd-8114-11ef83bf9175',
      context: this.context,
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


SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)`
Exercise caution regarding versioning limitations and incompatibilities.
Be acutely aware of versioning limitations and compatibility pitfalls.
Pay close attention to versioning limitations and compatibility issues.


CHALLENGE: We need three mode of this form: Create(current form), Display and Edit. We should add two other view of this form too (Display and Edit)



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













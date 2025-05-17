# SharePoint 2019 *On-premises*

* dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, typescript@2.4.2 ,update and upgrade are not options)`
* *Exercise caution regarding versioning limitations and incompatibilities.*
* *Be acutely aware of versioning limitations and compatibility pitfalls.*
* *Pay close attention to versioning limitations and compatibility issues.*

## Problem

it is supposed to prevent all other than the members of "Commercial Department" group from the prices. Although, there are no error in run, but it doesn't show neither all nor the members of "Commercial Department" group.

```ts

// src/webparts/prm/services/ProjectRequestService.ts
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import BaseService from "./BaseService";
import TaxonomyService from "./TaxonomyService";
import DocumentService from "./DocumentService";
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";
// In ProjectRequestService.ts
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';



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
  TotalCost?: number;
}

export default class ProjectRequestService extends BaseService {
  private taxonomyService: TaxonomyService;
  private documentService: DocumentService;
  private commercialGroupName: string;

  constructor(context: any, commercialGroupName: string) {
    super(context);
    this.taxonomyService = new TaxonomyService(context);
    this.documentService = new DocumentService(context);
  this.commercialGroupName = commercialGroupName;
}
  
  // ...


  // Add to src/webparts/prm/services/ProjectRequestService.ts
private checkUserInCommercialDepartment(commercialGroupName: string = "Commercial Department"): Promise<boolean> {
  const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentUser/groups`;

  return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1, {
    headers: {
      "Accept": "application/json;odata=verbose"
    }
  })
  .then((response: SPHttpClientResponse) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`HTTP ${response.status}`);
  })
  .then((data: any) => {
    const groups = data.d.results;
    // console.log("Retrieved user groups:", groups);
    // console.log("Expected commercial group name:", commercialGroupName);
    for (let i = 0; i < groups.length; i++) {
      // console.log(
      //   `Comparing group title '${groups[i].Title}' with expected '${commercialGroupName}'`
      // );
      if (groups[i].Title.toLowerCase().trim() === commercialGroupName.toLowerCase().trim()) {
        console.log("Match found:", groups[i].Title);
        return true;
      }
    }
    console.log("No matching group found.");
    return false;
  })
  .catch((error) => {
    console.error("Group check failed:", error);
    return false;
  });
}

// Update the savePricingDetails method
public savePricingDetails(pricingDetails: IPricingDetails[]): Promise<any> {
  // First check if user has permission
  return this.checkUserInCommercialDepartment().then(isCommercial => {
    if (!isCommercial) {
      // For non-commercial users, set all prices to 0 before saving
      for (let i = 0; i < pricingDetails.length; i++) {
        pricingDetails[i].UnitPrice = 0;
      }
    }

    // Now proceed with saving
    const batch = sp.createBatch();
    const pricingList = sp.web.lists.getByTitle("PricingDetails");

    pricingDetails.forEach(detail => {
      pricingList.items.inBatch(batch).add({
        RequestIDId: detail.RequestID,
        UnitPrice: detail.UnitPrice,
        Quantity: detail.Quantity,
        AssessmentItemIDId: detail.AssessmentItemID
      });
    });

    return batch.execute();
  });
}
// Also update the updateProjectRequestEstimatedCost method
public updateProjectRequestEstimatedCost(requestId: number, totalCost: number): Promise<any> {
  return this.checkUserInCommercialDepartment().then(isCommercial => {
    if (!isCommercial) {
      // Non-commercial users can't update cost
      return Promise.resolve();
    }

    // Commercial users can update cost
    return sp.web.lists.getByTitle("ProjectRequests").items.getById(requestId).update({
      EstimatedCost: totalCost
    });
  });
}
// ...
}
```

```tsx
// src\webparts\prm\components\TechnicalAssessmentTable.tsx

import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";

import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import PricingDetails from "./PricingDetails";
import styles from "./TechnicalAssessmentTable.module.scss";

import * as strings from "PrmWebPartStrings";
import { sp } from "@pnp/sp";
import ProjectRequestService, {
  IPricingDetails,
} from "../services/ProjectRequestService";
import { ResourceTable } from "./ResourceTable";

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    // this.projectRequestService = new ProjectRequestService(this.context);
    this.projectRequestService = props.projectRequestService; // Use the service
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
    // Add this line to load existing assessments when component mounts
    this.loadExistingAssessments();
  }

  // In TechnicalAssessmentTable.tsx
  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm, isCommercialDept } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("لطفا دست کم یک آیتم ارزیابی وارد نمایید");
      return;
    }

    // Show loading state
    this.setState({ isSubmitting: true });

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
                // Only include pricing if user has permission
                const unitPrice = isCommercialDept
                  ? parseFloat(item.pricePerUnit)
                  : 0;

                pricingDetails.push({
                  RequestID: requestId,
                  UnitPrice: unitPrice,
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

        // Only fetch pricing details if user has permission
        if (isCommercialDept) {
          return this.projectRequestService.getPricingDetailsByRequestID(
            requestId
          );
        } else {
          return Promise.resolve([]);
        }
      })
      .then((pricingDetails) => {
        // console.log("Fetched Pricing Details After Save:", pricingDetails);

        // Only update estimated cost if user has permission
        if (isCommercialDept && pricingDetails.length > 0) {
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
              // Hide loading state
              this.setState({ isSubmitting: false });

              // Show success message
              console.log(
                "Assessments and pricing details saved successfully!"
              );

              // Call resetForm to navigate back to the list view
              if (resetForm) {
                resetForm();
              }
            });
        } else {
          // Hide loading state
          this.setState({ isSubmitting: false });

          // Show success message
          console.log("Assessments saved successfully!");

          // Call resetForm to navigate back to the list view
          if (resetForm) {
            resetForm();
          }

          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        // Hide loading state
        this.setState({ isSubmitting: false });
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

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

    // Debug: Log categories and inventory items
    // console.log("Filtering for categories:", categories);
    // console.log("All inventory items:", inventoryItems);

    // Map English category keys to their Persian equivalents
    const categoryMap: { [key: string]: string[] } = {
      HumanResource: [strings.HumanResource, "نیروی انسانی"], // English & Persian
      Machine: [strings.Machine, "ماشین آلات"],
      Material: [strings.Material, "ابزار", "محصول", "مواد اولیه"],
    };

    // Get all valid category names for the requested categories
    const validCategories = categories.reduce((acc, category) => {
      return acc.concat(categoryMap[category] || [category]);
    }, [] as string[]);

    // Filter items using indexOf for SPFx 1.4.1 compatibility
    const filteredItems = inventoryItems.filter(
      (item) => validCategories.indexOf(item.itemCategory) > -1
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

  // In TechnicalAssessmentTable.tsx
  loadExistingAssessments = () => {
    const { requestId } = this.props;

    // First get the technical assessments
    sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.filter(`RequestIDId eq ${requestId}`)
      .select(
        "Id,Title,HumanResourceId,HumanResourceQuantity,HumanResourcePricePerUnit,MachineId,MachineQuantity,MachinePricePerUnit,MaterialId,MaterialQuantity,MaterialPricePerUnit"
      )
      .get()
      .then((assessmentItems) => {
        // console.log("Loaded assessment items:", assessmentItems);

        if (assessmentItems.length === 0) {
          return;
        }

        // Group assessments by activity (Title)
        const groupedAssessments = {};
        assessmentItems.forEach((item) => {
          if (!groupedAssessments[item.Title]) {
            groupedAssessments[item.Title] = [];
          }
          groupedAssessments[item.Title].push(item);
        });

        // Convert to our assessment format
        const assessments = [];
        for (const activity in groupedAssessments) {
          if (groupedAssessments.hasOwnProperty(activity)) {
            const items = groupedAssessments[activity];
            const assessment = {
              activity,
              humanResources: [],
              machines: [],
              materials: [],
            };

            // Process each item to extract resources
            items.forEach((item) => {
              // Add human resources
              if (item.HumanResourceId) {
                // Check if this resource is already added to avoid duplicates
                let isDuplicate = false;
                for (let i = 0; i < assessment.humanResources.length; i++) {
                  if (
                    assessment.humanResources[i].item.key ===
                    item.HumanResourceId
                  ) {
                    isDuplicate = true;
                    break;
                  }
                }

                if (!isDuplicate) {
                  assessment.humanResources.push({
                    item: {
                      key: item.HumanResourceId,
                      text: "Loading...", // Will be updated later
                    },
                    quantity: item.HumanResourceQuantity || 0,
                    pricePerUnit: item.HumanResourcePricePerUnit || 0,
                  });
                }
              }

              // Add machines (similar logic)
              if (item.MachineId) {
                let isDuplicate = false;
                for (let i = 0; i < assessment.machines.length; i++) {
                  if (assessment.machines[i].item.key === item.MachineId) {
                    isDuplicate = true;
                    break;
                  }
                }

                if (!isDuplicate) {
                  assessment.machines.push({
                    item: {
                      key: item.MachineId,
                      text: "Loading...", // Will be updated later
                    },
                    quantity: item.MachineQuantity || 0,
                    pricePerUnit: item.MachinePricePerUnit || 0,
                  });
                }
              }

              // Add materials (similar logic)
              if (item.MaterialId) {
                let isDuplicate = false;
                for (let i = 0; i < assessment.materials.length; i++) {
                  if (assessment.materials[i].item.key === item.MaterialId) {
                    isDuplicate = true;
                    break;
                  }
                }

                if (!isDuplicate) {
                  assessment.materials.push({
                    item: {
                      key: item.MaterialId,
                      text: "Loading...", // Will be updated later
                    },
                    quantity: item.MaterialQuantity || 0,
                    pricePerUnit: item.MaterialPricePerUnit || 0,
                  });
                }
              }
            });

            assessments.push(assessment);
          }
        }

        // Update inventory item text values and then update state
        this.updateResourceItemTexts(assessments);
      })
      .catch((error) => {
        console.error("Error loading existing assessments:", error);
      });
  };

  updateResourceItemTexts = (assessments) => {
    // Get all resource IDs
    const resourceIds = [];
    assessments.forEach((assessment) => {
      ["humanResources", "machines", "materials"].forEach((resourceType) => {
        assessment[resourceType].forEach((resource) => {
          if (resource.item && resource.item.key) {
            resourceIds.push(resource.item.key);
          }
        });
      });
    });

    if (resourceIds.length === 0) {
      this.setState({ assessments });
      return;
    }

    // Instead of using the 'in' operator, get all inventory items
    sp.web.lists
      .getByTitle("InventoryItems")
      .items.select("Id,Title,ItemCategory")
      .get()
      .then((inventoryItems) => {
        // console.log("Fetched all inventory items:", inventoryItems);

        // Create a map of ID to Title
        const itemMap = {};

        // Filter the items manually
        for (let i = 0; i < inventoryItems.length; i++) {
          const item = inventoryItems[i];
          // Check if this item's ID is in our resourceIds array
          for (let j = 0; j < resourceIds.length; j++) {
            if (item.Id === resourceIds[j]) {
              itemMap[item.Id] = item.Title;
              break;
            }
          }
        }

        // Update the text values in assessments
        assessments.forEach((assessment) => {
          ["humanResources", "machines", "materials"].forEach(
            (resourceType) => {
              assessment[resourceType].forEach((resource) => {
                if (
                  resource.item &&
                  resource.item.key &&
                  itemMap[resource.item.key]
                ) {
                  resource.item.text = itemMap[resource.item.key];
                } else if (resource.item) {
                  // If we couldn't find the item name, use a better fallback
                  let typeLabel = "Resource";
                  if (resourceType === "humanResources") {
                    typeLabel = "Human Resource";
                  } else if (resourceType === "machines") {
                    typeLabel = "Machine";
                  } else {
                    typeLabel = "Material";
                  }
                  resource.item.text =
                    typeLabel + " (ID: " + resource.item.key + ")";
                }
              });
            }
          );
        });

        this.setState({ assessments });
      })
      .catch((error) => {
        console.error("Error updating resource item texts:", error);
        this.setState({ assessments });
      });
  };

  render() {
    const { assessments } = this.state;
    const { isReadOnly } = this.props;
    const canViewPricing = this.props.isCommercialDept === true;

    return (
      <div className={styles.assessmentContainer}>
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>

        {assessments.map((assessment, index) => (
          <div key={index} className={styles.assessmentItem}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />

            <ResourceTable
              label={strings.HumanResource}
              field="humanResources"
              options={this.filterInventoryItems([strings.HumanResource])}
              resources={assessment.humanResources}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
              isReadOnly={isReadOnly}
              // canViewPricing={this.props.isCommercialDept}
              canViewPricing={canViewPricing}
            />

            <ResourceTable
              label={strings.Machine}
              field="machines"
              options={this.filterInventoryItems([strings.Machine])}
              resources={assessment.machines}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
              isReadOnly={isReadOnly}
              // canViewPricing={this.props.isCommercialDept}
              canViewPricing={canViewPricing}
            />

            <ResourceTable
              label={strings.Material}
              field="materials"
              options={this.filterInventoryItems([strings.Material])}
              resources={assessment.materials}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
              isReadOnly={isReadOnly}
              // canViewPricing={this.props.isCommercialDept}
              canViewPricing={canViewPricing}
            />

            <hr className={styles.assessmentDivider} />
          </div>
        ))}

        {!isReadOnly && (
          <div className={styles.assessmentButtons}>
            <PrimaryButton
              className={styles.addAssessmentButton}
              text={strings.AddAssessment}
              onClick={this.addAssessment}
            />
            <PrimaryButton
              className={styles.finalSubmitButton}
              text={strings.FinalSubmit}
              onClick={this.handleFinalSubmit}
              disabled={this.state.isSubmitting}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

```

```tsx
// src/webparts/prm/components/ProjectRequestForm.tsx (modified)
import * as React from "react";
import {
  PrimaryButton,
  DefaultButton,
  IDropdownOption,
  DocumentCard,
  DocumentCardTitle,
  MessageBar,
  MessageBarType,
} from "office-ui-fabric-react";
import { IProjectRequestFormProps, FormMode } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import * as strings from "PrmWebPartStrings";
import ProjectInformation from "./ProjectInformation";
import ProjectRequestFormFields from "./ProjectRequestFormFields";
import StepIndicator from "./StepIndicator";
import { sp } from "@pnp/sp";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(
      this.props.context,
      this.props.commercialGroupName
    ); // Pass the value here
    this.state = {
      isProjectCreated: props.mode !== FormMode.Create,
      showProjectForm: true,
      requestId: props.itemId || null,
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
      isLoading: props.mode !== FormMode.Create,
      isSubmitting: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: "",
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  // src/webparts/prm/components/ProjectRequestForm.tsx
  // Add to the componentDidMount method:

  componentDidMount() {
    this.loadCustomerOptions();

    // If in Edit or View mode, load the existing item
    if (this.props.mode !== FormMode.Create && this.props.itemId) {
      this.loadExistingItem(this.props.itemId);
    }
  }

    // ...

render (){
  
  // ...
            {(isProjectCreated || isViewMode) && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
            isReadOnly={isViewMode}
            isCommercialDept={this.props.isCommercialDept}
          />
        )}
      </div>
    );
  }
}

export default ProjectRequestForm;
```

```tsx
// src/webparts/prm/components/ProjectListView.tsx
import * as React from "react";
import { sp } from "@pnp/sp";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from "office-ui-fabric-react/lib/DetailsList";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import GenericDropdown from "./GenericDropdown"; // Use your custom dropdown
import styles from "./ProjectListView.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IProjectListViewProps {
  context: any;
  onCreateNew: () => void;
  onSelectItem: (itemId: number, mode: string) => void;
  isCommercialDept?: boolean; // Add this new property
}

export interface IProjectListViewState {
  items: any[];
  isLoading: boolean;
  statusFilter: string;
  userDepartment: string;
  isCommercialDept: boolean;
}

export class ProjectListView extends React.Component<
  IProjectListViewProps,
  IProjectListViewState
> {
  constructor(props: IProjectListViewProps) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      statusFilter: "All",
      userDepartment: "",
      isCommercialDept: false,
    };

    // Bind methods
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  public componentDidMount(): void {
    this.getCurrentUserInfo();
    this.loadProjects();
  }

  // src/webparts/prm/components/ProjectListView.tsx
  private getCurrentUserInfo(): void {
    // Get user info directly from the context
    const currentUser = this.props.context.pageContext.user;

    // For demo purposes, we'll just assume the user is in the Commercial Department
    // In a production environment, you would check actual group membership
    this.setState({
      userDepartment: "Commercial Department", // Simplified for demo
      isCommercialDept: true, // Simplified for demo - set to true to show all buttons
    });

    // Note: In a real implementation, you would check group membership using the SharePoint REST API
    // Example of how you might do this (commented out for now):
    /*
  const endpoint = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;

  this.props.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
    .then(response => response.json())
    .then(data => {
      let isCommercial = false;
      if (data && data.value) {
        for (let i = 0; i < data.value.length; i++) {
          if (data.value[i].Title === "Commercial Department") {
            isCommercial = true;
            break;
          }
        }
      }

      this.setState({
        userDepartment: isCommercial ? "Commercial Department" : "Other Department",
        isCommercialDept: isCommercial
      });
    })
    .catch(error => {
      console.error('Error checking group membership:', error);
      this.setState({
        userDepartment: "Unknown Department",
        isCommercialDept: false
      });
    });
  */
  }

  private loadProjects(): void {
    const { statusFilter } = this.state;

    let query = sp.web.lists
      .getByTitle("ProjectRequests")
      .items.select(
        "Id,Title,RequestDate,RequestStatus,FormNumber,EstimatedCost"
      );

    // Apply filters based on status
    if (statusFilter !== "All") {
      query = query.filter(`RequestStatus eq '${statusFilter}'`);
    }

    query
      .get()
      .then((items) => {
        this.setState({
          items,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        this.setState({ isLoading: false });
      });
  }

  private getColumns(): IColumn[] {
    return [
      {
        key: "title",
        name: strings.Title,
        fieldName: "Title",
        minWidth: 100,
        isResizable: true,
      },
      {
        key: "formNumber",
        name: strings.FormNumber,
        fieldName: "FormNumber",
        minWidth: 70,
        isResizable: true,
      },
      {
        key: "requestDate",
        name: strings.RequestDate,
        fieldName: "RequestDate",
        minWidth: 90,
        isResizable: true,
        onRender: (item) => (
          <span>{new Date(item.RequestDate).toLocaleDateString()}</span>
        ),
      },
      {
        key: "status",
        name: strings.Status,
        fieldName: "RequestStatus",
        minWidth: 90,
        isResizable: true,
      },
      {
        key: "actions",
        name: strings.Actions,
        fieldName: "actions",
        minWidth: 150,
        isResizable: true,
        onRender: (item) => this.renderActionButtons(item),
      },
    ];
  }

  private renderActionButtons(item: any): JSX.Element {
    const { isCommercialDept } = this.state;
    const isApproved = item.RequestStatus === "Approved";

    return (
      <div className={styles.actionButtons}>
        <DefaultButton
          text={strings.View}
          onClick={this.handleViewClick.bind(this, item.Id)}
          className={styles.actionButton}
        />

        {!isApproved &&
          (isCommercialDept ||
            item.Department === this.state.userDepartment) && (
            <PrimaryButton
              text={strings.Edit}
              onClick={this.handleEditClick.bind(this, item.Id)}
              className={styles.actionButton}
            />
          )}
      </div>
    );
  }

  private handleViewClick(itemId: number): void {
    this.props.onSelectItem(itemId, "View");
  }

  private handleEditClick(itemId: number): void {
    this.props.onSelectItem(itemId, "Edit");
  }

  private handleStatusFilterChange(option: any): void {
    this.setState({ statusFilter: option.key }, () => {
      this.loadProjects();
    });
  }

  private renderFilters(): JSX.Element {
    const statusOptions = [
      { key: "All", text: strings.AllStatuses },
      { key: "New", text: strings.StatusNew },
      { key: "In Review", text: strings.StatusInReview },
      { key: "Approved", text: strings.StatusApproved },
      { key: "Rejected", text: strings.StatusRejected },
    ];

    return (
      <div className={styles.filtersContainer}>
        <div>
          <GenericDropdown
            label={strings.FilterByStatus}
            options={statusOptions}
            selectedKey={this.state.statusFilter}
            onChanged={this.handleStatusFilterChange}
            placeHolder={strings.SelectStatus}
          />
        </div>

        {this.state.isCommercialDept && (
          <PrimaryButton
            text={strings.CreateNewRequest}
            onClick={this.props.onCreateNew}
            className={styles.newButton}
          />
        )}
      </div>
    );
  }

  public render(): React.ReactElement<IProjectListViewProps> {
    const { items, isLoading } = this.state;

    if (isLoading) {
      return <div>{strings.LoadingProjects}</div>;
    }

    return (
      <div className={styles.projectListView}>
        <h2>{strings.ProjectRequests}</h2>

        {this.renderFilters()}

        <DetailsList
          items={items}
          columns={this.getColumns()}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      </div>
    );
  }
}

export default ProjectListView;
```

```tsx
// src\webparts\prm\components\ManagedMetadataPicker.tsx
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
  commercialGroupName?: string; // Add this optional prop
}

export interface IManagedMetadataPickerState {
  options: IComboBoxOption[];
}

export default class ManagedMetadataPicker extends React.Component<
  IManagedMetadataPickerProps,
  IManagedMetadataPickerState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IManagedMetadataPickerProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(
      this.props.context,
      this.props.commercialGroupName || "Commercial Department"
    ); // Use from props if available);
    this.state = {
      options: [],
    };
    this._onMenuOpen = this._onMenuOpen.bind(this);
    this._onChanged = this._onChanged.bind(this);
  }

  private _onMenuOpen(): void {
    // Fetch taxonomy terms using the service method
    this.projectRequestService
      .getTaxonomyTerms("5863383a-85c5-4fbd-8114-11ef83bf9175")
      .then((terms) => {
        const options: IComboBoxOption[] = terms.map((term) => ({
          key: term.id,
          text: term.label,
        }));
        this.setState({ options });
      })
      .catch((error) => {
        console.error("Error fetching taxonomy terms", error);
        this.setState({ options: [] });
      });
  }

  private _onChanged(
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void {
    if (option && this.props.onTermSelected) {
      this.props.onTermSelected({
        id: option.key as string,
        label: option.text,
      });
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
```

```ts
// src/webparts/prm/PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/ProjectRequestForm';
import { IProjectRequestFormProps, FormMode } from './components/IProjectRequestFormProps';
import { sp } from "@pnp/sp";
// src/webparts/prm/PrmWebPart.ts
import ProjectListView, { IProjectListViewProps } from './components/ProjectListView';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export interface IPrmWebPartProps {
  description: string;
  formMode: string;
  itemId: string;
  currentView: string; // 'list' or 'form'
  commercialGroupName: string; // Add this property
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {
  private isCommercialDept: boolean = false;

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    // Set a default value for commercialGroupName if not provided
    if (!this.properties.commercialGroupName) {
      this.properties.commercialGroupName = "Commercial Department";
    }
      // Check if user is in Commercial Department
      return this.checkUserDepartment().then(isCommercial => {
        this.isCommercialDept = isCommercial;
      });
    });
  }


  private checkUserDepartment(): Promise<boolean> {
  const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentUser/groups`;

  return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then((data: any) => {
      // Log the raw response for debugging
      // console.log("Raw API response:", data);

      let groups: any[];
      if (data && data.d && data.d.results) {
        // Handle odata=verbose
        groups = data.d.results;
      } else if (data && data.value) {
        // Handle odata=minimalmetadata
        groups = data.value;
      } else if (Array.isArray(data)) {
        // Handle odata=nometadata (direct array)
        groups = data;
      } else {
        // Handle unexpected or empty response
        console.error("Unexpected or empty response structure:", data);
        return false;
      }

      // console.log("Retrieved user groups (Web Part):", groups);
      // console.log("Expected commercial group (Web Part):", this.properties.commercialGroupName);

      for (let i = 0; i < groups.length; i++) {
        if (!groups[i] || !groups[i].Title) {
          console.warn("Group at index", i, "is missing or has no Title:", groups[i]);
          continue;
        }
        console.log(
          `Comparing group title '${groups[i].Title}' with expected '${this.properties.commercialGroupName}'`
        );
        if (groups[i].Title.toLowerCase().trim() === this.properties.commercialGroupName.toLowerCase().trim()) {
          console.log("Match found (Web Part):", groups[i].Title);
          return true;
        }
      }
      console.log("No matching group found (Web Part).");
      return false;
    })
    .catch((error) => {
      console.error("Group check failed (Web Part):", error);
      return false;
    });
}

  public render(): void {
    // Determine what to render based on currentView property
    const currentView = this.properties.currentView || 'list';

    if (currentView === 'list') {
      // Render the list view
      const element: React.ReactElement<IProjectListViewProps> = React.createElement(
        ProjectListView,
        {
          context: this.context,
          onCreateNew: () => {
            // Switch to form view in Create mode
            this.properties.currentView = 'form';
            this.properties.formMode = 'Create';
            this.properties.itemId = '';
            this.render();
          },
          onSelectItem: (itemId: number, mode: string) => {
            // Switch to form view in the selected mode
            this.properties.currentView = 'form';
            this.properties.formMode = mode;
            this.properties.itemId = itemId.toString();
            this.render();
          },
          isCommercialDept: this.isCommercialDept // Pass the department flag
        }
      );

      ReactDom.render(element, this.domElement);
    } else {
      // Render the form view (existing code)
      let formMode = FormMode.Create;
      if (this.properties.formMode) {
        if (this.properties.formMode === "Edit") {
          formMode = FormMode.Edit;
        } else if (this.properties.formMode === "View") {
          formMode = FormMode.View;
        }
      }

      let itemId: number = undefined;
      if (this.properties.itemId) {
        itemId = parseInt(this.properties.itemId);
      }

      const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(
        ProjectRequestForm,
        {
          context: this.context,
          mode: formMode,
          itemId: itemId,
          onBack: () => {
            // Switch back to list view
            this.properties.currentView = 'list';
            this.render();
          },
          isCommercialDept: this.isCommercialDept, // Pass the department flag
          commercialGroupName: this.properties.commercialGroupName
        }
      );

      ReactDom.render(element, this.domElement);
    }
  }

  // @ts-ignore: Inherited property with different implementation
  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                }),
                PropertyPaneTextField('commercialGroupName', {
                  label: 'Commercial Department Group Name',
                  description: 'Enter the name of the SharePoint group that has access to pricing information',
                  value: this.properties.commercialGroupName || 'Commercial Department'
                }),

                PropertyPaneDropdown('formMode', {
                  label: strings.FormModeFieldLabel,
                  options: [
                    { key: 'Create', text: strings.FormModeCreate },
                    { key: 'Edit', text: strings.FormModeEdit },
                    { key: 'View', text: strings.FormModeView }
                  ]
                }),
                PropertyPaneTextField('itemId', {
                  label: strings.ItemIdFieldLabel,
                  description: strings.ItemIdFieldDescription
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

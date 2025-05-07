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
        console.log("Assessment IDs:", assessmentIds);

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

        console.log("Pricing Details to Save:", pricingDetails);

        // Save pricing details
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        console.log("Pricing details saved successfully.");
        return this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );
      })
      .then((pricingDetails) => {
        console.log("Fetched Pricing Details After Save:", pricingDetails);

        // Calculate the total estimated cost
        const totalEstimatedCost = pricingDetails.reduce(
          (sum, detail) => sum + detail.TotalCost,
          0
        );

        console.log("Total Estimated Cost:", totalEstimatedCost);

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
      console.log("Inventory Items:", items); // Debugging
      this.setState({ inventoryItems: items });
    });
  };

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

    // Debug: Log categories and inventory items
    console.log("Filtering for categories:", categories);
    console.log("All inventory items:", inventoryItems);

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

    console.log("Filtered Items:", filteredItems);
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
        console.log("Loaded assessment items:", assessmentItems);

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
        console.log("Fetched all inventory items:", inventoryItems);

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

  // // src/webparts/prm/components/TechnicalAssessmentTable.tsx (corrected)
  // loadExistingAssessments = () => {
  //   const { requestId } = this.props;

  //   // First get the technical assessments
  //   sp.web.lists
  //     .getByTitle("TechnicalAssessments")
  //     .items.filter(`RequestIDId eq ${requestId}`)
  //     .select(
  //       "Id,Title,HumanResourceId,HumanResourceQuantity,HumanResourcePricePerUnit,MachineId,MachineQuantity,MachinePricePerUnit,MaterialId,MaterialQuantity,MaterialPricePerUnit"
  //     )
  //     .get()
  //     .then((assessmentItems) => {
  //       console.log("Loaded assessment items:", assessmentItems);

  //       if (assessmentItems.length === 0) {
  //         return;
  //       }

  //       // Group assessments by activity (Title)
  //       const groupedAssessments = {};
  //       assessmentItems.forEach((item) => {
  //         if (!groupedAssessments[item.Title]) {
  //           groupedAssessments[item.Title] = [];
  //         }
  //         groupedAssessments[item.Title].push(item);
  //       });

  //       // Convert to our assessment format
  //       const assessments = Object.keys(groupedAssessments).map((activity) => {
  //         const items = groupedAssessments[activity];
  //         const assessment = {
  //           activity,
  //           humanResources: [],
  //           machines: [],
  //           materials: [],
  //         };

  //         // Process each item to extract resources
  //         items.forEach((item) => {
  //           // Add human resources
  //           if (item.HumanResourceId) {
  //             assessment.humanResources.push({
  //               item: {
  //                 key: item.HumanResourceId,
  //                 text: "Resource " + item.HumanResourceId,
  //               },
  //               quantity: item.HumanResourceQuantity || 0,
  //               pricePerUnit: item.HumanResourcePricePerUnit || 0,
  //             });
  //           }

  //           // Add machines
  //           if (item.MachineId) {
  //             assessment.machines.push({
  //               item: {
  //                 key: item.MachineId,
  //                 text: "Machine " + item.MachineId,
  //               },
  //               quantity: item.MachineQuantity || 0,
  //               pricePerUnit: item.MachinePricePerUnit || 0,
  //             });
  //           }

  //           // Add materials
  //           if (item.MaterialId) {
  //             assessment.materials.push({
  //               item: {
  //                 key: item.MaterialId,
  //                 text: "Material " + item.MaterialId,
  //               },
  //               quantity: item.MaterialQuantity || 0,
  //               pricePerUnit: item.MaterialPricePerUnit || 0,
  //             });
  //           }
  //         });

  //         return assessment;
  //       });

  //       // Update inventory item text values and then update state
  //       this.updateResourceItemTexts(assessments);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading existing assessments:", error);
  //     });
  // };

  // updateResourceItemTexts = (assessments) => {
  //   // Get all resource IDs
  //   const resourceIds = [];
  //   assessments.forEach((assessment) => {
  //     ["humanResources", "machines", "materials"].forEach((resourceType) => {
  //       assessment[resourceType].forEach((resource) => {
  //         if (resource.item && resource.item.key) {
  //           resourceIds.push(resource.item.key);
  //         }
  //       });
  //     });
  //   });

  //   if (resourceIds.length === 0) {
  //     this.setState({ assessments });
  //     return;
  //   }

  //   // Get inventory items to update the text values
  //   sp.web.lists
  //     .getByTitle("InventoryItems")
  //     .items.filter(`Id in (${resourceIds.join(",")})`)
  //     .select("Id,Title")
  //     .get()
  //     .then((inventoryItems) => {
  //       // Create a map of ID to Title
  //       const itemMap = {};
  //       inventoryItems.forEach((item) => {
  //         itemMap[item.Id] = item.Title;
  //       });

  //       // Update the text values in assessments
  //       assessments.forEach((assessment) => {
  //         ["humanResources", "machines", "materials"].forEach(
  //           (resourceType) => {
  //             assessment[resourceType].forEach((resource) => {
  //               if (
  //                 resource.item &&
  //                 resource.item.key &&
  //                 itemMap[resource.item.key]
  //               ) {
  //                 resource.item.text = itemMap[resource.item.key];
  //               }
  //             });
  //           }
  //         );
  //       });

  //       this.setState({ assessments });
  //     })
  //     .catch((error) => {
  //       console.error("Error updating resource item texts:", error);
  //       this.setState({ assessments });
  //     });
  // };

  render() {
    const { assessments } = this.state;
    const { isReadOnly } = this.props;

    return (
      <div className={styles.assessmentContainer}>
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>

        {/* {assessments.map((assessment, index) => (
          <div className={styles.assessmentItem}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue) =>
                this.handleInputChange(newValue, "activity", index)
              }
              disabled={isReadOnly}
              className={styles.activityField}
            />

            {/* Use the existing ResourceTable component with isReadOnly prop
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
            />

            <hr className={styles.assessmentDivider} />
          </div>
        ))} */}

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

            {/* Only one ResourceTable per resource type */}
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
            />
          </div>
        )}
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

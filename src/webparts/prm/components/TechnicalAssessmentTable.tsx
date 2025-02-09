// import * as React from "react";
// import {
//   PrimaryButton,
//   TextField,
//   IDropdownOption,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// import { set } from "lodash";

// import ProjectRequestService from "../services/ProjectRequestService";

// class TechnicalAssessmentTable extends React.Component<
//   ITechnicalAssessmentProps,
//   ITechnicalAssessmentState
// > {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: ITechnicalAssessmentProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService();
//     this.state = {
//       assessments: [],
//       inventoryItems: [],
//     };
//   }

//   componentDidMount() {
//     this.loadInventoryItems();
//   }

//   handleFinalSubmit = (): void => {
//     const { assessments } = this.state;
//     const { requestId, resetForm } = this.props;

//     if (!assessments || assessments.length === 0) {
//       alert("Please add at least one assessment before submitting.");
//       return;
//     }

//     this.projectRequestService
//       .saveAssessments(assessments, requestId)
//       .then(() => {
//         alert("Assessments saved successfully!");
//         resetForm(); // Reset the form after saving
//       })
//       .catch((error) => {
//         console.error("Error saving assessments:", error);
//         alert(
//           "Error saving assessments. Please check the console for details."
//         );
//       });
//   };

//   loadInventoryItems = () => {
//     this.projectRequestService.getInventoryItems().then((items) => {
//       this.setState({ inventoryItems: items });
//     });
//   };

//   filterInventoryItems = (categories: string[]): IDropdownOption[] => {
//     const { inventoryItems } = this.state;
//     return inventoryItems
//       .filter((item) => categories.indexOf(item.itemCategory) > -1)
//       .map((item) => ({ key: item.key, text: item.text }));
//   };
//   handleInputChange = (
//     newValue: string,
//     nestedField: string, // "quantity" or "pricePerUnit"
//     index: number,
//     partIndex?: number
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments]; // Shallow copy of assessments

//       if (partIndex !== undefined) {
//         // Update a nested property (quantity or pricePerUnit)
//         const items = [...(assessments[index].humanResources || [])]; // Ensure the nested array exists
//         const updatedItem = { ...items[partIndex] }; // Shallow copy of specific item

//         updatedItem[nestedField] = newValue; // Dynamically update the nested property

//         items[partIndex] = updatedItem; // Replace the updated item in the array
//         assessments[index].humanResources = items; // Update the nested array
//       } else {
//         // Update top-level properties (e.g., activity)
//         assessments[index] = { ...assessments[index], [nestedField]: newValue };
//       }

//       return { assessments }; // Update state
//     });
//   };

//   handleDropdownChange = (
//     field: string,
//     option: IDropdownOption,
//     index: number,
//     partIndex: number
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field][partIndex].item = option;
//       return { assessments };
//     });
//   };
//   addRow = (field: string, index: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments]; // Shallow copy of assessments

//       // Ensure the field exists and is an array
//       if (!Array.isArray(assessments[index][field])) {
//         assessments[index][field] = [];
//       }

//       // Add a new row with default values
//       assessments[index][field].push({
//         item: { key: "", text: "" }, // Default dropdown item
//         quantity: 0, // Default quantity
//         pricePerUnit: 0, // Default price per unit
//       });

//       return { assessments }; // Update state
//     });
//   };

//   removeRow = (field: string, index: number, partIndex: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field].splice(partIndex, 1);
//       return { assessments };
//     });
//   };
//   addAssessment = () => {
//     this.setState((prevState) => ({
//       assessments: [
//         ...prevState.assessments,
//         {
//           activity: "", // Default activity
//           humanResources: [], // Initialize as an empty array
//           machines: [], // Initialize as an empty array
//           materials: [], // Initialize as an empty array
//         },
//       ],
//     }));
//   };

//   renderTable = (
//     label: string,
//     field: string,
//     options: IDropdownOption[],
//     assessment: any,
//     index: number
//   ) => (
//     <table>
//       <tbody>
//         <tr>
//           <th>{label}</th>
//           <th>Quantity</th>
//           <th>Price Per Unit</th>
//         </tr>
//         {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
//           assessment[field].map((item: any, partIndex: number) => (
//             <tr key={partIndex}>
//               <td>
//                 <GenericDropdown
//                   label={`${label} ${partIndex + 1}`}
//                   options={options}
//                   selectedKey={item.item ? item.item.key : undefined}
//                   onChanged={(option) =>
//                     this.handleDropdownChange(field, option!, index, partIndex)
//                   }
//                 />
//               </td>
//               <td>
//                 <TextField
//                   value={item.quantity.toString()}
//                   onChanged={(newValue: string) =>
//                     this.handleInputChange(
//                       newValue,
//                       "quantity",
//                       index,
//                       partIndex
//                     )
//                   }
//                 />
//               </td>
//               <td>
//                 <TextField
//                   value={item.pricePerUnit.toString()}
//                   onChanged={(newValue: string) =>
//                     this.handleInputChange(
//                       newValue,
//                       "pricePerUnit",
//                       index,
//                       partIndex
//                     )
//                   }
//                 />
//               </td>
//               <td>
//                 <PrimaryButton
//                   text="Remove"
//                   onClick={() => this.removeRow(field, index, partIndex)}
//                 />
//               </td>
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan={4}>No {label.toLowerCase()} added yet.</td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   );

//   render() {
//     const { assessments } = this.state;
//     console.log("Assessments state:", assessments); // Debug log

//     return (
//       <div>
//         <h3>Technical Assessments</h3>
//         {assessments.map((assessment, index) => (
//           <div key={index}>
//             <TextField
//               label={`Activity ${index + 1}`}
//               value={assessment.activity}
//               onChanged={(newValue: string) =>
//                 this.handleInputChange(newValue, "activity", index)
//               }
//             />

//             {/* Human Resources */}
//             {this.renderTable(
//               "Human Resource",
//               "humanResources",
//               this.filterInventoryItems(["نیروی انسانی"]),
//               assessment,
//               index
//             )}
//             <PrimaryButton
//               text="Add Human Resource"
//               onClick={() => this.addRow("humanResources", index)}
//             />

//             {/* Machines */}
//             {this.renderTable(
//               "Machine",
//               "machines",
//               this.filterInventoryItems(["ماشین آلات"]),
//               assessment,
//               index
//             )}
//             <PrimaryButton
//               text="Add Machine"
//               onClick={() => this.addRow("machines", index)}
//             />

//             {/* Materials */}
//             {this.renderTable(
//               "Material",
//               "materials",
//               this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]),
//               assessment,
//               index
//             )}
//             <PrimaryButton
//               text="Add Material"
//               onClick={() => this.addRow("materials", index)}
//             />

//             <hr />
//           </div>
//         ))}
//         <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
//         <PrimaryButton text="Final Submit" onClick={this.handleFinalSubmit} />
//       </div>
//     );
//   }
// }

// export default TechnicalAssessmentTable;
import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import { set } from "lodash";

import ProjectRequestService from "../services/ProjectRequestService";

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

    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then(() => {
        alert("Assessments saved successfully!");
        resetForm(); // Reset the form after saving
      })
      .catch((error) => {
        console.error("Error saving assessments:", error);
        alert(
          "Error saving assessments. Please check the console for details."
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
      const assessments = [...prevState.assessments]; // Shallow copy of assessments

      // Ensure the field exists and is an array
      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      // Add a new row with default values
      assessments[index][field].push({
        item: { key: "", text: "" }, // Default dropdown item
        quantity: 0, // Default quantity
        pricePerUnit: 0, // Default price per unit
      });

      return { assessments }; // Update state
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
          activity: "", // Default activity
          humanResources: [], // Initialize as an empty array
          machines: [], // Initialize as an empty array
          materials: [], // Initialize as an empty array
        },
      ],
    }));
  };

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
                    this.handleInputChange(
                      newValue,
                      "quantity",
                      index,
                      partIndex,
                      field
                    )
                  }
                />
              </td>
              <td>
                <TextField
                  value={item.pricePerUnit.toString()}
                  onChanged={(newValue: string) =>
                    this.handleInputChange(
                      newValue,
                      "pricePerUnit",
                      index,
                      partIndex,
                      field
                    )
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

  render() {
    const { assessments } = this.state;
    console.log("Assessments state:", assessments); // Debug log

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

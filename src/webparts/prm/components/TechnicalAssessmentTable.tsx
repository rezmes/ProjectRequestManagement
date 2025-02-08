// // // import * as React from "react";
// // // import {
// // //   PrimaryButton,
// // //   TextField,
// // //   IDropdownOption,
// // // } from "office-ui-fabric-react";
// // // import GenericDropdown from "./GenericDropdown";
// // // import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// // // import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";

// // // import ProjectRequestService, {
// // //   IDropdownOptionWithCategory,
// // // } from "../services/ProjectRequestService";

// // // class TechnicalAssessmentTable extends React.Component<
// // //   ITechnicalAssessmentProps,
// // //   ITechnicalAssessmentState
// // // > {
// // //   private projectRequestService: ProjectRequestService;

// // //   constructor(props: ITechnicalAssessmentProps) {
// // //     super(props);
// // //     this.projectRequestService = new ProjectRequestService();
// // //     this.state = {
// // //       assessments: [],
// // //       inventoryItems: [],
// // //     };
// // //   }

// // //   componentDidMount() {
// // //     console.log(
// // //       "Received requestId in TechnicalAssessmentTable:",
// // //       this.props.requestId
// // //     );
// // //     this.loadInventoryItems();
// // //   }

// // //   handleFinalSubmit = (): void => {
// // //     const { assessments } = this.state;
// // //     const { requestId, resetForm } = this.props;

// // //     if (!assessments || assessments.length === 0) {
// // //       alert("Please add at least one assessment before submitting.");
// // //       return;
// // //     }

// // //     this.projectRequestService
// // //       .saveAssessments(assessments, requestId)
// // //       .then(() => {
// // //         alert("Assessments saved successfully!");
// // //         resetForm(); // Reset the form after saving
// // //       })
// // //       .catch((error) => {
// // //         console.error("Error saving assessments:", error);
// // //         alert(
// // //           "Error saving assessments. Please check the console for details."
// // //         );
// // //       });
// // //   };

// // //   loadInventoryItems = () => {
// // //     this.projectRequestService.getInventoryItems().then((items) => {
// // //       this.setState({ inventoryItems: items });
// // //     });
// // //   };

// // //   filterInventoryItems = (categories: string[]): IDropdownOption[] => {
// // //     const { inventoryItems } = this.state;
// // //     return inventoryItems
// // //       .filter((item) => categories.indexOf(item.itemCategory) > -1)
// // //       .map((item) => ({ key: item.key, text: item.text }));
// // //   };

// // //   handleInputChange = (
// // //     newValue: string,
// // //     field: string,
// // //     index: number
// // //   ): void => {
// // //     this.setState((prevState) => {
// // //       const assessments = [...prevState.assessments];
// // //       assessments[index][field] = newValue;
// // //       return { assessments };
// // //     });
// // //   };

// // //   handleDropdownChange = (
// // //     field: string,
// // //     option: IDropdownOption,
// // //     index: number
// // //   ): void => {
// // //     this.setState((prevState) => {
// // //       const assessments = [...prevState.assessments];
// // //       assessments[index][field] = option;
// // //       return { assessments };
// // //     });
// // //   };

// // //   addAssessment = () => {
// // //     this.setState((prevState) => ({
// // //       assessments: [
// // //         ...prevState.assessments,
// // //         {
// // //           activity: "",
// // //           humanResource: null,
// // //           machine: null,
// // //           material: null,
// // //           quantity: 0,
// // //         },
// // //       ],
// // //     }));
// // //   };

// // //   render() {
// // //     const { assessments } = this.state;

// // //     return (
// // //       <div>
// // //         <h3>Technical Assessments</h3>
// // //         {assessments.map((assessment, index) => (
// // //           <div key={index}>
// // //             <TextField
// // //               label={`Activity ${index + 1}`}
// // //               value={assessment.activity}
// // //               onChanged={(newValue: string) =>
// // //                 this.handleInputChange(newValue, "activity", index)
// // //               }
// // //             />

// // //             {/* Human Resource */}
// // //             <h4>Human Resource</h4>
// // //             <GenericDropdown
// // //               label="Human Resource"
// // //               options={this.filterInventoryItems(["نیروی انسانی"])}
// // //               selectedKey={
// // //                 assessment.humanResource ? assessment.humanResource.key : null
// // //               }
// // //               onChanged={(option) =>
// // //                 this.handleDropdownChange("humanResource", option, index)
// // //               }
// // //               placeHolder="Select a human resource"
// // //             />

// // //             {/* Machine */}
// // //             <h4>Machine</h4>
// // //             <GenericDropdown
// // //               label="Machine"
// // //               options={this.filterInventoryItems(["ماشین آلات"])}
// // //               selectedKey={assessment.machine ? assessment.machine.key : null}
// // //               onChanged={(option) =>
// // //                 this.handleDropdownChange("machine", option, index)
// // //               }
// // //               placeHolder="Select a machine"
// // //             />

// // //             {/* Material */}
// // //             <h4>Material</h4>
// // //             <GenericDropdown
// // //               label="Material"
// // //               options={this.filterInventoryItems([
// // //                 "ابزار",
// // //                 "محصول",
// // //                 "مواد اولیه",
// // //               ])}
// // //               selectedKey={assessment.material ? assessment.material.key : null}
// // //               onChanged={(option) =>
// // //                 this.handleDropdownChange("material", option, index)
// // //               }
// // //               placeHolder="Select a material"
// // //             />

// // //             <hr />
// // //           </div>
// // //         ))}
// // //         <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
// // //         {/* Remove the Save Assessments button */}
// // //         {/* <PrimaryButton
// // //           text="Save Assessments"
// // //           onClick={this.handleSaveAssessments}
// // //         /> */}
// // //         <PrimaryButton text="Final Submit" onClick={this.handleFinalSubmit} />
// // //       </div>
// // //     );
// // //   }
// // // }

// // // export default TechnicalAssessmentTable;
// // import * as React from "react";
// // import {
// //   PrimaryButton,
// //   TextField,
// //   IDropdownOption,
// // } from "office-ui-fabric-react";
// // import GenericDropdown from "./GenericDropdown";
// // import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// // import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";

// // import ProjectRequestService from "../services/ProjectRequestService";

// // class TechnicalAssessmentTable extends React.Component<
// //   ITechnicalAssessmentProps,
// //   ITechnicalAssessmentState
// // > {
// //   private projectRequestService: ProjectRequestService;

// //   constructor(props: ITechnicalAssessmentProps) {
// //     super(props);
// //     this.projectRequestService = new ProjectRequestService();
// //     this.state = {
// //       assessments: [],
// //       inventoryItems: [],
// //     };
// //   }

// //   componentDidMount() {
// //     this.loadInventoryItems();
// //   }

// //   handleFinalSubmit = (): void => {
// //     const { assessments } = this.state;
// //     const { requestId, resetForm } = this.props;

// //     if (!assessments || assessments.length === 0) {
// //       alert("Please add at least one assessment before submitting.");
// //       return;
// //     }

// //     this.projectRequestService
// //       .saveAssessments(assessments, requestId)
// //       .then(() => {
// //         alert("Assessments saved successfully!");
// //         resetForm(); // Reset the form after saving
// //       })
// //       .catch((error) => {
// //         console.error("Error saving assessments:", error);
// //         alert(
// //           "Error saving assessments. Please check the console for details."
// //         );
// //       });
// //   };

// //   loadInventoryItems = () => {
// //     this.projectRequestService.getInventoryItems().then((items) => {
// //       this.setState({ inventoryItems: items });
// //     });
// //   };

// //   filterInventoryItems = (categories: string[]): IDropdownOption[] => {
// //     const { inventoryItems } = this.state;
// //     return inventoryItems
// //       .filter((item) => categories.indexOf(item.itemCategory) > -1)
// //       .map((item) => ({ key: item.key, text: item.text }));
// //   };

// //   handleInputChange = (
// //     newValue: string,
// //     field: string,
// //     index: number
// //   ): void => {
// //     this.setState((prevState) => {
// //       const assessments = [...prevState.assessments];
// //       assessments[index][field] = newValue;
// //       return { assessments };
// //     });
// //   };

// //   handleDropdownChange = (
// //     field: string,
// //     option: IDropdownOption,
// //     index: number
// //   ): void => {
// //     this.setState((prevState) => {
// //       const assessments = [...prevState.assessments];
// //       assessments[index][field] = option;
// //       return { assessments };
// //     });
// //   };

// //   addAssessment = () => {
// //     this.setState((prevState) => ({
// //       assessments: [
// //         ...prevState.assessments,
// //         {
// //           activity: "",
// //           humanResource: null,
// //           humanResourceQuantity: 0,
// //           machine: null,
// //           machineQuantity: 0,
// //           material: null,
// //           materialQuantity: 0,
// //         },
// //       ],
// //     }));
// //   };

// //   renderTable = (
// //     label: string,
// //     field: string,
// //     quantityField: string,
// //     options: IDropdownOption[],
// //     assessment: any,
// //     index: number
// //   ) => (
// //     <table>
// //       <tbody>
// //         <tr>
// //           <th>{label}</th>
// //           <th>Quantity</th>
// //         </tr>
// //         <tr>
// //           <td>
// //             <GenericDropdown
// //               label={label}
// //               options={options}
// //               selectedKey={assessment[field] ? assessment[field].key : null}
// //               onChanged={(option) =>
// //                 this.handleDropdownChange(field, option, index)
// //               }
// //               placeHolder={`Select a ${label.toLowerCase()}`}
// //             />
// //           </td>
// //           <td>
// //             <TextField
// //               value={assessment[quantityField].toString()}
// //               onChanged={(newValue: string) =>
// //                 this.handleInputChange(newValue, quantityField, index)
// //               }
// //             />
// //           </td>
// //         </tr>
// //       </tbody>
// //     </table>
// //   );

// //   render() {
// //     const { assessments } = this.state;

// //     return (
// //       <div>
// //         <h3>Technical Assessments</h3>
// //         {assessments.map((assessment, index) => (
// //           <div key={index}>
// //             <TextField
// //               label={`Activity ${index + 1}`}
// //               value={assessment.activity}
// //               onChanged={(newValue: string) =>
// //                 this.handleInputChange(newValue, "activity", index)
// //               }
// //             />

// //             {this.renderTable(
// //               "Human Resource",
// //               "humanResource",
// //               "humanResourceQuantity",
// //               this.filterInventoryItems(["نیروی انسانی"]),
// //               assessment,
// //               index
// //             )}

// //             {this.renderTable(
// //               "Machine",
// //               "machine",
// //               "machineQuantity",
// //               this.filterInventoryItems(["ماشین آلات"]),
// //               assessment,
// //               index
// //             )}

// //             {this.renderTable(
// //               "Material",
// //               "material",
// //               "materialQuantity",
// //               this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]),
// //               assessment,
// //               index
// //             )}

// //             <hr />
// //           </div>
// //         ))}
// //         <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
// //         <PrimaryButton text="Final Submit" onClick={this.handleFinalSubmit} />
// //       </div>
// //     );
// //   }
// // }

// // export default TechnicalAssessmentTable;
// import * as React from "react";
// import {
//   PrimaryButton,
//   TextField,
//   IDropdownOption,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import {
//   IAssessment,
//   ITechnicalAssessmentState,
// } from "./ITechnicalAssessmentState";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";

// import ProjectRequestService, {
//   IDropdownOptionWithCategory,
// } from "../services/ProjectRequestService";

// // interface ITechnicalAssessmentState {
// //   assessments: IAssessment[];
// //   inventoryItems: IDropdownOptionWithCategory[];
// // }

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
//     field: string,
//     index: number
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field] = newValue;
//       return { assessments };
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
//       assessments[index][field][partIndex] = option;
//       return { assessments };
//     });
//   };

//   addRow = (field: string, index: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field].push({ key: "", text: "" });
//       return { assessments };
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
//           activity: "",
//           humanResources: [],
//           machines: [],
//           materials: [],
//         },
//       ],
//     }));
//   };

//   handleSaveAssessments = () => {
//     const { assessments } = this.state;
//     const { requestId } = this.props;

//     this.projectRequestService
//       .saveAssessments(assessments, requestId)
//       .then(() => {
//         alert("Assessments saved successfully!");
//       })
//       .catch((error) => {
//         console.error("Error saving assessments", error);
//         alert(
//           "Error saving assessments. Please check the console for details."
//         );
//       });
//   };

//   render() {
//     const { assessments } = this.state;

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
//             <h4>Human Resources</h4>
//             {assessment.humanResources.map((hr, partIndex) => (
//               <div key={partIndex}>
//                 <GenericDropdown
//                   label={`Human Resource ${partIndex + 1}`}
//                   options={this.filterInventoryItems(["نیروی انسانی"])}
//                   selectedKey={hr.key}
//                   onChange={(option) =>
//                     this.handleDropdownChange(
//                       "humanResources",
//                       option!,
//                       index,
//                       partIndex
//                     )
//                   }
//                 />
//                 <PrimaryButton
//                   text="Remove"
//                   onClick={() =>
//                     this.removeRow("humanResources", index, partIndex)
//                   }
//                 />
//               </div>
//             ))}
//             <PrimaryButton
//               text="Add Human Resource"
//               onClick={() => this.addRow("humanResources", index)}
//             />

//             {/* Machines */}
//             <h4>Machines</h4>
//             {assessment.machines.map((machine, partIndex) => (
//               <div key={partIndex}>
//                 <GenericDropdown
//                   label={`Machine ${partIndex + 1}`}
//                   options={this.filterInventoryItems(["ماشین آلات"])}
//                   selectedKey={machine.key}
//                   onChange={(option) =>
//                     this.handleDropdownChange(
//                       "machines",
//                       option!,
//                       index,
//                       partIndex
//                     )
//                   }
//                 />
//                 <PrimaryButton
//                   text="Remove"
//                   onClick={() => this.removeRow("machines", index, partIndex)}
//                 />
//               </div>
//             ))}
//             <PrimaryButton
//               text="Add Machine"
//               onClick={() => this.addRow("machines", index)}
//             />

//             {/* Materials */}
//             <h4>Materials</h4>
//             {assessment.materials.map((material, partIndex) => (
//               <div key={partIndex}>
//                 <GenericDropdown
//                   label={`Material ${partIndex + 1}`}
//                   options={this.filterInventoryItems([
//                     "ابزار",
//                     "محصول",
//                     "مواد اولیه",
//                   ])}
//                   selectedKey={material.key}
//                   onChange={(option) =>
//                     this.handleDropdownChange(
//                       "materials",
//                       option!,
//                       index,
//                       partIndex
//                     )
//                   }
//                 />
//                 <PrimaryButton
//                   text="Remove"
//                   onClick={() => this.removeRow("materials", index, partIndex)}
//                 />
//               </div>
//             ))}
//             <PrimaryButton
//               text="Add Material"
//               onClick={() => this.addRow("materials", index)}
//             />

//             <hr />
//           </div>
//         ))}
//         <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
//         <PrimaryButton
//           text="Save Assessments"
//           onClick={this.handleSaveAssessments}
//         />
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
    field: string,
    index: number,
    partIndex?: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      if (partIndex !== undefined) {
        assessments[index][field][partIndex].quantity = newValue;
      } else {
        assessments[index][field] = newValue;
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
      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
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
    <table>
      <tbody>
        <tr>
          <th>{label}</th>
          <th>Quantity</th>
        </tr>
        {assessment[field].map((item: any, partIndex: number) => (
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
                  this.handleInputChange(newValue, field, index, partIndex)
                }
              />
              <PrimaryButton
                text="Remove"
                onClick={() => this.removeRow(field, index, partIndex)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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

            {/* Human Resources */}
            {this.renderTable(
              "Human Resource",
              "humanResources",
              this.filterInventoryItems(["نیروی انسانی"]),
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
              this.filterInventoryItems(["ماشین آلات"]),
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
              this.filterInventoryItems(["ابزار", "محصول", "مواد اولیه"]),
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

// import * as React from "react";
// import {
//   PrimaryButton,
//   TextField,
//   IDropdownOption,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// import ProjectRequestService, {
//   IDropdownOptionWithCategory,
// } from "../services/ProjectRequestService";

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
//     this.loadAssessments();
//     this.loadInventoryItems();
//   }

//   loadAssessments = () => {
//     this.props.projectRequestService
//       .getTechnicalAssessments(this.props.requestId)
//       .then((assessments) => {
//         this.setState({ assessments });
//       });
//   };

//   loadInventoryItems = () => {
//     this.projectRequestService.getInventoryItems().then((inventoryItems) => {
//       this.setState({ inventoryItems });
//     });
//   };

//   handleInputChange = (
//     newValue: string,
//     field: string,
//     index: number,
//     partIndex?: number,
//     subField?: string
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       if (partIndex !== undefined && subField) {
//         assessments[index][field][partIndex][subField] = newValue;
//       } else {
//         assessments[index][field] = newValue;
//       }
//       return { assessments };
//     });
//   };

//   // handleDropdownChange = (
//   //   field: string,
//   //   option: IDropdownOption,
//   //   index: number,
//   //   partIndex: number
//   // ): void => {
//   //   this.setState((prevState) => {
//   //     const assessments = [...prevState.assessments];
//   //     assessments[index][field][partIndex] = {
//   //       id: option.key,
//   //       name: option.text,
//   //     };
//   //     return { assessments };
//   //   });
//   // };

//   // addRow = (field: string, index: number) => {
//   //   this.setState((prevState) => {
//   //     const assessments = [...prevState.assessments];
//   //     assessments[index][field].push({ id: "", name: "" });
//   //     return { assessments };
//   //   });
//   // };

//   // removeRow = (field: string, index: number, partIndex: number) => {
//   //   this.setState((prevState) => {
//   //     const assessments = [...prevState.assessments];
//   //     assessments[index][field].splice(partIndex, 1);
//   //     return { assessments };
//   //   });
//   // };

//   // addAssessment = () => {
//   //   this.setState((prevState) => ({
//   //     assessments: [
//   //       ...prevState.assessments,
//   //       {
//   //         activity: "",
//   //         humanResources: [],
//   //         machines: [],
//   //         materials: [],
//   //       } as IAssessment,
//   //     ],
//   //   }));
//   // };
//   // Add a new item to the array
//   addRow = (field: string, index: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field].push({ key: "", text: "" });
//       return { assessments };
//     });
//   };

//   // Remove an item from the array
//   removeRow = (field: string, index: number, partIndex: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field].splice(partIndex, 1);
//       return { assessments };
//     });
//   };

//   // Add a new assessment block
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

//   // Handle activity text change
//   handleActivityChange = (newValue: string, index: number): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index].activity = newValue;
//       return { assessments };
//     });
//   };

//   // Handle dropdown change
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
//   // TechnicalAssessmentTable.tsx

//   // TechnicalAssessmentTable.tsx

//   filterInventoryItems = (categories: string[]): IDropdownOption[] => {
//     const { inventoryItems } = this.state;
//     return inventoryItems
//       .filter((item) => categories.indexOf(item.itemCategory) > -1)
//       .map((item) => ({ key: item.key, text: item.text }));
//   };

//   handleSaveAssessments = () => {
//     const { assessments } = this.state;
//     const { requestId } = this.props; // Ensure requestId is passed as a prop

//     this.projectRequestService
//       .saveAssessments(assessments, requestId)
//       .then(() => {
//         alert("Assessments saved successfully!");
//       })
//       .catch((error) => {
//         alert(
//           "Error saving assessments. Please check the console for details."
//         );
//       });
//   };

//   // render() {
//   //   const { assessments, inventoryItems } = this.state;

//   //   return (
//   //     <div>
//   //       <h3>Technical Assessments</h3>
//   //       {assessments.map((assessment, index) => (
//   //         <div key={index}>
//   //           <TextField
//   //             label={`Activity ${index + 1}`}
//   //             value={assessment.activity}
//   //             onChanged={(newValue: string) =>
//   //               this.handleActivityChange(newValue, index)
//   //             }
//   //           />
//   //           {/* Human Resources */}
//   //           <h4>Human Resources</h4>
//   //           {assessment.humanResources.map((hr, partIndex) => (
//   //             <div key={partIndex}>
//   //               <GenericDropdown
//   //                 label={`Human Resource ${partIndex + 1}`}
//   //                 options={inventoryItems}
//   //                 selectedKey={hr.key}
//   //                 onChange={(option) =>
//   //                   this.handleDropdownChange(
//   //                     "humanResources",
//   //                     option!,
//   //                     index,
//   //                     partIndex
//   //                   )
//   //                 }
//   //               />

//   //               <PrimaryButton
//   //                 text="Remove"
//   //                 onClick={() =>
//   //                   this.removeRow("humanResources", index, partIndex)
//   //                 }
//   //               />
//   //             </div>
//   //           ))}
//   //           <PrimaryButton
//   //             text="Add Human Resource"
//   //             onClick={() => this.addRow("humanResources", index)}
//   //           />

//   //           {/* Machines */}
//   //           <h4>Machines</h4>
//   //           {assessment.machines.map((machine, partIndex) => (
//   //             <div key={partIndex}>
//   //               <GenericDropdown
//   //                 label={`Machine ${partIndex + 1}`}
//   //                 options={inventoryItems}
//   //                 selectedKey={machine.key}
//   //                 onChange={(option) =>
//   //                   this.handleDropdownChange(
//   //                     "machines",
//   //                     option,
//   //                     index,
//   //                     partIndex
//   //                   )
//   //                 }
//   //               />
//   //               <PrimaryButton
//   //                 text="Remove"
//   //                 onClick={() => this.removeRow("machines", index, partIndex)}
//   //               />
//   //             </div>
//   //           ))}
//   //           <PrimaryButton
//   //             text="Add Machine"
//   //             onClick={() => this.addRow("machines", index)}
//   //           />

//   //           {/* Materials */}
//   //           <h4>Materials</h4>
//   //           {assessment.materials.map((material, partIndex) => (
//   //             <div key={partIndex}>
//   //               <GenericDropdown
//   //                 label={`Material ${partIndex + 1}`}
//   //                 options={inventoryItems}
//   //                 selectedKey={material.key}
//   //                 onChange={(option) =>
//   //                   this.handleDropdownChange(
//   //                     "materials",
//   //                     option,
//   //                     index,
//   //                     partIndex
//   //                   )
//   //                 }
//   //               />
//   //               <PrimaryButton
//   //                 text="Remove"
//   //                 onClick={() => this.removeRow("materials", index, partIndex)}
//   //               />
//   //             </div>
//   //           ))}
//   //           <PrimaryButton
//   //             text="Add Material"
//   //             onClick={() => this.addRow("materials", index)}
//   //           />

//   //           <hr />
//   //         </div>
//   //       ))}
//   //       <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
//   //       <PrimaryButton
//   //         text="Save Assessments"
//   //         onClick={this.handleSaveAssessments}
//   //       />
//   //     </div>
//   //   );
//   // }
//   // TechnicalAssessmentTable.tsx

//   render() {
//     const { assessments } = this.state;

//     return (
//       <div>
//         <h3>Technical Assessments</h3>
//         {assessments.map((assessment, index) => (
//           <div key={index}>
//             {/* Activity Field */}
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

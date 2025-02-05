// // // import * as React from "react";
// // // import {
// // //   DefaultButton,
// // //   PrimaryButton,
// // //   TextField,
// // //   IDropdownOption,
// // // } from "office-ui-fabric-react";
// // // import CustomDropdown from "./CustomDropdown";
// // // import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// // // import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// // // import ProjectRequestService from "../services/ProjectRequestService";

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
// // //       newAssessment: {
// // //         title: "",
// // //         department: "",
// // //         manHours: 0,
// // //         materials: "",
// // //         machinery: "",
// // //         dependencies: "",
// // //         specialConsiderations: "",
// // //       },
// // //       departmentOptions: [],
// // //     };
// // //   }

// // //   componentDidMount() {
// // //     this.loadAssessments();
// // //     this.loadDepartmentOptions();
// // //   }

// // //   loadAssessments() {
// // //     this.props.projectRequestService
// // //       .getTechnicalAssessments(this.props.requestId)
// // //       .then((assessments) => {
// // //         this.setState({ assessments });
// // //       });
// // //   }

// // //   loadDepartmentOptions() {
// // //     this.projectRequestService
// // //       .getDepartmentOptions()
// // //       .then((departmentOptions) => {
// // //         this.setState({ departmentOptions });
// // //       });
// // //   }

// // //   handleInputChange = (
// // //     event: React.ChangeEvent<HTMLInputElement>,
// // //     field: string,
// // //     index: number
// // //   ): void => {
// // //     const { value } = event.target;
// // //     this.setState((prevState) => {
// // //       const assessments = [...prevState.assessments];
// // //       assessments[index] = {
// // //         ...assessments[index],
// // //         [field]: field === "manHours" ? parseFloat(value) || 0 : value,
// // //       };
// // //       return { assessments };
// // //     });
// // //   };

// // //   handleDropdownChange = (
// // //     field: string,
// // //     option?: IDropdownOption,
// // //     index?: number
// // //   ): void => {
// // //     this.setState((prevState) => {
// // //       const assessments = [...prevState.assessments];
// // //       assessments[index] = {
// // //         ...assessments[index],
// // //         [field]: option ? option.key.toString() : "",
// // //       };
// // //       return { assessments };
// // //     });
// // //   };

// // //   addRow = () => {
// // //     this.setState((prevState) => ({
// // //       assessments: [
// // //         ...prevState.assessments,
// // //         {
// // //           title: "",
// // //           department: "",
// // //           manHours: 0,
// // //           materials: "",
// // //           machinery: "",
// // //           dependencies: "",
// // //           specialConsiderations: "",
// // //         },
// // //       ],
// // //     }));
// // //   };

// // //   removeRow = (index: number) => {
// // //     this.setState((prevState) => ({
// // //       assessments: prevState.assessments.filter((_, i) => i !== index),
// // //     }));
// // //   };

// // //   // resetForm = () => {
// // //   //   this.setState({
// // //   //     assessments: [],
// // //   //     newAssessment: {
// // //   //       title: "",
// // //   //       department: "",
// // //   //       manHours: 0,
// // //   //       materials: "",
// // //   //       machinery: "",
// // //   //       dependencies: "",
// // //   //       specialConsiderations: "",
// // //   //     },
// // //   //     departmentOptions: [],
// // //   //   });
// // //   // };

// // //   // handleSubmit = (): void => {
// // //   //   console.log("Submit Technical Assessments:", this.state.assessments);
// // //   //   // Handle form submission logic here
// // //   // };

// // //   render() {
// // //     const { assessments, departmentOptions } = this.state;

// // //     return (
// // //       <div>
// // //         <h3>Technical Assessments</h3>
// // //         <table>
// // //           <thead>
// // //             <tr>
// // //               <th>Title</th>
// // //               <th>Department</th>
// // //               <th>Man Hours</th>
// // //               <th>Materials</th>
// // //               <th>Machinery</th>
// // //               <th>Dependencies</th>
// // //               <th>Special Considerations</th>
// // //               <th>Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {assessments.map((assessment, index) => (
// // //               <tr key={index}>
// // //                 <td>
// // //                   <TextField
// // //                     value={assessment.title}
// // //                     onChanged={(newValue: string) =>
// // //                       this.handleInputChange(
// // //                         {
// // //                           target: { value: newValue },
// // //                         } as React.ChangeEvent<HTMLInputElement>,
// // //                         "title",
// // //                         index
// // //                       )
// // //                     }
// // //                   />
// // //                 </td>
// // //                 <td>
// // //                   <CustomDropdown
// // //                     label="Department"
// // //                     options={departmentOptions}
// // //                     selectedKey={assessment.department}
// // //                     onChange={(option) =>
// // //                       this.handleDropdownChange("department", option, index)
// // //                     }
// // //                   />
// // //                 </td>
// // //                 <td>
// // //                   <TextField
// // //                     value={assessment.manHours.toString()}
// // //                     onChanged={(newValue: string) =>
// // //                       this.handleInputChange(
// // //                         {
// // //                           target: { value: newValue },
// // //                         } as React.ChangeEvent<HTMLInputElement>,
// // //                         "manHours",
// // //                         index
// // //                       )
// // //                     }
// // //                     type="number"
// // //                   />
// // //                 </td>
// // //                 <td>
// // //                   <TextField
// // //                     value={assessment.materials}
// // //                     onChanged={(newValue: string) =>
// // //                       this.handleInputChange(
// // //                         {
// // //                           target: { value: newValue },
// // //                         } as React.ChangeEvent<HTMLInputElement>,
// // //                         "materials",
// // //                         index
// // //                       )
// // //                     }
// // //                   />
// // //                 </td>
// // //                 <td>
// // //                   <TextField
// // //                     value={assessment.specialConsiderations}
// // //                     onChanged={(newValue: string) =>
// // //                       this.handleInputChange(
// // //                         {
// // //                           target: { value: newValue },
// // //                         } as React.ChangeEvent<HTMLInputElement>,
// // //                         "specialConsiderations",
// // //                         index
// // //                       )
// // //                     }
// // //                   />
// // //                 </td>
// // //                 <td>
// // //                   <PrimaryButton
// // //                     text="Remove"
// // //                     onClick={() => this.removeRow(index)}
// // //                   />
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //         <PrimaryButton text="Add Row" onClick={this.addRow} />
// // //         {/* <PrimaryButton text="Submit" onClick={this.handleSubmit} />
// // //         <PrimaryButton text="Cancel" onClick={this.resetForm} /> */}
// // //       </div>
// // //     );
// // //   }
// // // }

// // // export default TechnicalAssessmentTable;
// // import * as React from "react";
// // import {
// //   DefaultButton,
// //   PrimaryButton,
// //   TextField,
// //   IDropdownOption,
// // } from "office-ui-fabric-react";
// // import GenericDropdown from "./GenericDropdown";
// // import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// // import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
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
// //       newAssessment: {
// //         title: "",
// //         department: "",
// //         manHours: 0,
// //         materials: "",
// //         machinery: "",
// //         dependencies: "",
// //         specialConsiderations: "",
// //       },
// //       departmentOptions: [],
// //     };
// //   }

// //   componentDidMount() {
// //     this.loadAssessments();
// //     this.loadDepartmentOptions();
// //   }

// //   loadAssessments() {
// //     this.props.projectRequestService
// //       .getTechnicalAssessments(this.props.requestId)
// //       .then((assessments) => {
// //         this.setState({ assessments });
// //       });
// //   }

// //   loadDepartmentOptions() {
// //     this.projectRequestService
// //       .getDepartmentOptions()
// //       .then((departmentOptions) => {
// //         this.setState({ departmentOptions });
// //       });
// //   }

// //   handleInputChange = (
// //     event: React.ChangeEvent<HTMLInputElement>,
// //     field: string,
// //     index: number
// //   ): void => {
// //     const { value } = event.target;
// //     this.setState((prevState) => {
// //       const assessments = [...prevState.assessments];
// //       assessments[index] = {
// //         ...assessments[index],
// //         [field]: field === "manHours" ? parseFloat(value) || 0 : value,
// //       };
// //       return { assessments };
// //     });
// //   };

// //   handleDropdownChange = (
// //     field: string,
// //     option?: IDropdownOption,
// //     index?: number
// //   ): void => {
// //     this.setState((prevState) => {
// //       const assessments = [...prevState.assessments];
// //       if (index !== undefined) {
// //         assessments[index] = {
// //           ...assessments[index],
// //           [field]: option ? option.key.toString() : "",
// //         };
// //       }
// //       return { assessments };
// //     });
// //   };

// //   addRow = () => {
// //     this.setState((prevState) => ({
// //       assessments: [
// //         ...prevState.assessments,
// //         {
// //           title: "",
// //           department: "",
// //           manHours: 0,
// //           materials: "",
// //           machinery: "",
// //           dependencies: "",
// //           specialConsiderations: "",
// //         },
// //       ],
// //     }));
// //   };

// //   removeRow = (index: number) => {
// //     this.setState((prevState) => ({
// //       assessments: prevState.assessments.filter((_, i) => i !== index),
// //     }));
// //   };

// //   // resetForm = () => {
// //   //   this.setState({
// //   //     assessments: [],
// //   //     newAssessment: {
// //   //       title: "",
// //   //       department: "",
// //   //       manHours: 0,
// //   //       materials: "",
// //   //       machinery: "",
// //   //       dependencies: "",
// //   //       specialConsiderations: "",
// //   //     },
// //   //     departmentOptions: [],
// //   //   });
// //   // };

// //   // handleSubmit = (): void => {
// //   //   console.log("Submit Technical Assessments:", this.state.assessments);
// //   //   // Handle form submission logic here
// //   // };

// //   render() {
// //     const { assessments, departmentOptions } = this.state;

// //     return (
// //       <div>
// //         <h3>Technical Assessments</h3>
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Title</th>
// //               <th>Department</th>
// //               <th>Man Hours</th>
// //               <th>Materials</th>
// //               <th>Machinery</th>
// //               <th>Dependencies</th>
// //               <th>Special Considerations</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {assessments.map((assessment, index) => (
// //               <tr key={index}>
// //                 <td>
// //                   <TextField
// //                     value={assessment.title}
// //                     onChanged={(newValue: string) =>
// //                       this.handleInputChange(
// //                         {
// //                           target: { value: newValue },
// //                         } as React.ChangeEvent<HTMLInputElement>,
// //                         "title",
// //                         index
// //                       )
// //                     }
// //                   />
// //                 </td>
// //                 <td>
// //                   <GenericDropdown
// //                     label="Department"
// //                     options={departmentOptions}
// //                     selectedKey={assessment.department}
// //                     onChange={(option) =>
// //                       this.handleDropdownChange("department", option, index)
// //                     }
// //                   />
// //                 </td>
// //                 <td>
// //                   <TextField
// //                     value={assessment.manHours.toString()}
// //                     onChanged={(newValue: string) =>
// //                       this.handleInputChange(
// //                         {
// //                           target: { value: newValue },
// //                         } as React.ChangeEvent<HTMLInputElement>,
// //                         "manHours",
// //                         index
// //                       )
// //                     }
// //                     type="number"
// //                   />
// //                 </td>
// //                 <td>
// //                   <TextField
// //                     value={assessment.materials}
// //                     onChanged={(newValue: string) =>
// //                       this.handleInputChange(
// //                         {
// //                           target: { value: newValue },
// //                         } as React.ChangeEvent<HTMLInputElement>,
// //                         "materials",
// //                         index
// //                       )
// //                     }
// //                   />
// //                 </td>
// //                 <td>
// //                   <TextField
// //                     value={assessment.specialConsiderations}
// //                     onChanged={(newValue: string) =>
// //                       this.handleInputChange(
// //                         {
// //                           target: { value: newValue },
// //                         } as React.ChangeEvent<HTMLInputElement>,
// //                         "specialConsiderations",
// //                         index
// //                       )
// //                     }
// //                   />
// //                 </td>
// //                 <td>
// //                   <PrimaryButton
// //                     text="Remove"
// //                     onClick={() => this.removeRow(index)}
// //                   />
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         <PrimaryButton text="Add Row" onClick={this.addRow} />
// //         {/* <PrimaryButton text="Submit" onClick={this.handleSubmit} /> */}
// //         {/* <PrimaryButton text="Cancel" onClick={this.resetForm} /> */}
// //       </div>
// //     );
// //   }
// // }

// // export default TechnicalAssessmentTable;
// import * as React from "react";
// import {
//   DefaultButton,
//   PrimaryButton,
//   TextField,
// } from "office-ui-fabric-react";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
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
//     };
//   }

//   componentDidMount() {
//     this.loadAssessments();
//   }

//   loadAssessments() {
//     this.props.projectRequestService
//       .getTechnicalAssessments(this.props.requestId)
//       .then((assessments) => {
//         this.setState({ assessments });
//       });
//   }

//   handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     field: string,
//     index: number,
//     partIndex?: number,
//     subField?: string
//   ): void => {
//     const { value } = event.target;
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       if (partIndex !== undefined && subField) {
//         (assessments[index] as any)[field][partIndex][subField] = value;
//       } else {
//         (assessments[index] as any)[field] = value;
//       }
//       return { assessments };
//     });
//   };

//   addRow = (field: string, index: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       (assessments[index] as any)[field].push({ name: "" });
//       return { assessments };
//     });
//   };

//   removeRow = (field: string, index: number, partIndex: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       (assessments[index] as any)[field] = (assessments[index] as any)[
//         field
//       ].filter((_: any, i: number) => i !== partIndex);
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
//                 this.handleInputChange(
//                   {
//                     target: { value: newValue },
//                   } as React.ChangeEvent<HTMLInputElement>,
//                   "activity",
//                   index
//                 )
//               }
//             />
//             <h4>Human Resources</h4>
//             {assessment.humanResources.map((hr, partIndex) => (
//               <div key={partIndex}>
//                 <TextField
//                   placeholder={`Human Resource ${partIndex + 1}`}
//                   value={hr.name}
//                   onChanged={(newValue: string) =>
//                     this.handleInputChange(
//                       {
//                         target: { value: newValue },
//                       } as React.ChangeEvent<HTMLInputElement>,
//                       "humanResources",
//                       index,
//                       partIndex,
//                       "name"
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
//             <h4>Machines</h4>
//             {assessment.machines.map((machine, partIndex) => (
//               <div key={partIndex}>
//                 <TextField
//                   placeholder={`Machine ${partIndex + 1}`}
//                   value={machine.name}
//                   onChanged={(newValue: string) =>
//                     this.handleInputChange(
//                       {
//                         target: { value: newValue },
//                       } as React.ChangeEvent<HTMLInputElement>,
//                       "machines",
//                       index,
//                       partIndex,
//                       "name"
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
//             <h4>Materials</h4>
//             {assessment.materials.map((material, partIndex) => (
//               <div key={partIndex}>
//                 <TextField
//                   placeholder={`Material ${partIndex + 1}`}
//                   value={material.name}
//                   onChanged={(newValue: string) =>
//                     this.handleInputChange(
//                       {
//                         target: { value: newValue },
//                       } as React.ChangeEvent<HTMLInputElement>,
//                       "materials",
//                       index,
//                       partIndex,
//                       "name"
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
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import ProjectRequestService from "../services/ProjectRequestService";

interface IAssessment {
  activity: string;
  humanResources: Array<{ id: string | number; name: string }>;
  machines: Array<{ id: string | number; name: string }>;
  materials: Array<{ id: string | number; name: string }>;
}

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
    this.loadAssessments();
    this.loadInventoryItems();
  }

  loadAssessments() {
    this.props.projectRequestService
      .getTechnicalAssessments(this.props.requestId)
      .then((assessments) => {
        this.setState({ assessments });
      });
  }

  loadInventoryItems() {
    this.projectRequestService.getInventoryItems().then((inventoryItems) => {
      this.setState({ inventoryItems });
    });
  }

  handleInputChange = (
    newValue: string,
    field: string,
    index: number,
    partIndex?: number,
    subField?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      if (partIndex !== undefined && subField) {
        assessments[index][field][partIndex][subField] = newValue;
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
      assessments[index][field][partIndex] = {
        id: option.key,
        name: option.text,
      };
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].push({ id: "", name: "" });
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
        } as IAssessment,
      ],
    }));
  };

  render() {
    const { assessments, inventoryItems } = this.state;

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
            <h4>Human Resources</h4>
            {assessment.humanResources.map((hr, partIndex) => (
              <div key={partIndex}>
                <TextField
                  placeholder={`Human Resource ${partIndex + 1}`}
                  value={hr.name}
                  onChanged={(newValue: string) =>
                    this.handleInputChange(
                      newValue,
                      "humanResources",
                      index,
                      partIndex,
                      "name"
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

            <h4>Machines</h4>
            {assessment.machines.map((machine, partIndex) => (
              <div key={partIndex}>
                <TextField
                  placeholder={`Machine ${partIndex + 1}`}
                  value={machine.name}
                  onChanged={(newValue: string) =>
                    this.handleInputChange(
                      newValue,
                      "machines",
                      index,
                      partIndex,
                      "name"
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

            <h4>Materials</h4>
            {assessment.materials.map((materials, partIndex) => (
              <div key={partIndex}>
                <TextField
                  placeholder={`Material ${partIndex + 1}`}
                  value={materials.name}
                  onChanged={(newValue: string) =>
                    this.handleInputChange(
                      newValue,
                      "materials",
                      index,
                      partIndex,
                      "name"
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
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

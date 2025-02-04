// // TechnicalAssessmentTable.tsx
// import * as React from "react";
// import { DefaultButton, PrimaryButton, TextField, IDropdownOption } from "office-ui-fabric-react";
// import CustomDropdown from "./CustomDropdown";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// import ProjectRequestService from "../services/ProjectRequestService";

// class TechnicalAssessmentTable extends React.Component<ITechnicalAssessmentProps, ITechnicalAssessmentState> {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: ITechnicalAssessmentProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService();
//     this.state = {
//       assessments: [],
//       newAssessment: {
//         title: "",
//         department: "",
//         manHours: 0,
//         materials: "",
//         machinery: "",
//         dependencies: "",
//         specialConsiderations: ""
//       },
//       departmentOptions: []
//     };
//   }

//   componentDidMount() {
//     this.loadAssessments();
//     this.loadDepartmentOptions();
//   }

//   loadAssessments() {
//     this.props.projectRequestService.getTechnicalAssessments(this.props.requestId)
//       .then((assessments) => {
//         this.setState({ assessments });
//       });
//   }

//   loadDepartmentOptions() {
//     this.projectRequestService.getDepartmentOptions().then((departmentOptions) => {
//       this.setState({ departmentOptions });
//     });
//   }

//   handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string): void => {
//     const { value } = event.target;
//     this.setState((prevState) => ({
//       newAssessment: {
//         ...prevState.newAssessment,
//         [field]: field === "manHours" ? parseFloat(value) || 0 : value
//       }
//     }));
//   };

//   handleDropdownChange = (field: string, option?: IDropdownOption): void => {
//     this.setState((prevState) => ({
//       newAssessment: {
//         ...prevState.newAssessment,
//         [field]: option ? option.key.toString() : ""
//       }
//     }));
//   };

//   handleAddAssessment = (): void => {
//     const { assessments, newAssessment } = this.state;

//     this.setState({
//       assessments: [...assessments, newAssessment],
//       newAssessment: {
//         title: "",
//         department: "",
//         manHours: 0,
//         materials: "",
//         machinery: "",
//         dependencies: "",
//         specialConsiderations: ""
//       }
//     });
//   };

//   render() {
//     const { assessments, newAssessment, departmentOptions } = this.state;

//     return (
//       <div>
//         <h3>Technical Assessments</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Department</th>
//               <th>Man Hours</th>
//               <th>Materials</th>
//               <th>Machinery</th>
//               <th>Dependencies</th>
//               <th>Special Considerations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assessments.map((assessment, index) => (
//               <tr key={index}>
//                 <td>{assessment.title}</td>
//                 <td>{assessment.department}</td>
//                 <td>{assessment.manHours}</td>
//                 <td>{assessment.materials}</td>
//                 <td>{assessment.machinery}</td>
//                 <td>{assessment.dependencies}</td>
//                 <td>{assessment.specialConsiderations}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <h4>Add New Assessment</h4>
//         <TextField
//           label="Title"
//           value={newAssessment.title}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, title: newValue || "" } })}
//         />
//         <CustomDropdown
//           label="Department"
//           options={departmentOptions}
//           selectedKey={newAssessment.department}
//           onChange={(option) => this.handleDropdownChange("department", option)}
//         />
//         <TextField
//           label="Man Hours"
//           value={newAssessment.manHours.toString()}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, manHours: parseInt(newValue) || 0 } })}
//           type="number"
//         />
//         <TextField
//           label="Materials"
//           value={newAssessment.materials}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, materials: newValue || "" } })}
//         />
//         <TextField
//           label="Machinery"
//           value={newAssessment.machinery}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, machinery: newValue || "" } })}
//         />
//         <TextField
//           label="Dependencies"
//           value={newAssessment.dependencies}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, dependencies: newValue || "" } })}
//         />
//         <TextField
//           label="Special Considerations"
//           value={newAssessment.specialConsiderations}
//           onChanged={(newValue: string) => this.setState({ newAssessment: { ...newAssessment, specialConsiderations: newValue || "" } })}
//         />
//         <PrimaryButton text="Add Assessment" onClick={this.handleAddAssessment} />
//       </div>
//     );
//   }
// }

// export default TechnicalAssessmentTable;
import * as React from "react";
import { DefaultButton, PrimaryButton, TextField, IDropdownOption } from "office-ui-fabric-react";
import CustomDropdown from "./CustomDropdown";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import ProjectRequestService from "../services/ProjectRequestService";

class TechnicalAssessmentTable extends React.Component<ITechnicalAssessmentProps, ITechnicalAssessmentState> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService();
    this.state = {
      assessments: [],
      newAssessment: {
        title: "",
        department: "",
        manHours: 0,
        materials: "",
        machinery: "",
        dependencies: "",
        specialConsiderations: ""
      },
      departmentOptions: []
    };
  }

  componentDidMount() {
    this.loadAssessments();
    this.loadDepartmentOptions();
  }

  loadAssessments() {
    this.props.projectRequestService.getTechnicalAssessments(this.props.requestId)
      .then((assessments) => {
        this.setState({ assessments });
      });
  }

  loadDepartmentOptions() {
    this.projectRequestService.getDepartmentOptions().then((departmentOptions) => {
      this.setState({ departmentOptions });
    });
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string, index: number): void => {
    const { value } = event.target;
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index] = {
        ...assessments[index],
        [field]: field === "manHours" ? parseFloat(value) || 0 : value
      };
      return { assessments };
    });
  };

  handleDropdownChange = (field: string, option?: IDropdownOption, index?: number): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index] = {
        ...assessments[index],
        [field]: option ? option.key.toString() : ""
      };
      return { assessments };
    });
  };

  addRow = () => {
    this.setState((prevState) => ({
      assessments: [...prevState.assessments, {
        title: "",
        department: "",
        manHours: 0,
        materials: "",
        machinery: "",
        dependencies: "",
        specialConsiderations: ""
      }]
    }));
  };

  removeRow = (index: number) => {
    this.setState((prevState) => ({
      assessments: prevState.assessments.filter((_, i) => i !== index)
    }));
  };

  resetForm = () => {
    this.setState({
      assessments: [],
      newAssessment: {
        title: "",
        department: "",
        manHours: 0,
        materials: "",
        machinery: "",
        dependencies: "",
        specialConsiderations: ""
      },
      departmentOptions: []
    });
  };

  handleSubmit = (): void => {
    console.log("Submit Technical Assessments:", this.state.assessments);
    // Handle form submission logic here
  };

  render() {
    const { assessments, departmentOptions } = this.state;

    return (
      <div>
        <h3>Technical Assessments</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Man Hours</th>
              <th>Materials</th>
              <th>Machinery</th>
              <th>Dependencies</th>
              <th>Special Considerations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr key={index}>
                <td>
                  <TextField
                    value={assessment.title}
                    onChanged={(newValue: string) => this.handleInputChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>, "title", index)}
                  />
                </td>
                <td>
                  <CustomDropdown
                    label="Department"
                    options={departmentOptions}
                    selectedKey={assessment.department}
                    onChange={(option) => this.handleDropdownChange("department", option, index)}
                  />
                </td>
                <td>
                  <TextField
                    value={assessment.manHours.toString()}
                    onChanged={(newValue: string) => this.handleInputChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>, "manHours", index)}
                    type="number"
                  />
                </td>
                <td>
                  <TextField
                    value={assessment.materials}
                    onChanged={(newValue: string) => this.handleInputChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>, "materials", index)}
                  />
                </td>
                <td>
                  <TextField

                    value={assessment.specialConsiderations}
                    onChanged={(newValue: string) => this.handleInputChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>, "specialConsiderations", index)}
                  />
                </td>
                <td>
                  <PrimaryButton text="Remove" onClick={() => this.removeRow(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PrimaryButton text="Add Row" onClick={this.addRow} />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
        <PrimaryButton text="Cancel" onClick={this.resetForm} />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

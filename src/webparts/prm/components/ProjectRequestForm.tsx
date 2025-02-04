import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import CustomerDropdown from "./CustomerDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import { IDropdownOption } from "office-ui-fabric-react";
import * as moment from "moment";
import "moment-jalaali";

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
    const newValue = name === "estimatedDuration" || name === "estimatedCost"
      ? parseFloat(value) || 0
      : value;

    this.setState({ [name]: newValue } as unknown as Pick<IProjectRequestFormState, keyof IProjectRequestFormState>);
  };


  handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    this.setState({
      selectedCustomer: option ? option.key.toString() : undefined,
    });
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

    // Convert the requestDate to Gregorian format
    const formattedRequestDate = moment(requestDate, "jYYYY-jMM-jDD").format(
      "YYYY-MM-DDTHH:mm:ss[Z]"
    ); // Format date as ISO string
    // const formattedRequestDate = moment(
    //   requestDate,
    //   "jYYYY-jMM-jDD"
    // ).toISOString();

    const requestData = {
      Title: requestTitle,
      CustomerId: parseInt(selectedCustomer, 10), // Ensure CustomerId is an integer
      RequestDate: formattedRequestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus, // Use the correct field name
    };
    // const requestData = {
    //   Title: requestTitle.trim(), // Ensure text field is not empty
    //   CustomerId: selectedCustomer ? parseInt(selectedCustomer, 10) : null, // Ensure lookup is valid
    //   RequestDate: formattedRequestDate,
    //   EstimatedDuration: isNaN(estimatedDuration) ? 0 : estimatedDuration, // Ensure numeric
    //   EstimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost, // Ensure numeric
    //   RequestStatus: RequestStatus.trim(),
    // };

    // Log the requestData object for debugging
    console.log("Request Data:", requestData);

    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response.data) {
          alert("Request submitted successfully!");
          this.resetForm();
        } else {
          alert("Error submitting request");
        }
      })
      .catch((error) => {
        console.error("Error details:", error);
        alert(
          "There was an error submitting your request. Please check the console for details."
        );
      });
  };


// // TEST 1
// handleSubmit = (): void => {
//   const { requestTitle, RequestStatus } = this.state;

//   const requestData = {
//     Title: requestTitle,
//     RequestStatus: RequestStatus,
//   };

//   console.log("Simplified Request Data:", requestData); // Log for debugging

//   this.projectRequestService
//     .createProjectRequest(requestData)
//     .then((response) => {
//       if (response.data) {
//         alert("Request submitted successfully!");
//         this.resetForm();
//       } else {
//         alert("Error submitting request");
//       }
//     })
//     .catch((error) => {
//       console.error("Error details:", error);
//       alert(
//         "There was an error submitting your request. Please check the console for details."
//       );
//     });
// };


  resetForm = (): void => {
    this.setState({
      requestTitle: "",
      selectedCustomer: undefined,
      requestDate: moment().format("YYYY-MM-DD"), // Reset to default date
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
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
    console.log("Event Fired! New Value:", newValue);
    this.setState({ requestTitle: newValue || "" });
  }}
/>
        <CustomerDropdown
          customerOptions={customerOptions}
          selectedCustomer={selectedCustomer}
          onChange={this.handleDropdownChange}
        />
        <TextField
          label="Request Date"
          name="requestDate"
          value={this.state.requestDate}
          onChanged={(newValue: string) => {
            console.log("Event Fired! New Value:", newValue);
            this.setState({ requestDate: newValue || "" });
          }}
        />
<TextField
  label="Estimated Duration (days)"
  value={this.state.estimatedDuration.toString()} // Ensure it’s a string
  onChanged={(newValue: string) => this.setState({ estimatedDuration: parseInt(newValue) || 0 })}
  type="number"
/>


<TextField
  label="Estimated Cost"
  name="estimatedCost"
  value={this.state.estimatedCost.toString()} // Convert number to string for display
  onChanged={(newValue: string) => this.setState({ estimatedCost: parseInt(newValue) || 0 })}
  type="number"
/>

        {/* <TextField
          label="Estimated Duration (days)"
          name="estimatedDuration"
          value={this.state.estimatedDuration.toString()}
          onChanged={(newValue: string) => {
            console.log("Event Fired! New Value:", newValue);
            this.setState({ estimatedDuration: newValue || "" });
          }}
          type="number"
        />
        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={this.state.estimatedCost.toString()}
          onChanged={(newValue: string) => {
            console.log("Event Fired! New Value:", newValue);
            this.setState({ estimatedCost: newValue || "" });
          }}
          type="number"
        /> */}
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default ProjectRequestForm;
// import * as React from 'react';
// import { TextField, PrimaryButton } from 'office-ui-fabric-react';
// import CustomerDropdown from './CustomerDropdown';
// import { IProjectRequestFormProps } from './IProjectRequestFormProps';
// import { IProjectRequestFormState } from './IProjectRequestFormState';
// import ProjectRequestService from '../services/ProjectRequestService';
// import * as moment from 'moment';
// import 'moment-jalaali';
// import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

// class ProjectRequestForm extends React.Component<IProjectRequestFormProps, IProjectRequestFormState> {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IProjectRequestFormProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService();
//     this.state = {
//       customerOptions: [],
//       selectedCustomer: undefined,
//       requestTitle: '',
//       requestDate: moment().format('YYYY-MM-DD'), // Set default date to today
//       estimatedDuration: 0,
//       estimatedCost: 0,
//       RequestStatus: 'New' // Default status
//     };
//   }

//   componentDidMount() {
//     this.loadCustomerOptions();
//   }

//   loadCustomerOptions() {
//     this.projectRequestService.getCustomerOptions()
//       .then(customerOptions => {
//         this.setState({ customerOptions });
//       });
//   }

//   handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = event.target;
//     this.setState({ [name]: value } as any);
//   };

//   handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
//     this.setState({ selectedCustomer: option ? option.key.toString() : undefined });
//   };

//   handleSubmit = (): void => {
//     const { requestTitle, selectedCustomer, RequestStatus } = this.state;

//     const requestData = {
//       Title: requestTitle,
//       RequestStatus: RequestStatus
//     };

//     console.log("Simplified Request Data:", requestData); // Log for debugging

//     this.projectRequestService
//       .createProjectRequest(requestData)
//       .then((response) => {
//         if (response.data) {
//           alert("Request submitted successfully!");
//           this.resetForm();
//         } else {
//           alert("Error submitting request");
//         }
//       })
//       .catch((error) => {
//         console.error("Error details:", error);
//         alert(
//           "There was an error submitting your request. Please check the console for details."
//         );
//       });
//   };

//   resetForm = (): void => {
//     this.setState({
//       requestTitle: '',
//       selectedCustomer: undefined,
//       requestDate: moment().format('YYYY-MM-DD'), // Reset to default date
//       estimatedDuration: 0,
//       estimatedCost: 0,
//       RequestStatus: 'New' // Reset to default status
//     });
//   };

//   render() {
//     const { customerOptions, selectedCustomer, requestTitle, RequestStatus } = this.state;

//     return (
//       <div>
//         <TextField
//           label="Request Title"
//           name="requestTitle"
//           value={requestTitle}
//           onChange={this.handleInputChange}
//         />
//         <CustomerDropdown
//           customerOptions={customerOptions}
//           selectedCustomer={selectedCustomer}
//           onChange={this.handleDropdownChange}
//         />
//         <TextField
//           label="Request Status"
//           name="RequestStatus"
//           value={RequestStatus}
//           onChange={this.handleInputChange}
//         />
//         <PrimaryButton text="Submit" onClick={this.handleSubmit} />
//       </div>
//     );
//   }
// }

// // export default ProjectRequestForm;
// import * as React from 'react';
// import { PrimaryButton } from 'office-ui-fabric-react';
// import { TextField } from "office-ui-fabric-react/lib/TextField";

// import { IProjectRequestFormProps } from './IProjectRequestFormProps';
// import { IProjectRequestFormState } from './IProjectRequestFormState';

// import ProjectRequestService from '../services/ProjectRequestService';

// class ProjectRequestForm extends React.Component<IProjectRequestFormProps, IProjectRequestFormState> {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IProjectRequestFormProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService();
//     this.state = {
//       requestTitle: '',
//       RequestStatus: 'New', // Default status
//       customerOptions: [],
//       selectedCustomer: undefined
//     };
//     this.handleTitleChange = this.handleTitleChange.bind(this);

//     console.log("Initial State:", this.state); // Log the initial state
//   }
//   componentDidMount() {
//     console.log("ProjectRequestForm MOUNTED!");
//   }

//   componentWillUnmount() {
//     console.log("ProjectRequestForm UNMOUNTED!");
//   }



//   loadCustomerOptions() {
//     this.projectRequestService.getCustomerOptions()
//       .then(customerOptions => {
//         this.setState({ customerOptions });
//       });
//   }

//   // handleTitleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//   //   const newValue = event.target.value;
//   //   console.log(`Changing Title to ${newValue}`); // Log the title change
//   //   this.setState(prevState => ({
//   //     ...prevState,
//   //     requestTitle: newValue
//   //   }), () => {
//   //     console.log(`Updated Title in state: ${this.state.requestTitle}`);
//   //   });
//   // };
//   handleTitleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const newValue = event.target.value; // Store value before state update
//     console.log(`Changing Title to ${newValue}`); // Log before state change

//     this.setState({ requestTitle: newValue }, () => {
//       console.log(`Updated Title in state: ${this.state.requestTitle}`); // Verify updated state
//     });
//   };

//   handleSubmit = (): void => {
//     const { requestTitle, RequestStatus } = this.state;

//     const requestData = {
//       Title: requestTitle,
//       RequestStatus: RequestStatus
//     };

//     console.log("Simplified Request Data:", requestData); // Log for debugging

//     this.projectRequestService
//       .createProjectRequest(requestData)
//       .then((response) => {
//         if (response.data) {
//           console.log("Request submitted successfully!");
//         } else {
//           console.log("Error submitting request");
//         }
//       })
//       .catch((error) => {
//         console.error("Error details:", error);
//         console.log(
//           "There was an error submitting your request. Please check the console for details."
//         );
//       });
//   };

//   render() {
//     const { requestTitle } = this.state;

//     console.log(`Rendering with Title: ${requestTitle}`); // Log the render
//     console.log("Rendering with state:", this.state);

//     return (
//       <div>

// <TextField
//   label="Request Title"
//   value={this.state.requestTitle}
//   onChanged={(newValue: string) => {
//     console.log("Event Fired! New Value:", newValue);
//     this.setState({ requestTitle: newValue || "" });
//   }}
// />

//         <PrimaryButton text="Submit" onClick={this.handleSubmit} />
//       </div>
//     );
//   }
// }

// export default ProjectRequestForm;

import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import { IDropdownOption } from "office-ui-fabric-react";
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
      customerOptions: [],
      selectedCustomer: undefined,
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"), // Set default date to today
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
      requestId: null, // Assuming requestId is part of the state
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
    const newValue =
      name === "estimatedDuration" || name === "estimatedCost"
        ? parseFloat(value) || 0
        : value;

    this.setState({ [name]: newValue } as unknown as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    console.log("Dropdown Change Event:", option); // Log the dropdown change event
    this.setState(
      {
        selectedCustomer: option ? option.key : undefined,
      },
      () => {
        console.log(
          "Updated selectedCustomer in state:",
          this.state.selectedCustomer
        ); // Log the updated state
      }
    );
  };

  // handleSubmit = (): void => {
  //   const {
  //     requestTitle,
  //     selectedCustomer,
  //     requestDate,
  //     estimatedDuration,
  //     estimatedCost,
  //     RequestStatus,
  //   } = this.state;
  //   console.log("Selected Customer:", selectedCustomer); // Log the selectedCustomer value
  //   // Convert the requestDate to Gregorian format
  //   const formattedRequestDate = moment(requestDate, "jYYYY-jMM-jDD").format(
  //     "YYYY-MM-DDTHH:mm:ss[Z]"
  //   );
  //   const requestData = {
  //     Title: requestTitle.trim(), // Ensure text field is not empty
  //     CustomerId: selectedCustomer ? selectedCustomer : null, // Ensure lookup is valid
  //     RequestDate: formattedRequestDate,
  //     EstimatedDuration: isNaN(estimatedDuration) ? 0 : estimatedDuration, // Ensure numeric
  //     EstimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost, // Ensure numeric
  //     RequestStatus: RequestStatus.trim(),
  //   };

  //   // Log the requestData object for debugging
  //   console.log("Request Data:", requestData);

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

  // ProjectRequestForm.tsx

  handleSubmit = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      RequestStatus,
    } = this.state;

    // Prepare the request data
    const requestData = {
      Title: requestTitle.trim(),
      CustomerId: selectedCustomer ? selectedCustomer : null,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus.trim(),
    };

    // Create the project request
    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response.data) {
          const requestId = response.data.Id;
          this.setState({ requestId }, () => {
            alert(
              "Project request created successfully! You can now add assessments."
            );
            // You might navigate to a different view or enable the assessments section
          });
        } else {
          alert("Error creating project request");
        }
      })
      .catch((error) => {
        console.error("Error details:", error);
        alert(
          "There was an error creating your project request. Please check the console for details."
        );
      });
  };

  resetForm = (): void => {
    this.setState({
      requestTitle: "",
      selectedCustomer: undefined,
      requestDate: moment().format("YYYY-MM-DD"), // Reset to default date
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
      requestId: null, // Reset requestId if needed
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
            this.setState({ requestTitle: newValue || "" });
          }}
        />
        <GenericDropdown
          label="Customer"
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChange={this.handleDropdownChange}
          placeHolder="انتخاب مشتری"
        />
        <TextField
          label="Request Date"
          name="requestDate"
          value={this.state.requestDate}
          onChanged={(newValue: string) => {
            this.setState({ requestDate: newValue || "" });
          }}
        />
        <TextField
          label="Estimated Duration (days)"
          value={this.state.estimatedDuration.toString()} // Ensure it’s a string
          onChanged={(newValue: string) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
        />

        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={this.state.estimatedCost.toString()} // Convert number to string for display
          onChanged={(newValue: string) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
        />
        {this.state.requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={this.state.requestId}
          />
        )}

        <div>
          <PrimaryButton text="Submit" onClick={this.handleSubmit} />
          <PrimaryButton text="Cancel" onClick={this.resetForm} />
        </div>
      </div>
    );
  }
}

export default ProjectRequestForm;

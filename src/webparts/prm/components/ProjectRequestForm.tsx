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
    this.setState({ [name]: value } as any);
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
    // const formattedRequestDate = moment(requestDate, "jYYYY-jMM-jDD").format(
    //   "YYYY-MM-DDTHH:mm:ss[Z]"
    // ); // Format date as ISO string
    const formattedRequestDate = moment(
      requestDate,
      "jYYYY-jMM-jDD"
    ).toISOString();

    // const requestData = {
    //   Title: requestTitle,
    //   CustomerId: parseInt(selectedCustomer, 10), // Ensure CustomerId is an integer
    //   RequestDate: formattedRequestDate,
    //   EstimatedDuration: estimatedDuration,
    //   EstimatedCost: estimatedCost,
    //   RequestStatus: RequestStatus, // Use the correct field name
    // };
    const requestData = {
      Title: requestTitle.trim(), // Ensure text field is not empty
      CustomerId: selectedCustomer ? parseInt(selectedCustomer, 10) : null, // Ensure lookup is valid
      RequestDate: formattedRequestDate,
      EstimatedDuration: isNaN(estimatedDuration) ? 0 : estimatedDuration, // Ensure numeric
      EstimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost, // Ensure numeric
      RequestStatus: RequestStatus.trim(),
    };

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
          name="requestTitle"
          value={requestTitle}
          onChange={this.handleInputChange}
        />
        <CustomerDropdown
          customerOptions={customerOptions}
          selectedCustomer={selectedCustomer}
          onChange={this.handleDropdownChange}
        />
        <TextField
          label="Request Date"
          name="requestDate"
          value={requestDate}
          onChange={this.handleInputChange}
        />
        <TextField
          label="Estimated Duration (days)"
          name="estimatedDuration"
          value={estimatedDuration.toString()}
          onChange={this.handleInputChange}
          type="number"
        />
        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={estimatedCost.toString()}
          onChange={this.handleInputChange}
          type="number"
        />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default ProjectRequestForm;

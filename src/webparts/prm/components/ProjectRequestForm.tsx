import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import CustomerDropdown from "./CustomerDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import { IDropdownOption } from "office-ui-fabric-react";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(
      props.spHttpClient,
      props.siteUrl
    );
    this.state = {
      customerOptions: [],
      selectedCustomer: undefined,
      requestTitle: "",
      requestDate: "",
      estimatedDuration: 0,
      estimatedCost: 0,
      status: "New",
    };
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      const dropdownOptions = customerOptions.map((item) => ({
        key: item.Id,
        text: item.Title,
      }));
      this.setState({ customerOptions: dropdownOptions });
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
    this.setState({ selectedCustomer: option?.key.toString() });
  };

  handleSubmit = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      status,
    } = this.state;

    const requestData = {
      Title: requestTitle,
      CustomerId: selectedCustomer,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      Status: status,
    };

    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response.ok) {
          alert("Request submitted successfully!");
          this.resetForm();
        } else {
          alert("Error submitting request");
        }
      });
  };

  resetForm = (): void => {
    this.setState({
      requestTitle: "",
      selectedCustomer: undefined,
      requestDate: "",
      estimatedDuration: 0,
      estimatedCost: 0,
      status: "New",
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

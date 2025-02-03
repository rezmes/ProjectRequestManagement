import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import CustomerDropdown from "./CustomerDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import { SPHttpClient } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  constructor(props: IProjectRequestFormProps) {
    super(props);
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
    this.props.spHttpClient
      .get(
        `${this.props.siteUrl}/_api/web/lists/getbytitle('CustomerList')/items`,
        SPHttpClient.configurations.v1
      )
      .then((response) => response.json())
      .then((data) => {
        const customerOptions = data.value.map((item) => ({
          key: item.Id,
          text: item.Title,
        }));
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
    this.setState({ selectedCustomer: option?.key });
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

    this.props.spHttpClient
      .post(
        `${this.props.siteUrl}/_api/web/lists/getbytitle('ProjectRequests')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-type": "application/json;odata=verbose",
          },
          body: JSON.stringify(requestData),
        }
      )
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
          value={estimatedDuration}
          onChange={this.handleInputChange}
          type="number"
        />
        <TextField
          label="Estimated Cost"
          name="estimatedCost"
          value={estimatedCost}
          onChange={this.handleInputChange}
          type="number"
        />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default ProjectRequestForm;

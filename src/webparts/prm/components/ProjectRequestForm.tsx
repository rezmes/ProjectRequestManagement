// ProjectRequestForm.tsx

import * as React from "react";
import {
  TextField,
  PrimaryButton,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
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
      isProjectCreated: false,
      showProjectForm: true,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
      customerOptions: [],
      assessments: [], // Add this line
    };

    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      this.setState({ customerOptions });
    });
  }

  handleInputChange = (
    newValue: string,
    field: keyof IProjectRequestFormState
  ): void => {
    let parsedValue: any = newValue;

    // Check if the field expects a number
    if (field === "estimatedDuration" || field === "estimatedCost") {
      parsedValue = parseFloat(newValue) || 0;
    }

    this.setState({ [field]: parsedValue } as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    this.setState({
      selectedCustomer: option ? option.key : null,
      selectedCustomerName: option ? option.text : "",
    });
  };

  calculateEstimatedCost = async () => {
    const { requestId } = this.state; // Assuming requestId is stored in the state

    if (!requestId) {
      console.error("RequestID is not available.");
      return;
    }

    try {
      // Fetch all PricingDetails for this RequestID
      const pricingDetails =
        await this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );

      // Sum up the TotalCost values
      const estimatedCost = pricingDetails.reduce((sum, item) => {
        return sum + (item.TotalCost || 0); // Ensure TotalCost is treated as a number
      }, 0);

      console.log("Calculated Estimated Cost:", estimatedCost);

      // Update the state with the calculated cost
      this.setState({ estimatedCost });

      // Optionally, save the calculated cost to the ProjectRequests list
      await this.projectRequestService.updateProjectRequestEstimatedCost(
        requestId,
        estimatedCost
      );
    } catch (error) {
      console.error("Error calculating estimated cost:", error);
    }
  };

  handleCreateProjectRequest = (): void => {
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
      CustomerId: selectedCustomer || null,
      RequestDate: requestDate,
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      RequestStatus: RequestStatus.trim(),
    };

    // Create the project request
    this.projectRequestService
      .createProjectRequest(requestData)
      .then((response) => {
        if (response && response.Id) {
          const requestId = response.Id;
          this.setState(
            {
              isProjectCreated: true,
              requestId,
            },
            () => {
              console.log("New project created with ID:", requestId);
              alert(
                "Project request created successfully! You can now add assessments."
              );
            }
          );
        } else {
          alert("Error creating project request");
        }
      })
      .catch((error) => {
        console.error("Error creating project request:", error);
        alert(
          "There was an error creating your project request. Please check the console for details."
        );
      });
  };

  resetForm = (): void => {
    this.setState({
      isProjectCreated: false,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("YYYY-MM-DD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      RequestStatus: "New",
      // Reset any other state variables as needed
    });
  };

  render() {
    const {
      isProjectCreated,
      requestId,
      selectedCustomer,
      selectedCustomerName,
      requestTitle,
      requestDate,
      estimatedDuration,
      estimatedCost,
      customerOptions,
    } = this.state;

    return (
      <div>
        <h2>
          {isProjectCreated ? "Add Assessments" : "Create Project Request"}
        </h2>

        {isProjectCreated && (
          <div>
            <h3>Project Information</h3>
            <p>
              <strong>Project ID:</strong> {requestId}
            </p>
            <p>
              <strong>Title:</strong> {requestTitle}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedCustomerName}
            </p>
            <p>
              <strong>Request Date:</strong> {requestDate}
            </p>
            {/* Include other information as needed */}
          </div>
        )}

        {/* Project Request Form */}
        <TextField
          label="Request Title"
          value={requestTitle}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestTitle")
          }
          readOnly={isProjectCreated}
        />
        <GenericDropdown
          label="Customer"
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={this.handleDropdownChange}
          placeHolder="Select Customer"
          disabled={isProjectCreated}
        />
        <TextField
          label="Request Date"
          value={requestDate}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestDate")
          }
          readOnly={isProjectCreated}
        />
        <TextField
          label="Estimated Duration (days)"
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label="Estimated Cost"
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />

        {/* Create Button */}
        {!isProjectCreated && (
          <PrimaryButton
            text="Create"
            onClick={this.handleCreateProjectRequest}
          />
        )}

        {/* Technical Assessment Table */}
        {isProjectCreated && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
          />
        )}

        {/* Cancel Button */}
        <div>
          <PrimaryButton text="Cancel" onClick={this.resetForm} />
        </div>
      </div>
    );
  }
}

export default ProjectRequestForm;

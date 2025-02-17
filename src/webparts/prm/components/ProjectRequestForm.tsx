// ProjectRequestForm.tsx

import * as React from "react";
import {
  TextField,
  PrimaryButton,
  IDropdownOption,
  Link,
  Icon,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService"; // ✅ مطمئن شو مسیر درسته
import * as moment from "moment";
import "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import UIFabricWizard from "./UIFabricWizard";
import ManagedMetadataPicker from "./ManagedMetadataPicker";

import * as strings from "PrmWebPartStrings";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context); // ✅ context رو پاس بده
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
      requestNote: "",
      RequestStatus: "New",
      customerOptions: [],
      assessments: [],
      formNumber: null,
      documentSetLink: null,
      projectCodeTerm: null,
      selectedTerm: null,
      terms: [],
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  private handleSubmit(): void {
    console.log("Form submitted with data:", this.state); // Log form data
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  // private handleTermSelected(term: { id: string; label: string }): void {
  //   this.setState({ selectedTerm: term });
  //   console.log("Selected Term:", term); // Log selected term
  // }





  private handleTermSelected = (term: { id: string; label: string }) => {
    // Save the selected term to state or handle it as needed.
    this.setState({ projectCodeTerm: term });
  };






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
      requestNote,
      RequestStatus,
    } = this.state;

    // Step 1: Get the next form number
    this.projectRequestService
      .getNextFormNumber()
      .then((formNumber) => {
        console.log("Next Form Number:", formNumber);

        // Step 2: Prepare the request data
        const requestData = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer || null,
          RequestDate: requestDate,
          EstimatedDuration: estimatedDuration,
          EstimatedCost: estimatedCost,
          Description1: requestNote,
          RequestStatus: RequestStatus.trim(),
          FormNumber: formNumber,
        };

        // Step 3: Create the project request
        return this.projectRequestService.createProjectRequest(requestData);
      })
      .then((response) => {
        if (response && response.requestId) {
          console.log("New project created with ID:", response.requestId);

          // Update state to include documentSetLink for rendering
          this.setState(
            {
              isProjectCreated: true,
              requestId: response.requestId,
              formNumber: response.FormNumber, // if needed
              documentSetLink: response.documentSetLink,
            },
            () => {
              alert("Project request created successfully!");
            }
          );
        } else {
          throw new Error(
            "Error creating project request. Response was invalid."
          );
        }
      })
      .catch((error) => {
        console.error("Error creating project request or Document Set:", error);
        console.warn(
          "There was an error creating your project request or its associated Document Set. Please check the console for details."
        );
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
      });
  };

  // // Handler when a term is selected
  // handleTermSelected = (term) => {
  //   this.setState({ projectCodeTerm: term });
  //   // Additional logic to handle the selected term can be added here
  // };
  private handleProjectCodeSelected(term: { id: string; label: string }): void {
    // Handle the selected term
  }
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
      requestNote: "",
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
      requestNote,
      customerOptions,
      formNumber,
      documentSetLink,
    } = this.state;

    const locale =
      this.props.context.pageContext.cultureInfo.currentCultureName;
    const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

    return (
      <div className={`${containerClass} ${styles.projectRequestForm}`}>
        <UIFabricWizard />
        <h2 className={styles.header}>
          {isProjectCreated
            ? strings.AddAssessments
            : strings.CreateProjectRequest}
        </h2>

        {isProjectCreated && (
          <div>
            <h3>{strings.ProjectInformation}</h3>
            <p>
              <strong>{strings.ProjectID}:</strong> {requestId}
            </p>
            <p>
              <strong>{strings.FormNumber}:</strong> {formNumber}
            </p>
            <p>
              <strong>{strings.Title}:</strong> {requestTitle}
            </p>
            <p>
              <strong>{strings.CustomerName}:</strong> {selectedCustomerName}
            </p>
            <p>
              <strong>{strings.RequestDate}:</strong> {requestDate}
            </p>
            <p>{strings.RequestNote}:</p> {requestNote}
          </div>
        )}

        {isProjectCreated && (
          <div>
            {/* Document Set Link */}
            {documentSetLink && (
              <div className={styles.docSetLink}>
                <Icon iconName="OpenFolderHorizontal" />
                <Link href={documentSetLink.url} target="_blank">
                  {documentSetLink.text}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Project Request Form */}
        <TextField
          label={strings.RequestTitle}
          value={requestTitle}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestTitle")
          }
          readOnly={isProjectCreated}
        />
        {/* <ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          disabled={false} // Set to true if the picker should be disabled
          context={this.props.context} // Pass the current WebPart context
        /> */}

        {/*
        <ManagedMetadataPicker
  label={strings.ProjectCodeLabel}  // e.g., "Project Code"
  onTermSelected={(term) => {
    // Handle the selected term
    console.log("Selected term:", term);
  }}

  placeHolder="Select a project code..."
  context={this.props.context} // Ensure you pass the context
  termSetId="your-term-set-id" // Provide the term set ID
  // Alternatively, you can use fieldInternalName
  // fieldInternalName="your-field-internal-name"
/> */}

<ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          context={this.props.context}
          placeHolder="Select Project Code"
        />
        <GenericDropdown
          label={strings.Customer}
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={this.handleDropdownChange}
          placeHolder={strings.SelectCustomer}
          disabled={isProjectCreated}
        />
        <TextField
          label={strings.RequestDate}
          value={requestDate}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestDate")
          }
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedDuration}
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedCost}
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.RequestNote}
          value={requestNote}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestNote")
          }
          multiline
          rows={4}
          readOnly={isProjectCreated}
        />

        {/* Create Button */}
        <div className={styles.buttonGroup}>
          {!isProjectCreated && (
            <PrimaryButton
              text={strings.Create}
              onClick={this.handleCreateProjectRequest}
            />
          )}
          {/* Cancel Button */}
          <div>
            <PrimaryButton text={strings.Cancel} onClick={this.resetForm} />
          </div>
        </div>
        {/* Technical Assessment Table */}
        {isProjectCreated && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
          />
        )}

        <div>
          <TextField
            label="Request Title"
            value={this.state.requestTitle}
            onChanged={(value) => this.setState({ requestTitle: value })}
          />
          {/* <ManagedMetadataPicker
            label="Project Code"
            onTermSelected={this.handleTermSelected}
            context={this.props.context}
            termSetId={this.props.termSetId}
            
            // termSetId="5863383a-85c5-4fbd-8114-11ef83bf9175"
            placeHolder="Select Project Code"
          /> */}
        <ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          context={this.props.context}
          placeHolder="Select Project Code"
        />
          <PrimaryButton text="Submit" onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default ProjectRequestForm;

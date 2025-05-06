// src/webparts/prm/components/ProjectRequestForm.tsx (modified)
import * as React from "react";
import {
  PrimaryButton,
  DefaultButton,
  IDropdownOption,
} from "office-ui-fabric-react";
import { IProjectRequestFormProps, FormMode } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import * as strings from "PrmWebPartStrings";
import ProjectInformation from "./ProjectInformation";
import ProjectRequestFormFields from "./ProjectRequestFormFields";
import StepIndicator from "./StepIndicator";
import { sp } from "@pnp/sp";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      isProjectCreated: props.mode !== FormMode.Create,
      showProjectForm: true,
      requestId: props.itemId || null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("jYYYY/jM/jD"),
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
      ProjectCode1: null,
      isLoading: props.mode !== FormMode.Create,
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  // src/webparts/prm/components/ProjectRequestForm.tsx
  // Add to the componentDidMount method:

  componentDidMount() {
    this.loadCustomerOptions();

    // If in Edit or View mode, load the existing item
    if (this.props.mode !== FormMode.Create && this.props.itemId) {
      this.loadExistingItem(this.props.itemId);
    }
  }

  private loadExistingItem(itemId: number): void {
    this.setState({ isLoading: true });

    // Get the project request details
    sp.web.lists
      .getByTitle("ProjectRequests")
      .items.getById(itemId)
      .select(
        "Id,Title,CustomerId,Customer/Title,RequestDate,EstimatedDuration,EstimatedCost,Description1,RequestStatus,FormNumber,DocumentSetLink,ProjectCode1/Label,ProjectCode1/TermGuid"
      )
      .expand("Customer,ProjectCode1")
      .get()
      .then((item) => {
        console.log("Loaded item:", item);

        // Format the date from ISO to Jalali
        const requestDate = item.RequestDate
          ? moment(item.RequestDate).format("jYYYY/jM/jD")
          : moment().format("jYYYY/jM/jD");

        // Parse the DocumentSetLink field
        let documentSetLink = null;
        if (item.DocumentSetLink) {
          documentSetLink = {
            url: item.DocumentSetLink.Url,
            text: item.DocumentSetLink.Description,
          };
        }

        // Parse the ProjectCode1 field
        let projectCodeTerm = null;
        if (item.ProjectCode1) {
          projectCodeTerm = {
            id: item.ProjectCode1.TermGuid,
            label: item.ProjectCode1.Label,
          };
        }

        this.setState({
          requestId: item.Id,
          selectedCustomer: item.CustomerId,
          selectedCustomerName: item.Customer ? item.Customer.Title : "",
          requestTitle: item.Title || "",
          requestDate: requestDate,
          estimatedDuration: item.EstimatedDuration || 0,
          estimatedCost: item.EstimatedCost || 0,
          requestNote: item.Description1 || "",
          RequestStatus: item.RequestStatus || "New",
          formNumber: item.FormNumber,
          documentSetLink: documentSetLink,
          ProjectCode1: projectCodeTerm,
          selectedTerm: projectCodeTerm,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Error loading project request:", error);
        this.setState({ isLoading: false });
        alert(strings.ErrorLoadingProjectRequest);
      });
  }

  private handleTermSelected(term: { id: string; label: string }): void {
    this.setState({ selectedTerm: term, ProjectCode1: term });
    console.log("Selected Term:", term);
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
    // Don't update state in View mode
    if (this.props.mode === FormMode.View) {
      return;
    }

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
    // Don't update state in View mode
    if (this.props.mode === FormMode.View) {
      return;
    }

    this.setState({
      selectedCustomer: option ? option.key : null,
      selectedCustomerName: option ? option.text : "",
    });
  };

  // src/webparts/prm/components/ProjectRequestForm.tsx
  handleCreateProjectRequest = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      RequestStatus,
      ProjectCode1,
    } = this.state;

    // Validate required fields
    if (!requestTitle.trim()) {
      alert(strings.RequestTitleRequired);
      return;
    }

    if (!selectedCustomer) {
      alert(strings.CustomerRequired);
      return;
    }

    // Step 1: Get the next form number (only for Create mode)
    const getFormNumberPromise =
      this.props.mode === FormMode.Create
        ? this.projectRequestService.getNextFormNumber()
        : Promise.resolve(this.state.formNumber);

    getFormNumberPromise
      .then((formNumber) => {
        console.log("Form Number:", formNumber);
        const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();

        // Step 2: Prepare the request data
        const requestData: { [key: string]: any } = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer,
          RequestDate: requestDateISO,
          EstimatedDuration: estimatedDuration,
          EstimatedCost: estimatedCost,
          Description1: requestNote,
          RequestStatus: RequestStatus.trim(),
          FormNumber: formNumber,
        };

        console.log("Request data being sent:", requestData);

        // Step 3: Create or update the project request
        if (this.props.mode === FormMode.Create) {
          return this.projectRequestService.createProjectRequest(requestData);
        } else {
          // For Edit mode, update the existing item
          return this.projectRequestService.updateProjectRequest(
            this.state.requestId,
            requestData
          );
        }
      })
      .then((response) => {
        if (response && (response.requestId || response.success)) {
          const requestId = response.requestId || this.state.requestId;
          console.log(
            "Project " +
              (this.props.mode === FormMode.Create ? "created" : "updated") +
              " with ID:",
            requestId
          );

          // Update state first
          this.setState(
            {
              isProjectCreated: true,
              requestId: requestId,
              formNumber: response.FormNumber || this.state.formNumber,
              documentSetLink:
                response.documentSetLink || this.state.documentSetLink,
            },
            () => {
              // Then try to update the taxonomy field if needed
              if (ProjectCode1 && ProjectCode1.id && ProjectCode1.label) {
                // Add a small delay before updating the taxonomy field
                // src/webparts/prm/components/ProjectRequestForm.tsx
                // Replace the setTimeout block with this:

                setTimeout(() => {
                  this.projectRequestService
                    .updateProjectCode(
                      "ProjectRequests",
                      requestId,
                      ProjectCode1.label,
                      ProjectCode1.id
                    )
                    .then(() => {
                      console.log("ProjectCode updated successfully");
                      // Show success message after successful update
                      alert(
                        this.props.mode === FormMode.Create
                          ? strings.ProjectRequestCreatedSuccessfully
                          : strings.ProjectRequestUpdatedSuccessfully
                      );
                    })
                    .catch((error) => {
                      console.warn(
                        "Error updating ProjectCode, but request was created:",
                        error
                      );
                      // Still show success message even if taxonomy update fails
                      alert(
                        this.props.mode === FormMode.Create
                          ? strings.ProjectRequestCreatedSuccessfully
                          : strings.ProjectRequestUpdatedSuccessfully
                      );
                    });
                }, 1000); // 1 second delay
              } else {
                alert(
                  this.props.mode === FormMode.Create
                    ? strings.ProjectRequestCreatedSuccessfully
                    : strings.ProjectRequestUpdatedSuccessfully
                );
              }
            }
          );
        } else {
          throw new Error(
            "Error " +
              (this.props.mode === FormMode.Create ? "creating" : "updating") +
              " project request. Response was invalid."
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error " +
            (this.props.mode === FormMode.Create ? "creating" : "updating") +
            " project request:",
          error
        );
        alert(
          this.props.mode === FormMode.Create
            ? strings.ErrorCreatingProjectRequest
            : strings.ErrorUpdatingProjectRequest
        );
      });
  };

  resetForm = (): void => {
    if (this.props.mode === FormMode.Create) {
      this.setState({
        isProjectCreated: false,
        requestId: null,
        selectedCustomer: null,
        selectedCustomerName: "",
        requestTitle: "",
        requestDate: moment().format("jYYYY/jM/jD"),
        estimatedDuration: 0,
        estimatedCost: 0,
        requestNote: "",
        RequestStatus: "New",
        documentSetLink: null,
        projectCodeTerm: null,
        selectedTerm: null,
        ProjectCode1: null,
      });
    } else if (this.props.mode === FormMode.Edit && this.props.itemId) {
      // Reload the original item data
      this.loadExistingItem(this.props.itemId);
    }
  };

  render() {
    const {
      isLoading,
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

    const { mode } = this.props;
    const isViewMode = mode === FormMode.View;
    const isEditMode = mode === FormMode.Edit;
    const isCreateMode = mode === FormMode.Create;

    const locale =
      this.props.context.pageContext.cultureInfo.currentCultureName;
    const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

    if (isLoading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    return (
      <div className={`${containerClass} ${styles.projectRequestForm}`}>
        {!isViewMode && (
          <StepIndicator
            currentStep={isProjectCreated ? 2 : 1}
            totalSteps={2}
            stepLabels={[
              isCreateMode
                ? strings.CreateProjectRequest
                : strings.EditProjectRequest,
              strings.AddAssessments,
            ]}
          />
        )}

        <h2 className={styles.header}>
          {isViewMode
            ? strings.ViewProjectRequest
            : isProjectCreated
            ? strings.AddAssessments
            : isCreateMode
            ? strings.CreateProjectRequest
            : strings.EditProjectRequest}
        </h2>

        {(isProjectCreated || isViewMode) && (
          <ProjectInformation
            requestId={requestId}
            formNumber={formNumber}
            requestTitle={requestTitle}
            selectedCustomerName={selectedCustomerName}
            requestDate={requestDate}
            requestNote={requestNote}
            documentSetLink={documentSetLink}
          />
        )}

        {!isProjectCreated && !isViewMode && (
          <ProjectRequestFormFields
            requestTitle={requestTitle}
            selectedCustomer={selectedCustomer}
            requestDate={requestDate}
            estimatedDuration={estimatedDuration}
            estimatedCost={estimatedCost}
            requestNote={requestNote}
            customerOptions={customerOptions}
            onInputChange={this.handleInputChange}
            onDropdownChange={this.handleDropdownChange}
            onTermSelected={this.handleTermSelected}
            context={this.props.context}
            isReadOnly={isViewMode}
          />
        )}

        {isViewMode && (
          <ProjectRequestFormFields
            requestTitle={requestTitle}
            selectedCustomer={selectedCustomer}
            requestDate={requestDate}
            estimatedDuration={estimatedDuration}
            estimatedCost={estimatedCost}
            requestNote={requestNote}
            customerOptions={customerOptions}
            onInputChange={this.handleInputChange}
            onDropdownChange={this.handleDropdownChange}
            onTermSelected={this.handleTermSelected}
            context={this.props.context}
            isReadOnly={true}
          />
        )}

        <div className={styles.buttonGroup}>
          {!isProjectCreated && !isViewMode && (
            <PrimaryButton
              text={isCreateMode ? strings.Create : strings.Update}
              onClick={this.handleCreateProjectRequest}
            />
          )}

          {!isViewMode && (
            <DefaultButton text={strings.Cancel} onClick={this.resetForm} />
          )}

          {isViewMode && (
            <DefaultButton
              text={strings.Back}
              onClick={() => window.history.back()}
            />
          )}
        </div>

        {(isProjectCreated || isViewMode) && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
            isReadOnly={isViewMode}
          />
        )}
      </div>
    );
  }
}

export default ProjectRequestForm;

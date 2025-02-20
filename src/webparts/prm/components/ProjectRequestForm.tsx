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
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
console.log('TechnicalAssessmentTable:', TechnicalAssessmentTable);
import styles from "./ProjectRequestForm.module.scss";
import UIFabricWizard from "./UIFabricWizard";
import ManagedMetadataPicker from "./ManagedMetadataPicker";

import { IAssessment, IResource } from "./IAssessment";

import * as strings from "PrmWebPartStrings";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context); // ✅ context رو پاس بده

    // Check URL params for form number
    const urlParams = new URLSearchParams(window.location.search);
    const formNumberParam = urlParams.get('formNumber');

    this.state = {
      mode: formNumberParam ? 'display' : 'create',
      isProjectCreated: false,
      showProjectForm: true,
      requestId: null,
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
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  // private handleSubmit(): void {
  //   console.log("Form submitted with data:", this.state); // Log form data
  // }

  componentDidMount() {
    this.loadCustomerOptions();
    const urlParams = new URLSearchParams(window.location.search);
    const formNumber = urlParams.get('formNumber');
    
    if (formNumber) {
      this.loadExistingForm(parseInt(formNumber));
    }
  }


  // Add load existing form method
  loadExistingForm = async (formNumber: number) => {
    try {
      const data = await this.projectRequestService.getFullRequestData(formNumber);
      
      this.setState({
        mode: 'display',
        requestId: data.request.Id,
        requestTitle: data.request.Title,
        selectedCustomer: data.request.CustomerId,
        // ... map all fields
        assessments: this.mapAssessments(data.assessments),
        documentSetLink: data.request.DocumentSetLink,
        isProjectCreated: true
      });
    } catch (error) {
      console.error("Error loading form:", error);
    }
  };

  private mapAssessments(rawAssessments: any[]): IAssessment[] {
    // Transform SharePoint list data into IAssessment format
    return rawAssessments.map(assessment => ({
      activity: assessment.Title,
      humanResources: this.mapResources(assessment, 'HumanResource') || [],
      machines: this.mapResources(assessment, 'Machine') || [],
      materials: this.mapResources(assessment, 'Material') || []
    }));
  }
  private mapResources(assessment: any, type: string): IResource[] {
    return [{
      item: { key: assessment[`${type}Id`], text: assessment[`${type}Title`] },
      quantity: assessment[`${type}Quantity`],
      pricePerUnit: assessment[`${type}PricePerUnit`]
    }];
  }

  // Add mode toggle methods
  enterEditMode = () => this.setState({ mode: 'edit' });
  cancelEdit = () => this.setState({ mode: 'display' });






  private handleTermSelected(term: { id: string; label: string }): void {
    this.setState({ selectedTerm: term });
    console.log("Selected Term:", term); // Log selected term
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
      requestNote,
      RequestStatus,
      ProjectCode1,
    } = this.state;

    // Step 1: Get the next form number
    this.projectRequestService
      .getNextFormNumber()
      .then((formNumber) => {
        console.log("Next Form Number:", formNumber);
        const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();
        console.log("requestDate:", requestDate); // Check the initial value
        console.log("requestDateISO:", requestDateISO); // Check the converted ISO string
        console.log("Type of requestDateISO:", typeof requestDateISO); // Should be "string"
        // Step 2: Prepare the request data
        const requestData = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer || null,
          RequestDate: requestDateISO,
          EstimatedDuration: estimatedDuration,
          EstimatedCost: estimatedCost,
          Description1: requestNote,
          RequestStatus: RequestStatus.trim(),
          FormNumber: formNumber,
          ProjectCode1: ProjectCode1 ? ProjectCode1.id: null,
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
  // private handleProjectCodeSelected(term: { id: string; label: string }): void {
  //   // Handle the selected term
  // }
  resetForm = (): void => {
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

      // Reset any other state variables as needed
    });
  };

 // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private renderCreateMode() {

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


        <ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          context={this.props.context}
          placeHolder="Select Project Code"
          disabled={isProjectCreated}
        />
        <GenericDropdown
          label={strings.Customer}
          options={customerOptions || []}
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
            context={this.props.context}
          />
        )}


      </div>
    );

  }

  private renderDisplayMode() {
    const { requestTitle, selectedCustomerName, requestDate } = this.state;
    
    return (
      <div>
        <div className={(styles as any).viewModeControls}>
          <PrimaryButton text={strings.Edit} onClick={this.enterEditMode} />
          <PrimaryButton text={strings.Delete} onClick={this.handleDelete} />
        </div>

        <TextField
          label={strings.RequestTitle}
          value={requestTitle}
          readOnly
        />

        <TextField
          label={strings.Customer}
          value={selectedCustomerName}
          readOnly
        />

        <TextField
          label={strings.RequestDate}
          value={requestDate}
          readOnly
        />

        {/* Add other read-only fields */}
      </div>
    );
  }
  private renderEditMode() {
    return (
      <div>
        {/* Reuse create mode fields but make editable */}
        <TextField
          label={strings.RequestTitle}
          value={this.state.requestTitle}
          onChanged={(val) => this.handleInputChange(val, 'requestTitle')}
        />

        <div className={(styles as any).editModeControls}>
          <PrimaryButton text={strings.Save} onClick={this.handleUpdate} />
          <PrimaryButton text={strings.Cancel} onClick={this.cancelEdit} />
        </div>
      </div>
    );
  }


  // Add update handler
  handleUpdate = async () => {
    const { requestId} = this.state;
      const {
        estimatedDuration,
        estimatedCost,
        requestNote,
        RequestStatus,
        ProjectCode1,
      } = this.state;
    
    const updateData = {
      Title: this.state.requestTitle,
      CustomerId: this.state.selectedCustomer,
      // ... other fields
      EstimatedDuration: estimatedDuration,
      EstimatedCost: estimatedCost,
      Description1: requestNote,
      RequestStatus: RequestStatus.trim(),
      ProjectCode1: ProjectCode1 ? ProjectCode1.id: null,
    };

    try {
      await this.projectRequestService.updateProjectRequest(requestId!, updateData);
      this.setState({ mode: 'display' });
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // Add delete handler
  handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    
    try {
      await this.projectRequestService.deleteProjectRequest(this.state.requestId!);
      this.resetForm();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };




 // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Modify render method
  render() {
    const { mode } = this.state;
    
    return (
      <div className={styles.projectRequestForm}>
        {mode === 'create' && this.renderCreateMode()}
        {mode === 'display' && this.renderDisplayMode()}
        {mode === 'edit' && this.renderEditMode()}
      </div>
    );
    
    }


}


export default ProjectRequestForm;




// // ProjectRequestForm.tsx

// import * as React from "react";
// import {
//   TextField,
//   PrimaryButton,
//   IDropdownOption,
//   Link,
//   Icon,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
// import { IProjectRequestFormState } from "./IProjectRequestFormState";
// import ProjectRequestService from "../services/ProjectRequestService"; // ✅ مطمئن شو مسیر درسته
// import * as moment from "moment-jalaali";
// import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
// import styles from "./ProjectRequestForm.module.scss";
// import UIFabricWizard from "./UIFabricWizard";
// import ManagedMetadataPicker from "./ManagedMetadataPicker";

// import * as strings from "PrmWebPartStrings";

// class ProjectRequestForm extends React.Component<
//   IProjectRequestFormProps,
//   IProjectRequestFormState
// > {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IProjectRequestFormProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService(this.props.context); // ✅ context رو پاس بده
//     this.state = {
//       isProjectCreated: false,
//       showProjectForm: true,
//       requestId: null,
//       selectedCustomer: null,
//       selectedCustomerName: "",
//       requestTitle: "",
//       requestDate: moment().format("jYYYY/jM/jD"),
//       estimatedDuration: 0,
//       estimatedCost: 0,
//       requestNote: "",
//       RequestStatus: "New",
//       customerOptions: [],
//       assessments: [],
//       formNumber: null,
//       documentSetLink: null,
//       projectCodeTerm: null,
//       selectedTerm: null,
//       terms: [],
//       ProjectCode1: null,
//     };

//     this.handleTermSelected = this.handleTermSelected.bind(this);
//     // this.handleSubmit = this.handleSubmit.bind(this);
//     this.resetForm = this.resetForm.bind(this);
//   }

//   // private handleSubmit(): void {
//   //   console.log("Form submitted with data:", this.state); // Log form data
//   // }

//   componentDidMount() {
//     this.loadCustomerOptions();
//   }

//   private handleTermSelected(term: { id: string; label: string }): void {
//     this.setState({ selectedTerm: term });
//     console.log("Selected Term:", term); // Log selected term
//   }




//   loadCustomerOptions() {
//     this.projectRequestService.getCustomerOptions().then((customerOptions) => {
//       this.setState({ customerOptions });
//     });
//   }

//   handleInputChange = (
//     newValue: string,
//     field: keyof IProjectRequestFormState
//   ): void => {
//     let parsedValue: any = newValue;

//     // Check if the field expects a number
//     if (field === "estimatedDuration" || field === "estimatedCost") {
//       parsedValue = parseFloat(newValue) || 0;
//     }

//     this.setState({ [field]: parsedValue } as Pick<
//       IProjectRequestFormState,
//       keyof IProjectRequestFormState
//     >);
//   };

//   handleDropdownChange = (option?: IDropdownOption): void => {
//     this.setState({
//       selectedCustomer: option ? option.key : null,
//       selectedCustomerName: option ? option.text : "",
//     });
//   };

//   calculateEstimatedCost = async () => {
//     const { requestId } = this.state; // Assuming requestId is stored in the state

//     if (!requestId) {
//       console.error("RequestID is not available.");
//       return;
//     }

//     try {
//       // Fetch all PricingDetails for this RequestID
//       const pricingDetails =
//         await this.projectRequestService.getPricingDetailsByRequestID(
//           requestId
//         );

//       // Sum up the TotalCost values
//       const estimatedCost = pricingDetails.reduce((sum, item) => {
//         return sum + (item.TotalCost || 0); // Ensure TotalCost is treated as a number
//       }, 0);

//       console.log("Calculated Estimated Cost:", estimatedCost);

//       // Update the state with the calculated cost
//       this.setState({ estimatedCost });

//       // Optionally, save the calculated cost to the ProjectRequests list
//       await this.projectRequestService.updateProjectRequestEstimatedCost(
//         requestId,
//         estimatedCost
//       );
//     } catch (error) {
//       console.error("Error calculating estimated cost:", error);
//     }
//   };

//   handleCreateProjectRequest = (): void => {
//     const {
//       requestTitle,
//       selectedCustomer,
//       requestDate,
//       estimatedDuration,
//       estimatedCost,
//       requestNote,
//       RequestStatus,
//       ProjectCode1,
//     } = this.state;

//     // Step 1: Get the next form number
//     this.projectRequestService
//       .getNextFormNumber()
//       .then((formNumber) => {
//         console.log("Next Form Number:", formNumber);
//         const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();
//         console.log("requestDate:", requestDate); // Check the initial value
//         console.log("requestDateISO:", requestDateISO); // Check the converted ISO string
//         console.log("Type of requestDateISO:", typeof requestDateISO); // Should be "string"
//         // Step 2: Prepare the request data
//         const requestData = {
//           Title: requestTitle.trim(),
//           CustomerId: selectedCustomer || null,
//           RequestDate: requestDateISO,
//           EstimatedDuration: estimatedDuration,
//           EstimatedCost: estimatedCost,
//           Description1: requestNote,
//           RequestStatus: RequestStatus.trim(),
//           FormNumber: formNumber,
//           ProjectCode1: ProjectCode1 ? ProjectCode1.id: null,
//         };

//         // Step 3: Create the project request
//         return this.projectRequestService.createProjectRequest(requestData);
//       })
//       .then((response) => {
//         if (response && response.requestId) {
//           console.log("New project created with ID:", response.requestId);

//           // Update state to include documentSetLink for rendering
//           this.setState(
//             {
//               isProjectCreated: true,
//               requestId: response.requestId,
//               formNumber: response.FormNumber, // if needed
//               documentSetLink: response.documentSetLink,
//             },
//             () => {
//               alert("Project request created successfully!");
//             }
//           );
//         } else {
//           throw new Error(
//             "Error creating project request. Response was invalid."
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error creating project request or Document Set:", error);
//         console.warn(
//           "There was an error creating your project request or its associated Document Set. Please check the console for details."
//         );
//         if (error instanceof Error) {
//           console.error("Error message:", error.message);
//         }
//       });
//   };

//   // // Handler when a term is selected
//   // handleTermSelected = (term) => {
//   //   this.setState({ projectCodeTerm: term });
//   //   // Additional logic to handle the selected term can be added here
//   // };
//   private handleProjectCodeSelected(term: { id: string; label: string }): void {
//     // Handle the selected term
//   }
//   resetForm = (): void => {
//     this.setState({
//       isProjectCreated: false,
//       requestId: null,
//       selectedCustomer: null,
//       selectedCustomerName: "",
//       requestTitle: "",
//       requestDate: moment().format("jYYYY/jM/jD"),
//       estimatedDuration: 0,
//       estimatedCost: 0,
//       requestNote: "",
//       RequestStatus: "New",

//       // Reset any other state variables as needed
//     });
//   };

//   render() {
//     const {
//       isProjectCreated,
//       requestId,
//       selectedCustomer,
//       selectedCustomerName,
//       requestTitle,
//       requestDate,
//       estimatedDuration,
//       estimatedCost,
//       requestNote,
//       customerOptions,
//       formNumber,
//       documentSetLink,
//     } = this.state;

//     const locale =
//       this.props.context.pageContext.cultureInfo.currentCultureName;
//     const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

//     return (
//       <div className={`${containerClass} ${styles.projectRequestForm}`}>
//         <UIFabricWizard />
//         <h2 className={styles.header}>
//           {isProjectCreated
//             ? strings.AddAssessments
//             : strings.CreateProjectRequest}
//         </h2>

//         {isProjectCreated && (
//           <div>
//             <h3>{strings.ProjectInformation}</h3>
//             <p>
//               <strong>{strings.ProjectID}:</strong> {requestId}
//             </p>
//             <p>
//               <strong>{strings.FormNumber}:</strong> {formNumber}
//             </p>
//             <p>
//               <strong>{strings.Title}:</strong> {requestTitle}
//             </p>
//             <p>
//               <strong>{strings.CustomerName}:</strong> {selectedCustomerName}
//             </p>
//             <p>
//               <strong>{strings.RequestDate}:</strong> {requestDate}
//             </p>
//             <p>{strings.RequestNote}:</p> {requestNote}
//           </div>
//         )}

//         {isProjectCreated && (
//           <div>
//             {/* Document Set Link */}
//             {documentSetLink && (
//               <div className={styles.docSetLink}>
//                 <Icon iconName="OpenFolderHorizontal" />
//                 <Link href={documentSetLink.url} target="_blank">
//                   {documentSetLink.text}
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Project Request Form */}
//         <TextField
//           label={strings.RequestTitle}
//           value={requestTitle}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestTitle")
//           }
//           readOnly={isProjectCreated}
//         />


//         <ManagedMetadataPicker
//           label={strings.ProjectCodeLabel} // e.g., "Project Code"
//           onTermSelected={this.handleTermSelected}
//           context={this.props.context}
//           placeHolder="Select Project Code"
//           disabled={isProjectCreated}
//         />
//         <GenericDropdown
//           label={strings.Customer}
//           options={customerOptions}
//           selectedKey={selectedCustomer}
//           onChanged={this.handleDropdownChange}
//           placeHolder={strings.SelectCustomer}
//           disabled={isProjectCreated}
//         />
//         <TextField
//           label={strings.RequestDate}
//           value={requestDate}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestDate")
//           }
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label={strings.EstimatedDuration}
//           value={estimatedDuration.toString()}
//           onChanged={(newValue) =>
//             this.setState({ estimatedDuration: parseInt(newValue) || 0 })
//           }
//           type="number"
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label={strings.EstimatedCost}
//           value={estimatedCost.toString()}
//           onChanged={(newValue) =>
//             this.setState({ estimatedCost: parseInt(newValue) || 0 })
//           }
//           type="number"
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label={strings.RequestNote}
//           value={requestNote}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestNote")
//           }
//           multiline
//           rows={4}
//           readOnly={isProjectCreated}
//         />

//         {/* Create Button */}
//         <div className={styles.buttonGroup}>
//           {!isProjectCreated && (
//             <PrimaryButton
//               text={strings.Create}
//               onClick={this.handleCreateProjectRequest}
//             />
//           )}
//           {/* Cancel Button */}
//           <div>
//             <PrimaryButton text={strings.Cancel} onClick={this.resetForm} />
//           </div>
//         </div>
//         {/* Technical Assessment Table */}
//         {isProjectCreated && requestId && (
//           <TechnicalAssessmentTable
//             projectRequestService={this.projectRequestService}
//             requestId={requestId}
//             resetForm={this.resetForm}
//           />
//         )}


//       </div>
//     );
//   }
// }

// export default ProjectRequestForm;










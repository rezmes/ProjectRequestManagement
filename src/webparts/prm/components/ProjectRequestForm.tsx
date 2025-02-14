// // ProjectRequestForm.tsx

// import * as React from "react";
// import {
//   TextField,
//   PrimaryButton,
//   IDropdownOption,
//   Button,
//   ActionButton,
//   DefaultButton,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
// import { IProjectRequestFormState } from "./IProjectRequestFormState";
// import ProjectRequestService from "../services/ProjectRequestService";
// import * as moment from "moment";
// import "moment-jalaali";
// import TechnicalAssessmentTable from "./TechnicalAssessmentTable";

// class ProjectRequestForm extends React.Component<
//   IProjectRequestFormProps,
//   IProjectRequestFormState
// > {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IProjectRequestFormProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService(this.props.context);
//     this.state = {
//       isProjectCreated: false,
//       requestDate: moment().format("YYYY-MM-DD"),
//       RequestStatus: "New",
//       showProjectForm: true,
//       requestId: null,
//       requestTitle: "", // مقدار اولیه برای requestTitle
//       estimatedDuration: 0, // مقدار اولیه برای estimatedDuration
//       estimatedCost: 0, // مقدار اولیه برای estimatedCost
//       requestNote: "", // مقدار اولیه برای requestNote
//       selectedCustomer: null, // مقدار اولیه برای selectedCustomer
//       selectedCustomerName: "", // مقدار اولیه برای selectedCustomerName
//       customerOptions: [], // مقدار اولیه برای customerOptions
//       assessments: [], // مقدار اولیه برای assessments
//       formNumber: null, // مقدار اولیه برای formNumber
//     };
//     this.handleCreateProjectRequest = this.handleCreateProjectRequest.bind(this); // ✅ Bind کردن متد handleCreateProjectRequest
//     this.resetForm = this.resetForm.bind(this);
//   }

//   componentDidMount() {
//     this.loadCustomerOptions();
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
// // ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //    handleCreateProjectRequest = (): void => {

// //     const {
// //       requestTitle,
// //       selectedCustomer,
// //       requestDate,
// //       estimatedDuration,
// //       estimatedCost,
// //       requestNote,
// //       RequestStatus,
// //     } = this.state;

// //     // Step 1: Get the next form number
// //     this.projectRequestService
// //       .getNextFormNumber()
// //       .then((formNumber) => {
// //         console.log("Next Form Number:", formNumber);

// //         // Step 2: Prepare the request data
// //         const requestData = {
// //           Title: requestTitle.trim(),
// //           CustomerId: selectedCustomer || null,
// //           RequestDate: requestDate,
// //           EstimatedDuration: estimatedDuration,
// //           EstimatedCost: estimatedCost,
// //           Description1: requestNote,
// //           RequestStatus: RequestStatus.trim(),
// //           FormNumber: formNumber,
// //         };

// //         // Step 3: Create the project request
// //         return this.projectRequestService.createProjectRequest(requestData);
// //       })
// //       .then((response) => {
// //         if (response && response.Id) {
// //           const requestId = response.Id; // Get the request ID of the newly created project request
// //           console.log("New project created with ID:", requestId);

// //           // Step 4: Create the Document Set
// //           const documentSetName = `Request-${requestId}`; // Name the Document Set based on the Request ID
// //           return this.projectRequestService
// //           .createDocumentSet(documentSetName)
// //             .then(() => {
// //               console.log("Document Set created successfully.");

// //               // Step 5: Update the DocumentSetLink in the ProjectRequests list
// //               const documentSetLink = {
// //                 url: `${this.props.context.pageContext.web.absoluteUrl}/RelatedDocuments/${documentSetName}`,
// //                 text: `Documents for Request ${requestId}`,
// //               };
// //               console.log("documentSetName:", documentSetName); // چاپ نام Document Set
// //               console.log("this.props.context.pageContext.web.absoluteUrl:", this.props.context.pageContext.web.absoluteUrl); // چاپ آدرس سایت
// //               console.log("documentSetLink.url (before update):", documentSetLink.url); // چاپ URL لینک قبل از آپدیت

// //               return this.projectRequestService.updateDocumentSetLink(
// //                 requestId,
// //                 documentSetLink
// //               );

// //             })
// //             .then(() => {
// //               console.log("documentSetName:", documentSetName); // چاپ نام Document Set
// // console.log("this.props.context.pageContext.web.absoluteUrl:", this.props.context.pageContext.web.absoluteUrl); // چاپ آدرس سایت

// //               console.log("Document Set link updated successfully.");
// //               this.setState(
// //                 {
// //                   isProjectCreated: true,
// //                   requestId: response.Id,
// //                   formNumber: response.FormNumber,
// //                 },
// //                 () => {
// //                   alert(
// //                     "Project request created successfully! A Document Set has been created for related documents."
// //                   );
// //                 }
// //               );
// //             });
// //         } else {
// //           throw new Error(
// //             "Error creating project request. Response was invalid."
// //           );
// //         }
// //       })
// //       .catch((error) => {
// //         console.error("Error creating project request or Document Set:", error);
// //         return null;
// //         // alert(
// //         //   "There was an error creating your project request or its associated Document Set. Please check the console for details."
// //         // );
// //       });

// //   };
// // private async handleCreateProjectRequest(event: React.FormEvent<HTMLFormElement>): Promise<void> {event.preventDefault();
// private handleCreateProjectRequest = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => { // ✅ تغییر نوع event به MouseEvent<HTMLButtonElement>

//   return new Promise<void>(async (resolve, reject) => { // ✅ اضافه کردن return new Promise
//     try {
//       const formNumber = await this.projectRequestService.getNextFormNumber();
//       console.log("Next Form Number:", formNumber);
//       const requestData = {
//         CustomerId: this.state.selectedCustomer,      // ✅ مشتری
//         Title: this.state.requestTitle,             // ✅ عنوان پروژه (به Title تغییر دادم که با احتمال زیاد با فیلد SharePoint مطابقت داشته باشه)
//         Description1: this.state.requestNote,         // ✅ توضیحات پروژه (به Description1 تغییر دادم که با احتمال زیاد با فیلد SharePoint مطابقت داشته باشه)
//         FormNumber: formNumber                     // ✅ شماره فرم
//         // ✅ میتونی بقیه فیلدهای فرم رو هم اینجا اضافه کنی مثل RequestDate, EstimatedDuration, EstimatedCost, RequestStatus اگر نیاز داری
//       };
//       const projectRequestItem = await this.projectRequestService.createProjectRequest(
//         requestData
//       );
//       console.log("Request form created. ID:", projectRequestItem.Id);
//       const documentSetName = `Request-${projectRequestItem}`; // Name the Document Set based on the Request ID
//       const documentSetLink = await this.projectRequestService.createDocumentSet(documentSetName);
//       console.log("Document Set created:", documentSetLink);

//       // ✅ اضافه کردن تاخیر 1 ثانیه (1000 میلی ثانیه)
//       await new Promise(resolve => setTimeout(resolve, 1000)); // 👈 منتظر بمان 1 ثانیه

//       await this.projectRequestService.updateDocumentSetLink(
//         projectRequestItem.Id,
//         documentSetLink
//       );
//       console.log("DocumentSetLink updated successfully.");

//       this.setState({ RequestStatus: 'success', formNumber: formNumber }, () => {
//         if (this.state.RequestStatus === 'success') {
//           window.setTimeout(() => {
//             this.setState({ RequestStatus: 'initial' });
//           }, 3000);
//         }
//       });

//       resolve(projectRequestItem); // Resolve the promise if everything is successful

//     } catch (error) {
//       console.error("Error در handleCreateProjectRequest:", error); // ✅ پیغام خطای واضح تر برای console.log
//       resolve(null); // ✅ Resolve با مقدار null برای جلوگیری از خطای unhandled promise rejection
//     }
//   });
// }

// // //////////////////////////////////////////////////////////////////////////////////////////////////////////

//   resetForm = (): void => {
//     this.setState({
//       isProjectCreated: false,
//       requestId: null,
//       selectedCustomer: null,
//       selectedCustomerName: "",
//       requestTitle: "",
//       requestDate: moment().format("YYYY-MM-DD"),
//       estimatedDuration: 0,
//       estimatedCost: 0,
//       requestNote: "",
//       RequestStatus: "New",
//       // Reset any other state variables as needed
//     });
//   };

//  public render() {
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
//     } = this.state;

//     return (
//       <div>
//         <h2>
//           {isProjectCreated ? "Add Assessments" : "Create Project Request"}
//         </h2>

//         {isProjectCreated && (
//           <div>
//             <h3>Project Information</h3>
//             <p>
//               <strong>Project ID:</strong> {requestId}
//             </p>
//             <p>
//               <strong>Form Number:</strong> {formNumber}
//             </p>
//             <p>
//               <strong>Title:</strong> {requestTitle}
//             </p>
//             <p>
//               <strong>Customer Name:</strong> {selectedCustomerName}
//             </p>
//             <p>
//               <strong>Request Date:</strong> {requestDate}
//             </p>
//             <p>Request Note:</p> {requestNote}
//             {/* Include other information as needed */}
//           </div>
//         )}

//         {/* Project Request Form */}
//         <TextField
//           label="Request Title"
//           value={requestTitle}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestTitle")
//           }
//           readOnly={isProjectCreated}
//         />
//         <GenericDropdown
//           label="Customer"
//           options={customerOptions}
//           selectedKey={selectedCustomer}
//           onChanged={this.handleDropdownChange}
//           placeHolder="Select Customer"
//           disabled={isProjectCreated}
//         />
//         <TextField
//           label="Request Date"
//           value={requestDate}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestDate")
//           }
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label="Estimated Duration (days)"
//           value={estimatedDuration.toString()}
//           onChanged={(newValue) =>
//             this.setState({ estimatedDuration: parseInt(newValue) || 0 })
//           }
//           type="number"
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label="Estimated Cost"
//           value={estimatedCost.toString()}
//           onChanged={(newValue) =>
//             this.setState({ estimatedCost: parseInt(newValue) || 0 })
//           }
//           type="number"
//           readOnly={isProjectCreated}
//         />
//         <TextField
//           label="Request Note"
//           value={requestNote}
//           onChanged={(newValue) =>
//             this.handleInputChange(newValue || "", "requestNote")
//           }
//           multiline
//           rows={4}
//           readOnly={isProjectCreated}
//         />
//         {/* Create Button */}
//         {!isProjectCreated && (
//           <PrimaryButton
//             text="Create"
//             onClick={this.handleCreateProjectRequest}
//           />
//         )}

//         {/* Technical Assessment Table */}
//         {isProjectCreated && requestId && (
//           <TechnicalAssessmentTable
//             projectRequestService={this.projectRequestService}
//             requestId={requestId}
//             resetForm={this.resetForm}
//           />
//         )}

//         {/* Cancel Button */}
//         <div>
//           <PrimaryButton text="Cancel" onClick={this.resetForm} />
//         </div>
//       </div>
//     );
//   }
// }

// export default ProjectRequestForm;
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
import ProjectRequestService from "../services/ProjectRequestService"; // ✅ مطمئن شو مسیر درسته
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

  // handleCreateProjectRequest = (): void => {
  //   const {
  //     requestTitle,
  //     selectedCustomer,
  //     requestDate,
  //     estimatedDuration,
  //     estimatedCost,
  //     requestNote,
  //     RequestStatus,
  //   } = this.state;

  //   // Step 1: Get the next form number
  //   this.projectRequestService
  //     .getNextFormNumber()
  //     .then((formNumber) => {
  //       console.log("Next Form Number:", formNumber);

  //       // Step 2: Prepare the request data
  //       const requestData = {
  //         Title: requestTitle.trim(),
  //         CustomerId: selectedCustomer || null,
  //         RequestDate: requestDate,
  //         EstimatedDuration: estimatedDuration,
  //         EstimatedCost: estimatedCost,
  //         Description1: requestNote,
  //         RequestStatus: RequestStatus.trim(),
  //         FormNumber: formNumber,
  //       };

  //       // Step 3: Create the project request
  //       return this.projectRequestService.createProjectRequest(requestData);
  //     })
  //     .then((response) => {
  //       if (response && response.requestId) {
  //         const requestId = response.requestId; // ✅ Corrected

  //         console.log("New project created with ID:", requestId);

  //         const documentSetName = `Request-${requestId}`;
  //         return (
  //           this.projectRequestService
  //             .createDocumentSet(documentSetName)
  //             // .then((documentSetLink) => {
  //             //     if (!documentSetLink) {
  //             //         throw new Error("Document Set creation failed. No valid link returned.");
  //             //     }

  //             //     console.log("Document Set created with link:", documentSetLink);

  //             //     return this.projectRequestService.updateDocumentSetLink(
  //             //         requestId,
  //             //         documentSetLink
  //             //     );
  //             // })
  //             .then((documentSetLink) => {
  //               if (!documentSetLink) {
  //                 console.error(
  //                   "Document Set creation failed. No link returned."
  //                 );
  //                 throw new Error(
  //                   "Document Set creation failed. No valid link returned."
  //                 );
  //               }

  //               console.log("Document Set created with link:", documentSetLink);

  //               if (!this.state.requestId) {
  //                 // ✅ Prevent duplicate calls
  //                 return this.projectRequestService.updateDocumentSetLink(
  //                   requestId,
  //                   documentSetLink
  //                 );
  //               } else {
  //                 console.warn(
  //                   "Skipping duplicate updateDocumentSetLink call."
  //                 );
  //                 return Promise.resolve();
  //               }
  //             })
  //             .then(() => {
  //               console.log("Document Set link updated successfully.");
  //               this.setState(
  //                 {
  //                   isProjectCreated: true,
  //                   requestId: response.requestId, // ✅ Ensure correct variable is used
  //                   formNumber: response.FormNumber, // ✅ Ensure correct variable is used
  //                 },
  //                 () => {
  //                   alert("Project request created successfully!");
  //                 }
  //               );
  //             })
  //         );
  //       } else {
  //         throw new Error(
  //           "Error creating project request. Response was invalid."
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error creating project request or Document Set:", error);
  //       console.warn(
  //         "There was an error creating your project request or its associated Document Set. Please check the console for details."
  //       );
  //       // ✅ نمایش پیغام خطای دقیق تر در کنسول
  //       console.error("Detailed error:", error); // نمایش کامل شیء خطا
  //       if (error instanceof Error) {
  //         // بررسی اینکه آیا error از نوع Error است
  //         console.error("Error message:", error.message); // نمایش فقط پیغام خطا (اگر وجود داشته باشد)
  //       }
  //     });
  //   // .catch((error) => {
  //   //     console.error("Error creating project request or Document Set:", error);
  //   //     console.warn( // ✅ تغییر از alert به console.warn
  //   //     "There was an error creating your project request or its associated Document Set. Please check the console for details."
  //   // );
  //   //     // alert(
  //   //     //     "There was an error creating your project request or its associated Document Set. Please check the console for details."
  //   //     // );
  //   // });
  // };

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
        // CHANGED: Removed duplicate createDocumentSet call here,
        // since createProjectRequest already handles Document Set creation.
        return this.projectRequestService.createProjectRequest(requestData);
      })
      .then((response) => {
        if (response && response.requestId) {
          console.log("New project created with ID:", response.requestId);

          // CHANGED: No extra Document Set call after creation.
          this.setState(
            {
              isProjectCreated: true,
              requestId: response.requestId,
              formNumber: response.FormNumber, // kept if needed; otherwise, can be removed.
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
              <strong>Form Number:</strong> {formNumber}
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
            <p>Request Note:</p> {requestNote}
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
        <TextField
          label="Request Note"
          value={requestNote}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestNote")
          }
          multiline
          rows={4}
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

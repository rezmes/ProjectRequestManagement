// // TechnicalAssessmentTable.tsx

// import * as React from "react";
// import {
//   PrimaryButton,
//   TextField,
//   IDropdownOption,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";
// import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
// import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
// import PricingDetails from "./PricingDetails";
// import styles from "./TechnicalAssessmentTable.module.scss";

// import * as strings from "PrmWebPartStrings";

// import ProjectRequestService, {
//   IPricingDetails,
// } from "../services/ProjectRequestService";

// class TechnicalAssessmentTable extends React.Component<
//   ITechnicalAssessmentProps,
//   ITechnicalAssessmentState
// > {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: ITechnicalAssessmentProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService(this.context);
//     this.state = {
//       assessments: [],
//       inventoryItems: [],
//     };
//   }

//   componentDidMount() {
//     this.loadInventoryItems();
//   }

//   handleFinalSubmit = (): void => {
//     const { assessments } = this.state;
//     const { requestId, resetForm } = this.props;

//     if (!assessments || assessments.length === 0) {
//       alert("Please add at least one assessment before submitting.");
//       return;
//     }

//     const pricingDetails: IPricingDetails[] = [];

//     // Save assessments and get their IDs
//     this.projectRequestService
//       .saveAssessments(assessments, requestId)
//       .then((assessmentIds) => {
//         console.log("Assessment IDs:", assessmentIds);

//         // Map assessments to pricing details using the created IDs
//         assessments.forEach((assessment, index) => {
//           ["humanResources", "machines", "materials"].forEach((field) => {
//             if (Array.isArray(assessment[field])) {
//               assessment[field].forEach((item: any) => {
//                 pricingDetails.push({
//                   RequestID: requestId,
//                   UnitPrice: parseFloat(item.pricePerUnit),
//                   Quantity: parseInt(item.quantity),
//                   AssessmentItemID: assessmentIds[index],
//                 });
//               });
//             }
//           });
//         });

//         console.log("Pricing Details to Save:", pricingDetails);

//         // Save pricing details
//         return this.projectRequestService.savePricingDetails(pricingDetails);
//       })
//       .then(() => {
//         console.log("Pricing details saved successfully.");
//         return this.projectRequestService.getPricingDetailsByRequestID(
//           requestId
//         );
//       })
//       .then((pricingDetails) => {
//         console.log("Fetched Pricing Details After Save:", pricingDetails);

//         // Calculate the total estimated cost
//         const totalEstimatedCost = pricingDetails.reduce(
//           (sum, detail) => sum + detail.TotalCost,
//           0
//         );

//         console.log("Total Estimated Cost:", totalEstimatedCost);

//         // Update the ProjectRequest with the estimated cost
//         return this.projectRequestService
//           .updateProjectRequestEstimatedCost(requestId, totalEstimatedCost)
//           .then(() => {
//             alert("Assessments and pricing details saved successfully!");
//             resetForm();
//           });
//       })
//       .catch((error) => {
//         console.error("Error saving assessments and pricing details:", error);
//         alert(
//           "Error saving assessments and pricing details. Please check the console for details."
//         );
//       });
//   };

//   loadInventoryItems = () => {
//     this.projectRequestService.getInventoryItems().then((items) => {
//       console.log("Inventory Items:", items); // Debugging
//       this.setState({ inventoryItems: items });
//     });
//   };
  
//   // filterInventoryItems = (categories: string[]): IDropdownOption[] => {
//   //   const { inventoryItems } = this.state;
//   //   const filteredItems = inventoryItems
//   //     .filter((item) => categories.indexOf(item.itemCategory) > -1)
//   //     .map((item) => ({ key: item.key, text: item.text }));
//   //   console.log("Filtered Items:", filteredItems); // Debugging
//   //   return filteredItems;
//   // };
//   filterInventoryItems = (categories: string[]): IDropdownOption[] => {
//     const { inventoryItems } = this.state;
  
//       // Debug: Log categories and inventory items
//   console.log("Filtering for categories:", categories);
//   console.log("All inventory items:", inventoryItems);

//     // Map English category keys to their Persian equivalents
//     const categoryMap: { [key: string]: string[] } = {
//       HumanResource: [strings.HumanResource,"نیروی انسانی"], // English & Persian
//       Machine: [strings.Machine, "ماشین آلات"], 
//       Material: [strings.Material,"ابزار","محصول","مواد اولیه" ]
//     };
  
//     // Get all valid category names for the requested categories
//     const validCategories = categories.reduce((acc, category) => {
//       return acc.concat(categoryMap[category] || [category]);
//     }, [] as string[]);
  
//     // Filter items using indexOf for SPFx 1.4.1 compatibility
//     const filteredItems = inventoryItems.filter((item) => 
//       validCategories.indexOf(item.itemCategory) > -1
//     );
  
//     console.log("Filtered Items:", filteredItems);
//     return filteredItems.map((item) => ({ key: item.key, text: item.text }));
//   };

  
//   handleInputChange = (
//     newValue: string,
//     nestedField: string,
//     index: number,
//     partIndex?: number,
//     field?: string
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];

//       if (partIndex !== undefined && field) {
//         const items = [...(assessments[index][field] || [])];
//         const updatedItem = { ...items[partIndex] };

//         updatedItem[nestedField] = newValue;

//         items[partIndex] = updatedItem;
//         assessments[index][field] = items;
//       } else {
//         assessments[index] = { ...assessments[index], [nestedField]: newValue };
//       }

//       return { assessments };
//     });
//   };

//   handleDropdownChange = (
//     field: string,
//     option: IDropdownOption,
//     index: number,
//     partIndex: number
//   ): void => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field][partIndex].item = option;
//       return { assessments };
//     });
//   };

//   addRow = (field: string, index: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];

//       if (!Array.isArray(assessments[index][field])) {
//         assessments[index][field] = [];
//       }

//       assessments[index][field].push({
//         item: { key: "", text: "" },
//         quantity: 0,
//         pricePerUnit: 0,
//       });

//       return { assessments };
//     });
//   };

//   removeRow = (field: string, index: number, partIndex: number) => {
//     this.setState((prevState) => {
//       const assessments = [...prevState.assessments];
//       assessments[index][field].splice(partIndex, 1);
//       return { assessments };
//     });
//   };

//   addAssessment = () => {
//     this.setState((prevState) => ({
//       assessments: [
//         ...prevState.assessments,
//         {
//           activity: "",
//           humanResources: [],
//           machines: [],
//           materials: [],
//         },
//       ],
//     }));
//   };

//   renderTable = (
//     label: string,
//     field: string,
//     options: IDropdownOption[],
//     assessment: any,
//     index: number
//   ) => (
//     <PricingDetails
//       label={label}
//       field={field}
//       options={options}
//       assessment={assessment}
//       index={index}
//       handleDropdownChange={this.handleDropdownChange}
//       handleInputChange={this.handleInputChange}
//       addRow={this.addRow}
//       removeRow={this.removeRow}
//     />
//   );

//   render() {
//     const { assessments } = this.state;

//     return (
//       <div className={styles.assessmentContainer}>
//         <h3 className={styles.assessmentHeading}>
//           {strings.TechnicalAssessments}
//         </h3>
//         {assessments.map((assessment, index) => (
//           <div key={index}>
//             <TextField
//               label={`${strings.Activity} ${index + 1}`}
//               value={assessment.activity}
//               onChanged={(newValue: string) =>
//                 this.handleInputChange(newValue, "activity", index)
//               }
//             />

//             {this.renderTable(
//               strings.HumanResource,
//               "humanResources",
//               this.filterInventoryItems([strings.HumanResource]),
//               assessment,
//               index
//             )}
//             {this.renderTable(
//               strings.Machine,
//               "machines",
//               this.filterInventoryItems([strings.Machine]),
//               assessment,
//               index
//             )}
//             {this.renderTable(
//               strings.Material,
//               "materials",
//               this.filterInventoryItems([strings.Material]),
//               assessment,
//               index
//             )}

//             <hr />
//           </div>
//         ))}
//         <PrimaryButton
//           className={styles.addAssessmentButton}
//           text={strings.AddAssessment}
//           onClick={this.addAssessment}
//         />
//         <PrimaryButton
//           className={styles.finalSubmitButton}
//           text={strings.FinalSubmit}
//           onClick={this.handleFinalSubmit}
//         />
//       </div>
//     );
//   }
// }

// export default TechnicalAssessmentTable;
// TechnicalAssessmentTable.tsx

import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import { ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";  // Import ProgressIndicator


import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import PricingDetails from "./PricingDetails";
import styles from "./TechnicalAssessmentTable.module.scss";

import * as strings from "PrmWebPartStrings";

import ProjectRequestService, {
  IDropdownOptionWithCategory,
  IPricingDetails,
} from "../services/ProjectRequestService";
import { IAssessment } from "./IAssessment";
import { IResource } from "./IAssessment";

import  {ResourceRow}  from "./ResourceRow";




class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;
    // Add unique key generator
  private rowKeyCounter = 0;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      assessments: [] as IAssessment[],
      inventoryItems: [] as IDropdownOptionWithCategory[],
      isLoading: false, // Add loading state
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
    console.log(`[DEBUG] TechnicalAssessmentTable props:`, this.props);
    if (this.props.requestId && (this.props.isEditMode || this.props.isDisplayMode)) {
            // Add delay to ensure DOM stability
      setTimeout(() => this.loadAssessments(this.props.requestId), 1000);
      // this.loadAssessments(this.props.requestId);
      console.log(`[DEBUG] Calling loadAssessments from componentDidMount() with requestId: ${this.props.requestId}`);
    }
  }

  // private async loadAssessments(requestId: number) {
  //   this.setState({ isLoading: true });
  //   try {
  //     const assessmentsData = await this.projectRequestService.getAssessmentsByRequestId(requestId);
  //     if (assessmentsData && assessmentsData.length > 0) {
  //       this.setState({ assessments: assessmentsData });
  //     } else {
  //       // If no assessments are found, initialize with one empty assessment
  //       this.addAssessment(); // Initialize with one empty assessment if none exist
  //     }
  //   } catch (error) {
  //     console.error("Error loading assessments:", error);
  //     alert("Failed to load assessments.");
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  // }

  private async loadAssessments(requestId: number) {
    console.log(`[DEBUG] loadAssessments called with requestId: ${requestId}`);
    this.setState({ isLoading: true });
    try {
      const assessmentsData = await this.projectRequestService.getAssessmentsByRequestId(requestId);
      console.log(`[DEBUG] API Response:`, assessmentsData);
      if (assessmentsData.length > 0) {
        // Add unique keys to assessments
        const keyedAssessments = assessmentsData.map((a, index) => ({
          ...a,
          _key: a._key || `assessment - ${index} - ${Date.now()}` 
          // `assessment-${this.rowKeyCounter++}`
          
        }));
        console.log(`[DEBUG] Processed Assessments:`, keyedAssessments);
        this.setState({ assessments: keyedAssessments });
      } else {
        console.log(`[DEBUG] No assessments found, adding a new one.`);
        this.addAssessment();
      }
    } catch (error) {
      console.error("Error loading assessments:", error);
      this.setState({ assessments: [] });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  addAssessment = () => {
    this.setState(prevState => ({
      assessments: [
        ...prevState.assessments,
        {
          _key: `new-assessment-${Date.now()}`, // Unique key
          activity: "",
          humanResources: [],
          machines: [],
          materials: []
          // humanResources: this.initResourceArray(),
          // machines: this.initResourceArray(),
          // materials: this.initResourceArray()
        }
      ]
    }));
  };

// In TechnicalAssessmentTable.tsx
private initResourceArray(): IResource[] {
  return [{
    _key: `resource-${Date.now()}-${Math.random()}`, // Add _key
    item: { key: "", text: "" },
    quantity: 0,
    pricePerUnit: 0
  }];
}


  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    const pricingDetails: IPricingDetails[] = [];


    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then((assessmentIds) => {


        assessments.forEach((assessment, index) => {
          ["humanResources", "machines", "materials"].forEach((field) => {
            if (Array.isArray(assessment[field])) {
              assessment[field].forEach((item: any) => {
                pricingDetails.push({
                  RequestID: requestId,
                  UnitPrice: parseFloat(item.pricePerUnit),
                  Quantity: parseInt(item.quantity),
                  AssessmentItemID: assessmentIds[index],
                });
              });
            }
          });
        });


        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {

        return this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );
      })
      .then((pricingDetails) => {


        const totalEstimatedCost = pricingDetails.reduce(
          (sum, detail) => sum + detail.TotalCost,
          0
        );


        return this.projectRequestService
          .updateProjectRequestEstimatedCost(requestId, totalEstimatedCost)
          .then(() => {
            alert("Assessments and pricing details saved successfully!");
            resetForm();
          });
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(
          "Error saving assessments and pricing details. Please check the console for details."
        );
      });
  };

  loadInventoryItems = () => {
    this.projectRequestService.getInventoryItems().then((items) => {

      this.setState({ inventoryItems: items || [] });
    }).catch((error)=> {
      console.log("Error loading inventory: ", error);
      this.setState({inventoryItems: []});
    
    });
  };


  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

      // Add null check
  if (!inventoryItems || !Array.isArray(inventoryItems)) return [];


    const categoryMap: { [key: string]: string[] } = {
      HumanResource: [strings.HumanResource,"نیروی انسانی"],
      Machine: [strings.Machine, "ماشین آلات"],
      Material: [strings.Material,"ابزار","محصول","مواد اولیه" ]
    };


    const validCategories = categories.reduce((acc, category) => [
      //{ return acc.concat(categoryMap[category] || [category]);}
      ...acc,
      ...(categoryMap[category] || [category])
    ], [] as string[]);
    // return inventoryItems
    // .filter(item => validCategories.includes(item.itemCategory))
    // .map(item => ({key: item.key, text: item.text}));

    const filteredItems = inventoryItems.filter((item) =>
      validCategories.indexOf(item.itemCategory) > -1
    );


    return filteredItems.map((item) => ({ key: item.key, text: item.text }));
  };


  handleInputChange = (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (partIndex !== undefined && field) {
        const items = [...(assessments[index][field] || [])];
        const updatedItem = { ...items[partIndex] };

        updatedItem[nestedField] = newValue;

        items[partIndex] = updatedItem;
        assessments[index][field] = items;
      } else {
        assessments[index] = { ...assessments[index], [nestedField]: newValue };
      }

      return { assessments };
    });
  };

  handleDropdownChange = (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      if (!assessments[index][field]) {
        assessments[index][field] = []; // Initialize if undefined
      }
      if (!assessments[index][field][partIndex]) {
        assessments[index][field][partIndex] = {}; // Initialize if undefined
      }
      if (!assessments[index][field][partIndex].item) {
        assessments[index][field][partIndex].item = {}; // Initialize if undefined
      }
      assessments[index][field][partIndex].item = option;
      return { assessments };
    });
  };


  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0,
      });

      return { assessments };
    });
  };

  removeRow = (field: string, index: number, partIndex: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].splice(partIndex, 1);
      return { assessments };
    });
  };

  // addAssessment = () => {
  //   this.setState((prevState) => ({
  //     assessments: [
  //       ...prevState.assessments,
  //       {
  //         activity: "",
  //         humanResources: [],
  //         machines: [],
  //         materials: [],
  //       },
  //     ],
  //   }), () => {
  //     // After adding a new assessment, if it's a display mode, re-render to show the empty assessment
  //     if (this.props.isDisplayMode) {
  //       this.forceUpdate(); // Force re-render to display the added empty assessment
  //     }
  //   });
  // };


  renderTable = (
    label: string,
    field: string,
    options: IDropdownOption[],
    assessment: any,
    index: number
  ) => (
    <PricingDetails
      label={label}
      field={field}
      options={options}
      assessment={assessment}
      index={index}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
      disabled={this.props.isDisplayMode} // Disable controls in Display mode
    />
  );

  render() {
    const { assessments, isLoading } = this.state;
    const { isDisplayMode } = this.props;
    const isReadOnly = isDisplayMode;


    if (isLoading) {
      return <ProgressIndicator
      label={strings.LoadingAssessments}
      description={strings.PleaseWait} />;
    }


    return (
      <div className={styles.assessmentContainer}>
        {/* <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity || ''} // Ensure value is not undefined
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
              readOnly={isReadOnly} // Make Activity TextField read-only in Display mode
            />

            {this.renderTable(
              strings.HumanResource,
              "humanResources",
              this.filterInventoryItems([strings.HumanResource]),
              assessment,
              index
            )} */}
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>
        {assessments.length > 0 && assessments.map((assessment, index) => (
          <div key={assessment._key}> {/* Use unique key */}
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity || ''}
              readOnly={isDisplayMode}
            />
            {/* Add resource tables with proper keys */}
            {this.renderResourceTable(
              strings.HumanResource,
              "humanResources",
              assessment,
              index
            )}

            {this.renderResourceTable(
              strings.Machine,
              "machines",
              assessment,
              index
            )}
            {this.renderResourceTable(
              strings.Material,
              "materials",
              assessment,
              index
            )}

            <hr />
          </div>
        ))}
        {/* Conditionally render "Add Assessment" and "Final Submit" buttons based on mode */}
        {/* {!(isDisplayMode) && (
          <>
            <PrimaryButton
              className={styles.addAssessmentButton}
              text={strings.AddAssessment}
              onClick={this.addAssessment}
              disabled={isReadOnly}
            />
            <PrimaryButton
              className={styles.finalSubmitButton}
              text={strings.FinalSubmit}
              onClick={this.handleFinalSubmit}
              disabled={isReadOnly}
              style={{ marginLeft: '10px' }}
            />
          </>
        )} */}
      </div>
    );
  }

  //  private renderResourceTable(
  //   label: string,
  //   field: keyof IAssessment,
  //   assessment: IAssessment,
  //   index: number
  // ) {
  //   const resources = assessment[field] || [];
  //   return (
  //     <PricingDetails
  //       key={`${assessment._key}-${field}`}
  //       label={label}
  //       field={field}
  //       options={this.filterInventoryItems([label])}
  //       assessment={assessment}
  //       index={index} handleDropdownChange={function (field: string, option: IDropdownOption, index: number, partIndex: number): void {
  //         throw new Error("Function not implemented.");
  //       } } handleInputChange={function (newValue: string, nestedField: string, index: number, partIndex?: number, field?: string): void {
  //         throw new Error("Function not implemented.");
  //       } } addRow={function (field: string, index: number): void {
  //         throw new Error("Function not implemented.");
  //       } } removeRow={function (field: string, index: number, partIndex: number): void {
  //         throw new Error("Function not implemented.");
  //       } }        // ... other props
  //     >
  //       {resources.map((resource, resIndex) => (
  //         <ResourceRow
  //           key={resource._key} // Unique key
  //           resource={resource}
  //           // ... other props
  //         />
  //       ))}
  //     </PricingDetails>
  //   );
  // }
  private renderResourceTable(
    label: string,
    field: keyof IAssessment,
    assessment: IAssessment,
    index: number
  ) {
  // Add type assertion
  const resources = assessment[field] as IResource[];
  

  
    return (
      <PricingDetails
        key={`${assessment._key}-${field}`} // Use bracket notation to avoid TypeScript error
        label={label}
        field={field}
        options={this.filterInventoryItems([label])}
        assessment={assessment}
        index={index} handleDropdownChange={function (field: string, option: IDropdownOption, index: number, partIndex: number): void {
          throw new Error("Function not implemented.");
        } } handleInputChange={function (newValue: string, nestedField: string, index: number, partIndex?: number, field?: string): void {
          throw new Error("Function not implemented.");
        } } addRow={function (field: string, index: number): void {
          throw new Error("Function not implemented.");
        } } removeRow={function (field: string, index: number, partIndex: number): void {
          throw new Error("Function not implemented.");
        } }        >
      {resources.map((resource, resIndex) => (
        <ResourceRow
          key={resource._key}
          resource={resource}
        />
        ))}
      </PricingDetails>
    );
  }

}

export default TechnicalAssessmentTable;
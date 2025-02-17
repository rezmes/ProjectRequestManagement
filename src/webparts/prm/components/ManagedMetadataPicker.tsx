// // // // import * as React from "react";
// // // // import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
// // // // import ProjectRequestService from "../services/ProjectRequestService";
// // // // import { WebPartContext } from "@microsoft/sp-webpart-base";

// // // // export interface IManagedMetadataPickerProps {
// // // //   label: string;
// // // //   onTermSelected: (term: { id: string; label: string }) => void;
// // // //   placeHolder?: string;
// // // //   disabled?: boolean;
// // // //   context: WebPartContext;
// // // // }

// // // // export interface IManagedMetadataPickerState {
// // // //   options: IComboBoxOption[];
// // // //   // Optionally, store input text if you plan to use it for filtering
// // // //   inputValue: string;
// // // // }

// // // // export default class ManagedMetadataPicker extends React.Component<IManagedMetadataPickerProps, IManagedMetadataPickerState> {
// // // //   private projectRequestService: ProjectRequestService;

// // // //   constructor(props: IManagedMetadataPickerProps) {
// // // //     super(props);
// // // //     this.projectRequestService = new ProjectRequestService(this.props.context);
// // // //     this.state = {
// // // //       options: [],
// // // //       inputValue: ""
// // // //     };
// // // //   }

// // // //   // When the ComboBox's menu opens, fetch terms based on the current input value.
// // // //   private _onMenuOpen = (): void => {
// // // //     const filterText = this.state.inputValue || "";
// // // //     this.projectRequestService.getTermsByLabel(filterText)
// // // //       .then(terms => {
// // // //         const options = terms.map(term => ({
// // // //           key: term.id,
// // // //           text: term.label
// // // //         }));
// // // //         this.setState({ options });
// // // //       })
// // // //       .catch(error => {
// // // //         console.error("Error fetching terms", error);
// // // //       });
// // // //   };

// // // //   // Capture selection changes using onChanged
// // // //   private _onChanged = (option: IComboBoxOption): void => {
// // // //     if (option) {
// // // //       this.props.onTermSelected({ id: option.key as string, label: option.text });
// // // //     }
// // // //   };

// // // //   public render(): React.ReactElement<IManagedMetadataPickerProps> {
// // // //     return (
// // // //       <ComboBox
// // // //         label={this.props.label}
// // // //         options={this.state.options}
// // // //         onMenuOpen={this._onMenuOpen}
// // // //         onChanged={this._onChanged}
// // // //         placeholder={this.props.placeHolder || "Type to search..."}
// // // //         disabled={this.props.disabled}
// // // //         allowFreeform={false}
// // // //       />
// // // //     );
// // // //   }
// // // // }
// // // import * as React from "react";
// // // import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
// // // import ProjectRequestService from "../services/ProjectRequestService";
// // // import { WebPartContext } from "@microsoft/sp-webpart-base";

// // // export interface IManagedMetadataPickerProps {
// // //   label: string;
// // //   onTermSelected: (term: { id: string; label: string }) => void;
// // //   disabled?: boolean;
// // //   context: WebPartContext;
// // //   termSetId?: string; // Note: If termSetId is optional
// // //   fieldInternalName?: string; // Add this line
// // //   placeHolder?: string; // If you use placeholder
// // // }

// // // export interface IManagedMetadataPickerState {
// // //   options: IComboBoxOption[];
// // //   inputValue: string;
// // // }

// // // // ManagedMetadataPicker.tsx modifications
// // // export default class ManagedMetadataPicker extends React.Component<
// // //   IManagedMetadataPickerProps,
// // //   IManagedMetadataPickerState
// // // > {
// // //   private projectRequestService: ProjectRequestService;

// // //   constructor(props: IManagedMetadataPickerProps) {
// // //     super(props);
// // //     this.projectRequestService = new ProjectRequestService(this.props.context);
// // //     this.state = {
// // //       options: [],
// // //       inputValue: "",
// // //     };
// // //     this._onChanged = this._onChanged.bind(this);
// // //   }

// // //   // // Example method to fetch an item
// // //   // private fetchItem = async () => {
// // //   //   try {
// // //   //     const item = await this.projectRequestService.getItemById(
// // //   //       "RequestProjects",
// // //   //       1
// // //   //     );
// // //   //     console.log(item);
// // //   //   } catch (error) {
// // //   //     console.error("Error fetching item:", error);
// // //   //   }
// // //   // };

// // //   // // Example method to update the ProjectCode field
// // //   // private updateProjectCode = async () => {
// // //   //   try {
// // //   //     await this.projectRequestService.updateProjectCode(
// // //   //       "RequestProjects",
// // //   //       1,
// // //   //       "Your Term Label",
// // //   //       "term-guid-here"
// // //   //     );
// // //   //     console.log("Item updated successfully");
// // //   //   } catch (error) {
// // //   //     console.error("Error updating item:", error);
// // //   //   }
// // //   // };

// // //   private _onMenuOpen(): void {
// // //     var self = this;
// // //     var filterText = this.state.inputValue || "";
// // //     var termSetId = this.props.termSetId;
// // //     var fieldInternalName = this.props.fieldInternalName;

// // //     var termsPromise;

// // //     if (termSetId) {
// // //       termsPromise = this.projectRequestService.getTermsByTermSetId(
// // //         termSetId,
// // //         filterText
// // //       );
// // //     } else if (fieldInternalName) {
// // //       termsPromise = this.projectRequestService.getTermsByFieldInternalName(
// // //         fieldInternalName,
// // //         filterText
// // //       );
// // //     }

// // //     if (termsPromise) {
// // //       termsPromise
// // //         .then(function (terms) {
// // //           self.setState({
// // //             options: terms.map(function (term) {
// // //               return {
// // //                 key: term.id,
// // //                 text: term.label,
// // //                 data: term,
// // //               };
// // //             }),
// // //           });
// // //         })
// // //         .catch(function (error) {
// // //           console.error("Error fetching terms:", error);
// // //           self.setState({ options: [] });
// // //         });
// // //     }
// // //   }

// // //   // Update render method to use compatible ComboBox properties

// // //   private _onChanged(
// // //     option?: IComboBoxOption,
// // //     index?: number,
// // //     value?: string
// // //   ): void {
// // //     if (option && this.props.onTermSelected) {
// // //       const term = { id: option.key as string, label: option.text };
// // //       this.props.onTermSelected(term);
// // //     }
// // //   }

// // //   public render(): React.ReactElement<IManagedMetadataPickerProps> {
// // //     return (
// // //       <ComboBox
// // //         label={this.props.label}
// // //         options={this.state.options}
// // //         onMenuOpen={this._onMenuOpen.bind(this)}
// // //         onChanged={this._onChanged.bind(this)}
// // //         disabled={this.props.disabled}
// // //         allowFreeform={false}
// // //         autoComplete="on"
// // //         placeHolder={this.props.placeHolder} // Use 'placeHolder' instead of 'placeholder'
// // //       />
// // //     );
// // //   }
// // // }
// // // ManagedMetadataPicker.tsx

// // import * as React from "react";

// // import GenericComboBox from "./GenericComboBox";
// // import { IComboBoxOption } from "office-ui-fabric-react";
// // import ProjectRequestService from "../services/ProjectRequestService";
// // import { WebPartContext } from "@microsoft/sp-webpart-base";
// // export interface IManagedMetadataPickerProps {
// //   label: string;
// //   onTermSelected: (term: { id: string; label: string }) => void;
// //   disabled?: boolean;
// //   context: WebPartContext;
// //   termSetId?: string; // Note: If termSetId is optional
// //   fieldInternalName?: string; // Add this line
// //   placeHolder?: string; // If you use placeholder
// // }

// // export interface IManagedMetadataPickerState {
// //   options: IComboBoxOption[];
// //   inputValue: string;
// // }

// // export default class ManagedMetadataPicker extends React.Component<
// //   IManagedMetadataPickerProps,
// //   IManagedMetadataPickerState
// // > {
// //   private projectRequestService: ProjectRequestService;

// //   constructor(props: IManagedMetadataPickerProps) {
// //     super(props);

// //     this.state = {
// //       options: [],
// //       inputValue: "",
// //     };

// //     // Ensure event handlers are bound
// //     this._onMenuOpen = this._onMenuOpen.bind(this);
// //     this._onChanged = this._onChanged.bind(this);

// //     this.projectRequestService = new ProjectRequestService(this.props.context);
// //   }

// //   private _onMenuOpen(): void {
// //     const filterText = this.state.inputValue || "";
// //     const termSetId = this.props.termSetId;
// //     const fieldInternalName = this.props.fieldInternalName;

// //     let termsPromise;

// //     if (termSetId) {
// //       termsPromise = this.projectRequestService.getTermsByTermSetId(
// //         termSetId,
// //         filterText
// //       );
// //     } else if (fieldInternalName) {
// //       termsPromise = this.projectRequestService.getTermsByFieldInternalName(
// //         fieldInternalName,
// //         filterText
// //       );
// //     } else {
// //       termsPromise = Promise.resolve([]);
// //     }

// //     termsPromise
// //       .then((terms) => {
// //         const options = terms.map((term) => ({
// //           key: term.id,
// //           text: term.label,
// //           data: term,
// //         }));
// //         this.setState({ options });
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching terms:", error);
// //         this.setState({ options: [] });
// //       });
// //   }

// //   private _onChanged(
// //     option?: IComboBoxOption,
// //     index?: number,
// //     value?: string
// //   ): void {
// //     if (option && this.props.onTermSelected) {
// //       const term = { id: option.key as string, label: option.text };
// //       this.props.onTermSelected(term);
// //     }
// //   }

// //   public render(): React.ReactElement<IManagedMetadataPickerProps> {
// //     return (
// //       <GenericComboBox
// //         label={this.props.label}
// //         options={this.state.options}
// //         onMenuOpen={this._onMenuOpen}
// //         onChanged={this._onChanged}
// //         disabled={this.props.disabled}
// //         allowFreeform={true}
// //         autoComplete="on"
// //       />
// //     );
// //   }
// // }
// import * as React from "react";
// import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
// import ProjectRequestService from "../services/ProjectRequestService";
// import { WebPartContext } from "@microsoft/sp-webpart-base";

// export interface IManagedMetadataPickerProps {
//   label: string;
//   onTermSelected: (term: { id: string; label: string }) => void;
//   disabled?: boolean;
//   context: WebPartContext;
//   termSetId?: string; // For fetching via term set if needed
//   fieldInternalName?: string; // Alternative for field-based lookup
//   parentTermId?: string; // Use this to fetch child terms under "شماره سفارش"
//   placeHolder?: string;
// }

// export interface IManagedMetadataPickerState {
//   options: IComboBoxOption[];
//   inputValue: string;
// }

// export default class ManagedMetadataPicker extends React.Component<
//   IManagedMetadataPickerProps,
//   IManagedMetadataPickerState
// > {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IManagedMetadataPickerProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService(this.props.context);
//     this.state = {
//       options: [],
//       inputValue: "",
//     };
//     this._onMenuOpen = this._onMenuOpen.bind(this);
//     this._onChanged = this._onChanged.bind(this);
//   }

//   private _onMenuOpen(): void {
//     const filterText = this.state.inputValue || "";
//     let termsPromise: Promise<{ id: string; label: string }[]>;

//     if (this.props.parentTermId) {
//       // Use GetChildTerms method to fetch terms under the given parent term ("شماره سفارش")
//       termsPromise = this.projectRequestService.getChildTermsByTermId(
//         this.props.parentTermId,
//         filterText
//       );
//     } else if (this.props.termSetId) {
//       // Fallback: fetch terms by term set ID if parentTermId isn't provided
//       termsPromise = this.projectRequestService.getTermsByTermSetId(
//         this.props.termSetId,
//         filterText
//       );
//     } else if (this.props.fieldInternalName) {
//       // Alternative: fetch terms by field internal name
//       termsPromise = this.projectRequestService.getTermsByFieldInternalName(
//         this.props.fieldInternalName,
//         filterText
//       );
//     } else {
//       termsPromise = Promise.resolve([]);
//     }

//     termsPromise
//       .then((terms) => {
//         const options = terms.map((term) => ({
//           key: term.id,
//           text: term.label,
//           data: term,
//         }));
//         this.setState({ options });
//       })
//       .catch((error) => {
//         console.error("Error fetching terms:", error);
//         this.setState({ options: [] });
//       });
//   }

//   private _onChanged(
//     option?: IComboBoxOption,
//     index?: number,
//     value?: string
//   ): void {
//     if (option && this.props.onTermSelected) {
//       const term = { id: option.key as string, label: option.text };
//       this.props.onTermSelected(term);
//     }
//   }

//   public render(): React.ReactElement<IManagedMetadataPickerProps> {
//     return (
//       <ComboBox
//         label={this.props.label}
//         options={this.state.options}
//         onMenuOpen={this._onMenuOpen}
//         onChanged={this._onChanged}
//         disabled={this.props.disabled}
//         allowFreeform={true}
//         // Omit placeholder since it's not supported in your version
//       />
//     );
//   }
// }
import * as React from "react";
import GenericComboBox from "./GenericComboBox";
import { IComboBoxOption } from "office-ui-fabric-react";
import ProjectRequestService from "../services/ProjectRequestService";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IManagedMetadataPickerProps {
  label: string;
  onTermSelected: (term: { id: string; label: string }) => void;
  disabled?: boolean;
  context: WebPartContext;
  placeHolder?: string; // Note: if your ComboBox version doesn't support placeholder, ignore it.
}

export interface IManagedMetadataPickerState {
  options: IComboBoxOption[];
}

export default class ManagedMetadataPicker extends React.Component<IManagedMetadataPickerProps, IManagedMetadataPickerState> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IManagedMetadataPickerProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      options: []
    };
    this._onMenuOpen = this._onMenuOpen.bind(this);
    this._onChanged = this._onChanged.bind(this);
  }

  private _onMenuOpen(): void {
    // Fetch taxonomy terms using the service method
    this.projectRequestService.getTaxonomyTerms('5863383a-85c5-4fbd-8114-11ef83bf9175')
      .then((terms) => {
        const options: IComboBoxOption[] = terms.map(term => ({
          key: term.id,
          text: term.label
        }));
        this.setState({ options });
      })
      .catch(error => {
        console.error("Error fetching taxonomy terms", error);
        this.setState({ options: [] });
      });
  }

  private _onChanged(option?: IComboBoxOption, index?: number, value?: string): void {
    if (option && this.props.onTermSelected) {
      this.props.onTermSelected({ id: option.key as string, label: option.text });
    }
  }

  public render(): React.ReactElement<IManagedMetadataPickerProps> {
    return (
      <GenericComboBox
        label={this.props.label}
        options={this.state.options}
        onChanged={this._onChanged}
        onMenuOpen={this._onMenuOpen}
        disabled={this.props.disabled}
        allowFreeform={true}
        autoComplete="on"
      />
    );
  }
}

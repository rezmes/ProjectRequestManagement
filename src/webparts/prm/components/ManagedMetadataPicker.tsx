// import * as React from "react";
// import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
// import ProjectRequestService from "../services/ProjectRequestService";
// import { WebPartContext } from "@microsoft/sp-webpart-base";

// export interface IManagedMetadataPickerProps {
//   label: string;
//   onTermSelected: (term: { id: string; label: string }) => void;
//   placeHolder?: string;
//   disabled?: boolean;
//   context: WebPartContext;
// }

// export interface IManagedMetadataPickerState {
//   options: IComboBoxOption[];
//   // Optionally, store input text if you plan to use it for filtering
//   inputValue: string;
// }

// export default class ManagedMetadataPicker extends React.Component<IManagedMetadataPickerProps, IManagedMetadataPickerState> {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IManagedMetadataPickerProps) {
//     super(props);
//     this.projectRequestService = new ProjectRequestService(this.props.context);
//     this.state = {
//       options: [],
//       inputValue: ""
//     };
//   }

//   // When the ComboBox's menu opens, fetch terms based on the current input value.
//   private _onMenuOpen = (): void => {
//     const filterText = this.state.inputValue || "";
//     this.projectRequestService.getTermsByLabel(filterText)
//       .then(terms => {
//         const options = terms.map(term => ({
//           key: term.id,
//           text: term.label
//         }));
//         this.setState({ options });
//       })
//       .catch(error => {
//         console.error("Error fetching terms", error);
//       });
//   };

//   // Capture selection changes using onChanged
//   private _onChanged = (option: IComboBoxOption): void => {
//     if (option) {
//       this.props.onTermSelected({ id: option.key as string, label: option.text });
//     }
//   };

//   public render(): React.ReactElement<IManagedMetadataPickerProps> {
//     return (
//       <ComboBox
//         label={this.props.label}
//         options={this.state.options}
//         onMenuOpen={this._onMenuOpen}
//         onChanged={this._onChanged}
//         placeholder={this.props.placeHolder || "Type to search..."}
//         disabled={this.props.disabled}
//         allowFreeform={false}
//       />
//     );
//   }
// }
import * as React from "react";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
import ProjectRequestService from "../services/ProjectRequestService";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IManagedMetadataPickerProps {
  label: string;
  onTermSelected: (term: { id: string; label: string }) => void;
  disabled?: boolean;
  context: WebPartContext;
}

export interface IManagedMetadataPickerState {
  options: IComboBoxOption[];
  inputValue: string;
}

export default class ManagedMetadataPicker extends React.Component<
  IManagedMetadataPickerProps,
  IManagedMetadataPickerState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IManagedMetadataPickerProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      options: [],
      inputValue: "",
    };
  }

  private _onMenuOpen = (): void => {
    const filterText = this.state.inputValue || "";
    this.projectRequestService
      .getTermsByLabel(filterText)
      .then((terms) => {
        const options = terms.map((term) => ({
          key: term.id,
          text: term.label,
        }));
        this.setState({ options });
      })
      .catch((error) => {
        console.error("Error fetching terms", error);
      });
  };

  private _onChanged = (option: IComboBoxOption): void => {
    if (option) {
      this.props.onTermSelected({
        id: option.key as string,
        label: option.text,
      });
    }
  };

  public render(): React.ReactElement<IManagedMetadataPickerProps> {
    return (
      <ComboBox
        label={this.props.label}
        options={this.state.options}
        onMenuOpen={this._onMenuOpen}
        onChanged={this._onChanged}
        disabled={this.props.disabled}
        allowFreeform={false}
      />
    );
  }
}

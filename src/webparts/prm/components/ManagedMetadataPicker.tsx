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

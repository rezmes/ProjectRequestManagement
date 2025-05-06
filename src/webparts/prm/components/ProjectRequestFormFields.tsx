// src/webparts/prm/components/ProjectRequestFormFields.tsx
import * as React from "react";
import { TextField, IDropdownOption } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import ManagedMetadataPicker from "./ManagedMetadataPicker";
import * as strings from "PrmWebPartStrings";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProjectRequestFormFieldsProps {
  requestTitle: string;
  selectedCustomer: string | number | null;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  customerOptions: IDropdownOption[];
  onInputChange: (newValue: string, field: string) => void;
  onDropdownChange: (option?: IDropdownOption) => void;
  onTermSelected: (term: { id: string; label: string }) => void;
  context: WebPartContext;
  isReadOnly: boolean;
}

export class ProjectRequestFormFields extends React.Component<
  IProjectRequestFormFieldsProps,
  {}
> {
  public render(): React.ReactElement<IProjectRequestFormFieldsProps> {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      customerOptions,
      onInputChange,
      onDropdownChange,
      onTermSelected,
      context,
      isReadOnly,
    } = this.props;

    return (
      <div>
        <TextField
          label={strings.RequestTitle}
          value={requestTitle}
          onChanged={(newValue) =>
            onInputChange(newValue || "", "requestTitle")
          }
          readOnly={isReadOnly}
        />

        <ManagedMetadataPicker
          label={strings.ProjectCodeLabel}
          onTermSelected={onTermSelected}
          context={context}
          placeHolder="Select Project Code"
          disabled={isReadOnly}
        />

        <GenericDropdown
          label={strings.Customer}
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={onDropdownChange}
          placeHolder={strings.SelectCustomer}
          disabled={isReadOnly}
        />

        <TextField
          label={strings.RequestDate}
          value={requestDate}
          onChanged={(newValue) => onInputChange(newValue || "", "requestDate")}
          readOnly={isReadOnly}
        />

        <TextField
          label={strings.EstimatedDuration}
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            onInputChange(newValue || "0", "estimatedDuration")
          }
          type="number"
          readOnly={isReadOnly}
        />

        <TextField
          label={strings.EstimatedCost}
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            onInputChange(newValue || "0", "estimatedCost")
          }
          type="number"
          readOnly={isReadOnly}
        />

        <TextField
          label={strings.RequestNote}
          value={requestNote}
          onChanged={(newValue) => onInputChange(newValue || "", "requestNote")}
          multiline
          rows={4}
          readOnly={isReadOnly}
        />
      </div>
    );
  }
}

export default ProjectRequestFormFields;

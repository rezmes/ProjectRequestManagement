// src\webparts\prm\components\GenericDropdown.tsx

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
import styles from "./ProjectRequestForm.module.scss";

export interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | null;
  onChanged: (option?: IDropdownOption) => void;
  placeHolder?: string;
  disabled?: boolean; // Add this line
  required?: boolean; // Add this line
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const {
      label,
      options,
      selectedKey,
      onChanged,
      placeHolder,
      disabled,
      required,
    } = this.props;
    console.log("Dropdown Options:", this.props.options); // Debugging
    return (
      <div>
        <label className={required ? styles.requiredLabel : undefined}>
          {label}
        </label>
        <Dropdown
          label={label}
          options={options}
          selectedKey={selectedKey}
          onChanged={onChanged}
          placeHolder={placeHolder}
          disabled={disabled} // Add this prop
        />
      </div>
    );
  }
}

export default GenericDropdown;

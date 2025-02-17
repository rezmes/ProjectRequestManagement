// GenericDropdown.tsx

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

export interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | null;
  onChanged: (option?: IDropdownOption) => void;
  placeHolder?: string;
  disabled?: boolean; // Add this line
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChanged, placeHolder, disabled } =
      this.props;
      console.log("Dropdown Options:", this.props.options); // Debugging
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChanged}
        placeHolder={placeHolder}
        disabled={disabled} // Add this prop
      />
    );
  }
}

export default GenericDropdown;

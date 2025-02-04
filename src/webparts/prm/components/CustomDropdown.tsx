// CustomDropdown.tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | undefined;
  onChange: (option?: IDropdownOption) => void;
}

export class CustomDropdown extends React.Component<ICustomDropdownProps, {}> {
  public render(): React.ReactElement<ICustomDropdownProps> {
    const { label, options, selectedKey, onChange } = this.props;
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChange}
      />
    );
  }
}

export default CustomDropdown;

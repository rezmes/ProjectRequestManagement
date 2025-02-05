// GenericDropdown.tsx

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | undefined;
  onChange: (option?: IDropdownOption) => void;
  placeHolder?: string;
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChange, placeHolder } = this.props;
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChange}
        placeHolder={placeHolder}
      />
    );
  }
}

export default GenericDropdown;

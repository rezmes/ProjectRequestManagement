import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined;
  onChange: (option?: IDropdownOption) => void; // Corrected to use onChanged
}

export class CustomerDropdown extends React.Component<ICustomerDropdownProps, {}> {
  public render(): React.ReactElement<ICustomerDropdownProps> {
    const { customerOptions, selectedCustomer, onChange } = this.props;
    const placeHolderText = "انتخاب مشتری";
    return (
      <Dropdown
        placeHolder={placeHolderText}
        label="Customer"
        options={customerOptions}
        selectedKey={selectedCustomer}
        onChanged={onChange}
      />
    );
  }
}

export default CustomerDropdown;

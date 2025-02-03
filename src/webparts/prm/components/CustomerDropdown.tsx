import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface ICustomerDropdownProps {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | undefined;
  onChange: (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => void;
}

export class CustomerDropdown extends React.Component<
  ICustomerDropdownProps,
  {}
> {
  public render(): React.ReactElement<ICustomerDropdownProps> {
    return (
      <Dropdown
        label="Customer"
        options={this.props.customerOptions}
        selectedKey={this.props.selectedCustomer}
        onChange={this.props.onChange}
      />
    );
  }
}

export default CustomerDropdown;

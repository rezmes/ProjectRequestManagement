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

const CustomerDropdown: React.FC<ICustomerDropdownProps> = ({
  customerOptions,
  selectedCustomer,
  onChange,
}) => {
  return (
    <Dropdown
      label="Customer"
      options={customerOptions}
      selectedKey={selectedCustomer}
      onChange={onChange}
    />
  );
};

export default CustomerDropdown;

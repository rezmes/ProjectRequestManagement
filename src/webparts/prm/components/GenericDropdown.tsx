// // GenericDropdown.tsx

// import * as React from "react";
// import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

// interface IGenericDropdownProps {
//   label: string;
//   options: IDropdownOption[];
//   selectedKey: string | number | undefined;
//   onChanged: (option?: IDropdownOption) => void;
//   placeHolder?: string;
// }

// export class GenericDropdown extends React.Component<
//   IGenericDropdownProps,
//   {}
// > {
//   public render(): React.ReactElement<IGenericDropdownProps> {
//     const { label, options, selectedKey, onChanged, placeHolder } = this.props;
//     return (
//       <Dropdown
//         key={selectedKey || "default"} // Force re-render when selectedKey changes
//         label={label}
//         options={options}
//         selectedKey={selectedKey}
//         onChanged={onChanged}
//         placeHolder={placeHolder}
//       />
//     );
//   }
// }

// export default GenericDropdown;
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

export interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | null;
  onChanged: (option?: IDropdownOption) => void;
  placeHolder?: string;
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChanged, placeHolder } = this.props;
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChanged}
        placeHolder={placeHolder}
      />
    );
  }
}

export default GenericDropdown;

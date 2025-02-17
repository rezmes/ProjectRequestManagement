import * as React from "react";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";

export interface IGenericComboBoxProps {
  label: string;
  options: IComboBoxOption[];
  onChanged: (option?: IComboBoxOption, index?: number, value?: string) => void;
  onMenuOpen: () => void;
  disabled?: boolean;
  allowFreeform?: boolean;
  autoComplete?: "on" | "off";
}

export default class GenericComboBox extends React.Component<IGenericComboBoxProps, {}> {
  public render(): React.ReactElement<IGenericComboBoxProps> {
    const { label, options, onChanged, onMenuOpen, disabled, allowFreeform, autoComplete } = this.props;
    return (
      <ComboBox
        label={label}
        options={options}
        onChanged={onChanged}
        onMenuOpen={onMenuOpen}
        disabled={disabled}
        allowFreeform={allowFreeform}
        autoComplete={autoComplete}
      />
    );
  }
}

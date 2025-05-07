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
  disabled?: boolean;
  required?: boolean;
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

    return (
      <div className={styles.dropdownContainer}>
        {label && (
          <label className={required ? styles.requiredLabel : undefined}>
            {label}
          </label>
        )}
        <Dropdown
          // Remove the label prop here to avoid duplication
          options={options}
          selectedKey={selectedKey}
          onChanged={onChanged}
          placeHolder={placeHolder}
          disabled={disabled}
          // Add these props to control the dropdown appearance
          dropdownWidth={300}
          onRenderTitle={(selectedItems) => {
            if (Array.isArray(selectedItems) && selectedItems.length > 0) {
              return <span>{selectedItems[0].text}</span>;
            }
            return <span>{placeHolder}</span>;
          }}
        />
      </div>
    );
  }
}

export default GenericDropdown;

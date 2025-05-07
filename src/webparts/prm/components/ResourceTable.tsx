// src/webparts/prm/components/ResourceTable.tsx (update)
import * as React from "react";
import { TextField, IDropdownOption, IconButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";

import styles from "./ResourceTable.module.scss";

export interface IResourceTableProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  resources: any[];
  index: number;
  onDropdownChange: (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ) => void;
  onInputChange: (
    newValue: string,
    field: string,
    index: number,
    partIndex: number,
    resourceField: string
  ) => void;
  onAddRow: (field: string, index: number) => void;
  onRemoveRow: (field: string, index: number, partIndex: number) => void;
  isReadOnly: boolean;
}

export class ResourceTable extends React.Component<IResourceTableProps, {}> {
  public render(): React.ReactElement<IResourceTableProps> {
    const {
      label,
      field,
      options,
      resources,
      index,
      onDropdownChange,
      onInputChange,
      onAddRow,
      onRemoveRow,
      isReadOnly,
    } = this.props;

    return (
      <div className={styles.resourceTableContainer}>
        <h4>{label}</h4>
        <table className={styles.resourceTable}>
          <thead>
            <tr>
              <th>{label}</th>
              <th>Quantity</th>
              <th>Price Per Unit</th>
              <th>Total Cost</th>
              {!isReadOnly && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, partIndex) => (
              <tr key={partIndex}>
                <td>
                  {isReadOnly ? (
                    <div>{resource.item.text}</div>
                  ) : (
                    <GenericDropdown
                      label=""
                      options={options}
                      selectedKey={resource.item.key}
                      onChanged={(option) =>
                        onDropdownChange(field, option, index, partIndex)
                      }
                      placeHolder={`Select ${label}`}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <div>{resource.quantity}</div>
                  ) : (
                    <TextField
                      type="number"
                      value={resource.quantity.toString()}
                      onChanged={(newValue) =>
                        onInputChange(
                          newValue,
                          "quantity",
                          index,
                          partIndex,
                          field
                        )
                      }
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <div>{resource.pricePerUnit}</div>
                  ) : (
                    <TextField
                      type="number"
                      value={resource.pricePerUnit.toString()}
                      onChanged={(newValue) =>
                        onInputChange(
                          newValue,
                          "pricePerUnit",
                          index,
                          partIndex,
                          field
                        )
                      }
                    />
                  )}
                </td>
                <td>{resource.quantity * resource.pricePerUnit}</td>
                {!isReadOnly && (
                  <td>
                    <button
                      onClick={() => onRemoveRow(field, index, partIndex)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!isReadOnly && (
          <button onClick={() => onAddRow(field, index)}>Add {label}</button>
        )}
      </div>
    );
  }
}

export default ResourceTable;

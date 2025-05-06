// src/webparts/prm/components/ResourceTable.tsx
import * as React from "react";
import { TextField, IDropdownOption, IconButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";

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
    nestedField: string,
    index: number,
    partIndex: number,
    field: string
  ) => void;
  onAddRow: (field: string, index: number) => void;
  onRemoveRow: (field: string, index: number, partIndex: number) => void;
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
    } = this.props;

    return (
      <div>
        <table className="technicalAssessmentTable">
          <tbody>
            <tr>
              <th className="resourceColumn">{label}</th>
              <th>{strings.Quantity}</th>
              <th>{strings.PricePerUnit}</th>
              <th>{strings.TotalCost}</th>
              <th>{strings.Action}</th>
            </tr>
            {Array.isArray(resources) && resources.length > 0 ? (
              resources.map((item, partIndex) => {
                const totalCost = item.quantity * item.pricePerUnit;
                return (
                  <tr key={partIndex}>
                    <td className="resourceColumn">
                      <GenericDropdown
                        label={`${label} ${partIndex + 1}`}
                        options={options}
                        selectedKey={item.item ? item.item.key : undefined}
                        onChanged={(option) =>
                          onDropdownChange(field, option!, index, partIndex)
                        }
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.quantity.toString()}
                        onChanged={(newValue) =>
                          onInputChange(
                            newValue,
                            "quantity",
                            index,
                            partIndex,
                            field
                          )
                        }
                        type="number"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.pricePerUnit.toString()}
                        onChanged={(newValue) =>
                          onInputChange(
                            newValue,
                            "pricePerUnit",
                            index,
                            partIndex,
                            field
                          )
                        }
                        type="number"
                      />
                    </td>
                    <td>{totalCost.toFixed(0)}</td>
                    <td>
                      <IconButton
                        iconProps={{ iconName: "Delete" }}
                        title={strings.Remove}
                        ariaLabel={strings.Remove}
                        onClick={() => onRemoveRow(field, index, partIndex)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>{`${strings.No} ${label.toLowerCase()} ${
                  strings.AddedYet
                }`}</td>
              </tr>
            )}
          </tbody>
        </table>
        <IconButton
          iconProps={{ iconName: "Add" }}
          title={`${strings.Add} ${label}`}
          ariaLabel={`${strings.Add} ${label}`}
          onClick={() => onAddRow(field, index)}
        />
      </div>
    );
  }
}

export default ResourceTable;

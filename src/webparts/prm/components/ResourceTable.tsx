// src/webparts/prm/components/ResourceTable.tsx
import * as React from "react";
import { TextField, IconButton, IDropdownOption } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import styles from "./TechnicalAssessmentTable.module.scss"; // Use existing styles
import * as strings from "PrmWebPartStrings";

export interface IResourceTableProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  resources: any[];
  index: number;
  onDropdownChange: (field: string, option: IDropdownOption, index: number, partIndex: number) => void;
  onInputChange: (newValue: string, nestedField: string, index: number, partIndex?: number, field?: string) => void;
  onAddRow: (field: string, index: number) => void;
  onRemoveRow: (field: string, index: number, partIndex: number) => void;
  isReadOnly?: boolean;
  showPricing?: boolean;
}


export class ResourceTable extends React.Component<IResourceTableProps, {}> {
  constructor(props: IResourceTableProps) {
    super(props);
  }

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
      showPricing = true // Default to true for backward compatibility
    } = this.props;

    return (
      <div className={styles.resourceTable}>
        <h4>{label}</h4>
        <table>
          <thead>
            <tr>
              <th>{label}</th>
              <th>{strings.Quantity}</th>
              {showPricing && (
                <>
                  <th>{strings.PricePerUnit}</th>
                  <th>{strings.TotalCost}</th>
                </>
              )}
              {!isReadOnly && <th>{strings.Actions}</th>}
            </tr>
          </thead>
          <tbody>
            {resources && resources.length > 0 ? (
              resources.map((resource, partIndex) => {
                const totalCost = resource.quantity * resource.pricePerUnit;
                return (
                  <tr key={partIndex}>
                    <td>
                      <GenericDropdown
                      label=""
                        options={options}
                        selectedKey={resource.item ? resource.item.key : undefined}
                        onChanged={(option) =>
                          onDropdownChange(field, option, index, partIndex)
                        }
                        disabled={isReadOnly}
                      />
                    </td>
                    <td>
                      <TextField
                        value={resource.quantity.toString()}
                        onChanged={(newValue) =>
                          onInputChange(newValue, "quantity", index, partIndex, field)
                        }
                        type="number"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                      />
                    </td>
                    {showPricing && (
                      <>
                        <td>
                          <TextField
                            value={resource.pricePerUnit.toString()}
                            onChanged={(newValue) =>
                              onInputChange(newValue, "pricePerUnit", index, partIndex, field)
                            }
                            type="number"
                            readOnly={isReadOnly}
                            disabled={isReadOnly}
                          />
                        </td>
                        <td>{totalCost.toFixed(0)}</td>
                      </>
                    )}
                    {!isReadOnly && (
                      <td>
                        <IconButton
                          iconProps={{ iconName: "Delete" }}
                          onClick={() => onRemoveRow(field, index, partIndex)}
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={showPricing ? (isReadOnly ? 4 : 5) : (isReadOnly ? 2 : 3)}>
                  {`${strings.No} ${label.toLowerCase()} ${strings.AddedYet}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!isReadOnly && (
          <IconButton
            iconProps={{ iconName: "Add" }}
            onClick={() => onAddRow(field, index)}
          />
        )}
      </div>
    );
  }
}

export default ResourceTable;

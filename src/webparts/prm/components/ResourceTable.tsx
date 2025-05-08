// src/webparts/prm/components/ResourceTable.tsx
import * as React from "react";
import { TextField, IDropdownOption } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import styles from "./TechnicalAssessmentTable.module.scss"; // Use existing styles
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
    partIndex?: number,
    field?: string
  ) => void;
  onAddRow: (field: string, index: number) => void;
  onRemoveRow: (field: string, index: number, partIndex: number) => void;
  isReadOnly: boolean;
  canViewPricing?: boolean; // Add this new prop as optional
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

    // Default to false if not provided
    const canViewPricing = this.props.canViewPricing === true;

    return (
      <div className={styles.resourceTableContainer}>
        <h4 className={styles.resourceTableHeading}>{label}</h4>
        <table className={styles.resourceTable}>
          <thead>
            <tr>
              <th className={styles.resourceColumn}>{label}</th>
              <th className={styles.quantityColumn}>Quantity</th>
              {canViewPricing && (
                <th className={styles.priceColumn}>Price Per Unit</th>
              )}
              {canViewPricing && (
                <th className={styles.totalColumn}>Total Cost</th>
              )}
              {!isReadOnly && <th className={styles.actionColumn}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(resources) && resources.length > 0 ? (
              resources.map((resource, partIndex) => {
                const totalCost = resource.quantity * resource.pricePerUnit;
                return (
                  <tr key={partIndex}>
                    <td className={styles.resourceColumn}>
                      {isReadOnly ? (
                        <div>{resource.item ? resource.item.text : ""}</div>
                      ) : (
                        <GenericDropdown
                          label=""
                          options={options}
                          selectedKey={
                            resource.item ? resource.item.key : undefined
                          }
                          onChanged={(option) =>
                            onDropdownChange(field, option, index, partIndex)
                          }
                          placeHolder={`Select ${label}`}
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    <td className={styles.quantityColumn}>
                      {isReadOnly ? (
                        <div>{resource.quantity}</div>
                      ) : (
                        <TextField
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
                          type="number"
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    {canViewPricing && (
                      <td className={styles.priceColumn}>
                        {isReadOnly ? (
                          <div>{resource.pricePerUnit}</div>
                        ) : (
                          <TextField
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
                            type="number"
                            disabled={isReadOnly}
                            required={false} // Make it not required
                          />
                        )}
                      </td>
                    )}
                    {canViewPricing && (
                      <td className={styles.totalColumn}>
                        {totalCost.toFixed(0)}
                      </td>
                    )}
                    {!isReadOnly && (
                      <td className={styles.actionColumn}>
                        <button
                          className={styles.removeButton}
                          onClick={() => onRemoveRow(field, index, partIndex)}
                          title={strings.Remove}
                          aria-label={strings.Remove}
                        >
                          <i
                            className="ms-Icon ms-Icon--Delete"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    canViewPricing ? (isReadOnly ? 4 : 5) : isReadOnly ? 2 : 3
                  }
                  className={styles.emptyMessage}
                >
                  {`${strings.No} ${label.toLowerCase()} ${strings.AddedYet}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!isReadOnly && (
          <button
            className={styles.addButton}
            onClick={() => onAddRow(field, index)}
          >
            <i className="ms-Icon ms-Icon--Add" aria-hidden="true"></i>
            {`${strings.Add} ${label}`}
          </button>
        )}
      </div>
    );
  }
}

export default ResourceTable;

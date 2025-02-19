// PricingDetails.tsx
import * as React from "react";
import {
  TextField,
  IDropdownOption,
  IconButton,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";
import styles from "./TechnicalAssessmentTable.module.scss";

interface IPricingDetailsProps { // Corrected interface
  label: string;
  field: string;
  options: IDropdownOption[];
  assessment: any;
  index: number;

  handleDropdownChange: (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ) => void;
  handleInputChange: (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ) => void;
  addRow: (field: string, index: number) => void;
  removeRow: (field: string, index: number, partIndex: number) => void;
  disabled?: boolean; // Add this line to IPricingDetailsProps
}

// ... rest of PricingDetails.tsx




class PricingDetails extends React.Component<IPricingDetailsProps> {
  renderTable() {
    const {
      field,
      options,
      assessment,
      index,
      handleDropdownChange,
      handleInputChange,
      removeRow,
      label,
    } = this.props;
    // console.log(`Options for ${label}:`, options); // Debugging
    return (
      <table className="technicalAssessmentTable">
        <tbody>
          <tr>
            <th className="resourceColumn">{label}</th>
            <th>{strings.Quantity}</th>
            <th>{strings.PricePerUnit}</th>
            <th>{strings.TotalCost}</th>
            <th>{strings.Action}</th>
          </tr>
          {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
            assessment[field].map((item: any, partIndex: number) => {
              const totalCost = item.quantity * item.pricePerUnit;
              return (
                <tr key={partIndex}>
                  <td className="resourceColumn">
                    <GenericDropdown
                      label={`${label} ${partIndex + 1}`}
                      options={options}
                      selectedKey={item.item ? item.item.key : undefined}
                      onChanged={(option) =>
                        handleDropdownChange(field, option!, index, partIndex)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      value={item.quantity.toString()}
                      onChanged={(newValue: string) =>
                        handleInputChange(
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
                      onChanged={(newValue: string) =>
                        handleInputChange(
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
                      onClick={() => removeRow(field, index, partIndex)}
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
    );
  }

  

  render() {
    const { label, field, index, addRow } = this.props;

    return (
      <div>
        {this.renderTable()}
        <IconButton
          iconProps={{ iconName: "Add" }}
          title={`${strings.Add} ${label}`}
          ariaLabel={`${strings.Add} ${label}`}
          onClick={() => addRow(field, index)}
        />
      </div>
    );
  }
}

export default PricingDetails;
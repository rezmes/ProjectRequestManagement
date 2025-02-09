// // PricingDetails.tsx

// import * as React from "react";
// import {
//   PrimaryButton,
//   TextField,
//   IDropdownOption,
// } from "office-ui-fabric-react";
// import GenericDropdown from "./GenericDropdown";

// interface IPricingDetailsProps {
//   label: string; // Add this line
//   field: string;
//   options: IDropdownOption[];
//   assessment: any;
//   index: number;
//   handleDropdownChange: (
//     field: string,
//     option: IDropdownOption,
//     index: number,
//     partIndex: number
//   ) => void;
//   handleInputChange: (
//     newValue: string,
//     nestedField: string,
//     index: number,
//     partIndex?: number,
//     field?: string
//   ) => void;
//   addRow: (field: string, index: number) => void;
//   removeRow: (field: string, index: number, partIndex: number) => void;
// }

// class PricingDetails extends React.Component<IPricingDetailsProps> {
//   renderTable() {
//     const {
//       field,
//       options,
//       assessment,
//       index,
//       handleDropdownChange,
//       handleInputChange,
//       addRow,
//       removeRow,
//       label,
//     } = this.props;

//     return (
//       <table>
//         <tbody>
//           <tr>
//             <th>{label}</th>
//             <th>Quantity</th>
//             <th>Price Per Unit</th>
//           </tr>
//           {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
//             assessment[field].map((item: any, partIndex: number) => (
//               <tr key={partIndex}>
//                 <td>
//                   <GenericDropdown
//                     label={`${label} ${partIndex + 1}`}
//                     options={options}
//                     selectedKey={item.item ? item.item.key : undefined}
//                     onChanged={(option) =>
//                       handleDropdownChange(field, option!, index, partIndex)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <TextField
//                     value={item.quantity.toString()}
//                     onChanged={(newValue: string) =>
//                       handleInputChange(
//                         newValue,
//                         "quantity",
//                         index,
//                         partIndex,
//                         field
//                       )
//                     }
//                   />
//                 </td>
//                 <td>
//                   <TextField
//                     value={item.pricePerUnit.toString()}
//                     onChanged={(newValue: string) =>
//                       handleInputChange(
//                         newValue,
//                         "pricePerUnit",
//                         index,
//                         partIndex,
//                         field
//                       )
//                     }
//                   />
//                 </td>
//                 <td>
//                   <PrimaryButton
//                     text="Remove"
//                     onClick={() => removeRow(field, index, partIndex)}
//                   />
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4}>No {label.toLowerCase()} added yet.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     );
//   }

//   render() {
//     return (
//       <div>
//         {this.renderTable()}
//         <PrimaryButton
//           text={`Add ${this.props.label}`}
//           onClick={() => this.props.addRow(this.props.field, this.props.index)}
//         />
//       </div>
//     );
//   }
// }

// export default PricingDetails;
// PricingDetails.tsx

import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";

interface IPricingDetailsProps {
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
}

class PricingDetails extends React.Component<IPricingDetailsProps> {
  renderTable() {
    const {
      field,
      options,
      assessment,
      index,
      handleDropdownChange,
      handleInputChange,
      addRow,
      removeRow,
      label,
    } = this.props;

    return (
      <table>
        <tbody>
          <tr>
            <th>{label}</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Total Cost</th>
          </tr>
          {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
            assessment[field].map((item: any, partIndex: number) => {
              const totalCost = item.quantity * item.pricePerUnit;
              return (
                <tr key={partIndex}>
                  <td>
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
                  <td>{totalCost.toFixed(2)}</td>
                  <td>
                    <PrimaryButton
                      text="Remove"
                      onClick={() => removeRow(field, index, partIndex)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>No {label.toLowerCase()} added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.renderTable()}
        <PrimaryButton
          text={`Add ${this.props.label}`}
          onClick={() => this.props.addRow(this.props.field, this.props.index)}
        />
      </div>
    );
  }
}

export default PricingDetails;

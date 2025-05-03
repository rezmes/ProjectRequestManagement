// O3
// src\webparts\prm\components\PricingDetails.tsx
import * as React from "react";
import { IDropdownOption, IconButton, TextField } from "office-ui-fabric-react";
import GenericDropdown from "../controls/GenericDropdown";
import ResourceRow from "./ResourceRow";
import * as strings from "PrmWebPartStrings";

export interface IResItem {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}
export interface IResourceTableProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  rows: IResItem[];
  onAdd: () => void;
  onChange: (rowIdx: number, col: keyof IResItem, val: string) => void;
  onRemove: (rowIdx: number) => void;
}

export default class ResourceTable extends React.Component<
  IResourceTableProps,
  {}
> {
  public render() {
    const { label, rows, options } = this.props;
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
            {rows.length ? (
              rows.map(this.renderRow)
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
          onClick={this.props.onAdd}
        />
      </div>
    );
  }

  private renderRow = (r: IResItem, i: number) => {
    const total = r.quantity * r.pricePerUnit;
    return (
      <tr key={i}>
        <td className="resourceColumn">
          <GenericDropdown
            label={`${this.props.label} ${i + 1}`}
            options={this.props.options}
            selectedKey={r.item.key}
            onChanged={(opt) =>
              this.props.onChange(i, "item", opt ? opt.key + "" : "")
            }
          />
        </td>
        <td>
          <TextField
            value={r.quantity + ""}
            onChanged={(v) => this.props.onChange(i, "quantity", v!)}
            type="number"
          />
        </td>
        <td>
          <TextField
            value={r.pricePerUnit + ""}
            onChanged={(v) => this.props.onChange(i, "pricePerUnit", v!)}
            type="number"
          />
        </td>
        <td>{total}</td>
        <td>
          <IconButton
            iconProps={{ iconName: "Delete" }}
            onClick={() => this.props.onRemove(i)}
          />
        </td>
      </tr>
    );
  };
}

import * as React from "react";
import { TextField, IconButton } from "office-ui-fabric-react";
import GenericDropdown from "../../controls/GenericDropdown";
import { IResourceRowProps } from "./IResourceRow";

export default class ResourceRow extends React.Component<
  IResourceRowProps,
  {}
> {
  public render(): JSX.Element {
    const { row, total } = this.props;
    return (
      <tr>
        <td className="resourceColumn">
          <GenericDropdown
            label=""
            options={[]} // options come via children
            selectedKey={row.item.key}
            onChanged={this.props.onItem}
          />
        </td>
        <td>
          <TextField
            value={row.quantity + ""}
            onChanged={this.props.onQty}
            type="number"
          />
        </td>
        <td>
          <TextField
            value={row.pricePerUnit + ""}
            onChanged={this.props.onPrice}
            type="number"
          />
        </td>
        <td>{total}</td>
        <td>
          <IconButton
            iconProps={{ iconName: "Delete" }}
            onClick={this.props.onRemove}
          />
        </td>
      </tr>
    );
  }
}

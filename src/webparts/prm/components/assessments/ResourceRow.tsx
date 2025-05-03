// O3
// components/assessments/ResourceRow.tsx
export default class ResourceRow extends React.Component<IProps, {}> {
  public render() {
    const { item, onQty, onPrice, onRemove } = this.props;
    const total = item.quantity * item.pricePerUnit;
    return (
      <tr>
        <td className="resourceColumn">{this.props.children}</td>
        <td>
          <TextField
            value={item.quantity + ""}
            onChanged={onQty}
            type="number"
          />
        </td>
        <td>
          <TextField
            value={item.pricePerUnit + ""}
            onChanged={onPrice}
            type="number"
          />
        </td>
        <td>{total}</td>
        <td>
          <IconButton iconProps={{ iconName: "Delete" }} onClick={onRemove} />
        </td>
      </tr>
    );
  }
}

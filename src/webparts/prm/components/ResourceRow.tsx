import * as React from "react";
import { IResource } from "./IAssessment";

interface ResourceRowProps {
  resource: IResource;
}

export class ResourceRow extends React.Component<ResourceRowProps> {
  render() {
    const { resource } = this.props;
    return (
      <tr>
        <td>{resource.item.text}</td>
        <td>{resource.quantity}</td>
        <td>{resource.pricePerUnit}</td>
      </tr>
    );
  }
}
//  O3
// src/webparts/prm/components/wizard/UIFabricWizard.tsx
import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react";

export interface IWizardProps {
  step: number;
  total: number;
  label: string;
  description: string;
}

export default class UIFabricWizard extends React.Component<IWizardProps, {}> {
  public render() {
    const { step, total, label, description } = this.props;
    return (
      <ProgressIndicator
        label={`${label} ${step}/${total}`}
        description={description}
      />
    );
  }
}

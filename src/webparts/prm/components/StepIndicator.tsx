// src/webparts/prm/components/StepIndicator.tsx
import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react";
import styles from "./StepIndicator.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export class StepIndicator extends React.Component<IStepIndicatorProps, {}> {
  public render(): React.ReactElement<IStepIndicatorProps> {
    const { currentStep, totalSteps, stepLabels } = this.props;

    // Calculate progress percentage
    const progressPercentage = (currentStep - 1) / (totalSteps - 1);

    return (
      <div className={styles.progressContainer}>
        <ProgressIndicator
          label={`${strings.Step} ${currentStep} ${strings.Of} ${totalSteps}`}
          description={stepLabels[currentStep - 1]}
          percentComplete={progressPercentage}
        />
      </div>
    );
  }
}

export default StepIndicator;

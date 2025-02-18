import * as React from "react";
import { PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import styles from "./UIFabricWizard.module.scss";

interface IUIFabricWizardState {
  currentStep: number;
}

export default class UIFabricWizard extends React.Component<
  {},
  IUIFabricWizardState
> {
  constructor(props: {}) {
    super(props);
    this.state = { currentStep: 1 };
  }

  private _goToNextStep = (): void => {
    this.setState({ currentStep: 2 });
  };

  private _goToPreviousStep = (): void => {
    this.setState({ currentStep: 1 });
  };

  public render(): React.ReactElement<{}> {
    const { currentStep } = this.state;
    return (
      <div>
        <div className={styles.progressContainer}>
          <ProgressIndicator
            label={`Step ${currentStep} of 2`}
            description={
              currentStep === 1 ? "Create Project Request" : "Add Assessments"
            }
          />
        </div>

        {currentStep === 1 && (
          <div>
            {/* Render your Project Request Form components here */}
            <PrimaryButton text="Next" onClick={this._goToNextStep} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {/* Render your Technical Assessments components here */}
            <div>
              <PrimaryButton text="Back" onClick={this._goToPreviousStep} />
              {/* <PrimaryButton
                text="Submit"
                onClick={() => alert("Final submission")}
                style={{ marginLeft: 10 }}
              /> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

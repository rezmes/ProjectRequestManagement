// O3
// components/assessments/AssessmentWizard.tsx
import * as React from "react";
import AssessmentTable from "./AssessmentTable";
import TechnicalAssessmentService from "../../services/TechnicalAssessmentService";
import ProjectRequestService from "../../services/ProjectRequestService";
import { IAssWizProps, IAssWizState } from "./IAssessmentWizard";
import { IDropdownOption } from "office-ui-fabric-react";
import { IDropdownOptionWithCategory } from "../../services/ProjectRequestService";

export default class AssessmentWizard extends React.Component<
  IAssWizProps,
  IAssWizState
> {
  public render() {
    return (
      <div>
        <AssessmentTable
          requestId={this.props.requestId}
          onSaved={this.onAssessmentsSaved}
        />
      </div>
    );
  }
}

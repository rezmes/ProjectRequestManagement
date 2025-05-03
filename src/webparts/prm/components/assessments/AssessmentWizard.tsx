// O3
// components/assessments/AssessmentWizard.tsx
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

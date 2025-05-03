// O3
// components/forms/ProjectRequestForm/ProjectRequestForm.tsx
export default class ProjectRequestForm extends React.Component<
  IProps,
  IState
> {
  // state omitted for brevity

  public render() {
    const { isProjectCreated } = this.state;
    return (
      <div className={styles.formRoot}>
        {isProjectCreated
          ? this.renderAssessmentsStep()
          : this.renderRequestInfoStep()}
      </div>
    );
  }

  private renderRequestInfoStep() {
    return (
      <RequestInfoForm
        state={this.state}
        customerOptions={this.state.customerOptions}
        onChange={this.handleFieldChange}
        onCreate={this.createRequest}
      />
    );
  }

  private renderAssessmentsStep() {
    return (
      <AssessmentWizard
        requestId={this.state.requestId!}
        onDone={this.resetForm}
      />
    );
  }
}

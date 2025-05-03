// forms/ProjectRequestForm/RequestInfoForm.tsx
class RequestInfoForm extends React.Component<IRequestInfoProps, {}> {
  public render() {
    const { model, customerOptions, disabled } = this.props;
    return (
      <div>
        <TextField
          label={strings.RequestTitle}
          value={model.requestTitle}
          onChanged={(val) => this.props.onChange("requestTitle", val!)}
          readOnly={disabled}
        />
        {/* … other controls … */}
        <PrimaryButton
          text={strings.Create}
          onClick={this.props.onCreate}
          disabled={disabled}
        />
      </div>
    );
  }
}

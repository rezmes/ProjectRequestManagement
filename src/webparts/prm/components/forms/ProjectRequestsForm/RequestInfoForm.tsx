// O3
// forms/ProjectRequestForm/RequestInfoForm.tsx
import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";

// TODO: Replace this with the actual import if you have a localization/strings file
const strings = {
  RequestTitle: "Request Title",
  Create: "Create",
};

interface IRequestInfoProps {
  model: {
    requestTitle: string;
    // add other fields as needed
  };
  customerOptions?: any; // specify the correct type if available
  disabled?: boolean;
  onChange: (field: string, value: any) => void;
  onCreate: () => void;
}

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

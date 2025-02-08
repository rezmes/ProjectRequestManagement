import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import {
  IAssessment,
  ITechnicalAssessmentState,
} from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";

import ProjectRequestService, {
  IDropdownOptionWithCategory,
} from "../services/ProjectRequestService";

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService();
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    console.log(
      "Received requestId in TechnicalAssessmentTable:",
      this.props.requestId
    );
    this.loadInventoryItems();
  }

  loadInventoryItems = () => {
    this.projectRequestService.getInventoryItems().then((items) => {
      this.setState({ inventoryItems: items });
    });
  };

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;
    return inventoryItems
      .filter((item) => categories.indexOf(item.itemCategory) > -1)
      .map((item) => ({ key: item.key, text: item.text }));
  };

  handleInputChange = (
    newValue: string,
    field: string,
    index: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field] = newValue;
      return { assessments };
    });
  };

  // handleDropdownChange = (
  //   field: string,
  //   option: IDropdownOption,
  //   index: number,
  //   partIndex: number
  // ): void => {
  //   this.setState((prevState) => {
  //     const assessments = [...prevState.assessments];
  //     assessments[index][field][partIndex] = option;
  //     return { assessments };
  //   });
  // };

  handleDropdownChange = (
    field: string,
    option: IDropdownOption,
    index: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field] = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].push({ key: "", text: "" });
      return { assessments };
    });
  };

  removeRow = (field: string, index: number, partIndex: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].splice(partIndex, 1);
      return { assessments };
    });
  };

  addAssessment = () => {
    this.setState((prevState) => ({
      assessments: [
        ...prevState.assessments,
        {
          activity: "",
          humanResource: null,
          machine: null,
          material: null,
        },
      ],
    }));
  };

  handleSaveAssessments = () => {
    const { assessments } = this.state;
    const { requestId } = this.props;
    if (!requestId) {
      alert("Request ID is missing. Please create a project request first.");
      return;
    }
    this.projectRequestService
      .saveAssessments(assessments, requestId)
      .then(() => {
        alert("Assessments saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving assessments", error);
        alert(
          "Error saving assessments. Please check the console for details."
        );
      });
  };

  render() {
    const { assessments } = this.state;

    return (
      <div>
        <h3>Technical Assessments</h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <TextField
              label={`Activity ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
            />

            {/* Human Resource */}
            <h4>Human Resource</h4>
            <GenericDropdown
              label="Human Resource"
              options={this.filterInventoryItems(["نیروی انسانی"])}
              selectedKey={
                assessment.humanResource ? assessment.humanResource.key : null
              }
              onChanged={(option) =>
                this.handleDropdownChange("humanResource", option, index)
              }
              placeHolder="Select a human resource"
            />

            {/* Machine */}
            <h4>Machine</h4>
            <GenericDropdown
              label="Machine"
              options={this.filterInventoryItems(["ماشین آلات"])}
              selectedKey={assessment.machine ? assessment.machine.key : null}
              onChanged={(option) =>
                this.handleDropdownChange("machine", option, index)
              }
              placeHolder="Select a machine"
            />

            {/* Material */}
            <h4>Material</h4>
            <GenericDropdown
              label="Material"
              options={this.filterInventoryItems([
                "ابزار",
                "محصول",
                "مواد اولیه",
              ])}
              selectedKey={assessment.material ? assessment.material.key : null}
              onChanged={(option) =>
                this.handleDropdownChange("material", option, index)
              }
              placeHolder="Select a material"
            />

            <hr />
          </div>
        ))}
        <PrimaryButton text="Add Assessment" onClick={this.addAssessment} />
        <PrimaryButton
          text="Save Assessments"
          onClick={this.handleSaveAssessments}
        />
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

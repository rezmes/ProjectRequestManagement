import * as React from "react";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";

class TechnicalAssessmentTable extends React.Component<ITechnicalAssessmentProps, ITechnicalAssessmentState> {
  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.state = {
      assessments: []
    };
  }

  componentDidMount() {
    this.loadAssessments();
  }

  loadAssessments() {
    // Load assessments from the ProjectRequestService
    this.props.projectRequestService.getTechnicalAssessments(this.props.requestId)
      .then((assessments) => {
        this.setState({ assessments });
      });
  }

  render() {
    const { assessments } = this.state;

    return (
      <div>
        <h3>Technical Assessments</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Man Hours</th>
              <th>Materials</th>
              <th>Machinery</th>
              <th>Dependencies</th>
              <th>Special Considerations</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr key={index}>
                <td>{assessment.title}</td>
                <td>{assessment.department}</td>
                <td>{assessment.manHours}</td>
                <td>{assessment.materials}</td>
                <td>{assessment.machinery}</td>
                <td>{assessment.dependencies}</td>
                <td>{assessment.specialConsiderations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TechnicalAssessmentTable;

// ITechnicalAssessmentProps.ts
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void; // Make this required
}

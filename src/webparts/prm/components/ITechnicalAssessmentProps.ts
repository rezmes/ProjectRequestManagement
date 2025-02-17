// ITechnicalAssessmentProps.ts
import { Guid } from "@microsoft/sp-core-library";
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void; // Make this required

}

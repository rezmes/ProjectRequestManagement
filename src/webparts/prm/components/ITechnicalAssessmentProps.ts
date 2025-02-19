// ITechnicalAssessmentProps.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  context: WebPartContext; // Add if missing
  resetForm: () => void; // Make this required

}

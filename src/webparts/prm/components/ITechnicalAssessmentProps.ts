// ITechnicalAssessmentProps.ts
import { Guid } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  context: WebPartContext; // Add if missing
  resetForm: () => void; // Make this required
  isEditMode?: boolean; // Optional prop to indicate Edit mode
  isDisplayMode?: boolean; // Optional prop to indicate Display mode

}

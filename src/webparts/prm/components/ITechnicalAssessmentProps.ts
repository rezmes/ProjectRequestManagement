// src/webparts/prm/components/ITechnicalAssessmentProps.ts (updated)
import { WebPartContext } from "@microsoft/sp-webpart-base";
import ProjectRequestService from "../services/ProjectRequestService";
export interface ITechnicalAssessmentProps {
  // projectRequestService: any;
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void;
  isReadOnly?: boolean;
  isCommercialDept?: boolean; // Add this new property
  context?: WebPartContext; // Add this
}

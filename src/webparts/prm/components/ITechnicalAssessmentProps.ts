import  ProjectRequestService  from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService; // Using ProjectRequestService
  requestId: number; // Assuming we have a request ID
}

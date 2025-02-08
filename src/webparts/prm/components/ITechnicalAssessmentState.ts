// ITechnicalAssessmentState.ts
import ProjectRequestService, { IDropdownOptionWithCategory } from "../services/ProjectRequestService";
// Import IDropdownOption interface
import { IDropdownOption } from "office-ui-fabric-react";

// IAssessment.ts
export interface IAssessment {
  activity: string;
  humanResource: IDropdownOption | null;
  machine: IDropdownOption | null;
  material: IDropdownOption | null;
  // Other fields as necessary
}



export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
}


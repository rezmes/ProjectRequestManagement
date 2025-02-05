// ITechnicalAssessmentState.ts

// Import IDropdownOption interface
import { IDropdownOption } from "office-ui-fabric-react";

export interface IAssessment {
  activity: string;
  humanResources: IDropdownOption[];
  machines: IDropdownOption[];
  materials: IDropdownOption[];
}


export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOption[];
}


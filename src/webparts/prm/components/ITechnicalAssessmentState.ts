// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

// ITechnicalAssessmentState.ts
import { IAssessment } from './IAssessment';
import { IDropdownOptionWithCategory } from "../services/ProjectRequestService";

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
}

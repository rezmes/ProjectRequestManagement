// ITechnicalAssessmentState.ts

import { IDropdownOption } from "office-ui-fabric-react";

interface IAssessment {
  activity: string;
  humanResources: Array<{ id: string | number; name: string }>;
  machines: Array<{ id: string | number; name: string }>;
  materials: Array<{ id: string | number; name: string }>;
}

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOption[];
}

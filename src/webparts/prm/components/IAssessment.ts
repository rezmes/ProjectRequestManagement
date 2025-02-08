// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IAssessment {
  activity: string;
  humanResource: IDropdownOption | null;
  machine: IDropdownOption | null;
  material: IDropdownOption | null;
  // Include other fields if necessary
}

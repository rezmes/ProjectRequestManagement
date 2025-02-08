// // IAssessment.ts
// import { IDropdownOption } from "office-ui-fabric-react";


// export interface IAssessment {
//   activity: string;
//   humanResource: IDropdownOption | null;
//   machine: IDropdownOption | null;
//   material: IDropdownOption | null;
//   // Include other fields if necessary
//   quantity: number;
// }
// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  item: IDropdownOption;
  quantity: number;
}

export interface IAssessment {
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
  // Include other fields if necessary
}

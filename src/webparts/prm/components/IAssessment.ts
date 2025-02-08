// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IAssessment {
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
}


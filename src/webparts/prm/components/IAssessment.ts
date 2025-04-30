// IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  _key:string;
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IAssessment {
  _key: string;
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
 
}


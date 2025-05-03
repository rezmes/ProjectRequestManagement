import { IDropdownOption } from "office-ui-fabric-react";
import { WebPartContext }  from "@microsoft/sp-webpart-base";

export interface IAssWizProps {
  ctx: WebPartContext;
  requestId: number;
  onDone: () => void;
}

export interface IAssWizState {
  inventory: IDropdownOption[];
}

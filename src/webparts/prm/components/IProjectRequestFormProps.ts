// src/webparts/prm/components/IProjectRequestFormProps.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";

export enum FormMode {
  Create = "Create",
  Edit = "Edit",
  View = "View"
}

export interface IProjectRequestFormProps {
  context: WebPartContext;
  mode: FormMode;
  itemId?: number; // Optional for Edit and View modes
}

// src/webparts/prm/components/IProjectRequestFormState.ts
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
export interface IProjectRequestFormState {
  isProjectCreated: boolean;
  showProjectForm: boolean;
  requestId: number | null;
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  RequestStatus: string;
  customerOptions: IDropdownOption[];
  assessments: any[];
  formNumber: number | null;
  documentSetLink: { url: string; text: string } | null;
  projectCodeTerm: any;
  selectedTerm: { id: string; label: string } | null;
  terms: any[];
  ProjectCode1: any;
  isLoading?: boolean; // New property
}

// src/webparts/prm/components/IProjectRequestFormState.ts
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
// In IProjectRequestFormState.ts
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
  projectCodeTerm: { id: string; label: string } | null;
  selectedTerm: { id: string; label: string } | null;
  terms: { id: string; label: string }[];
  ProjectCode1: { id: string; label: string } | null;
  isLoading: boolean;
  // Add these new properties
  isSubmitting?: boolean;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
  successMessage?: string;
}


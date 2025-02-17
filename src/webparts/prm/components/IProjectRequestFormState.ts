// IProjectRequestFormState.ts
import { IDropdownOption } from 'office-ui-fabric-react';
import { IAssessment } from './IAssessment';

export interface IProjectRequestFormState {
  // Flags
  isProjectCreated: boolean;
  showProjectForm: boolean;

  // Project Request Information
  requestId: number | null;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  RequestStatus: string;

  // Customer Information
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  customerOptions: IDropdownOption[];
  // projectCodeTerm: string;

  // Assessments
  assessments: IAssessment[];
  formNumber: Number | null;

  // Document Set Link
  documentSetLink?: {
    url: string;
    text: string;
  };

//combo box

  selectedTerm: { id: string; label: string } | null;
  terms: { id: string; label: string }[];
  projectCodeTerm: { id: string; label: string } | null;

}

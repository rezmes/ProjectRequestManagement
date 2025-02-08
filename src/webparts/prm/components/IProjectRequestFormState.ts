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
  RequestStatus: string;

  // Customer Information
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  customerOptions: IDropdownOption[];

  // Assessments
  assessments: IAssessment[];
}

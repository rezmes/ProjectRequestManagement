import { IDropdownOption } from 'office-ui-fabric-react';

export interface IProjectRequestFormState {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | number | undefined;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  RequestStatus: string;
  requestId?: number;
}

import { IDropdownOption } from 'office-ui-fabric-react';

export interface IProjectRequestFormState {
  customerOptions: IDropdownOption[];
  selectedCustomer: string | undefined;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  status: string;
}

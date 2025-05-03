export interface IProjectRequest {
  Title: string;
  CustomerId: number | null;
  RequestDate: string;          // ISO
  EstimatedDuration: number;
  EstimatedCost: number;
  Description1: string;         // note field name
  RequestStatus: string;
  FormNumber: number;
  ProjectCode1?: string;        // term GUID (not label)
}

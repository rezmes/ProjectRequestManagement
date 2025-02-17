declare interface IPrmWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AddAssessments: string;
  CreateProjectRequest: string;
  ProjectInformation: string;
  ProjectID: string;
  FormNumber: string;
  Title: string;
  CustomerName: string;
  ProjectCodeLabel: string,
  RequestDate: string;
  RequestNote: string;
  RequestTitle: string;
  Customer: string;
  SelectCustomer: string;
  EstimatedDuration: string;
  EstimatedCost: string;
  Create: string;
  Cancel: string;
  TechnicalAssessments: string;
  Activity: string;
  HumanResource: string;
  Machine: string;
  Material: string;
  AddAssessment: string;
  FinalSubmit: string;
  Quantity: string;
  PricePerUnit: string;
  TotalCost: string;
  Remove: string;
  No: string;
  AddedYet: string;
  Add: string;
}

declare module 'PrmWebPartStrings' {
  const strings: IMyWebPartStrings;
  export = strings;
}

// import { Guid } from '@microsoft/sp-core-library';
// import { SPHttpClient } from '@microsoft/sp-http';

// import { WebPartContext } from '@microsoft/sp-webpart-base';

// export interface IProjectRequestFormProps {
//   context: WebPartContext;
//   spHttpClient: SPHttpClient;
//   siteUrl: string;
//   termSetId: string;
// }
// IProjectRequestFormProps.ts
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';

export type FormMode = 'Create' | 'Display' | 'Edit';

export interface IProjectRequestFormProps {
  context: WebPartContext;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  termSetId: string;
  mode: FormMode; // Add form mode prop
  itemId?: number; // Optional item ID for Edit and Display modes
}
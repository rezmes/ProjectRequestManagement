import { SPHttpClient } from '@microsoft/sp-http';

export interface IProjectRequestFormProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

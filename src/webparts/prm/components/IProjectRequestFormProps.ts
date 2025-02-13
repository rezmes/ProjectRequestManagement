import { SPHttpClient } from '@microsoft/sp-http';

import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectRequestFormProps {
  context: WebPartContext;
  spHttpClient: SPHttpClient;
  siteUrl: string;

}

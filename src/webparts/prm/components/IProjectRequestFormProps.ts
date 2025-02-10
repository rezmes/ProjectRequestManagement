import { SPHttpClient } from '@microsoft/sp-http';
import { DocumentSetService } from '../services/DocumentSetService';

export interface IProjectRequestFormProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  documentSetService: DocumentSetService; // Add this property
}

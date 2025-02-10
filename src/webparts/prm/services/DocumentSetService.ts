import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

export class DocumentSetService {
  private _spHttpClient: SPHttpClient;
  private _siteUrl: string;

  constructor(spHttpClient: SPHttpClient, siteUrl: string) {
    this._spHttpClient = spHttpClient;
    this._siteUrl = siteUrl;
  }

  public async createDocumentSet(
    libraryName: string, // The library where the Document Set will be created
    documentSetName: string, // The name of the Document Set
    requestId: number // The ID of the related request
  ): Promise<{ url: string; text: string }> {
    console.log(`Creating Document Set: ${documentSetName}`);

    const documentSetContentTypeId = "0x0120D520"; // Default Content Type ID for Document Set in SharePoint
    const restApiUrl = `${this._siteUrl}/_api/web/getfolderbyserverrelativeurl('${encodeURIComponent(libraryName)}')/documentset/add(decodedurl='${encodeURIComponent(documentSetName)}', ctid='${documentSetContentTypeId}')`;

    try {
      const response: SPHttpClientResponse = await this._spHttpClient.post(restApiUrl, SPHttpClient.configurations.v1, {
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": (document.getElementById("__REQUESTDIGEST") as HTMLInputElement).value,
        },
      });

      if (response.ok) {
        console.log("Document Set created successfully.");

        // Step 2: Return the Document Set link
        const documentSetUrl = `${this._siteUrl}/${libraryName}/${documentSetName}`;
        const absoluteUrl = `${window.location.origin}${documentSetUrl}`;
        return {
          url: absoluteUrl, // Full URL of the Document Set
          text: `Documents for Request ${requestId}`, // Text for the hyperlink
        };
      } else {
        throw new Error(`Failed to create Document Set: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating Document Set:", error);
      throw error;
    }
  }
}

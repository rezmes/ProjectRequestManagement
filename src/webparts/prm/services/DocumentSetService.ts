// O3
// services/DocumentSetService.ts
import BaseService from "./BaseService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { LISTS } from "../utils/constants";

export interface IDocSetLink { url: string; text: string; }

export default class DocumentSetService extends BaseService {

  public async createDocumentSet(docSetName: string): Promise<IDocSetLink> {
    const digest = await this.getFormDigest();
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${LISTS.RelatedDocuments}`;

    const headers = {
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
      "Slug": `${LISTS.RelatedDocuments}/${encodeURIComponent(docSetName)}|${LISTS.RelatedDocumentsContentType}`,
      "X-RequestDigest": digest
    };

    const body = JSON.stringify({ Title: docSetName, Path: LISTS.RelatedDocuments });

    const resp: SPHttpClientResponse = await this.context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      { headers, body }
    );

    if (!resp.ok) { throw new Error(`DocSet creation failed ${resp.statusText}`); }

    const data = await resp.json();
    const url = (data.d["شناسهسند"] as string).split(",")[0];

    return { url, text: `Documents for ${docSetName}` };
  }

  public async updateProjectRequestLink(requestId: number, link: IDocSetLink): Promise<void> {
    await sp.web.lists.getByTitle(LISTS.ProjectRequests)
      .items.getById(requestId)
      .update({
        DocumentSetLink: {
          __metadata: { type: "SP.FieldUrlValue" },
          Url: link.url,
          Description: link.text
        }
      });
  }
}

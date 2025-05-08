
// src/webparts/prm/services/DocumentService.ts
import BaseService from "./BaseService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import {sp} from '@pnp/sp'

export default class DocumentService extends BaseService {
  public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string } | null> {
    try {
      const libraryName = "RelatedDocuments";
      const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
      const siteUrl = this.context.pageContext.web.absoluteUrl;
      const endpoint = `${siteUrl}/_vti_bin/listdata.svc/${libraryName}`;

      // console.log("DEBUG: siteUrl from pageContext:", this.context.pageContext.web.absoluteUrl);

      const requestDigest = await this.getFormDigest();
      if (!requestDigest) {
        throw new Error("Failed to retrieve X-RequestDigest.");
      }

      const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
        "X-RequestDigest": requestDigest
      };

      const postBody = JSON.stringify({
        Title: documentSetName,
        Path: libraryName
      });

      const response: SPHttpClientResponse = await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        { headers, body: postBody }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      // console.log("[DOCSET CREATION SUCCESS] API Response:", result);
      // console.log("Full response from createDocumentSet:", response);

      if (!result.d || !result.d["شناسهسند"]) {
        throw new Error("Error: Document Set ID (شناسهسند) is missing in the response.");
      }

      const docIdFullUrl = result.d["شناسهسند"];
      // console.log("Raw شناسهسند:", docIdFullUrl);

      const docIdUrlPart = docIdFullUrl.split(',')[0];
      // console.log("Extracted Document Set URL:", docIdUrlPart);

      return {
        url: docIdUrlPart,
        text: `Documents for ${documentSetName}`
      };

    } catch (error) {
      console.error("[DOCSET CREATION ERROR]", error);
      return null;
    }
  }

  public async updateDocumentSetLink(
    requestId: number,
    documentSetLink: { url: string; text: string }
  ): Promise<void> {
    // console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

    const hyperlinkValue = {
      __metadata: { type: "SP.FieldUrlValue" },
      Url: documentSetLink.url,
      Description: documentSetLink.text
    };

    try {
      // console.log("[DEBUG - SITE URL BEFORE CONCAT]:", this.context.pageContext.web.absoluteUrl);
      const updateUrl = sp.web.lists
        .getByTitle('ProjectRequests')
        .items.getById(requestId).toUrl();
      // console.log("[DEBUG - UPDATE URL (TOURL) BEFORE CONCAT]:", updateUrl);

      let fullUpdateUrl = this.context.pageContext.web.absoluteUrl + updateUrl;

      await sp.web.lists
        .getByTitle("ProjectRequests")
        .items.getById(requestId)
        .update({
          DocumentSetLink: hyperlinkValue
        });

      // console.log("DocumentSetLink updated successfully.");
    } catch (error) {
      console.error("Error updating DocumentSetLink:", error);
      throw error;
    }
  }
}

// src/webparts/prm/services/BaseService.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";

export default class BaseService {
  protected context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  public async getFormDigest(): Promise<string> {
    try {
      const digestElement = document.getElementById("__REQUESTDIGEST");
      const digestValue = digestElement ? digestElement.getAttribute("value") : "";

      const response = await fetch(
        `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digestValue || ""
          },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Form Digest. HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.d.GetContextWebInformation.FormDigestValue;
    } catch (error) {
      console.error("❌ FormDigest fetch failed:", error);
      throw error;
    }
  }
}

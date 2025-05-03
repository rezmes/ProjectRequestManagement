// // A CLOUD
// // src/webparts/prm/services/BaseService.ts
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { sp } from "@pnp/sp";

// export default class BaseService {
//   protected context: WebPartContext;

//   constructor(context: WebPartContext) {
//     this.context = context;
//   }

//   public async getFormDigest(): Promise<string> {
//     try {
//       const digestElement = document.getElementById("__REQUESTDIGEST");
//       const digestValue = digestElement ? digestElement.getAttribute("value") : "";

//       const response = await fetch(
//         `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
//         {
//           method: "POST",
//           headers: {
//             "Accept": "application/json;odata=verbose",
//             "Content-Type": "application/json;odata=verbose",
//             "X-RequestDigest": digestValue || ""
//           },
//           credentials: "include"
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch Form Digest. HTTP ${response.status}: ${response.statusText}`);
//       }

//       const responseData = await response.json();
//       return responseData.d.GetContextWebInformation.FormDigestValue;
//     } catch (error) {
//       console.error("❌ FormDigest fetch failed:", error);
//       throw error;
//     }
//   }
// }


// O3
// services/BaseService.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { SPHttpClient } from "@microsoft/sp-http";

export default class BaseService {
  protected context: WebPartContext;
  constructor(ctx: WebPartContext) {
    this.context = ctx;
    sp.setup({ spfxContext: ctx });
  }

  protected async getFormDigest(): Promise<string> {
    const resp = await this.context.spHttpClient.post(
      `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
      SPHttpClient.configurations.v1,
      { headers: { accept: "application/json;odata=verbose" } }
    );
    const json = await resp.json();
    return json.d.GetContextWebInformation.FormDigestValue as string;
  }
}

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

// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

// export default class ProjectRequestService {
//   private spHttpClient: SPHttpClient;
//   private siteUrl: string;

//   constructor(spHttpClient: SPHttpClient, siteUrl: string) {
//     this.spHttpClient = spHttpClient;
//     this.siteUrl = siteUrl;
//   }

//   public getCustomerOptions(): Promise<any[]> {
//     const url = `${this.siteUrl}/_api/web/lists/getbytitle('CustomerList')/items`;

//     return this.spHttpClient.get(url, SPHttpClient.configurations.v1)
//       .then((response: SPHttpClientResponse) => response.json())
//       .then((data: any) => data.value);
//   }

//   public createProjectRequest(requestData: any): Promise<SPHttpClientResponse> {
//     const url = `${this.siteUrl}/_api/web/lists/getbytitle('ProjectRequests')/items`;

//     return this.spHttpClient.post(url, SPHttpClient.configurations.v1, {
//       headers: {
//         'Accept': 'application/json;odata=verbose',
//         'Content-type': 'application/json;odata=verbose'
//       },
//       body: JSON.stringify(requestData)
//     });
//   }
// }
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<any[]> {
    return sp.web.lists.getByTitle('Customer').items.get()
      .then(data => data.map(item => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists.getByTitle('ProjectRequests').items.add(requestData);
  }
}

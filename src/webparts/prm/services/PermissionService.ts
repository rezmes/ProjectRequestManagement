// src/webparts/prm/services/PermissionService.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class PermissionService {
  private context: WebPartContext;
  
  constructor(context: WebPartContext) {
    this.context = context;
  }

  public isUserInCommercialDepartment(): Promise<boolean> {
    // Get the current user's groups using the REST API directly
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
    
    return this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((data: any) => {
        if (data && data.value) {
          // Check if any of the groups is the Commercial Department
          for (let i = 0; i < data.value.length; i++) {
            if (data.value[i].Title === "Commercial Department") {
              return true;
            }
          }
        }
        return false;
      })
      .catch((error) => {
        console.error("Error checking user permissions:", error);
        return false;
      });
  }
}


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

  public getTechnicalAssessments(requestId: number): Promise<any[]> {
    return sp.web.lists.getByTitle('TechnicalAssessments').items.filter(`ProjectID eq ${requestId}`).get()
      .then(data => data.map(item => ({
        title: item.Title,
        department: item.DepartmentM,
        manHours: item.ManHours,
        materials: item.Materials,
        machinery: item.Machinery,
        dependencies: item.Dependencies,
        specialConsiderations: item.SpecialConsiderations
      })));
    }
      public getDepartmentOptions(): Promise<any[]> {
        return sp.web.lists.getByTitle('Departments').items.get()
          .then(data => data.map(item => ({ key: item.Id, text: item.Title })));
      }
}

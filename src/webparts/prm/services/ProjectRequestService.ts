// //O3
// services/ProjectRequestService.ts
import BaseService from "./BaseService";
import DocumentSetService, { IDocSetLink } from "./DocumentSetService";
import { LISTS } from "../utils/constants";
import { IProjectRequest } from "../modules/IProjectRequest";
import {sp} from '@pnp/sp'
export interface IDropdownOptionWithCategory {
  key: string|number;
  text: string;
  itemCategory: string;
}

// … keep existing class …

export default class ProjectRequestService extends BaseService {

  private docService: DocumentSetService;
  constructor(ctx) {
    super(ctx);
    this.docService = new DocumentSetService(ctx);
  }


  public async getNextFormNumber(): Promise<number> {
    const items = await sp.web.lists.getByTitle(LISTS.ProjectRequests)
                    .items.orderBy("FormNumber", false).top(1).get();
    return items.length ? items[0].FormNumber + 1 : 1;
  }

  public async createProjectRequest(data: IProjectRequest)
       : Promise<{ requestId: number; formNumber: number; docLink: IDocSetLink; }> {
    const res = await sp.web.lists.getByTitle(LISTS.ProjectRequests).items.add(data);
    const id = res.data.Id as number;
    const docName = `Request-${id}`;
    const link = await this.docService.createDocumentSet(docName);
    await this.docService.updateProjectRequestLink(id, link);
    return { requestId: id, formNumber: res.data.FormNumber as number, docLink: link };
  }

  public async updateEstimatedCost(id: number, cost: number): Promise<void> {
    await sp.web.lists.getByTitle(LISTS.ProjectRequests).items.getById(id).update({ EstimatedCost: cost });
  }

  /**
   * Recalculate sum of PricingDetails and push to EstimatedCost.
   */
  public async updateEstimatedCostFromPricing(requestId:number):Promise<void>{
    const details = await sp.web.lists
                          .getByTitle(LISTS.PricingDetails)
                          .items.filter(`RequestIDId eq ${requestId}`)
                          .select("TotalCost")
                          .get();
    const total   = details.reduce((s,i)=>s + (i.TotalCost||0),0);
    await this.updateEstimatedCost(requestId,total);
  }
  // ProjectRequestService.ts (at bottom)
public getCustomerOptions() { return sp.web.lists.getByTitle("Customer").items.get()
  .then(d=>d.map(i=>({key:i.Id,text:i.Title}))); }

public getPricingDetailsByRequestID(id:number){ /* old implementation… */ }
public updateProjectRequestEstimatedCost(id:number,cost:number){ /* … */ }
public savePricingDetails(details:IPricingDetails[]){ /* … */ }
public saveAssessments = undefined; // lives in TechnicalAssessmentService, update callers!

}

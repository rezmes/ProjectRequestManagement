// services/TechnicalAssessmentService.ts
import BaseService from "./BaseService";
import { IAssessment } from "../models/IAssessment";
import { IPricingDetails } from "../models/IPricingDetails";
import { LISTS } from "../utils/constants";

export default class TechnicalAssessmentService extends BaseService {

  public saveAssessments(a: IAssessment[], reqId: number): Promise<number[]> {
    const batch = sp.web.createBatch();
    const created: Promise<any>[] = [];

    a.forEach(ass => {
      ["humanResources","machines","materials"].forEach(t => {
        Array.prototype.forEach.call(ass[t] || [], (r) => {
          const itm = {
            Title: ass.activity || "No Activity",
            RequestIDId: reqId,
            [`${t === "humanResources" ? "HumanResource" : t === "machines" ? "Machine" : "Material"}Id`]: r.item.key,
            [`${t === "humanResources" ? "HumanResource" : t === "machines" ? "Machine" : "Material"}Quantity`]: r.quantity,
            [`${t === "humanResources" ? "HumanResource" : t === "machines" ? "Machine" : "Material"}PricePerUnit`]: r.pricePerUnit
          };
          created.push(
            sp.web.lists.getByTitle(LISTS.TechnicalAssessments)
              .items.inBatch(batch).add(itm)
          );
        });
      });
    });

    return batch.execute().then(() => Promise.all(created))
                .then(rs => rs.map(r => r.data.Id as number));
  }

  public savePricing(p: IPricingDetails[]): Promise<void> {
    const batch = sp.web.createBatch();
    p.forEach(d => {
      sp.web.lists.getByTitle(LISTS.PricingDetails).items.inBatch(batch).add({
        RequestIDId: d.RequestID,
        UnitPrice: d.UnitPrice,
        Quantity: d.Quantity,
        AssessmentItemIDId: d.AssessmentItemID,
        TotalCost: d.UnitPrice * d.Quantity
      });
    });
    return batch.execute().then(() => { /* ok */ });
  }
}

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";

// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export interface IPricingDetails {
  RequestID: number;
  UnitPrice: number;
  Quantity: number;
  AssessmentItemID: number;

}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.add(requestData)
      .then((result) => {
        console.log("Create Response:", result);
        return result.data;
      })
      .catch((error) => {
        console.error("Create Error:", error);
        throw error;
      });
  }

  public getInventoryItems(): Promise<IDropdownOptionWithCategory[]> {
    return sp.web.lists
      .getByTitle("InventoryItems")
      .items.select("Id", "Title", "ItemCategory")
      .get()
      .then((data) =>
        data.map((item) => ({
          key: item.Id,
          text: item.Title,
          itemCategory: item.ItemCategory,
        }))
      );
  }

  public createTechnicalAssessment(assessmentData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.add(assessmentData);
  }

public saveAssessments(
  assessments: IAssessment[],
  requestId: number
): Promise<number[]> {
  const batch = sp.web.createBatch();
  const createdItems: Promise<any>[] = []; // Store promises for created items

  assessments.forEach((assessment) => {
    const createData = (resource: IResource, type: string) => ({
      Title: assessment.activity || "No Activity",
      RequestIDId: requestId, // Associate with the ProjectRequest
      [`${type}Id`]: resource.item ? resource.item.key : null, // Lookup field for resource
      [`${type}Quantity`]: resource.quantity,
      [`${type}PricePerUnit`]: resource.pricePerUnit,
    });

    assessment.humanResources.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "HumanResource"));
      createdItems.push(promise);
    });

    assessment.machines.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Machine"));
      createdItems.push(promise);
    });

    assessment.materials.forEach((resource) => {
      const promise = sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(createData(resource, "Material"));
      createdItems.push(promise);
    });
  });

  // Execute the batch and collect the created item IDs
  return batch
    .execute()
    .then(() => Promise.all(createdItems))
    .then((results) => results.map((result) => result.data.Id)) // Extract IDs
    .catch((error) => {
      console.error("Error saving assessments", error);
      throw error;
    });
}

public getPricingDetailsByRequestID(requestId: number): Promise<any[]> {
  return sp.web.lists
    .getByTitle("PricingDetails")
    .items.filter(`RequestIDId eq ${requestId}`) // Filter by RequestID lookup field
    .select("Id", "UnitPrice", "Quantity", "TotalCost")
    .get()
    .then((items) => {
      console.log("Fetched Pricing Details:", items);
      return items;
    })
    .catch((error) => {
      console.error("Error fetching pricing details:", error);
      throw error;
    });
}

public updateProjectRequestEstimatedCost(requestId: number, estimatedCost: number): Promise<void> {
  return sp.web.lists
    .getByTitle("ProjectRequests")
    .items.getById(requestId)
    .update({ EstimatedCost: estimatedCost }) // Update the EstimatedCost field
    .then(() => {
      console.log("Estimated cost updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating estimated cost:", error);
      throw error;
    });
}


public savePricingDetails(pricingDetails: IPricingDetails[]): Promise<void> {
  const batch = sp.web.createBatch();

  pricingDetails.forEach((detail) => {
    const data = {
      RequestIDId: detail.RequestID, // Lookup field: Use RequestIDId and pass the ID of the referenced item
      UnitPrice: parseFloat(detail.UnitPrice.toString()), // Ensure it's a number
      Quantity: parseInt(detail.Quantity.toString()), // Ensure it's a number
      AssessmentItemIDId: detail.AssessmentItemID, // Lookup field: Use AssessmentItemIDId and pass the ID of the referenced item
    };

    console.log("Pricing Detail Data to Add:", data);

    sp.web.lists
      .getByTitle("PricingDetails")
      .items.inBatch(batch)
      .add(data);
  });

  return batch
    .execute()
    .then(() => {
      console.log("Pricing details saved successfully");
    })
    .catch((error) => {
      console.error("Error saving pricing details", error);
      throw error;
    });
}





}

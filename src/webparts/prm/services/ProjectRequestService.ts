
// src/webparts/prm/services/ProjectRequestService.ts
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import BaseService from "./BaseService";
import TaxonomyService from "./TaxonomyService";
import DocumentService from "./DocumentService";
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";
// In ProjectRequestService.ts
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

// Add this method to check permissions

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
  TotalCost?: number;
}

export default class ProjectRequestService extends BaseService {
  private taxonomyService: TaxonomyService;
  private documentService: DocumentService;
  private commercialGroupName: string;

  constructor(context: any, commercialGroupName: string) {
    super(context);
    this.taxonomyService = new TaxonomyService(context);
    this.documentService = new DocumentService(context);
  this.commercialGroupName = commercialGroupName;
}
  // Taxonomy methods - delegated to TaxonomyService
  public getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    return this.taxonomyService.getTermsByTermSetId(termSetId, searchText);
  }

  public getTermsByFieldInternalName(fieldInternalName: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    return this.taxonomyService.getTermsByFieldInternalName(fieldInternalName, searchText);
  }

  public getTaxonomyTerms(termSetId: string): Promise<{ id: string; label: string }[]> {
    return this.taxonomyService.getTaxonomyTerms(termSetId);
  }

  public updateProjectCode(listTitle: string, itemId: number, termLabel: string, termGuid: string): Promise<void> {
    return this.taxonomyService.updateProjectCode(listTitle, itemId, termLabel, termGuid);
  }

  // Document methods - delegated to DocumentService
  public createDocumentSet(documentSetName: string): Promise<{ url: string; text: string } | null> {
    return this.documentService.createDocumentSet(documentSetName);
  }

  public updateDocumentSetLink(requestId: number, documentSetLink: { url: string; text: string }): Promise<void> {
    return this.documentService.updateDocumentSetLink(requestId, documentSetLink);
  }

  // Project Request methods
  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

// src/webparts/prm/services/ProjectRequestService.ts (continued)
  public getNextFormNumber(): Promise<number> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.orderBy("FormNumber", false).top(1).get()
      .then((items) => {
        if (items.length === 0) {
          return 1; // Start with 1 if no items exist
        }
        return items[0].FormNumber + 1;
      });
  }

// src/webparts/prm/services/ProjectRequestService.ts


public createProjectRequest(requestData: any): Promise<any> {
  // The issue is likely with how ProjectCode1 is being handled
  // Let's ensure it's properly formatted for a taxonomy field

  // Check if ProjectCode1 is a primitive value (string/number) and convert it to proper format
  if (requestData.ProjectCode1 && typeof requestData.ProjectCode1 === 'string') {
    // If it's a string (termId), convert to proper taxonomy format
    requestData.ProjectCode1 = {
      __metadata: { type: "SP.Taxonomy.TaxonomyFieldValue" },
      TermGuid: requestData.ProjectCode1,
      WssId: -1
    };
  } else if (requestData.ProjectCode1 && typeof requestData.ProjectCode1 === 'object' && requestData.ProjectCode1.id) {
    // If it's an object with id property, use that as TermGuid
    requestData.ProjectCode1 = {
      __metadata: { type: "SP.Taxonomy.TaxonomyFieldValue" },
      TermGuid: requestData.ProjectCode1.id,
      WssId: -1
    };
  }

  console.log("Formatted request data:", JSON.stringify(requestData, null, 2));

  return sp.web.lists
    .getByTitle("ProjectRequests")
    .items.add(requestData)
    .then(async (result) => {
      console.log("Raw API Response:", result);
      const requestId = result.data.Id;
      if (!requestId) {
        throw new Error("Error: requestId is undefined!");
      }
      const documentSetName = `Request-${requestId}`;
      const documentSetLink = await this.createDocumentSet(documentSetName);
      if (!documentSetLink) {
        throw new Error("Document Set creation failed. No valid link returned.");
      }
      await this.updateDocumentSetLink(requestId, documentSetLink);
      return {
        success: true,
        requestId,
        documentSetLink,
        FormNumber: result.data.FormNumber
      };
    })
    .catch((error) => {
      console.error("Project request creation failed:", error);
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
    const createdItems: Promise<any>[] = [];

    assessments.forEach((assessment) => {
      const createData = (resource: IResource, type: string) => ({
        Title: assessment.activity || "No Activity",
        RequestIDId: requestId,
        [`${type}Id`]: resource.item ? resource.item.key : null,
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

    return batch
      .execute()
      .then(() => Promise.all(createdItems))
      .then((results) => results.map((result) => result.data.Id))
      .catch((error) => {
        console.error("Error saving assessments", error);
        throw error;
      });
  }

  public getPricingDetailsByRequestID(requestId: number): Promise<any[]> {
    console.log("Fetching Pricing Details for RequestID:", requestId);
    return sp.web.lists
      .getByTitle("PricingDetails")
      .items.filter(`RequestIDId eq ${requestId}`)
      .select("Id", "UnitPrice", "Quantity", "AssessmentItemIDId")
      .get()
      .then(items => {
        console.log("Raw Fetched Items:", items);
        const calculatedItems = items.map(item => ({
          ...item,
          TotalCost: item.UnitPrice * item.Quantity
        }));
        console.log("Calculated Items (with TotalCost):", calculatedItems);
        return calculatedItems;
      })
      .catch(error => {
        console.error("Error fetching pricing details:", error);
        throw error;
      });
  }


  // Add to src/webparts/prm/services/ProjectRequestService.ts
public updateProjectRequest(requestId: number, requestData: any): Promise<any> {
  return sp.web.lists
    .getByTitle("ProjectRequests")
    .items.getById(requestId)
    .update(requestData)
    .then(() => {
      return {
        success: true,
        requestId: requestId
      };
    })
    .catch((error) => {
      console.error("Project request update failed:", error);
      throw error;
    });
}

private checkUserInCommercialDepartment(): Promise<boolean> {
  const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentUser/groups`;

  return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1, {
    headers: {
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose;charset=utf-8"
    }
  })
  .then((response: SPHttpClientResponse) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`HTTP ${response.status}`);
  })
  .then((data: any) => {
    const groups = data.d.results;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].Title === this.commercialGroupName) {
        return true;
      }

    }
    return false;
  })
  .catch((error) => {
    console.error("Group check failed:", error);
    return false;
  });
}

// Update the savePricingDetails method
public savePricingDetails(pricingDetails: IPricingDetails[]): Promise<any> {
  // First check if user has permission
  return this.checkUserInCommercialDepartment().then(isCommercial => {
    if (!isCommercial) {
      // For non-commercial users, set all prices to 0 before saving
      for (let i = 0; i < pricingDetails.length; i++) {
        pricingDetails[i].UnitPrice = 0;
      }
    }

    // Now proceed with saving
    const batch = sp.createBatch();
    const pricingList = sp.web.lists.getByTitle("PricingDetails");

    pricingDetails.forEach(detail => {
      pricingList.items.inBatch(batch).add({
        RequestIDId: detail.RequestID,
        UnitPrice: detail.UnitPrice,
        Quantity: detail.Quantity,
        AssessmentItemIDId: detail.AssessmentItemID
      });
    });

    return batch.execute();
  });
}

// Also update the updateProjectRequestEstimatedCost method
public updateProjectRequestEstimatedCost(requestId: number, totalCost: number): Promise<any> {
  return this.checkUserInCommercialDepartment().then(isCommercial => {
    if (!isCommercial) {
      // Non-commercial users can't update cost
      return Promise.resolve();
    }

    // Commercial users can update cost
    return sp.web.lists.getByTitle("ProjectRequests").items.getById(requestId).update({
      EstimatedCost: totalCost
    });
  });
}


}

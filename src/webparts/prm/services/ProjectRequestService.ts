// ProjectRequestService.ts

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types"
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
  TotalCost?: number; // Optional if not always included

}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

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

  // public createProjectRequest(requestData: any): Promise<any> {
  //   return sp.web.lists
  //     .getByTitle("ProjectRequests")
  //     .items.add(requestData)
  //     .then((result) => {
  //       console.log("Create Response:", result);
  //       return result.data;
  //     })
  //     .catch((error) => {
  //       console.error("Create Error:", error);
  //       throw error;
  //     });
  // }




  // public createProjectRequest(requestData: any): Promise<any> {
  //   let requestId: number;

  //   // Step 1: Create the request form in the ProjectRequests list
  //   return sp.web.lists
  //     .getByTitle("ProjectRequests")
  //     .items.add(requestData)
  //     .then((result) => {
  //       console.log("Request form created:", result);
  //       requestId = result.data.Id; // Get the newly created request ID

  //       // Step 2: Create the Document Set using the request ID
  //       const documentSetName = `Request-${requestId}`; // Name the Document Set based on the request ID
  //       return this.createDocumentSet("RelatedDocuments", documentSetName, requestId);
  //     })
  //     .then((documentSetLink) => {
  //       console.log("Document Set created with link:", documentSetLink);

  //       // Step 3: Update the DocumentSetLink column with the hyperlink to the Document Set
  //       return sp.web.lists
  //         .getByTitle("ProjectRequests")
  //         .items.getById(requestId)
  //         .update({
  //           DocumentSetLink: JSON.stringify(documentSetLink), // Save the hyperlink as a JSON string
  //         });
  //     })
  //     .then(() => {
  //       console.log("DocumentSetLink updated successfully.");
  //       return { success: true, requestId }; // Return the request ID and success status
  //     })
  //     .catch((error) => {
  //       console.error("Error creating request or Document Set:", error);
  //       throw error;
  //     });
  // }

// //////////////////////////

  public createProjectRequest(requestData: any): Promise<any> {
    let requestId: number;

    // Step 1: Create the request form in the ProjectRequests list
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.add(requestData)
      .then((result) => {
        console.log("Request form created:", result);
        requestId = result.data.Id; // Get the newly created request ID

        // Step 2: Create the Document Set using the request ID
        const documentSetName = `Request-${requestId}`; // Name the Document Set based on the request ID
        return this.createDocumentSet("RelatedDocuments", documentSetName, requestId);
      })
      .then((documentSetLink) => {
        console.log("Document Set created with link:", documentSetLink);

        // Step 3: Update the DocumentSetLink column with the hyperlink to the Document Set
        return this.updateDocumentSetLink(requestId, documentSetLink);
      })
      .then(() => {
        console.log("DocumentSetLink updated successfully.");
        return { success: true, requestId }; // Return the request ID and success status
      })
      .catch((error) => {
        console.error("Error creating request or Document Set:", error);
        throw error;
      });
  }




  // public createProjectRequest(requestData: any): Promise<any> {
  //   return sp.web.lists
  //     .getByTitle("ProjectRequests")
  //     .items.add(requestData)
  //     .then((result) => {
  //       const requestId = result.data.Id;
  //       const documentSetName = `Request-${requestId}`;

  //       return this.createDocumentSet("RelatedDocuments", documentSetName, requestId)
  //         .then((documentSetLink) => {
  //           // Return both requestId AND documentSetLink for chaining
  //           return { requestId, documentSetLink };
  //         });
  //     })
  //     .then(({ requestId, documentSetLink }) => {
  //       return this.updateDocumentSetLink(requestId, documentSetLink)
  //         .then(() => ({ success: true, requestId }));
  //     })
  //     .catch((error) => {
  //       console.error("Error creating request:", error);
  //       throw error;
  //     });
  // }

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
        RequestIDId: detail.RequestID, // Lookup field
        UnitPrice: parseFloat(detail.UnitPrice.toString()), // Ensure it's a number
        Quantity: parseInt(detail.Quantity.toString()), // Ensure it's a number
        AssessmentItemIDId: detail.AssessmentItemID, // Lookup field
        TotalCost: detail.UnitPrice * detail.Quantity // Add TotalCost here
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


  public createDocumentSet(
    libraryName: string, // The library where the Document Set will be created
    documentSetName: string, // The name of the Document Set
    requestId: number // The ID of the related request
  ): Promise<{ url: string; text: string }> {
    console.log(`Creating Document Set: ${documentSetName}`);

    const siteUrl = sp.web.toUrl(); // Get the site URL
    const libraryPath = `${siteUrl}/${libraryName}`; // Path to the document library
    const documentSetPath = `${libraryPath}/${documentSetName}`; // Path for the Document Set

    // Step 1: Create the folder in the library
    return sp.web.folders
      .add(`${libraryName}/${documentSetName}`)
      .then((folderResult) => {
        console.log("Folder created for Document Set:", folderResult);

        // Step 2: Set the folder content type to Document Set
        const documentSetContentTypeId = "0x0120D520"; // Default Content Type ID for Document Set in SharePoint
        const folderItemId = folderResult.data.UniqueId; // Unique ID of the created folder

        // Use REST API to update the folder's content type
        return sp.web.getFolderByServerRelativePath(folderResult.data.ServerRelativeUrl)
          .getItem()
          .then((folderItem) => {
            return folderItem.update({
              ContentTypeId: documentSetContentTypeId, // Update to Document Set content type
            });
          })
          .then(() => {
            console.log("Folder content type updated to Document Set.");

            // Return the Document Set link
            const documentSetUrl = folderResult.data.ServerRelativeUrl;
            const absoluteUrl = `${window.location.origin}${documentSetUrl}`;
            return {
              url: absoluteUrl, // Full URL of the Document Set
              text: `Documents for Request ${requestId}`, // Text for the hyperlink
            };
          });
      })
      .catch((error) => {
        console.error("Error creating Document Set:", error);
        throw error;
      });
  }

  // public updateDocumentSetLink(
  //   requestId: number,
  //   documentSetLink: { url: string; text: string }
  // ): Promise<void> {
  //   console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

  //   // Format the hyperlink value as "URL, Display Text"
  //   const hyperlinkValue = `${documentSetLink.url}, ${documentSetLink.text}`;

  //   return sp.web.lists
  //     .getByTitle("ProjectRequests")
  //     .items.getById(requestId)
  //     .update({
  //       DocumentSetLink: hyperlinkValue, // Use the actual internal name of the column
  //     })
  //     .then(() => {
  //       console.log("DocumentSetLink updated successfully.");
  //     })
  //     .catch((error) => {
  //       console.error("Error updating DocumentSetLink:", error);
  //       throw error;
  //     });
  // }

  public updateDocumentSetLink(
    requestId: number,
    documentSetLink: { url: string; text: string }
  ): Promise<void> {
    console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

    // SharePoint hyperlink field requires this specific format
    const hyperlinkValue = {
      __metadata: { type: "SP.FieldUrlValue" }, // REQUIRED metadata
      Url: documentSetLink.url,
      Description: documentSetLink.text
    };

    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.getById(requestId)
      .update({
        // Use internal name with correct casing
        DocumentSetLink: hyperlinkValue
      })
      .then(() => {
        console.log("DocumentSetLink updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating DocumentSetLink:", error);
        throw error;
      });
  }

  // public updateDocumentSetLink(
  //   requestId: number,
  //   documentSetLink: { url: string; text: string }
  // ): Promise<void> {
  //   console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

  //   // SharePoint hyperlink field requires this specific format
  //   const hyperlinkValue = {
  //     __metadata: { type: "SP.FieldUrlValue" }, // REQUIRED metadata
  //     Url: documentSetLink.url,
  //     Description: documentSetLink.text
  //   };

  //   return sp.web.lists
  //     .getByTitle("ProjectRequests")
  //     .items.getById(requestId)
  //     .update({
  //       // Use internal name with correct casing
  //       DocumentSetLink: hyperlinkValue
  //     })
  //     .then(() => {
  //       console.log("DocumentSetLink updated successfully.");
  //     })
  //     .catch((error) => {
  //       console.error("Error updating DocumentSetLink:", error);
  //       throw error;
  //     });
  // }

}



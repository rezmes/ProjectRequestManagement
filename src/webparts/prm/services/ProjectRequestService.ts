// ProjectRequestService.ts


import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types"
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";
import { ContentType } from "@pnp/sp/content-types";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';


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
  private context: any;

  constructor(context:any) {
  this.context = context;
}
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

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.add(requestData)
      .then(async (result) => {
        const requestId = result.data.Id;
        console.log("Request form created. ID:", requestId);

        // Create Document Set
        const documentSetName = `Request-${requestId}`;
        const documentSetLink = await this.createDocumentSet(
          documentSetName
        );

        // Update ProjectRequest with link
        await this.updateDocumentSetLink(requestId, documentSetLink);

        return { success: true, requestId };
      })
      .catch((error) => {
        console.error("Project request creation failed:", error);
        throw error;
      });
  }

  // Method to fetch form digest value
  // private async getFormDigestValue(): Promise<string> {
  //   const contextInfoUrl = `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`;
  //   const response = await this.context.spHttpClient.post(
  //     contextInfoUrl,
  //     SPHttpClient.configurations.v1,
  //     {
  //       headers: {
  //         "Accept": "application/json;odata=verbose",
  //         "Content-Type": "application/json;odata=verbose"
  //       }
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }

  //   const jsonResponse = await response.json();
  //   return jsonResponse.d.GetContextWebInformation.FormDigestValue;
  // }

  // public async createDocumentSetWithMetadata(
  //   libraryName: string,
  //   documentSetName: string
  // ): Promise<{ url: string; text: string }> {
  //   try {
  //     // 1. Get library-specific Document Set Content Type ID
  //     const contentTypeResponse = await sp.web.lists
  //       .getByTitle(libraryName)
  //       .contentTypes
  //       .filter("Name eq 'ProjectDocumentation'")
  //       .select("StringId")
  //       .get();

  //     if (contentTypeResponse.length === 0) {
  //       throw new Error("Document Set content type not found in library");
  //     }
  //     const contentTypeId = contentTypeResponse[0].StringId;

  //     // 2. Create Document Set via legacy endpoint
  //     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${libraryName}`;
  //     const slugValue = `${libraryName}/${documentSetName}|${contentTypeId}`;

  //     const formDigestValue = await this.getFormDigestValue();

  //     const response = await this.context.spHttpClient.post(
  //       endpoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           "Accept": "application/json;odata=verbose",
  //           "Content-Type": "application/json;odata=verbose",
  //           "Slug": slugValue,
  //           "X-RequestDigest": formDigestValue
  //         },
  //         body: JSON.stringify({
  //           Title: documentSetName,
  //           Path: libraryName
  //         })
  //       }
  //     );

  //     if (!response.ok) throw new Error(`HTTP error ${response.status}`);

  //     // 3. Return Document Set URL
  //     const result = await response.json();
  //     return {
  //       url: `${window.location.origin}${result.d.ServerRelativeUrl}`,
  //       text: `Documents for Request ${documentSetName.split('-')[1]}`
  //     };
  //   } catch (error) {
  //     console.error(`[ERROR] Document Set creation failed: ${error}`);
  //     throw error;
  //   }
  // }


  // public async createDocumentSetWithMetadata(
  //   libraryName: string,
  //   documentSetName: string
  // ): Promise<{ url: string; text: string }> {
  //   try {
  //     // 1. Get library-specific Document Set Content Type ID
  //     const contentTypeResponse = await sp.web.lists
  //       .getByTitle(libraryName)
  //       .contentTypes
  //       .filter("Name eq 'Document Set'")
  //       .select("StringId")
  //       .get();

  //     if (contentTypeResponse.length === 0) {
  //       throw new Error("Document Set content type not found in library");
  //     }
  //     const contentTypeId = contentTypeResponse[0].StringId;

  //     // 2. Prepare legacy API endpoint
  //     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${encodeURIComponent(libraryName)}`;

  //     // 3. Prepare headers with correct encoding
  //     const headers = new Headers({
  //       "Accept": "application/json;odata=verbose",
  //       "Content-Type": "application/json;odata=verbose",
  //       "Slug": `${encodeURIComponent(libraryName)}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
  //       "X-RequestDigest": this.context.formDigestValue
  //     });

  //     // 4. Execute request
  //     const response = await this.context.spHttpClient.post(
  //       endpoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers,
  //         body: JSON.stringify({
  //           Title: documentSetName,
  //           Path: libraryName
  //         })
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  //     }

  //     // 5. Process response
  //     const result = await response.json();
  //     return {
  //       url: `${window.location.origin}${result.d.ServerRelativeUrl}`,
  //       text: `Documents for Request ${documentSetName.split('-')[1]}`
  //     };

  //   } catch (error) {
  //     console.error("Document Set creation failed. Details:", {
  //       libraryName,
  //       documentSetName,
  //       error: error.message
  //     });
  //     throw error;
  //   }
  // }



  // public async createDocumentSetWithMetadata(
  //   libraryName: string,
  //   documentSetName: string
  // ): Promise<{ url: string; text: string }> {
  //   try {
  //     // 1. Get library-specific Document Set Content Type ID
  //     const contentTypeResponse = await sp.web.lists
  //       .getByTitle(libraryName)
  //       .contentTypes
  //       .filter("Name eq 'Document Set'")
  //       .select("StringId")
  //       .get();

  //     if (contentTypeResponse.length === 0) {
  //       throw new Error("Document Set content type not found in library");
  //     }
  //     const contentTypeId = contentTypeResponse[0].StringId;

  //     // 2. Get the form digest value dynamically
  //     const digestResponse = await this.context.spHttpClient.post(
  //       `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           "Accept": "application/json;odata=verbose",
  //           "Content-Type": "application/json;odata=verbose"
  //         }
  //       }
  //     );

  //     if (!digestResponse.ok) {
  //       throw new Error(`Failed to fetch form digest value. HTTP error ${digestResponse.status}: ${digestResponse.statusText}`);
  //     }

  //     const digestData = await digestResponse.json();
  //     const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue;

  //     // 3. Prepare legacy API endpoint
  //     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${encodeURIComponent(libraryName)}`;

  //     // 4. Prepare headers with correct encoding
  //     const headers = new Headers({
  //       "Accept": "application/json;odata=verbose",
  //       "Content-Type": "application/json;odata=verbose",
  //       "Slug": `${encodeURIComponent(libraryName)}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
  //       "X-RequestDigest": formDigestValue // Use dynamically retrieved form digest value
  //     });

  //     // 5. Execute request
  //     const response = await this.context.spHttpClient.post(
  //       endpoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers,
  //         body: JSON.stringify({
  //           Title: documentSetName,
  //           Path: libraryName
  //         })
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  //     }

  //     // 6. Process response
  //     const result = await response.json();
  //     return {
  //       url: `${window.location.origin}${result.d.ServerRelativeUrl}`,
  //       text: `Documents for Request ${documentSetName.split('-')[1]}`
  //     };

  //   } catch (error) {
  //     console.error("Document Set creation failed. Details:", {
  //       libraryName,
  //       documentSetName,
  //       error: error.message
  //     });
  //     throw error;
  //   }
  // }


//   public async createDocumentSetWithMetadata(
//     libraryName: string,
//     documentSetName: string
//   ): Promise<{ url: string; text: string }> {
//     try {
//       // 1️⃣ Hardcoded Content Type ID for Document Set
//       const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";

//       // 2️⃣ Get the form digest value using the new `getFormDigest()` method
//       const formDigestValue = await this.getFormDigest(); // ✅ Correctly fetches digest value

// // 3️⃣ Fetch List Item Entity Type Name (Required for Document Set Creation) - Now with JSON parsing again!
// const listEntityTypeResponse = await this.context.spHttpClient.get(
//   `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${libraryName}')?$select=ListItemEntityTypeFullName`,
//   SPHttpClient.configurations.v1,
//   {
//     headers: {
//       "Accept": "application/json;odata=verbose" // Be very specific JSON OData verbose
//   }
//   }
// );

// if (!listEntityTypeResponse.ok) {
//   throw new Error(`Failed to fetch List Entity Type. HTTP error ${listEntityTypeResponse.status}: ${listEntityTypeResponse.statusText}`);
// }

// const listEntityTypeData = await listEntityTypeResponse.json();
// console.log("listEntityTypeData:", listEntityTypeData);
// await new Promise(resolve => setTimeout(resolve, 1000)); // **INSERT THIS TINY DELAY**
//  const listItemEntityTypeFullName = listEntityTypeData.d.ListItemEntityTypeFullName;
// // const listItemEntityTypeFullName = "SP.Data.DocumentSet"; //  یه چیز الکی برای تست!
// console.log("listItemEntityTypeFullName:", listItemEntityTypeFullName);


//     // 4️⃣ Prepare API endpoint for creating a Document Set (POST request remains the same)
//     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${libraryName}')//RootFolder/Children`;


//     // 5️⃣ Execute request to create the Document Set (POST request remains the same)
//     const response = await this.context.spHttpClient.post(
//         endpoint,
//         SPHttpClient.configurations.v1,
//         {
//             headers: {
//               "Accept": "*/*"
//                 // "Accept": "application/json;odata=verbose",
//                 // "Content-Type": "application/json;odata=verbose",
//                 // "X-RequestDigest": formDigestValue
//             },
//             body: JSON.stringify({
//                 "__metadata": { "type": listItemEntityTypeFullName }, // Use the parsed ListItemEntityTypeFullName
//                 "Title": documentSetName,
//                 "ContentTypeId": contentTypeId
//             })
//         }
//     );

//     if (!response.ok) {
//         throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
//     }

//     // 6️⃣ Process response (remains the same - assuming POST response is JSON)
//     const result = await response.json();
//     return {
//         url: `${window.location.origin}${result.d.FileRef}`,
//         text: `Documents for Request ${documentSetName.split('-')[1]}`
//     };

// } catch (error) {
//     console.error("❌ Document Set creation failed. Details:", {
//         libraryName,
//         documentSetName,
//         error: error.message
//     });
//     throw error;
// }
// }



  public async getFormDigest(): Promise<string> {
    try {
      const digestElement = document.getElementById("__REQUESTDIGEST");
      const digestValue = digestElement ? digestElement.getAttribute("value") : "";

      const response = await fetch(
        `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digestValue || "" // Use extracted form digest if available
          },
          credentials: "include" // Ensures authentication
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Form Digest. HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.d.GetContextWebInformation.FormDigestValue;

    } catch (error) {
      console.error("❌ FormDigest fetch failed:", error);
      throw error;
    }
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




  // public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string }> {
  //   try {

  //     const libraryName = "RelatedDocuments";
  //     const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
  //     const listUrl = `${this.context.pageContext.web.absoluteUrl}/${libraryName}`;
  

  //     const headers = {
  //       "Accept": "application/json;odata=verbose",
  //       "Content-Type": "application/json;odata=verbose",
  //       "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
  //       "X-RequestDigest": this.context.formDigestValue
  //     };
  

  //     const postBody = JSON.stringify({
  //       Title: documentSetName,
  //       Path: libraryName
  //     });
  

  //     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${libraryName}`;
  //     const response: SPHttpClientResponse = await this.context.spHttpClient.post(
  //       endpoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers,
  //         body: postBody
  //       }
  //     );
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  

  //     const result = await response.json();
  //     console.log("result: ", result);
  //     const serverRelativeUrl = result.d.ServerRelativeUrl;
  //     console.log("servierRelativeUrl ", serverRelativeUrl);
  //     return {
  //       url: `${this.context.pageContext.web.absoluteUrl}${serverRelativeUrl}`, // ✅ استفاده از this.context.pageContext.web.absoluteUrl
  //       text: `Documents for ${documentSetName}`
  //     };
  
  //   } catch (error) {
  //     console.error("[DOCSET CREATION ERROR]", error);
  //     throw new Error(`Document Set creation failed: ${error.message}`);
  //   }
  // }


  public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string }> {
    try {
        const libraryName = "RelatedDocuments";
        const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
        const listUrl = `${this.context.pageContext.web.absoluteUrl}/${libraryName}`;

        const headers = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
            "X-RequestDigest": this.context.formDigestValue
        };

        const postBody = JSON.stringify({
            Title: documentSetName,
            Path: libraryName
        });

        const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${libraryName}`;
        const response: SPHttpClientResponse = await this.context.spHttpClient.post(
            endpoint,
            SPHttpClient.configurations.v1,
            {
                headers,
                body: postBody
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result: ", result);

        // استخراج شناسه سند (Document ID) و پردازش URL
        const docIdFullUrl = result.d["شناسهسند"]; // ✅ اسم فیلد "شناسهسند" (فارسی!)
        console.log("docIdFullUrl: ", docIdFullUrl); // لاگ کامل شناسه سند

        const docIdUrlPart = docIdFullUrl.split(',')[0]; // ✅ جدا کردن قسمت اول URL (قبل از کاما)
        console.log("docIdUrlPart: ", docIdUrlPart); // لاگ قسمت اول URL

        // ساخت URL نهایی Document Set بر اساس DocIdRedir.aspx و شناسه سند
        const documentSetUrl = docIdUrlPart; // ✅ دیگه نیازی به ترکیب با this.context.pageContext.web.absoluteUrl نیست!

        console.log("documentSetUrl: ", documentSetUrl); // لاگ URL نهایی

        return {
            url: documentSetUrl, // ✅ استفاده از URL استخراج شده از شناسه سند
            text: `Documents for ${documentSetName}`
        };

    } catch (error) {
        console.error("[DOCSET CREATION ERROR]", error);
        return null;
        // throw new Error(`Document Set creation failed: ${error.message}`);
    }
}


// public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string }> {
//   try {
//     // 1️⃣ Hardcoded values (Verify these match your environment)
//     const libraryName = "RelatedDocuments";
//     const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
//     const listUrl = `${this.context.pageContext.web.absoluteUrl}/${libraryName}`;

//     // 2️⃣ Prepare headers with critical Slug value
//     const headers = {
//       "Accept": "application/json;odata=verbose",
//       "Content-Type": "application/json;odata=verbose",
//       "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
//       "X-RequestDigest": this.context.formDigestValue
//     };

//     // 3️⃣ Prepare POST body
//     const postBody = JSON.stringify({
//       Title: documentSetName,
//       Path: libraryName
//     });

//     // 4️⃣ Execute legacy REST call
//     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${libraryName}`;
//     const response: SPHttpClientResponse = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers,
//         body: postBody
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     // 5️⃣ Process response
//     const result = await response.json();
//     const serverRelativeUrl = result.d.ServerRelativeUrl;
    
//     return {
//       url: `${window.location.origin}${serverRelativeUrl}`,
//       text: `Documents for ${documentSetName}`
      
//     };
    

//   } catch (error) {
//     console.error("[DOCSET CREATION ERROR]", error);
//     throw new Error(`Document Set creation failed: ${error.message}`);
//   }
// }

//  public async updateDocumentSetLink( // ✅ متد updateDocumentSetLink رو اصلاح کردیم
// requestId: number,
//  documentSetUrl: string // ✅ اسم پارامتر رو به documentSetUrl تغییر دادیم و نوعش رو string گذاشتیم
//  ) {
//  try {
//  await sp.web.lists
//  .getByTitle("ProjectRequests")
//  .items.getById(requestId)
//  .update({
//  DocumentSetLink: { // ✅ اینجا شیء Hyperlink رو می سازیم
//  Url: documentSetUrl,
// Description: "Project Documents",
//  },
//  });
// console.log("DocumentSetLink updated successfully.");
//  } catch (error) {
//  console.error("Error updating DocumentSetLink:", error);
//  // ✅ پرتاب مجدد خطا برای اینکه به catch در ProjectRequestForm برسه
//  throw error;
//  }
// }


public async updateDocumentSetLink(
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

  try { // ✅ اضافه کردن try...catch
      await sp.web.lists
          .getByTitle("ProjectRequests")
          .items.getById(requestId)
          .update({
              // Use internal name with correct casing
              DocumentSetLink: hyperlinkValue
          });
      console.log("DocumentSetLink updated successfully.");
  } catch (error) {
      console.error("Error updating DocumentSetLink:", error);
      // ✅ پرتاب مجدد خطا برای اینکه به catch در ProjectRequestForm برسه
      throw error; // ✅ مهم: پرتاب مجدد خطا
  }
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



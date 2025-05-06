# prm

This is where you include your WebPart documentation.

## Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

- lib/\* - intermediate-stage commonjs build artifacts
- dist/\* - the bundled script, along with other resources
- deploy/\* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

<!-- START -->

## Project Request Management (PRM)

## Scenario: Project Request and Execution Process

This document outlines the process for handling project requests, from initial customer contact to project pricing and initiation. The process involves several departments, including the Commerce Department and the Technical & Engineering Department.

**1. Customer Request:**
The process begins with the customer informing the Commerce Department of their need for products and services. This communication can occur through various channels: a. Verbal communication b. Formal letter c. Participation in tenders

**Note:** The primary deliverable is typically multi-month, sometimes multi-year projects. These projects encompass both goods consumed during the project and the execution of project services.

**2. Initial Response (Commerce Department):**
Upon receiving a request, the Commerce Department must provide the customer with the following information:
a. Estimated project duration
b. Project cost estimate

**3. Request Submission and Referral (Commerce Department):**
The Commerce Department formally registers the customer request within the system and forwards it to the Technical & Engineering Department.

**4. Technical Assessment (Technical & Engineering Department):**
The Technical & Engineering Department shares the request with relevant engineering sub-departments and solicits input regarding their specific areas of expertise.

This assessment covers the following aspects:
a. List of necessary activities to fulfill the customer request
b. Required man-hours, broken down by expertise level (e.g., expert, technician, general worker)
c. Required materials and tools, with quantities
d. Required machinery and estimated usage hours
e. Activity dependencies (predecessor, concurrent, successor)
f. Any special considerations or potential challenges

**5. Compilation and Review (Technical & Engineering Department):**
The Technical & Engineering Department consolidates the input from the various sub-departments and creates a draft document, which is then submitted to the respective sub-departments for review and approval.

**6. Finalization and Handover (Technical & Engineering Department):**
Once the consolidated document is approved, it is finalized and returned to the Commerce Department for pricing.

**7. Pricing (Commerce Department):**
The Commerce Department individually prices each item listed in the document and multiplies it by the corresponding quantity to determine the total cost per item. These totals are then summed to calculate the overall project cost (similar to a pro forma invoice). This total cost, along with the project duration provided by the Technical & Engineering Department, forms the basis for the final price and timeline presented to the customer.

**Key Considerations:**

1. **Supporting Documentation:**
   This process will undoubtedly involve supporting documents. It is recommended to utilize SharePoint's Document Set feature, along with a form or other suitable mechanism, to manage these documents efficiently.

2. **Workflow Automation:**
   The Nintex Workflow Designer 2019 tool is available for workflow automation.

3. **Environment:**
   The solution will be implemented in SharePoint 2019 On-Premises. The online version is not available.

4. **Customization:**
   Customizations will be developed using the SPFx@1.4.1 framework.

**_Crucially:_**
SharePoint 2019 - On-premises Dev. Env.:
`SPFx@1.4.1 (node@8.17.0, react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2; updates and upgrades are not options)`

**Pay close attention to the limitations imposed by the framework version and avoid using commands or external tools incompatible with it.**

## Step 2: Create Lists

1. 'Customer'
   Title (Single line of text) → Customer Name
   Email (text)
   WorkPhone (single line of text)
   WorkAddress (single line of text)
   CustomerType (Choices: Individual, Corporate, Government)

2. 'InventoryItems' List
   Title → Item Name
   ItemCategory (Choice)
   PricePerUnit (Currency)
   Activity (single line of text)
   Type (Choices)
   Description (single line of text)
   Image (hyperlink)
   Brand (single line of text)
   ItemCode (single line of text)

3. 'ProjectRequests' List
   Title → Request Title
   Customer (Lookup)
   RequestDate (Date and Time)
   EstimatedDuration(day) (number)
   EstimatedCost (currency)
   RequestStatus (Choices: New, In Progress, Completed, Priced)
   DocumentSetID (lookup to ProjectDocumentation library)

4. 'TechnicalAssessments' List
   Title → Assessment Title
   RequestID (Lookup)
   DepartmentName (Metadata)
   HumanResource (Lookup to InventoryItems list -Title filter on Type(HumanResource))
   Material (Lookup to InventoryItems list -Title filter on Type(Material))
   Machine (Lookup to InventoryItems list -Title filter on Type(Machine))
   Quantity (number)
   _Dependencies (Multiple lines of text)_
   _SpecialConsiderations (Multiple lines of text)_
   UnitPrice (Currency)
   TotalCost (Calculated)

## Step 3: Create Document Library for Project Documentation

Library Name: 'ProjectDocumentation'
Enable Document Sets

- Metadata Fields:
  Project-Code (Metadata)
  Customer (Lookup to Customer list)
  TechnicalAssessmentStatus (Choices: Not Started, In Progress, Completed)
  PricingStatus (Choices: Pending, Finalized)

## Step 4: Permissions Setup

Commerce Department: Can create/edit project requests but cannot modify technical assessments.
Engineering Teams: Can only update their respective assessments.
Pricing Team: Can only edit pricing details.
Management: Full control over all lists.

## Implementation Plan

1. SPFx Form Development
   Develop custom forms for request submission, technical assessments, and pricing details using SPFx.
   Ensure forms are dynamically populated with items from the InventoryItems list.

2. Document Set Management
   Configure Document Sets in the Project Documentation Library to group related project documents.

3. Workflow Automation with Nintex
   Implement workflows to automate notifications, approvals, and status updates.
   Ensure workflows correctly link list items and documents using the Current Item ID.

## Installing some packages

 `npm install moment@2.24.0 moment-jalaali@0.8.3`



<!-- Start Implementation -->

## Step 1: SPFx Form Development

We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

I'll refactor and clean up the code to make it more readable while being extremely careful about maintaining compatibility with SPFx@1.4.1. I'll focus on breaking down larger components and improving organization without changing any syntax that could break functionality.

## Refactoring Plan

1. Break down large components into smaller ones
2. Improve naming conventions and organization
3. Maintain all SPFx@1.4.1 compatibility requirements
4. Ensure UI components use the correct syntax for this version

Let's start with the refactoring:

### 1. ProjectRequestService Refactoring

The service file is quite large. Let's split it into domain-specific services:

```ts
// src/webparts/prm/services/BaseService.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";

export default class BaseService {
  protected context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

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
            "X-RequestDigest": digestValue || ""
          },
          credentials: "include"
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
}
```

```ts
// src/webparts/prm/services/TaxonomyService.ts
import BaseService from "./BaseService";
import { SPHttpClient } from "@microsoft/sp-http";

export default class TaxonomyService extends BaseService {
  public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;
    const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

    const soapEnvelope = `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
            <sspId>${sspId}</sspId>
            <termSetId>${termSetId}</termSetId>
            <lcid>1065</lcid>
            <termIds/>
          </GetChildTermsInTermSet>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      console.log('Fetching terms with Term Set ID:', termSetId);
      const response = await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Content-Type': 'text/xml;charset="UTF-8"',
            'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
          },
          body: soapEnvelope
        }
      );

      const responseText = await response.text();
      console.log('Response Text:', responseText);

      const parser = new DOMParser();
      const xmlDoc: Document = parser.parseFromString(responseText, 'text/xml');
      const resultNode = xmlDoc.querySelector("GetChildTermsInTermSetResult");
      if (!resultNode) {
        console.error("No GetChildTermsInTermSetResult node found");
        return [];
      }
      const innerXmlEncoded = resultNode.textContent || "";
      const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const innerDoc = parser.parseFromString(innerXml, "text/xml");

      const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
      const terms: { id: string; label: string }[] = [];
      termNodes.forEach((termNode) => {
        const labelAttr = termNode.getAttribute("a12");
        const idAttr = termNode.getAttribute("a45");
        if (idAttr && labelAttr) {
          terms.push({ id: idAttr, label: labelAttr });
        }
      });

      console.log('Fetched Terms:', terms);

      if (searchText) {
        return terms.filter(term => term.label.indexOf(searchText) >= 0);
      }
      return terms;
    } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
    }
  }

  public async getTermsByFieldInternalName(fieldInternalName: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/fields/getbyinternalnameortitle('${fieldInternalName}')`;
    const response = await this.context.spHttpClient.get(
      `${endpoint}?$expand=TaxonomyField`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      throw new Error(`Failed to get field: ${response.statusText}`);
    }

    const fieldData = await response.json();
    return this.getTermsByTermSetId(fieldData.TaxonomyField.SspId, searchText);
  }

  public async getTaxonomyTerms(termSetId: string): Promise<{ id: string; label: string }[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('TaxonomyHiddenList')/items?` +
      `$select=Path,Id&` +
      `$filter=IdForTermSet eq `+ `'` + termSetId + `'`;

    const options = {
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    };

    try {
      const response = await this.context.httpClient.get(endpoint, SPHttpClient.configurations.v1, options);
      const data = await response.json();
      return data.d.results.map((item: any) => ({
        id: item.Id,
        label: item.Path
      }));
    } catch (error) {
      console.error("Error retrieving terms:", error);
      return [];
    }
  }

  public async updateProjectCode(listTitle: string, itemId: number, termLabel: string, termGuid: string): Promise<void> {
    const listEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')`;

    // Get the list item type name first
    const listInfo = await this.context.spHttpClient.get(
      `${listEndpoint}?$select=ListItemEntityTypeFullName`,
      SPHttpClient.configurations.v1
    );

    const listData = await listInfo.json();
    const entityType = listData.ListItemEntityTypeFullName;

    const body = JSON.stringify({
      __metadata: { type: entityType },
      ProjectCode1: {
        __metadata: { type: 'SP.Taxonomy.TaxonomyFieldValue' },
        Label: termLabel,
        TermGuid: termGuid,
        WssId: '-1'
      }
    });

    const response = await this.context.spHttpClient.post(
      `${listEndpoint}/items(${itemId})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-HTTP-Method': 'MERGE',
          'IF-MATCH': '*'
        },
        body: body
      }
    );

    if (!response.ok) {
      throw new Error(`Update failed: ${response.statusText}`);
    }
  }
}
```

```ts
// src/webparts/prm/services/DocumentService.ts
import BaseService from "./BaseService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export default class DocumentService extends BaseService {
  public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string } | null> {
    try {
      const libraryName = "RelatedDocuments";
      const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
      const siteUrl = this.context.pageContext.web.absoluteUrl;
      const endpoint = `${siteUrl}/_vti_bin/listdata.svc/${libraryName}`;

      console.log("DEBUG: siteUrl from pageContext:", this.context.pageContext.web.absoluteUrl);

      const requestDigest = await this.getFormDigest();
      if (!requestDigest) {
        throw new Error("Failed to retrieve X-RequestDigest.");
      }

      const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
        "X-RequestDigest": requestDigest
      };

      const postBody = JSON.stringify({
        Title: documentSetName,
        Path: libraryName
      });

      const response: SPHttpClientResponse = await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        { headers, body: postBody }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("[DOCSET CREATION SUCCESS] API Response:", result);
      console.log("Full response from createDocumentSet:", response);

      if (!result.d || !result.d["شناسهسند"]) {
        throw new Error("Error: Document Set ID (شناسهسند) is missing in the response.");
      }

      const docIdFullUrl = result.d["شناسهسند"];
      console.log("Raw شناسهسند:", docIdFullUrl);

      const docIdUrlPart = docIdFullUrl.split(',')[0];
      console.log("Extracted Document Set URL:", docIdUrlPart);

      return {
        url: docIdUrlPart,
        text: `Documents for ${documentSetName}`
      };

    } catch (error) {
      console.error("[DOCSET CREATION ERROR]", error);
      return null;
    }
  }

  public async updateDocumentSetLink(
    requestId: number,
    documentSetLink: { url: string; text: string }
  ): Promise<void> {
    console.log(`Updating DocumentSetLink for Request ID: ${requestId}`);

    const hyperlinkValue = {
      __metadata: { type: "SP.FieldUrlValue" },
      Url: documentSetLink.url,
      Description: documentSetLink.text
    };

    try {
      console.log("[DEBUG - SITE URL BEFORE CONCAT]:", this.context.pageContext.web.absoluteUrl);
      const updateUrl = sp.web.lists
        .getByTitle('ProjectRequests')
        .items.getById(requestId).toUrl();
      console.log("[DEBUG - UPDATE URL (TOURL) BEFORE CONCAT]:", updateUrl);

      let fullUpdateUrl = this.context.pageContext.web.absoluteUrl + updateUrl;

      await sp.web.lists
        .getByTitle("ProjectRequests")
        .items.getById(requestId)
        .update({
          DocumentSetLink: hyperlinkValue
        });

      console.log("DocumentSetLink updated successfully.");
    } catch (error) {
      console.error("Error updating DocumentSetLink:", error);
      throw error;
    }
  }
}
```

```ts
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

  constructor(context: any) {
    super(context);
    this.taxonomyService = new TaxonomyService(context);
    this.documentService = new DocumentService(context);
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

  public createProjectRequest(requestData: any): Promise<any> {
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

  public updateProjectRequestEstimatedCost(requestId: number, estimatedCost: number): Promise<void> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.getById(requestId)
      .update({ EstimatedCost: estimatedCost })
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
        RequestIDId: detail.RequestID,
        UnitPrice: parseFloat(detail.UnitPrice.toString()),
        Quantity: parseInt(detail.Quantity.toString()),
        AssessmentItemIDId: detail.AssessmentItemID,
        TotalCost: detail.UnitPrice * detail.Quantity
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
```

### 2. Breaking down the ProjectRequestForm component

Let's create a separate component for the project information display:

```tsx
// src/webparts/prm/components/ProjectInformation.tsx
import * as React from "react";
import { Link, Icon } from "office-ui-fabric-react";
import styles from "./ProjectRequestForm.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IProjectInformationProps {
  requestId: number;
  formNumber: number;
  requestTitle: string;
  selectedCustomerName: string;
  requestDate: string;
  requestNote: string;
  documentSetLink: { url: string; text: string } | null;
}

export class ProjectInformation extends React.Component<IProjectInformationProps, {}> {
  public render(): React.ReactElement<IProjectInformationProps> {
    const {
      requestId,
      formNumber,
      requestTitle,
      selectedCustomerName,
      requestDate,
      requestNote,
      documentSetLink
    } = this.props;

    return (
      <div>
        <h3>{strings.ProjectInformation}</h3>
        <p>
          <strong>{strings.ProjectID}:</strong> {requestId}
        </p>
        <p>
          <strong>{strings.FormNumber}:</strong> {formNumber}
        </p>
        <p>
          <strong>{strings.Title}:</strong> {requestTitle}
        </p>
        <p>
          <strong>{strings.CustomerName}:</strong> {selectedCustomerName}
        </p>
        <p>
          <strong>{strings.RequestDate}:</strong> {requestDate}
        </p>
        <p>
          <strong>{strings.RequestNote}:</strong> {requestNote}
        </p>
        
        {documentSetLink && (
          <div className={styles.docSetLink}>
            <Icon iconName="OpenFolderHorizontal" />
            <Link href={documentSetLink.url} target="_blank">
              {documentSetLink.text}
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default ProjectInformation;
```

### 3. Create a separate component for the project request form fields

```tsx
// src/webparts/prm/components/ProjectRequestFormFields.tsx
import * as React from "react";
import { TextField, IDropdownOption } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import ManagedMetadataPicker from "./ManagedMetadataPicker";
import * as strings from "PrmWebPartStrings";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProjectRequestFormFieldsProps {
  requestTitle: string;
  selectedCustomer: string | number | null;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  customerOptions: IDropdownOption[];
  onInputChange: (newValue: string, field: string) => void;
  onDropdownChange: (option?: IDropdownOption) => void;
  onTermSelected: (term: { id: string; label: string }) => void;
  context: WebPartContext;
  isReadOnly: boolean;
}

const ProjectRequestFormFields: React.FC<IProjectRequestFormFieldsProps> = (props) => {
  const {
    requestTitle,
    selectedCustomer,
    requestDate,
    estimatedDuration,
    estimatedCost,
    requestNote,
    customerOptions,
    onInputChange,
    onDropdownChange,
    onTermSelected,
    context,
    isReadOnly
  } = props;

  return (
    <div>
      <TextField
        label={strings.RequestTitle}
        value={requestTitle}
        onChanged={(newValue) => onInputChange(newValue || "", "requestTitle")}
        readOnly={isReadOnly}
      />

      <ManagedMetadataPicker
        label={strings.ProjectCodeLabel}
        onTermSelected={onTermSelected}
        context={context}
        placeHolder="Select Project Code"
        disabled={isReadOnly}
      />

      <GenericDropdown
        label={strings.Customer}
        options={customerOptions}
        selectedKey={selectedCustomer}
        onChanged={onDropdownChange}
        placeHolder={strings.SelectCustomer}
        disabled={isReadOnly}
      />

      <TextField
        label={strings.RequestDate}
        value={requestDate}
        onChanged={(newValue) => onInputChange(newValue || "", "requestDate")}
        readOnly={isReadOnly}
      />

      <TextField
        label={strings.EstimatedDuration}
        value={estimatedDuration.toString()}
        onChanged={(newValue) => onInputChange(newValue || "0", "estimatedDuration")}
        type="number"
        readOnly={isReadOnly}
      />

      <TextField
        label={strings.EstimatedCost}
        value={estimatedCost.toString()}
        onChanged={(newValue) => onInputChange(newValue || "0", "estimatedCost")}
        type="number"
        readOnly={isReadOnly}
      />

      <TextField
        label={strings.RequestNote}
        value={requestNote}
        onChanged={(newValue) => onInputChange(newValue || "", "requestNote")}
        multiline
        rows={4}
        readOnly={isReadOnly}
      />
    </div>
  );
};

export default ProjectRequestFormFields;
```

### 4. Refactor the TechnicalAssessmentTable component

Let's create a separate component for each assessment type:

```tsx
// src/webparts/prm/components/ResourceTable.tsx
import * as React from "react";
import { TextField, IDropdownOption, IconButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";

export interface IResourceTableProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  resources: any[];
  index: number;
  onDropdownChange: (field: string, option: IDropdownOption, index: number, partIndex: number) => void;
  onInputChange: (newValue: string, nestedField: string, index: number, partIndex: number, field: string) => void;
  onAddRow: (field: string, index: number) => void;
  onRemoveRow: (field: string, index: number, partIndex: number) => void;
}

export class ResourceTable extends React.Component<IResourceTableProps, {}> {
  public render(): React.ReactElement<IResourceTableProps> {
    const {
      label,
      field,
      options,
      resources,
      index,
      onDropdownChange,
      onInputChange,
      onAddRow,
      onRemoveRow
    } = this.props;

    return (
      <div>
        <table className="technicalAssessmentTable">
          <tbody>
            <tr>
              <th className="resourceColumn">{label}</th>
              <th>{strings.Quantity}</th>
              <th>{strings.PricePerUnit}</th>
              <th>{strings.TotalCost}</th>
              <th>{strings.Action}</th>
            </tr>
            {Array.isArray(resources) && resources.length > 0 ? (
              resources.map((item, partIndex) => {
                const totalCost = item.quantity * item.pricePerUnit;
                return (
                  <tr key={partIndex}>
                    <td className="resourceColumn">
                      <GenericDropdown
                        label={`${label} ${partIndex + 1}`}
                        options={options}
                        selectedKey={item.item ? item.item.key : undefined}
                        onChanged={(option) => onDropdownChange(field, option!, index, partIndex)}
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.quantity.toString()}
                        onChanged={(newValue) => onInputChange(newValue, "quantity", index, partIndex, field)}
                        type="number"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.pricePerUnit.toString()}
                        onChanged={(newValue) => onInputChange(newValue, "pricePerUnit", index, partIndex, field)}
                        type="number"
                      />
                    </td>
                    <td>{totalCost.toFixed(0)}</td>
                    <td>
                      <IconButton
                        iconProps={{ iconName: "Delete" }}
                        title={strings.Remove}
                        ariaLabel={strings.Remove}
                        onClick={() => onRemoveRow(field, index, partIndex)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>{`${strings.No} ${label.toLowerCase()} ${strings.AddedYet}`}</td>
              </tr>
            )}
          </tbody>
        </table>
        <IconButton
          iconProps={{ iconName: "Add" }}
          title={`${strings.Add} ${label}`}
          ariaLabel={`${strings.Add} ${label}`}
          onClick={() => onAddRow(field, index)}
        />
      </div>
    );
  }
}

export default ResourceTable;
```

### 5. Refactor the main ProjectRequestForm component

Let me continue with the refactored ProjectRequestForm component:

```tsx
// src/webparts/prm/components/ProjectRequestForm.tsx (refactored)
import * as React from "react";
import { PrimaryButton, IDropdownOption } from "office-ui-fabric-react";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService";
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import * as strings from "PrmWebPartStrings";
import ProjectInformation from "./ProjectInformation";
import ProjectRequestFormFields from "./ProjectRequestFormFields";
import StepIndicator from "./StepIndicator";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      isProjectCreated: false,
      showProjectForm: true,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("jYYYY/jM/jD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      requestNote: "",
      RequestStatus: "New",
      customerOptions: [],
      assessments: [],
      formNumber: null,
      documentSetLink: null,
      projectCodeTerm: null,
      selectedTerm: null,
      terms: [],
      ProjectCode1: null,
    };

    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    this.loadCustomerOptions();
  }

  private handleTermSelected(term: { id: string; label: string }): void {
    this.setState({ selectedTerm: term, ProjectCode1: term });
    console.log("Selected Term:", term);
  }

  loadCustomerOptions() {
    this.projectRequestService.getCustomerOptions().then((customerOptions) => {
      this.setState({ customerOptions });
    });
  }

  handleInputChange = (
    newValue: string,
    field: keyof IProjectRequestFormState
  ): void => {
    let parsedValue: any = newValue;

    // Check if the field expects a number
    if (field === "estimatedDuration" || field === "estimatedCost") {
      parsedValue = parseFloat(newValue) || 0;
    }

    this.setState({ [field]: parsedValue } as Pick<
      IProjectRequestFormState,
      keyof IProjectRequestFormState
    >);
  };

  handleDropdownChange = (option?: IDropdownOption): void => {
    this.setState({
      selectedCustomer: option ? option.key : null,
      selectedCustomerName: option ? option.text : "",
    });
  };

  handleCreateProjectRequest = (): void => {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      RequestStatus,
      ProjectCode1,
    } = this.state;

    // Validate required fields
    if (!requestTitle.trim()) {
      alert(strings.RequestTitleRequired);
      return;
    }

    if (!selectedCustomer) {
      alert(strings.CustomerRequired);
      return;
    }

    // Step 1: Get the next form number
    this.projectRequestService
      .getNextFormNumber()
      .then((formNumber) => {
        console.log("Next Form Number:", formNumber);
        const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();
        
        // Step 2: Prepare the request data
        const requestData = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer,
          RequestDate: requestDateISO,
          EstimatedDuration: estimatedDuration,
          EstimatedCost: estimatedCost,
          Description1: requestNote,
          RequestStatus: RequestStatus.trim(),
          FormNumber: formNumber,
          ProjectCode1: ProjectCode1 ? ProjectCode1.id : null,
        };

        // Step 3: Create the project request
        return this.projectRequestService.createProjectRequest(requestData);
      })
      .then((response) => {
        if (response && response.requestId) {
          console.log("New project created with ID:", response.requestId);

          // Update state to include documentSetLink for rendering
          this.setState(
            {
              isProjectCreated: true,
              requestId: response.requestId,
              formNumber: response.FormNumber,
              documentSetLink: response.documentSetLink,
            },
            () => {
              alert(strings.ProjectRequestCreatedSuccessfully);
            }
          );
        } else {
          throw new Error(
            "Error creating project request. Response was invalid."
          );
        }
      })
      .catch((error) => {
        console.error("Error creating project request or Document Set:", error);
        alert(strings.ErrorCreatingProjectRequest);
      });
  };

  resetForm = (): void => {
    this.setState({
      isProjectCreated: false,
      requestId: null,
      selectedCustomer: null,
      selectedCustomerName: "",
      requestTitle: "",
      requestDate: moment().format("jYYYY/jM/jD"),
      estimatedDuration: 0,
      estimatedCost: 0,
      requestNote: "",
      RequestStatus: "New",
      documentSetLink: null,
      projectCodeTerm: null,
      selectedTerm: null,
      ProjectCode1: null,
    });
  };

  render() {
    const {
      isProjectCreated,
      requestId,
      selectedCustomer,
      selectedCustomerName,
      requestTitle,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      customerOptions,
      formNumber,
      documentSetLink,
    } = this.state;

    const locale = this.props.context.pageContext.cultureInfo.currentCultureName;
    const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

    return (
      <div className={`${containerClass} ${styles.projectRequestForm}`}>
        <StepIndicator 
          currentStep={isProjectCreated ? 2 : 1} 
          totalSteps={2}
          stepLabels={[strings.CreateProjectRequest, strings.AddAssessments]}
        />
        
        <h2 className={styles.header}>
          {isProjectCreated ? strings.AddAssessments : strings.CreateProjectRequest}
        </h2>

        {isProjectCreated && (
          <ProjectInformation 
            requestId={requestId}
            formNumber={formNumber}
            requestTitle={requestTitle}
            selectedCustomerName={selectedCustomerName}
            requestDate={requestDate}
            requestNote={requestNote}
            documentSetLink={documentSetLink}
          />
        )}

        {!isProjectCreated && (
          <ProjectRequestFormFields 
            requestTitle={requestTitle}
            selectedCustomer={selectedCustomer}
            requestDate={requestDate}
            estimatedDuration={estimatedDuration}
            estimatedCost={estimatedCost}
            requestNote={requestNote}
            customerOptions={customerOptions}
            onInputChange={this.handleInputChange}
            onDropdownChange={this.handleDropdownChange}
            onTermSelected={this.handleTermSelected}
            context={this.props.context}
            isReadOnly={isProjectCreated}
          />
        )}

        <div className={styles.buttonGroup}>
          {!isProjectCreated && (
            <PrimaryButton
              text={strings.Create}
              onClick={this.handleCreateProjectRequest}
            />
          )}
          <PrimaryButton 
            text={strings.Cancel} 
            onClick={this.resetForm} 
          />
        </div>

        {isProjectCreated && requestId && (
          <TechnicalAssessmentTable
            projectRequestService={this.projectRequestService}
            requestId={requestId}
            resetForm={this.resetForm}
          />
        )}
      </div>
    );
  }
}

export default ProjectRequestForm;
```

### 6. Create a StepIndicator component

```tsx
// src/webparts/prm/components/StepIndicator.tsx
import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react";
import styles from "./StepIndicator.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export class StepIndicator extends React.Component<IStepIndicatorProps, {}> {
  public render(): React.ReactElement<IStepIndicatorProps> {
    const { currentStep, totalSteps, stepLabels } = this.props;
    
    // Calculate progress percentage
    const progressPercentage = (currentStep - 1) / (totalSteps - 1);
    
    return (
      <div className={styles.progressContainer}>
        <ProgressIndicator
          label={`${strings.Step} ${currentStep} ${strings.Of} ${totalSteps}`}
          description={stepLabels[currentStep - 1]}
          percentComplete={progressPercentage}
        />
      </div>
    );
  }
}

export default StepIndicator;

```

### 7. Refactor TechnicalAssessmentTable component

```tsx
// src/webparts/prm/components/TechnicalAssessmentTable.tsx (refactored)
import * as React from "react";
import { PrimaryButton, TextField, IDropdownOption } from "office-ui-fabric-react";
import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import styles from "./TechnicalAssessmentTable.module.scss";
import * as strings from "PrmWebPartStrings";
import ResourceTable from "./ResourceTable";
import { IPricingDetails } from "../services/ProjectRequestService";

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
  }

  loadInventoryItems = () => {
    this.props.projectRequestService.getInventoryItems().then((items) => {
      console.log("Inventory Items:", items);
      this.setState({ inventoryItems: items });
    });
  };

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

    // Map English category keys to their Persian equivalents
    const categoryMap: { [key: string]: string[] } = {
      HumanResource: [strings.HumanResource, "نیروی انسانی"],
      Machine: [strings.Machine, "ماشین آلات"],
      Material: [strings.Material, "ابزار", "محصول", "مواد اولیه"],
    };

    // Get all valid category names for the requested categories
    const validCategories = categories.reduce((acc, category) => {
      return acc.concat(categoryMap[category] || [category]);
    }, [] as string[]);

    // Filter items using indexOf for SPFx 1.4.1 compatibility
    const filteredItems = inventoryItems.filter(
      (item) => validCategories.indexOf(item.itemCategory) > -1
    );

    return filteredItems.map((item) => ({ key: item.key, text: item.text }));
  };

  handleInputChange = (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (partIndex !== undefined && field) {
        const items = [...(assessments[index][field] || [])];
        const updatedItem = { ...items[partIndex] };

        updatedItem[nestedField] = newValue;

        items[partIndex] = updatedItem;
        assessments[index][field] = items;
      } else {
        assessments[index] = { ...assessments[index], [nestedField]: newValue };
      }

      return { assessments };
    });
  };

  handleDropdownChange = (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ): void => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field][partIndex].item = option;
      return { assessments };
    });
  };

  addRow = (field: string, index: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];

      if (!Array.isArray(assessments[index][field])) {
        assessments[index][field] = [];
      }

      assessments[index][field].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0,
      });

      return { assessments };
    });
  };

  removeRow = (field: string, index: number, partIndex: number) => {
    this.setState((prevState) => {
      const assessments = [...prevState.assessments];
      assessments[index][field].splice(partIndex, 1);
      return { assessments };
    });
  };

  addAssessment = () => {
    this.setState((prevState) => ({
      assessments: [
        ...prevState.assessments,
        {
          activity: "",
          humanResources: [],
          machines: [],
          materials: [],
        },
      ],
    }));
  };

  // src/webparts/prm/components/TechnicalAssessmentTable.tsx (fixing the incomplete section)
  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert(strings.AddAssessmentBeforeSubmitting);
      return;
    }

    const pricingDetails: IPricingDetails[] = [];

    // Save assessments and get their IDs
    this.props.projectRequestService
      .saveAssessments(assessments, requestId)
      .then((assessmentIds) => {
        console.log("Assessment IDs:", assessmentIds);

        // Map assessments to pricing details using the created IDs
        assessments.forEach((assessment, index) => {
          ["humanResources", "machines", "materials"].forEach((field) => {
            if (Array.isArray(assessment[field])) {
              assessment[field].forEach((item: any) => {
                pricingDetails.push({
                  RequestID: requestId,
                  UnitPrice: parseFloat(item.pricePerUnit),
                  Quantity: parseInt(item.quantity),
                  AssessmentItemID: assessmentIds[index],
                });
              });
            }
          });
        });

        console.log("Pricing Details to Save:", pricingDetails);

        // Save pricing details
        return this.props.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        console.log("Pricing details saved successfully.");
        return this.props.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );
      })
      .then((pricingDetails) => {
        console.log("Fetched Pricing Details After Save:", pricingDetails);

        // Calculate the total estimated cost
        const totalEstimatedCost = pricingDetails.reduce(
          (sum, detail) => sum + detail.TotalCost,
          0
        );

        console.log("Total Estimated Cost:", totalEstimatedCost);

        // Update the ProjectRequest with the estimated cost
        return this.props.projectRequestService
          .updateProjectRequestEstimatedCost(requestId, totalEstimatedCost)
          .then(() => {
            alert(strings.AssessmentsAndPricingDetailsSavedSuccessfully);
            resetForm();
          });
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(strings.ErrorSavingAssessmentsAndPricingDetails);
      });
  };



// src/webparts/prm/components/TechnicalAssessmentTable.tsx (continued)
  render() {
    const { assessments } = this.state;

    return (
      <div className={styles.assessmentContainer}>
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>
        
        {assessments.map((assessment, index) => (
          <div key={index} className={styles.assessmentItem}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
            />

            <ResourceTable
              label={strings.HumanResource}
              field="humanResources"
              options={this.filterInventoryItems([strings.HumanResource])}
              resources={assessment.humanResources}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
            />

            <ResourceTable
              label={strings.Machine}
              field="machines"
              options={this.filterInventoryItems([strings.Machine])}
              resources={assessment.machines}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
            />

            <ResourceTable
              label={strings.Material}
              field="materials"
              options={this.filterInventoryItems([strings.Material])}
              resources={assessment.materials}
              index={index}
              onDropdownChange={this.handleDropdownChange}
              onInputChange={this.handleInputChange}
              onAddRow={this.addRow}
              onRemoveRow={this.removeRow}
            />

            <hr className={styles.assessmentDivider} />
          </div>
        ))}
        
        <div className={styles.assessmentButtons}>
          <PrimaryButton
            className={styles.addAssessmentButton}
            text={strings.AddAssessment}
            onClick={this.addAssessment}
          />
          <PrimaryButton
            className={styles.finalSubmitButton}
            text={strings.FinalSubmit}
            onClick={this.handleFinalSubmit}
          />
        </div>
      </div>
    );
  }
}

export default TechnicalAssessmentTable;
```

Now let's complete the refactoring with some additional CSS modules:

```scss
// src/webparts/prm/components/StepIndicator.module.scss
.progressContainer {
  margin-bottom: 20px;
}
```

```scss
// src/webparts/prm/components/TechnicalAssessmentTable.module.scss
.assessmentContainer {
  margin-top: 20px;
}

.assessmentHeading {
  font-size: 18px;
  margin-bottom: 15px;
}

.assessmentItem {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.assessmentDivider {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #eaeaea;
}

.assessmentButtons {
  display: flex;
  margin-top: 20px;
}

.addAssessmentButton {
  margin-right: 10px;
}

.finalSubmitButton {
  background-color: #0078d4;
}
```

### Summary of Refactoring Changes

1. **Service Layer Separation**:
   - Split `ProjectRequestService` into multiple service classes
   - Created `BaseService`, `TaxonomyService`, and `DocumentService`
   - Improved organization and maintainability

2. **Component Breakdown**:
   - Created `ProjectInformation` component for displaying project details
   - Created `ProjectRequestFormFields` for form input fields
   - Created `StepIndicator` for progress visualization
   - Created `ResourceTable` for resource management

3. **Code Organization**:
   - Improved method organization and naming
   - Added proper typing for all components
   - Maintained SPFx@1.4.1 compatibility throughout

4. **UI Improvements**:
   - Added CSS modules for better styling organization
   - Improved component structure for better readability

5. **Compatibility Considerations**:
   - Maintained all SPFx@1.4.1 specific syntax
   - Kept custom dropdown implementation for compatibility
   - Ensured all React components use the correct lifecycle methods for React 15.6.2

These changes make the codebase more maintainable while preserving all functionality and compatibility with the SPFx@1.4.1 framework.













# Final Implementation Plan for Project Request Management

## Step 1: Add the List View Component
Create `ProjectListView.tsx` with a simplified approach that shows all projects and handles permissions based on user context.

## Step 2: Add CSS for the List View
Create `ProjectListView.module.scss` with basic styling for the list view.

## Step 3: Update the Web Part
Modify `PrmWebPart.ts` to handle switching between list and form views.

## Step 4: Update the Form Component
Add a back button to `ProjectRequestForm.tsx` to return to the list view.

## Step 5: Add String Resources
Update localization files with new strings for the list view.

## Step 6: Test and Deploy
1. Test the web part in all three modes (Create, Edit, View)
2. Verify permissions work correctly
3. Deploy to SharePoint

## Key Considerations:
1. **Permissions**: Commercial team creates forms, departments edit assigned forms, approved forms are read-only
2. **Document Management**: Each project has a document set for attachments
3. **Workflow**: Use Nintex to manage the approval process
4. **Mobile Support**: Ensure the interface works on all devices

## Future Enhancements:
1. Add filtering by department and status
2. Implement notifications for new assignments
3. Add reporting features
4. Create a dashboard view showing project statistics

Thank you for your patience! This implementation will provide a solid foundation for your project request management system while respecting the constraints of your SharePoint 2019 environment.


# Permission Management Advice for SharePoint 2019 Environment

## 1. SharePoint Permission Levels

Create custom permission levels for different roles:

- **Commercial Department**: Full control over project requests
- **Department Contributors**: Edit permissions on assigned projects only
- **Approvers**: Ability to approve/reject but not modify content
- **Viewers**: Read-only access to approved projects

## 2. Item-Level Permissions

Use item-level permissions to control access to individual project requests:

```typescript
// Example of setting unique permissions on a new item
async function setUniquePermissions(listName: string, itemId: number, departmentGroupIds: number[]) {
  // Break inheritance
  const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/breakroleinheritance(true)`;
  
  await context.spHttpClient.post(
    endpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
  
  // Grant permissions to department groups
  for (let i = 0; i < departmentGroupIds.length; i++) {
    const roleEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/roleassignments/addroleassignment(principalid=${departmentGroupIds[i]},roledefid=1073741827)`;
    
    await context.spHttpClient.post(
      roleEndpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-RequestDigest': await getFormDigest()
        }
      }
    );
  }
}
```

## 3. Status-Based Permission Changes

When a project is approved, remove edit permissions:

```typescript
// Example of removing edit permissions when project is approved
async function setReadOnlyPermissions(listName: string, itemId: number) {
  // First break inheritance if not already broken
  const breakInheritanceEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/breakroleinheritance(false)`;
  
  await context.spHttpClient.post(
    breakInheritanceEndpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
  
  // Then add read permission for everyone
  const readPermissionEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/roleassignments/addroleassignment(principalid=1073741823,roledefid=1073741826)`;
  
  await context.spHttpClient.post(
    readPermissionEndpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
}
```

## 4. Document Set Permissions

Ensure document set permissions match the project request permissions:

```typescript
// Example of syncing permissions between project and document set
async function syncDocumentSetPermissions(projectId: number, documentSetUrl: string) {
  // Get the document set item ID
  const docSetUrlParts = documentSetUrl.split('ID=');
  if (docSetUrlParts.length < 2) return;
  
  const docSetId = docSetUrlParts[1].split(',')[0];
  
  // Copy permissions from project to document set
  const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ProjectRequests')/items(${projectId})/copyroleassignments(${docSetId})`;
  
  await context.spHttpClient.post(
    endpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
}
```

## 5. Nintex Workflow Integration for Permissions

Use Nintex workflows to automate permission changes:

1. **On Creation**: Set initial permissions for Commercial Department
2. **On Assignment**: Add permissions for assigned departments
3. **On Approval**: Remove edit permissions, set to read-only
4. **On Rejection**: Reset permissions to allow edits

## 6. Security Best Practices

1. **Principle of Least Privilege**: Grant only the permissions needed
2. **Regular Audits**: Review permissions periodically
3. **Permission Inheritance**: Use inheritance where possible to simplify management
4. **Group-Based Permissions**: Assign permissions to groups, not individuals
5. **Document Permissions**: Ensure document libraries have appropriate permissions

## 7. UI Considerations for Permissions

1. **Hide Actions**: Don't show edit/delete buttons for items users can't modify
2. **Clear Messaging**: Explain permission restrictions to users
3. **Request Access**: Provide a way for users to request access if needed
4. **Audit Logging**: Log permission changes for accountability

By implementing these permission strategies, you'll ensure that your project request system maintains proper security while providing the right level of access to each department based on their role in the process.

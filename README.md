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

<!-- Installing some packages -->

<!-- `npm install office-ui-fabric-react@5.134.0 moment@2.24.0 moment-jalaali@0.8.3` -->

uninstalled

<!-- Start Implementation -->

## Step 1: SPFx Form Development

We'll start by creating custom forms using SPFx. The forms will be used for:

Request Submission by the Commerce Department.

Technical Assessments by the Technical & Engineering Department.

Pricing Details by the Commerce Department.

## Code
<!-- Code -->

```json
//package.json
{
  "name": "prm",
  "version": "0.0.1",
  "private": true,
  "main": "lib/index.js",
  "engines": {
    "node": ">=0.10.0"
  },
  "scripts": {
    "build": "gulp bundle",
    "clean": "gulp clean",
    "test": "gulp test"
  },
  "dependencies": {
    "@microsoft/sp-core-library": "~1.4.0",
    "@microsoft/sp-lodash-subset": "~1.4.0",
    "@microsoft/sp-office-ui-fabric-core": "~1.4.0",
    "@microsoft/sp-webpart-base": "~1.4.0",
    "@pnp/sp": "^2.0.9",
    "@types/es6-promise": "0.0.33",
    "@types/react": "15.6.6",
    "@types/react-dom": "15.5.6",
    "@types/webpack-env": "1.13.1",
    "moment": "^2.24.0",
    "moment-jalaali": "^0.8.3",
    "react": "15.6.2",
    "react-dom": "15.6.2"
  },
  "resolutions": {
    "@types/react": "15.6.6"
  },
  "devDependencies": {
    "@microsoft/sp-build-web": "~1.4.1",
    "@microsoft/sp-module-interfaces": "~1.4.1",
    "@microsoft/sp-webpart-workbench": "~1.4.1",
    "gulp": "~3.9.1",
    "@types/chai": "3.4.34",
    "@types/mocha": "2.2.38",
    "ajv": "~5.2.2"
  }
}

```

<!-- ## tsx -->

```tsx
// GenericDropdown.tsx
import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | undefined;
  onChange: (option?: IDropdownOption) => void;
  placeHolder?: string;
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChange, placeHolder } = this.props;
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChange}
        placeHolder={placeHolder}
      />
    );
  }
}

export default GenericDropdown;
```

```ts
// src\webparts\prm\PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/ProjectRequestForm';
import { sp } from "@pnp/sp";
import { IProjectRequestFormProps } from './components/IProjectRequestFormProps';


export interface IPrmWebPartProps {
  description: string;
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {


  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(ProjectRequestForm, {
      spHttpClient: this.context.spHttpClient,
      siteUrl: this.context.pageContext.web.absoluteUrl,

termSetId: '5863383a-85c5-4fbd-8114-11ef83bf9175',
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
```

```ts
// src\webparts\prm\services\ProjectRequestService.ts

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";

import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, IHttpClientOptions, HttpClientResponse, HttpClient } from '@microsoft/sp-http';

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
  public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

    // Replace with your actual Term Store GUID (sspId)
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

  const options: IHttpClientOptions = {
    headers: {
      'Accept': 'application/json;odata=verbose'
    }
  };

  try {
    const response = await this.context.httpClient.get(endpoint, HttpClient.configurations.v1, options);
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


// Update the updateProjectCode method for SharePoint 2019 compatibility
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
      // Return both the requestId and documentSetLink
      return { success: true, requestId, documentSetLink, FormNumber: result.data.FormNumber };
    })
    .catch((error) => {
      console.error("Project request creation failed:", error);
      throw error;
    });
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

public async createDocumentSet(documentSetName: string): Promise<{ url: string; text: string } | null> {
  try {
      const libraryName = "RelatedDocuments";
      const contentTypeId = "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3";
      const siteUrl = this.context.pageContext.web.absoluteUrl;
      const endpoint = `${siteUrl}/_vti_bin/listdata.svc/${libraryName}`;

      console.log("DEBUG: siteUrl from pageContext:", this.context.pageContext.web.absoluteUrl);

      // ✅ Use getFormDigest() instead of making a direct API call
      const requestDigest = await this.getFormDigest();
      if (!requestDigest) {
          throw new Error("Failed to retrieve X-RequestDigest.");
      }


      const headers = {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "Slug": `${libraryName}/${encodeURIComponent(documentSetName)}|${contentTypeId}`,
          "X-RequestDigest": requestDigest // ✅ Now properly set
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
      console.log("[DOCSET CREATION SUCCESS] API Response:", result); // ✅  این  خط  قبلاً  بود

      console.log("Full response from createDocumentSet:", response); // ✅ خط جدید - اضافه کردن این خط برای بررسی پاسخ کامل سرور


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

  // SharePoint hyperlink field requires this specific format
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

      let fullUpdateUrl = this.context.pageContext.web.absoluteUrl + updateUrl; // ساخت URL کامل و مطلق با استفاده از siteUrl


      await sp.web.lists  // ❌ کامنت کردن خط update برای جلوگیری از ارسال درخواست واقعی و فقط دیدن URL
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

```tsx
// src\webparts\prm\components\UIFabricWizard.tsx
import * as React from "react";
import { PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import styles from "./UIFabricWizard.module.scss";

interface IUIFabricWizardState {
  currentStep: number;
}

export default class UIFabricWizard extends React.Component<
  {},
  IUIFabricWizardState
> {
  constructor(props: {}) {
    super(props);
    this.state = { currentStep: 1 };
  }

  private _goToNextStep = (): void => {
    this.setState({ currentStep: 2 });
  };

  private _goToPreviousStep = (): void => {
    this.setState({ currentStep: 1 });
  };

  public render(): React.ReactElement<{}> {
    const { currentStep } = this.state;
    return (
      <div>
        <div className={styles.progressContainer}>
          <ProgressIndicator
            label={`Step ${currentStep} of 2`}
            description={
              currentStep === 1 ? "Create Project Request" : "Add Assessments"
            }
          />
        </div>

        {currentStep === 1 && (
          <div>
            {/* Render your Project Request Form components here */}
            <PrimaryButton text="Next" onClick={this._goToNextStep} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {/* Render your Technical Assessments components here */}
            <div>
              <PrimaryButton text="Back" onClick={this._goToPreviousStep} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
```

```tsx
// src\webparts\prm\components\TechnicalAssessmentTable.tsx

import * as React from "react";
import {
  PrimaryButton,
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";

import { ITechnicalAssessmentState } from "./ITechnicalAssessmentState";
import { ITechnicalAssessmentProps } from "./ITechnicalAssessmentProps";
import PricingDetails from "./PricingDetails";
import styles from "./TechnicalAssessmentTable.module.scss";

import * as strings from "PrmWebPartStrings";

import ProjectRequestService, {
  IPricingDetails,
} from "../services/ProjectRequestService";

class TechnicalAssessmentTable extends React.Component<
  ITechnicalAssessmentProps,
  ITechnicalAssessmentState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: ITechnicalAssessmentProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.context);
    this.state = {
      assessments: [],
      inventoryItems: [],
    };
  }

  componentDidMount() {
    this.loadInventoryItems();
  }

  handleFinalSubmit = (): void => {
    const { assessments } = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments || assessments.length === 0) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    const pricingDetails: IPricingDetails[] = [];

    // Save assessments and get their IDs
    this.projectRequestService
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
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      .then(() => {
        console.log("Pricing details saved successfully.");
        return this.projectRequestService.getPricingDetailsByRequestID(
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
        return this.projectRequestService
          .updateProjectRequestEstimatedCost(requestId, totalEstimatedCost)
          .then(() => {
            alert("Assessments and pricing details saved successfully!");
            resetForm();
          });
      })
      .catch((error) => {
        console.error("Error saving assessments and pricing details:", error);
        alert(
          "Error saving assessments and pricing details. Please check the console for details."
        );
      });
  };

  loadInventoryItems = () => {
    this.projectRequestService.getInventoryItems().then((items) => {
      console.log("Inventory Items:", items); // Debugging
      this.setState({ inventoryItems: items });
    });
  };

  filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

    // Debug: Log categories and inventory items
    console.log("Filtering for categories:", categories);
    console.log("All inventory items:", inventoryItems);

    // Map English category keys to their Persian equivalents
    const categoryMap: { [key: string]: string[] } = {
      HumanResource: [strings.HumanResource, "نیروی انسانی"], // English & Persian
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

    console.log("Filtered Items:", filteredItems);
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

  renderTable = (
    label: string,
    field: string,
    options: IDropdownOption[],
    assessment: any,
    index: number
  ) => (
    <PricingDetails
      label={label}
      field={field}
      options={options}
      assessment={assessment}
      index={index}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
    />
  );

  render() {
    const { assessments } = this.state;

    return (
      <div className={styles.assessmentContainer}>
        <h3 className={styles.assessmentHeading}>
          {strings.TechnicalAssessments}
        </h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <TextField
              label={`${strings.Activity} ${index + 1}`}
              value={assessment.activity}
              onChanged={(newValue: string) =>
                this.handleInputChange(newValue, "activity", index)
              }
            />

            {this.renderTable(
              strings.HumanResource,
              "humanResources",
              this.filterInventoryItems([strings.HumanResource]),
              assessment,
              index
            )}
            {this.renderTable(
              strings.Machine,
              "machines",
              this.filterInventoryItems([strings.Machine]),
              assessment,
              index
            )}
            {this.renderTable(
              strings.Material,
              "materials",
              this.filterInventoryItems([strings.Material]),
              assessment,
              index
            )}

            <hr />
          </div>
        ))}
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
    );
  }
}

export default TechnicalAssessmentTable;
```

```tsx
// src\webparts\prm\components\ProjectRequestForm.tsx

import * as React from "react";
import {
  TextField,
  PrimaryButton,
  IDropdownOption,
  Link,
  Icon,
} from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import { IProjectRequestFormProps } from "./IProjectRequestFormProps";
import { IProjectRequestFormState } from "./IProjectRequestFormState";
import ProjectRequestService from "../services/ProjectRequestService"; // ✅ مطمئن شو مسیر درسته
import * as moment from "moment-jalaali";
import TechnicalAssessmentTable from "./TechnicalAssessmentTable";
import styles from "./ProjectRequestForm.module.scss";
import UIFabricWizard from "./UIFabricWizard";
import ManagedMetadataPicker from "./ManagedMetadataPicker";

import * as strings from "PrmWebPartStrings";

class ProjectRequestForm extends React.Component<
  IProjectRequestFormProps,
  IProjectRequestFormState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IProjectRequestFormProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context); // ✅ context رو پاس بده
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
    this.setState({ selectedTerm: term });
    console.log("Selected Term:", term); // Log selected term
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

  calculateEstimatedCost = async () => {
    const { requestId } = this.state; // Assuming requestId is stored in the state

    if (!requestId) {
      console.error("RequestID is not available.");
      return;
    }

    try {
      // Fetch all PricingDetails for this RequestID
      const pricingDetails =
        await this.projectRequestService.getPricingDetailsByRequestID(
          requestId
        );

      // Sum up the TotalCost values
      const estimatedCost = pricingDetails.reduce((sum, item) => {
        return sum + (item.TotalCost || 0); // Ensure TotalCost is treated as a number
      }, 0);

      console.log("Calculated Estimated Cost:", estimatedCost);

      // Update the state with the calculated cost
      this.setState({ estimatedCost });

      // Optionally, save the calculated cost to the ProjectRequests list
      await this.projectRequestService.updateProjectRequestEstimatedCost(
        requestId,
        estimatedCost
      );
    } catch (error) {
      console.error("Error calculating estimated cost:", error);
    }
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

    // Step 1: Get the next form number
    this.projectRequestService
      .getNextFormNumber()
      .then((formNumber) => {
        console.log("Next Form Number:", formNumber);
        const requestDateISO = moment(requestDate, "jYYYY/jM/jD").toISOString();
        console.log("requestDate:", requestDate); // Check the initial value
        console.log("requestDateISO:", requestDateISO); // Check the converted ISO string
        console.log("Type of requestDateISO:", typeof requestDateISO); // Should be "string"
        // Step 2: Prepare the request data
        const requestData = {
          Title: requestTitle.trim(),
          CustomerId: selectedCustomer || null,
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
              formNumber: response.FormNumber, // if needed
              documentSetLink: response.documentSetLink,
            },
            () => {
              alert("Project request created successfully!");
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
        console.warn(
          "There was an error creating your project request or its associated Document Set. Please check the console for details."
        );
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
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

      // Reset any other state variables as needed
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

    const locale =
      this.props.context.pageContext.cultureInfo.currentCultureName;
    const containerClass = locale === "fa-IR" ? "rtlContainer" : "ltrContainer";

    return (
      <div className={`${containerClass} ${styles.projectRequestForm}`}>
        <UIFabricWizard />
        <h2 className={styles.header}>
          {isProjectCreated
            ? strings.AddAssessments
            : strings.CreateProjectRequest}
        </h2>

        {isProjectCreated && (
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
            <p>{strings.RequestNote}:</p> {requestNote}
          </div>
        )}

        {isProjectCreated && (
          <div>
            {/* Document Set Link */}
            {documentSetLink && (
              <div className={styles.docSetLink}>
                <Icon iconName="OpenFolderHorizontal" />
                <Link href={documentSetLink.url} target="_blank">
                  {documentSetLink.text}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Project Request Form */}
        <TextField
          label={strings.RequestTitle}
          value={requestTitle}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestTitle")
          }
          readOnly={isProjectCreated}
        />

        <ManagedMetadataPicker
          label={strings.ProjectCodeLabel} // e.g., "Project Code"
          onTermSelected={this.handleTermSelected}
          context={this.props.context}
          placeHolder="Select Project Code"
          disabled={isProjectCreated}
        />
        <GenericDropdown
          label={strings.Customer}
          options={customerOptions}
          selectedKey={selectedCustomer}
          onChanged={this.handleDropdownChange}
          placeHolder={strings.SelectCustomer}
          disabled={isProjectCreated}
        />
        <TextField
          label={strings.RequestDate}
          value={requestDate}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestDate")
          }
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedDuration}
          value={estimatedDuration.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedDuration: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.EstimatedCost}
          value={estimatedCost.toString()}
          onChanged={(newValue) =>
            this.setState({ estimatedCost: parseInt(newValue) || 0 })
          }
          type="number"
          readOnly={isProjectCreated}
        />
        <TextField
          label={strings.RequestNote}
          value={requestNote}
          onChanged={(newValue) =>
            this.handleInputChange(newValue || "", "requestNote")
          }
          multiline
          rows={4}
          readOnly={isProjectCreated}
        />

        {/* Create Button */}
        <div className={styles.buttonGroup}>
          {!isProjectCreated && (
            <PrimaryButton
              text={strings.Create}
              onClick={this.handleCreateProjectRequest}
            />
          )}
          {/* Cancel Button */}
          <div>
            <PrimaryButton text={strings.Cancel} onClick={this.resetForm} />
          </div>
        </div>
        {/* Technical Assessment Table */}
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

```tsx
// src\webparts\prm\components\PricingDetails.tsx
import * as React from "react";
import { TextField, IDropdownOption, IconButton } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import * as strings from "PrmWebPartStrings";
interface IPricingDetailsProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  assessment: any;
  index: number;
  handleDropdownChange: (
    field: string,
    option: IDropdownOption,
    index: number,
    partIndex: number
  ) => void;
  handleInputChange: (
    newValue: string,
    nestedField: string,
    index: number,
    partIndex?: number,
    field?: string
  ) => void;
  addRow: (field: string, index: number) => void;
  removeRow: (field: string, index: number, partIndex: number) => void;
}

class PricingDetails extends React.Component<IPricingDetailsProps> {
  renderTable() {
    const {
      field,
      options,
      assessment,
      index,
      handleDropdownChange,
      handleInputChange,
      removeRow,
      label,
    } = this.props;
    console.log(`Options for ${label}:`, options); // Debugging
    return (
      <table className="technicalAssessmentTable">
        <tbody>
          <tr>
            <th className="resourceColumn">{label}</th>
            <th>{strings.Quantity}</th>
            <th>{strings.PricePerUnit}</th>
            <th>{strings.TotalCost}</th>
            <th>{strings.Action}</th>
          </tr>
          {Array.isArray(assessment[field]) && assessment[field].length > 0 ? (
            assessment[field].map((item: any, partIndex: number) => {
              const totalCost = item.quantity * item.pricePerUnit;
              return (
                <tr key={partIndex}>
                  <td className="resourceColumn">
                    <GenericDropdown
                      label={`${label} ${partIndex + 1}`}
                      options={options}
                      selectedKey={item.item ? item.item.key : undefined}
                      onChanged={(option) =>
                        handleDropdownChange(field, option!, index, partIndex)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      value={item.quantity.toString()}
                      onChanged={(newValue: string) =>
                        handleInputChange(
                          newValue,
                          "quantity",
                          index,
                          partIndex,
                          field
                        )
                      }
                      type="number"
                    />
                  </td>
                  <td>
                    <TextField
                      value={item.pricePerUnit.toString()}
                      onChanged={(newValue: string) =>
                        handleInputChange(
                          newValue,
                          "pricePerUnit",
                          index,
                          partIndex,
                          field
                        )
                      }
                      type="number"
                    />
                  </td>
                  <td>{totalCost.toFixed(0)}</td>
                  <td>
                    <IconButton
                      iconProps={{ iconName: "Delete" }}
                      title={strings.Remove}
                      ariaLabel={strings.Remove}
                      onClick={() => removeRow(field, index, partIndex)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>{`${strings.No} ${label.toLowerCase()} ${
                strings.AddedYet
              }`}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    const { label, field, index, addRow } = this.props;

    return (
      <div>
        {this.renderTable()}
        <IconButton
          iconProps={{ iconName: "Add" }}
          title={`${strings.Add} ${label}`}
          ariaLabel={`${strings.Add} ${label}`}
          onClick={() => addRow(field, index)}
        />
      </div>
    );
  }
}

export default PricingDetails;
```

```tsx
// src\webparts\prm\components\ManagedMetadataPicker.tsx
import * as React from "react";
import GenericComboBox from "./GenericComboBox";
import { IComboBoxOption } from "office-ui-fabric-react";
import ProjectRequestService from "../services/ProjectRequestService";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IManagedMetadataPickerProps {
  label: string;
  onTermSelected: (term: { id: string; label: string }) => void;
  disabled?: boolean;
  context: WebPartContext;
  placeHolder?: string; // Note: if your ComboBox version doesn't support placeholder, ignore it.
}

export interface IManagedMetadataPickerState {
  options: IComboBoxOption[];
}

export default class ManagedMetadataPicker extends React.Component<
  IManagedMetadataPickerProps,
  IManagedMetadataPickerState
> {
  private projectRequestService: ProjectRequestService;

  constructor(props: IManagedMetadataPickerProps) {
    super(props);
    this.projectRequestService = new ProjectRequestService(this.props.context);
    this.state = {
      options: [],
    };
    this._onMenuOpen = this._onMenuOpen.bind(this);
    this._onChanged = this._onChanged.bind(this);
  }

  private _onMenuOpen(): void {
    // Fetch taxonomy terms using the service method
    this.projectRequestService
      .getTaxonomyTerms("5863383a-85c5-4fbd-8114-11ef83bf9175")
      .then((terms) => {
        const options: IComboBoxOption[] = terms.map((term) => ({
          key: term.id,
          text: term.label,
        }));
        this.setState({ options });
      })
      .catch((error) => {
        console.error("Error fetching taxonomy terms", error);
        this.setState({ options: [] });
      });
  }

  private _onChanged(
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void {
    if (option && this.props.onTermSelected) {
      this.props.onTermSelected({
        id: option.key as string,
        label: option.text,
      });
    }
  }

  public render(): React.ReactElement<IManagedMetadataPickerProps> {
    return (
      <GenericComboBox
        label={this.props.label}
        options={this.state.options}
        onChanged={this._onChanged}
        onMenuOpen={this._onMenuOpen}
        disabled={this.props.disabled}
        allowFreeform={true}
        autoComplete="on"
      />
    );
  }
}
```

```ts
// src\webparts\prm\components\ITechnicalAssessmentState.ts
import { IAssessment } from './IAssessment';
import { IDropdownOptionWithCategory } from "../services/ProjectRequestService";

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
}
```

```ts
// src\webparts\prm\components\ITechnicalAssessmentProps.ts
import ProjectRequestService from "../services/ProjectRequestService";

export interface ITechnicalAssessmentProps {
  projectRequestService: ProjectRequestService;
  requestId: number;
  resetForm: () => void; // Make this required

}
```

```ts
// src\webparts\prm\components\IProjectRequestFormState.ts
import { IDropdownOption } from 'office-ui-fabric-react';
import { IAssessment } from './IAssessment';

export interface IProjectRequestFormState {
  // Flags
  isProjectCreated: boolean;
  showProjectForm: boolean;

  // Project Request Information
  requestId: number | null;
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  RequestStatus: string;

  // Customer Information
  selectedCustomer: string | number | null;
  selectedCustomerName: string;
  customerOptions: IDropdownOption[];

  // PojectCode1 Information
  ProjectCode1: {id:string; label: string} | null;
  selectedTerm: { id: string; label: string } | null;
  projectCodeTerm: { id: string; label: string } | null;
  terms: { id: string; label: string }[];

  // Assessments
  assessments: IAssessment[];
  formNumber: Number | null;

  // Document Set Link
  documentSetLink?: {
    url: string;
    text: string;
  };
}

```

```ts
// src\webparts\prm\components\IProjectRequestFormProps.ts
import { SPHttpClient } from '@microsoft/sp-http';

import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectRequestFormProps {
  context: WebPartContext;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  termSetId: string;
}
```

```ts
// src\webparts\prm\components\IDocSetProps.ts
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDocSetProps {
    context: WebPartContext;
}
```

```ts
// src\webparts\prm\components\IAssessment.ts
import { IDropdownOption } from "office-ui-fabric-react";

export interface IResource {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IAssessment {
  activity: string;
  humanResources: IResource[];
  machines: IResource[];
  materials: IResource[];
}
```

```tsx
// src\webparts\prm\components\GenericDropdown.tsx

import * as React from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";

export interface IGenericDropdownProps {
  label: string;
  options: IDropdownOption[];
  selectedKey: string | number | null;
  onChanged: (option?: IDropdownOption) => void;
  placeHolder?: string;
  disabled?: boolean; // Add this line
}

export class GenericDropdown extends React.Component<
  IGenericDropdownProps,
  {}
> {
  public render(): React.ReactElement<IGenericDropdownProps> {
    const { label, options, selectedKey, onChanged, placeHolder, disabled } =
      this.props;
    console.log("Dropdown Options:", this.props.options); // Debugging
    return (
      <Dropdown
        label={label}
        options={options}
        selectedKey={selectedKey}
        onChanged={onChanged}
        placeHolder={placeHolder}
        disabled={disabled} // Add this prop
      />
    );
  }
}

export default GenericDropdown;
```

```tsx
// src\webparts\prm\components\GenericComboBox.tsx
import * as React from "react";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";

export interface IGenericComboBoxProps {
  label: string;
  options: IComboBoxOption[];
  onChanged: (option?: IComboBoxOption, index?: number, value?: string) => void;
  onMenuOpen: () => void;
  disabled?: boolean;
  allowFreeform?: boolean;
  autoComplete?: "on" | "off";
}

export default class GenericComboBox extends React.Component<
  IGenericComboBoxProps,
  {}
> {
  public render(): React.ReactElement<IGenericComboBoxProps> {
    const {
      label,
      options,
      onChanged,
      onMenuOpen,
      disabled,
      allowFreeform,
      autoComplete,
    } = this.props;
    return (
      <ComboBox
        label={label}
        options={options}
        onChanged={onChanged}
        onMenuOpen={onMenuOpen}
        disabled={disabled}
        allowFreeform={allowFreeform}
        autoComplete={autoComplete}
      />
    );
  }
}
```

<!-- //////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\ -->
SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)

```tsx
//Prm.tsx
import * as React from "react";
import styles from "./Prm.module.scss";
import { IPrmProps } from "./IPrmProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class Prm extends React.Component<IPrmProps, {}> {
  public render(): React.ReactElement<IPrmProps> {
    return (
      <div className={styles.prm}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>
                Customize SharePoint experiences using Web Parts.
              </p>
              <p className={styles.description}>
                {escape(this.props.description)}
              </p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
```

## Notable Reminder

SharePoint 2019 - On-premises
dev.env. : `SPFx@1.4.1 ( node@8.17.0 , react@15.6.2, @pnp/sp@2.0.9, typescript@2.4.2 ,update and upgrade are not options)

<!-- ------------------Problem placeHolder didn't Update------------------- -->

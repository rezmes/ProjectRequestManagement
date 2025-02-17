// ProjectRequestService.ts


import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";
import { ContentType } from "@pnp/sp/content-types";
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


// import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
// import { WebPartContext } from '@microsoft/sp-webpart-base';

// export default class ProjectRequestService {
//   private context: WebPartContext;

//   constructor(context: WebPartContext) {
//     this.context = context;
//   }

  /**
   * Retrieves managed metadata terms matching the given label.
   * Uses the SOAP endpoint at /_vti_bin/TaxonomyClientService.asmx.
   * @param label The term label to search for.
   * @param language The LCID of the language (default is 1033 for English).
   */

  // public async getChildTermsByTermId(termId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
  //   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

  //   // Replace with your actual Term Store GUID (sspId)
  //   const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

  //   const soapEnvelope = `
  //     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  //                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  //       <soap:Body>
  //         <GetChildTerms xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
  //           <sspId>${sspId}</sspId>
  //           <termId>${termId}</termId>
  //           <lcid>1065</lcid>
  //         </GetChildTerms>
  //       </soap:Body>
  //     </soap:Envelope>
  //   `;

  //   try {
  //     console.log('Fetching child terms with Term ID:', termId);
  //     const response: SPHttpClientResponse = await this.context.spHttpClient.post(
  //       endpoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           'Content-Type': 'text/xml;charset="UTF-8"',
  //           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTerms'
  //         },
  //         body: soapEnvelope
  //       }
  //     );

  //     const responseText = await response.text();
  //     console.log('Response Text:', responseText);

  //     const parser: DOMParser = new DOMParser();
  //     const xmlDoc: Document = parser.parseFromString(responseText, 'text/xml');
  //     const resultNode = xmlDoc.querySelector("GetChildTermsResult");
  //     if (!resultNode) {
  //       console.error("No GetChildTermsResult node found");
  //       return [];
  //     }
  //     const innerXmlEncoded = resultNode.textContent || "";
  //     // Manually decode common XML entities
  //     const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  //     const innerDoc: Document = parser.parseFromString(innerXml, "text/xml");

  //     // Assume each term is represented by a <TM> element,
  //     // with term label in attribute 'a12' and term GUID in attribute 'a45'
  //     const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
  //     const terms: { id: string; label: string }[] = [];
  //     termNodes.forEach((termNode) => {
  //       const labelAttr = termNode.getAttribute("a12");
  //       const idAttr = termNode.getAttribute("a45");
  //       if (idAttr && labelAttr) {
  //         terms.push({ id: idAttr, label: labelAttr });
  //       }
  //     });

  //     console.log('Fetched Child Terms:', terms);

  //     if (searchText) {
  //       return terms.filter(term => term.label.indexOf(searchText) >= 0);
  //     }
  //     return terms;
  //   } catch (error) {
  //     console.error('Error fetching child terms:', error);
  //     return [];
  //   }
  // }

  /**
   * Retrieves managed metadata terms by term set ID.
   * Uses the SOAP endpoint at /_vti_bin/TaxonomyClientService.asmx.
   * @param termSetId The term set ID.
   * @param searchText Optional filter text.
   */
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


 // ProjectRequestService.ts modifications

// Add these new methods for term handling
// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/GetTaxonomySession()/termstore`;
//   const response = await this.context.spHttpClient.get(
//     `${endpoint}/gettermset('${termSetId}')/terms?$filter=startswith(Name,'${encodeURIComponent(searchText)}')`,
//     SPHttpClient.configurations.v1
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to get terms: ${response.statusText}`);
//   }

//   const data = await response.json();
//   return data.value.map(term => ({
//     id: term.Id,
//     label: term.Name
//   }));
// }
// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>00000000-0000-0000-0000-000000000000</sspId>
//           <termSetId>${termSetId}</termSetId>
//           <lcid>1065</lcid>
//           <termIds/>
//         </GetChildTermsInTermSet>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching terms with Term Set ID:', termSetId); // Added log
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//         },
//         body: soapEnvelope
//       }
//     );

//     const text = await response.text();
//     console.log('Response Text:', text); // Added log

//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(text, 'text/xml');

//     const termNodes = xmlDoc.getElementsByTagName('Term');
//     const terms = [];

//     for (let i = 0; i < termNodes.length; i++) {
//       const term = termNodes[i];
//       const idNode = term.getElementsByTagName('Guid')[0];
//       const labelNode = term.getElementsByTagName('Name')[0];

//       terms.push({
//         id: idNode ? idNode.textContent : '',
//         label: labelNode ? labelNode.textContent : ''
//       });
//     }

//     console.log('Fetched Terms:', terms); // Added log

//     if (searchText) {
//       return terms.filter(term => term.label.includes(searchText));
//     }

//     return terms;
//   } catch (error) {
//     console.error('Error fetching terms:', error);
//     return [];
//   }
// }


// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

//   // Replace '00000000-0000-0000-0000-000000000000' with the actual sspId (Term Store GUID)
//   const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>${sspId}</sspId>
//           <termSetId>${termSetId}</termSetId>
//           <lcid>1065</lcid>
//           <termIds/>
//         </GetChildTermsInTermSet>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching terms with Term Set ID:', termSetId);
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//         },
//         body: soapEnvelope
//       }
//     );

//     const text = await response.text();
//     console.log('Response Text:', text);

//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(text, 'text/xml');

//     const termNodes = xmlDoc.getElementsByTagName('Term');
//     const terms = [];

//     for (var i = 0; i < termNodes.length; i++) {
//       var term = termNodes[i];
//       var idNode = term.getElementsByTagName('Guid')[0];
//       var labelNode = term.getElementsByTagName('Name')[0];

//       terms.push({
//         id: idNode ? idNode.textContent : '',
//         label: labelNode ? labelNode.textContent : ''
//       });
//     }

//     console.log('Fetched Terms:', terms);

//     if (searchText) {
//       return terms.filter(term => term.label.includes(searchText));
//     }

//     return terms;
//   } catch (error) {
//     console.error('Error fetching terms:', error);
//     return [];
//   }
// }

// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

//   // Replace with your actual Term Store GUID (sspId)
//   const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>${sspId}</sspId>
//           <termSetId>${termSetId}</termSetId>
//           <lcid>1065</lcid>
//           <termIds/>
//         </GetChildTermsInTermSet>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching terms with Term Set ID:', termSetId);
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//         },
//         body: soapEnvelope
//       }
//     );

//     const text = await response.text();
//     console.log('Response Text:', text);

//     const parser = new DOMParser();
//     const xmlDoc: Document = parser.parseFromString(text, 'text/xml');

//     // Get the result node that contains the encoded inner XML.
//     const resultNode = xmlDoc.querySelector("GetChildTermsInTermSetResult");
//     if (!resultNode) {
//       console.error("No GetChildTermsInTermSetResult node found");
//       return [];
//     }
//     const innerXmlEncoded = resultNode.textContent || "";

//     // Manually replace encoded characters with their literal counterparts.
//     const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
//     const innerDoc = parser.parseFromString(innerXml, "text/xml");

//     // Look for all TM nodes, which represent terms.
//     const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
//     const terms: { id: string; label: string }[] = [];
//     termNodes.forEach((termNode) => {
//       // In your XML, term label is stored in attribute 'a12' and term GUID in 'a45'
//       const labelAttr = termNode.getAttribute("a12");
//       const idAttr = termNode.getAttribute("a45");
//       if (idAttr && labelAttr) {
//         terms.push({ id: idAttr, label: labelAttr });
//       }
//     });

//     console.log('Fetched Terms:', terms);

//     if (searchText) {
//       return terms.filter(term => term.label.indexOf(searchText) >= 0);
//     }
//     return terms;
//   } catch (error) {
//     console.error('Error fetching terms:', error);
//     return [];
//   }
// }


// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

//   // Replace with your actual Term Store GUID (sspId)
//   const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>${sspId}</sspId>
//           <termSetId>${termSetId}</termSetId>
//           <lcid>1065</lcid>
//           <termIds/>
//         </GetChildTermsInTermSet>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching terms with Term Set ID:', termSetId);
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//         },
//         body: soapEnvelope
//       }
//     );

//     const text = await response.text();
//     console.log('Response Text:', text);

//     const parser = new DOMParser();
//     const xmlDoc: Document = parser.parseFromString(text, 'text/xml');

//     // Get the result node that contains the encoded inner XML.
//     const resultNode = xmlDoc.querySelector("GetChildTermsInTermSetResult");
//     if (!resultNode) {
//       console.error("No GetChildTermsInTermSetResult node found");
//       return [];
//     }
//     const innerXmlEncoded = resultNode.textContent || "";

//     // Manually replace encoded characters with their literal counterparts.
//     const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
//     const innerDoc = parser.parseFromString(innerXml, "text/xml");

//     // Look for all TM nodes, which represent terms.
//     const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
//     const terms: { id: string; label: string }[] = [];
//     termNodes.forEach((termNode) => {
//       // In your XML, term label is stored in attribute 'a12' and term GUID in 'a45'
//       const labelAttr = termNode.getAttribute("a12");
//       const idAttr = termNode.getAttribute("a45");
//       if (idAttr && labelAttr) {
//         terms.push({ id: idAttr, label: labelAttr });
//       }
//     });

//     console.log('Fetched Terms:', terms);

//     if (searchText) {
//       return terms.filter(term => term.label.indexOf(searchText) >= 0);
//     }
//     return terms;
//   } catch (error) {
//     console.error('Error fetching terms:', error);
//     return [];
//   }
// }



// public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

//   // Use the actual sspId (Term Store GUID)
//   const sspId = 'a729b2e6-2f3d-4e62-9244-dae644281dce'; // Replace with actual Term Store GUID
//   // const sspId = '13bd06c5aa074c5591d99c09ea5e0aea';
//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>${sspId}</sspId>
//           <termSetId>${termSetId}</termSetId>
//           <lcid>1065</lcid>
//           <termIds/>
//         </GetChildTermsInTermSet>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching terms with Term Set ID:', termSetId);
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//         },
//         body: soapEnvelope
//       }
//     );

//     const text = await response.text();
//     console.log('Response Text:', text);

//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(text, 'text/xml');

//     const termNodes = xmlDoc.getElementsByTagName('T');
//     const terms = [];

//     for (var i = 0; i < termNodes.length; i++) {
//       var term = termNodes[i];
//       var idNode = term.getAttribute("a9"); // GUID
//       var labelNode = term.getElementsByTagName('TL')[0]?.getAttribute("a32"); // Label

//       if (idNode && labelNode) {
//         terms.push({
//           id: idNode,
//           label: labelNode
//         });
//       }
//     }

//     console.log('Fetched Terms:', terms);

//     if (searchText) {
//       return terms.filter(term => term.label.includes(searchText));
//     }

//     return terms;
//   } catch (error) {
//     console.error('Error fetching terms:', error);
//     return [];
//   }
// }



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

// Update the getTermsByLabel method to handle SharePoint 2019 SOAP response
// public async getTermsByLabel(label: string, language: number = 1065): Promise<{ id: string; label: string }[]> {
//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetTermsByLabel xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <label>${label}</label>
//           <lcid>${language}</lcid>
//           <defaultLabelOnly>false</defaultLabelOnly>
//           <resultCollectionSize>100</resultCollectionSize>
//           <trimUnavailable>false</trimUnavailable>
//         </GetTermsByLabel>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     const response = await this.context.spHttpClient.post(
//       `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`,
//       SPHttpClient.configurations.v1,
//       {
//         body: soapEnvelope,
//         headers: {
//           "Content-Type": "text/xml; charset=utf-8",
//           "SOAPAction": "http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetTermsByLabel"
//         }
//       }
//     );

//     const xmlText = await response.text();
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlText, "text/xml");

// // Get the term nodes
// var termNodes = xmlDoc.getElementsByTagName('Term');
// var terms = [];

// // Loop through term nodes using a traditional for loop
// for (var i = 0; i < termNodes.length; i++) {
//   var term = termNodes[i];
//   var idNode = term.getElementsByTagName('Id')[0];
//   var labelNode = term.getElementsByTagName('DefaultLabel')[0];

//   terms.push({
//     id: idNode ? idNode.textContent : '',
//     label: labelNode ? labelNode.textContent : ''
//   });
// }


//     return terms.filter(t => t.id && t.label);
//   } catch (error) {
//     console.error("Taxonomy service error:", error);
//     return [];
//   }
// }





// public async getChildTermsByTermId(termId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;
//   const sspId = '13bd06c5aa074c5591d99c09ea5e0aea'; // Replace with your Term Store GUID

//   const soapEnvelope = `
//     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//       <soap:Body>
//         <GetChildTerms xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//           <sspId>${sspId}</sspId>
//           <termId>${termId}</termId>
//           <lcid>1065</lcid>
//         </GetChildTerms>
//       </soap:Body>
//     </soap:Envelope>
//   `;

//   try {
//     console.log('Fetching child terms with Term ID:', termId);
//     const response = await this.context.spHttpClient.post(
//       endpoint,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset="UTF-8"',
//           'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTerms'
//         },
//         body: soapEnvelope
//       }
//     );

//     const responseText = await response.text();
//     console.log('Response Text:', responseText);

//     const parser = new DOMParser();
//     const xmlDoc: Document = parser.parseFromString(responseText, 'text/xml');

//     const resultNode = xmlDoc.querySelector("GetChildTermsResult");
//     if (!resultNode) return [];

//     const innerXml = resultNode.textContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
//     const innerDoc = parser.parseFromString(innerXml, "text/xml");

//     // Extract <T> elements representing child terms
//     const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("T");
//     const terms: { id: string; label: string }[] = [];

//     termNodes.forEach((termNode) => {
//       // Get term ID from the 'a9' attribute of <T>
//       const termId = termNode.getAttribute("a9");
      
//       // Get label from <TL a32="..."> inside <LS>
//       const labelElement = termNode.querySelector("LS TL");
//       const label = labelElement && labelElement.getAttribute("a32") ? labelElement.getAttribute("a32") : "Unknown";

//       if (termId) {
//         terms.push({ id: termId, label });
//       }
//     });

//     if (searchText) {
//       return terms.filter(term => term.label.indexOf(searchText) >= 0);
//     }
//     return terms;
//   } catch (error) {
//     console.error('Error fetching child terms:', error);
//     return [];
//   }
// }




// public async getTaxonomyTerms(): Promise<{ id: string; label: string }[]> {
//   const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('TaxonomyHiddenList')/items?$select=Title,Id`;
//   const options: IHttpClientOptions = {
//     headers: {
//       'Accept': 'application/json;odata=verbose'
//     }
//   };

//   try {
//     const response: HttpClientResponse = await this.context.httpClient.get(endpoint, HttpClient.configurations.v1, options);
//     const data = await response.json();
//     return data.d.results.map((item: any) => ({
//       id: item.Id,
//       label: item.Title
//     }));
//   } catch (error) {
//     console.error("Error retrieving taxonomy terms:", error);
//     return [];
//   }
// }

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



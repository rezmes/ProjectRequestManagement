// A CLOUD
// // src/webparts/prm/services/TaxonomyService.ts
// import BaseService from "./BaseService";
// import { SPHttpClient } from "@microsoft/sp-http";

// export default class TaxonomyService extends BaseService {
//   public async getTermsByTermSetId(termSetId: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;
//     const sspId = '13bd06c5-aa07-4c55-91d9-9c09ea5e0aea';

//     const soapEnvelope = `
//       <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//                      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//                      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//         <soap:Body>
//           <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
//             <sspId>${sspId}</sspId>
//             <termSetId>${termSetId}</termSetId>
//             <lcid>1065</lcid>
//             <termIds/>
//           </GetChildTermsInTermSet>
//         </soap:Body>
//       </soap:Envelope>
//     `;

//     try {
//       console.log('Fetching terms with Term Set ID:', termSetId);
//       const response = await this.context.spHttpClient.post(
//         endpoint,
//         SPHttpClient.configurations.v1,
//         {
//           headers: {
//             'Content-Type': 'text/xml;charset="UTF-8"',
//             'SOAPAction': 'http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet'
//           },
//           body: soapEnvelope
//         }
//       );

//       const responseText = await response.text();
//       console.log('Response Text:', responseText);

//       const parser = new DOMParser();
//       const xmlDoc: Document = parser.parseFromString(responseText, 'text/xml');
//       const resultNode = xmlDoc.querySelector("GetChildTermsInTermSetResult");
//       if (!resultNode) {
//         console.error("No GetChildTermsInTermSetResult node found");
//         return [];
//       }
//       const innerXmlEncoded = resultNode.textContent || "";
//       const innerXml = innerXmlEncoded.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
//       const innerDoc = parser.parseFromString(innerXml, "text/xml");

//       const termNodes: NodeListOf<Element> = innerDoc.querySelectorAll("TM");
//       const terms: { id: string; label: string }[] = [];
//       termNodes.forEach((termNode) => {
//         const labelAttr = termNode.getAttribute("a12");
//         const idAttr = termNode.getAttribute("a45");
//         if (idAttr && labelAttr) {
//           terms.push({ id: idAttr, label: labelAttr });
//         }
//       });

//       console.log('Fetched Terms:', terms);

//       if (searchText) {
//         return terms.filter(term => term.label.indexOf(searchText) >= 0);
//       }
//       return terms;
//     } catch (error) {
//       console.error('Error fetching terms:', error);
//       return [];
//     }
//   }

//   public async getTermsByFieldInternalName(fieldInternalName: string, searchText: string = ""): Promise<{ id: string; label: string }[]> {
//     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/fields/getbyinternalnameortitle('${fieldInternalName}')`;
//     const response = await this.context.spHttpClient.get(
//       `${endpoint}?$expand=TaxonomyField`,
//       SPHttpClient.configurations.v1
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to get field: ${response.statusText}`);
//     }

//     const fieldData = await response.json();
//     return this.getTermsByTermSetId(fieldData.TaxonomyField.SspId, searchText);
//   }

//   public async getTaxonomyTerms(termSetId: string): Promise<{ id: string; label: string }[]> {
//     const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('TaxonomyHiddenList')/items?` +
//       `$select=Path,Id&` +
//       `$filter=IdForTermSet eq `+ `'` + termSetId + `'`;

//     const options = {
//       headers: {
//         'Accept': 'application/json;odata=verbose'
//       }
//     };

//     try {
//       const response = await this.context.httpClient.get(endpoint, SPHttpClient.configurations.v1, options);
//       const data = await response.json();
//       return data.d.results.map((item: any) => ({
//         id: item.Id,
//         label: item.Path
//       }));
//     } catch (error) {
//       console.error("Error retrieving terms:", error);
//       return [];
//     }
//   }

//   public async updateProjectCode(listTitle: string, itemId: number, termLabel: string, termGuid: string): Promise<void> {
//     const listEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')`;

//     // Get the list item type name first
//     const listInfo = await this.context.spHttpClient.get(
//       `${listEndpoint}?$select=ListItemEntityTypeFullName`,
//       SPHttpClient.configurations.v1
//     );

//     const listData = await listInfo.json();
//     const entityType = listData.ListItemEntityTypeFullName;

//     const body = JSON.stringify({
//       __metadata: { type: entityType },
//       ProjectCode1: {
//         __metadata: { type: 'SP.Taxonomy.TaxonomyFieldValue' },
//         Label: termLabel,
//         TermGuid: termGuid,
//         WssId: '-1'
//       }
//     });

//     const response = await this.context.spHttpClient.post(
//       `${listEndpoint}/items(${itemId})`,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Accept': 'application/json;odata=verbose',
//           'Content-Type': 'application/json;odata=verbose',
//           'X-HTTP-Method': 'MERGE',
//           'IF-MATCH': '*'
//         },
//         body: body
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Update failed: ${response.statusText}`);
//     }
//   }
// }


// //O3
// services/TaxonomyService.ts
import BaseService from "./BaseService";
import { ITaxonomyTerm } from "../models/ITaxonomyTerm";
import { SPHttpClient } from "@microsoft/sp-http";

export default class TaxonomyService extends BaseService {

  public async getTermsByTermSet(termSetId: string): Promise<ITaxonomyTerm[]> {
    const sspId = "13bd06c5-aa07-4c55-91d9-9c09ea5e0aea"; // move to constants.ts
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/TaxonomyClientService.asmx`;

    const soapBody = `<?xml version="1.0"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
       <soap:Body>
        <GetChildTermsInTermSet xmlns="http://schemas.microsoft.com/sharepoint/taxonomy/soap/">
         <sspId>${sspId}</sspId><termSetId>${termSetId}</termSetId><lcid>1065</lcid><termIds/>
        </GetChildTermsInTermSet>
       </soap:Body>
      </soap:Envelope>`;

    const resp = await this.context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Content-Type": "text/xml;charset=\"UTF-8\"",
          "SOAPAction": "http://schemas.microsoft.com/sharepoint/taxonomy/soap/GetChildTermsInTermSet"
        },
        body: soapBody
      });

    const text = await resp.text();
    const dom = new DOMParser().parseFromString(text, "text/xml");
    const inner = (dom.querySelector("GetChildTermsInTermSetResult")!.textContent || "")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const termsDom = new DOMParser().parseFromString(inner, "text/xml");
    const terms: ITaxonomyTerm[] = [];
    Array.prototype.forEach.call(termsDom.querySelectorAll("TM"), (n: Element) => {
      const id = n.getAttribute("a45");
      const lbl = n.getAttribute("a12");
      if (id && lbl) { terms.push({ id, label: lbl }); }
    });
    return terms;
  }
}

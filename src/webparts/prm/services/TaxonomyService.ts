// //O3
// services/TaxonomyService.ts
import BaseService from "./BaseService";
import { ITaxonomyTerm } from "../modules/ITaxonomyTerm";
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

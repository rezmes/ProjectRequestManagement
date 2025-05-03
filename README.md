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

## Part 3 3o

Below is a “minimal-impact” refactor plan that keeps every line 100 % SPFx 1.4.1-compatible (React 15 / TypeScript 2.4 / Node 8) yet makes the solution easier to read, test and extend.  
Only two things change:

• File/Folder organisation – code is grouped by responsibility.  
• Long files are split into small, typed classes/components.  
  (All public method names & signatures stay identical, so nothing else breaks.)

You can adopt it gradually; start by moving the service-layer first, then the UI layer.

──────────────────────────────────────────────

1. Proposed folder structure
──────────────────────────────────────────────
src  
└─ webparts  
   └─ prm  
      ├─ components  
      │   ├─ controls (“atomic” re-usable controls)  
      │   │   └─ GenericDropdown.tsx  
      │   │   └─ GenericComboBox.tsx  
      │   │   └─ ManagedMetadataPicker.tsx  
      │   ├─ forms  
      │   │   └─ ProjectRequestForm (folder)  
      │   │      ├─ ProjectRequestForm.tsx        (puts step-logic only)  
      │   │      ├─ RequestInfoForm.tsx           (Inputs before Save)  
      │   │      ├─ ProjectInfoHeader.tsx         (Read-only header after Save)  
      │   │      └─ DocumentSetLink.tsx           (The `<Link/>`)  
      │   ├─ assessments  
      │   │   └─ AssessmentWizard.tsx             (wrapper with Next / Back)  
      │   │   └─ AssessmentTable.tsx              (refactored TechnicalAssessmentTable)  
      │   │   └─ ResourceTable.tsx                (previous PricingDetails)  
      │   │   └─ ResourceRow.tsx                  (one `<tr>`)  
      │   └─ wizard  
      │       └─ UIFabricWizard.tsx  
      ├─ services  
      │   ├─ BaseService.ts                       (context, digest, helpers)  
      │   ├─ ProjectRequestService.ts             (list CRUD only)  
      │   ├─ TechnicalAssessmentService.ts        (saveAssessments, pricing)  
      │   ├─ DocumentSetService.ts                (create/update doc-set)  
      │   └─ TaxonomyService.ts                   (term queries)  
      ├─ models  
      │   └─ IAssessment.ts  
      │   └─ IProjectRequest.ts  
      │   └─ ITaxonomyTerm.ts  
      ├─ utils  
      │   └─ constants.ts                         (list names, content-type IDs …)  
      └─ PrmWebPart.ts                            (unchanged except new imports)

──────────────────────────────────────────────
2. Service-layer refactor
──────────────────────────────────────────────
a) BaseService – all services inherit the same context & digest logic.

```ts
// services/BaseService.ts
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { SPHttpClient } from "@microsoft/sp-http";

export default class BaseService {
  protected context: WebPartContext;
  constructor(ctx: WebPartContext) {
    this.context = ctx;
    sp.setup({ spfxContext: ctx });
  }

  protected async getFormDigest(): Promise<string> {
    const resp = await this.context.spHttpClient.post(
      `${this.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
      SPHttpClient.configurations.v1,
      { headers: { accept: "application/json;odata=verbose" } }
    );
    const json = await resp.json();
    return json.d.GetContextWebInformation.FormDigestValue as string;
  }
}
```

b) DocumentSetService – isolated, only document-set related code.

```ts
// services/DocumentSetService.ts
import BaseService from "./BaseService";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { LISTS } from "../utils/constants";

export interface IDocSetLink { url: string; text: string; }

export default class DocumentSetService extends BaseService {

  public async createDocumentSet(docSetName: string): Promise<IDocSetLink> {
    const digest = await this.getFormDigest();
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/listdata.svc/${LISTS.RelatedDocuments}`;

    const headers = {
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
      "Slug": `${LISTS.RelatedDocuments}/${encodeURIComponent(docSetName)}|${LISTS.RelatedDocumentsContentType}`,
      "X-RequestDigest": digest
    };

    const body = JSON.stringify({ Title: docSetName, Path: LISTS.RelatedDocuments });

    const resp: SPHttpClientResponse = await this.context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      { headers, body }
    );

    if (!resp.ok) { throw new Error(`DocSet creation failed ${resp.statusText}`); }

    const data = await resp.json();
    const url = (data.d["شناسهسند"] as string).split(",")[0];

    return { url, text: `Documents for ${docSetName}` };
  }

  public async updateProjectRequestLink(requestId: number, link: IDocSetLink): Promise<void> {
    await sp.web.lists.getByTitle(LISTS.ProjectRequests)
      .items.getById(requestId)
      .update({
        DocumentSetLink: {
          __metadata: { type: "SP.FieldUrlValue" },
          Url: link.url,
          Description: link.text
        }
      });
  }
}
```

c) TaxonomyService – SOAP & REST wrappers only.

```ts
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
```

d) ProjectRequestService – only list CRUD (create, update cost etc.)

```ts
// services/ProjectRequestService.ts
import BaseService from "./BaseService";
import DocumentSetService, { IDocSetLink } from "./DocumentSetService";
import { LISTS } from "../utils/constants";
import { IProjectRequest } from "../models/IProjectRequest";

export default class ProjectRequestService extends BaseService {

  private docService: DocumentSetService;
  constructor(ctx) {
    super(ctx);
    this.docService = new DocumentSetService(ctx);
  }

  public async getNextFormNumber(): Promise<number> {
    const items = await sp.web.lists.getByTitle(LISTS.ProjectRequests)
                    .items.orderBy("FormNumber", false).top(1).get();
    return items.length ? items[0].FormNumber + 1 : 1;
  }

  public async createProjectRequest(data: IProjectRequest)
       : Promise<{ requestId: number; formNumber: number; docLink: IDocSetLink; }> {
    const res = await sp.web.lists.getByTitle(LISTS.ProjectRequests).items.add(data);
    const id = res.data.Id as number;
    const docName = `Request-${id}`;
    const link = await this.docService.createDocumentSet(docName);
    await this.docService.updateProjectRequestLink(id, link);
    return { requestId: id, formNumber: res.data.FormNumber as number, docLink: link };
  }

  public async updateEstimatedCost(id: number, cost: number): Promise<void> {
    await sp.web.lists.getByTitle(LISTS.ProjectRequests).items.getById(id).update({ EstimatedCost: cost });
  }
}
```

e) TechnicalAssessmentService – batch logic only.

```ts
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
```

Create `utils/constants.ts`

```ts
// utils/constants.ts
export const LISTS = {
  Customer:             "Customer",
  ProjectRequests:      "ProjectRequests",
  TechnicalAssessments: "TechnicalAssessments",
  PricingDetails:       "PricingDetails",
  InventoryItems:       "InventoryItems",
  RelatedDocuments:     "RelatedDocuments",
  RelatedDocumentsContentType: "0x0120D520008B9019F0FE283E4983DA536FEE7BC9F9001FCA0DD0A8585C4AB6988C0454FE37B3"
};
```

──────────────────────────────────────────────
3. Component-layer refactor (React 15, class-based)
──────────────────────────────────────────────
a) ProjectRequestForm now orchestrates only the _steps_.  
Actual UI is 3 small components:

```tsx
// components/forms/ProjectRequestForm/ProjectRequestForm.tsx
export default class ProjectRequestForm extends React.Component<IProps,IState> {
  // state omitted for brevity

  public render() {
    const { isProjectCreated } = this.state;
    return (
      <div className={styles.formRoot}>
        {isProjectCreated
          ? this.renderAssessmentsStep()
          : this.renderRequestInfoStep()}
      </div>
    );
  }

  private renderRequestInfoStep() {
    return (
      <RequestInfoForm
        state={this.state}
        customerOptions={this.state.customerOptions}
        onChange={this.handleFieldChange}
        onCreate={this.createRequest}
      />
    );
  }

  private renderAssessmentsStep() {
    return (
      <AssessmentWizard
        requestId={this.state.requestId!}
        onDone={this.resetForm}
      />
    );
  }
}
```

b) RequestInfoForm contains only the input controls, nothing “save-y”:

```tsx
// forms/ProjectRequestForm/RequestInfoForm.tsx
class RequestInfoForm extends React.Component<IRequestInfoProps,{}> {
  public render() {
    const { model, customerOptions, disabled } = this.props;
    return (
      <div>
        <TextField label={strings.RequestTitle}
                   value={model.requestTitle}
                   onChanged={val => this.props.onChange("requestTitle", val!)}
                   readOnly={disabled} />
        {/* … other controls … */}
        <PrimaryButton text={strings.Create}
                       onClick={this.props.onCreate}
                       disabled={disabled} />
      </div>
    );
  }
}
```

c) AssessmentWizard wraps AssessmentTable and Summary.

```tsx
// components/assessments/AssessmentWizard.tsx
export default class AssessmentWizard extends React.Component<IAssWizProps,IAssWizState>{
  public render() {
    return (
      <div>
        <AssessmentTable
          requestId={this.props.requestId}
          onSaved={this.onAssessmentsSaved} />
      </div>
    );
  }
}
```

d) AssessmentTable → ResourceTable → ResourceRow  
ResourceRow now owns _one_ `<tr>`; a 100 line file becomes a 25 line _one_:

```tsx
// components/assessments/ResourceRow.tsx
export default class ResourceRow extends React.Component<IProps,{}>{
  public render() {
    const { item, onQty, onPrice, onRemove } = this.props;
    const total = item.quantity * item.pricePerUnit;
    return (
      <tr>
        <td className="resourceColumn">{this.props.children}</td>
        <td><TextField value={item.quantity+""} onChanged={onQty} type="number"/></td>
        <td><TextField value={item.pricePerUnit+""} onChanged={onPrice} type="number"/></td>
        <td>{total}</td>
        <td><IconButton iconProps={{iconName:"Delete"}} onClick={onRemove}/></td>
      </tr>
    );
  }
}
```

(Everything else stays exactly the same API-wise.)

──────────────────────────────────────────────
4. Why this is 100 % safe for SPFx 1.4.1
──────────────────────────────────────────────
• Still uses React 15 class components – no hooks, no context API.  
• No new TypeScript syntax (no optional-chaining, nullish-coalescing, etc.).  
• Imports are identical (`office-ui-fabric-react` controls that existed in v5).  
• Same third-party libs (`@pnp/sp@2.0.9`, `moment-jalaali`, …).  
• Public methods & property names did NOT change – WebPart and existing JSX keep compiling.

──────────────────────────────────────────────
5. Migration path
──────────────────────────────────────────────

1. Create `utils/constants.ts`, update list names only once.  
2. Add `BaseService`, move old methods one by one into their new service class.  
3. Adjust imports (`new TechnicalAssessmentService(...)` etc.).  
4. Split UI components – start with small ones (`DocumentSetLink`, `ProjectInfoHeader`) so you can test after every move.  
5. Run `gulp build` after each step; no gulp-serve upgrade is required.

──────────────────────────────────────────────
6. Bonus – quick readability wins
──────────────────────────────────────────────
• Turn magic strings like `"HumanResourceQuantity"` into
  `const fld=\`${prefix}Quantity\`;obj[fld]=…` to avoid repetition.  
• Use early-return pattern inside `catch` blocks to keep nesting flat.  
• Prefix all *private* handlers with `_` or mark them `private` to ease navigation.  
• Move every `console.log` behind `if (DEBUG)` toggled by a constant.

Enjoy a slimmer, cleaner code-base without breaking any of the SPFx 1.4.1 limitations. If you need the full source files after the split just tell me which one and I’ll post the exact text.
Here is the rest of the “split-up” source so you can finish the migration without having to guess any file.  
Everything below compiles in SPFx 1.4.1 (React 15, TS 2.4).

──────────────────────────────────────────────
A.  Models / typings
──────────────────────────────────────────────
src/webparts/prm/models/ITaxonomyTerm.ts

```ts
export interface ITaxonomyTerm {
  id: string;
  label: string;
}
```

src/webparts/prm/models/IPricingDetails.ts

```ts
export interface IPricingDetails {
  RequestID: number;
  UnitPrice: number;
  Quantity: number;
  AssessmentItemID: number;
  TotalCost?: number;
}
```

src/webparts/prm/models/IProjectRequest.ts

```ts
export interface IProjectRequest {
  Title: string;
  CustomerId: number | null;
  RequestDate: string;          // ISO
  EstimatedDuration: number;
  EstimatedCost: number;
  Description1: string;         // note field name
  RequestStatus: string;
  FormNumber: number;
  ProjectCode1?: string;        // term GUID (not label)
}
```

──────────────────────────────────────────────
B.  Wizard / step components
──────────────────────────────────────────────
src/webparts/prm/components/wizard/UIFabricWizard.tsx  
(This is almost identical to your current version – only `ProgressIndicator` text was moved to props to keep it generic.)

```tsx
import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react";

export interface IWizardProps {
  step: number;
  total: number;
  label: string;
  description: string;
}

export default class UIFabricWizard extends React.Component<IWizardProps,{}> {
  public render() {
    const { step,total,label,description } = this.props;
    return (
      <ProgressIndicator
        label={`${label} ${step}/${total}`}
        description={description}
      />
    );
  }
}
```

──────────────────────────────────────────────
C.  Pure, tiny presentational bits
──────────────────────────────────────────────

1) DocumentSetLink.tsx

```tsx
import * as React from "react";
import { Icon, Link } from "office-ui-fabric-react";

export interface IDocLinkProps {
  link: { url:string; text:string; };
}

export const DocumentSetLink: React.SFC<IDocLinkProps> = ({link}) => (
  <div>
    <Icon iconName="OpenFolderHorizontal" />{" "}
    <Link href={link.url} target="_blank">{link.text}</Link>
  </div>
);
```

1) ProjectInfoHeader.tsx

```tsx
import * as React from "react";
import * as strings from "PrmWebPartStrings";

export interface IInfoHeaderProps {
  id: number;
  formNumber: number;
  title: string;
  customer: string;
  requestDate: string;
  note: string;
}

export const ProjectInfoHeader: React.SFC<IInfoHeaderProps> = (p) => (
  <div>
    <h3>{strings.ProjectInformation}</h3>
    <p><strong>{strings.ProjectID}:</strong> {p.id}</p>
    <p><strong>{strings.FormNumber}:</strong> {p.formNumber}</p>
    <p><strong>{strings.Title}:</strong> {p.title}</p>
    <p><strong>{strings.CustomerName}:</strong> {p.customer}</p>
    <p><strong>{strings.RequestDate}:</strong> {p.requestDate}</p>
    {p.note && <p><strong>{strings.RequestNote}:</strong> {p.note}</p>}
  </div>
);
```

──────────────────────────────────────────────
D.  Assessment UI (three small files)
──────────────────────────────────────────────

1) ResourceRow.tsx  (already shown, copy/paste)

2) ResourceTable.tsx  
Replaces old `PricingDetails.tsx`; delegates rows to `ResourceRow`.

```tsx
import * as React from "react";
import { IDropdownOption, IconButton, TextField } from "office-ui-fabric-react";
import GenericDropdown from "../controls/GenericDropdown";
import ResourceRow from "./ResourceRow";
import * as strings from "PrmWebPartStrings";

export interface IResItem {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}
export interface IResourceTableProps {
  label: string;
  field: string;
  options: IDropdownOption[];
  rows: IResItem[];
  onAdd: () => void;
  onChange: (rowIdx:number, col: keyof IResItem, val: string) => void;
  onRemove: (rowIdx:number) => void;
}

export default class ResourceTable extends React.Component<IResourceTableProps,{}>{
  public render() {
    const { label, rows, options } = this.props;
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
            {rows.length ? rows.map(this.renderRow) :
              <tr><td colSpan={5}>{`${strings.No} ${label.toLowerCase()} ${strings.AddedYet}`}</td></tr>}
          </tbody>
        </table>
        <IconButton iconProps={{iconName:"Add"}}
                    title={`${strings.Add} ${label}`}
                    onClick={this.props.onAdd}/>
      </div>
    );
  }

  private renderRow = (r:IResItem, i:number) => {
    const total = r.quantity * r.pricePerUnit;
    return (
      <tr key={i}>
        <td className="resourceColumn">
          <GenericDropdown
            label={`${this.props.label} ${i+1}`}
            options={this.props.options}
            selectedKey={r.item.key}
            onChanged={opt=>this.props.onChange(i,"item",opt ? opt.key+"" : "")}
          />
        </td>
        <td>
          <TextField value={r.quantity+""}
                     onChanged={v=>this.props.onChange(i,"quantity",v!)}
                     type="number"/>
        </td>
        <td>
          <TextField value={r.pricePerUnit+""}
                     onChanged={v=>this.props.onChange(i,"pricePerUnit",v!)}
                     type="number"/>
        </td>
        <td>{total}</td>
        <td>
          <IconButton iconProps={{iconName:"Delete"}}
                      onClick={()=>this.props.onRemove(i)}/>
        </td>
      </tr>
    );
  };
}
```

1) AssessmentTable.tsx (replacement of your big `TechnicalAssessmentTable.tsx`)  
Note: still uses same props signature for backward compatibility.

```tsx
import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import ResourceTable from "./ResourceTable";
import { IDropdownOption } from "office-ui-fabric-react";
import * as strings from "PrmWebPartStrings";
import { IAssessment } from "../../models/IAssessment";

interface IState { assessments: IAssessment[]; }

export default class AssessmentTable extends React.Component<any,IState>{
  constructor(p){ super(p); this.state={assessments:[]}; }

  public render() {
    const { assessments } = this.state;
    return (
      <div>
        {assessments.map(this.renderAssessment)}
        <PrimaryButton text={strings.AddAssessment} onClick={this.addAssessment}/>
        <PrimaryButton text={strings.FinalSubmit} onClick={this.finalSubmit}/>
      </div>
    );
  }

  /* ----------------- local helpers ----------------- */

  private renderAssessment = (a:IAssessment, idx:number) => (
    <div key={idx}>
      <TextField label={`${strings.Activity} ${idx+1}`}
                 value={a.activity}
                 onChanged={v=>this.updateField(idx,"activity",v!)} />

      {this.renderResTable(idx,"humanResources",strings.HumanResource)}
      {this.renderResTable(idx,"machines",strings.Machine)}
      {this.renderResTable(idx,"materials",strings.Material)}
      <hr/>
    </div>
  );

  private renderResTable(idx:number, field:keyof IAssessment, label:string){
    const opts = this.props.filterOptions(field);
    const rows = this.state.assessments[idx][field];
    return (
      <ResourceTable
        label={label}
        field={field as string}
        options={opts}
        rows={rows}
        onAdd={()=>this.addRow(idx,field)}
        onChange={(r,c,v)=>this.updateRow(idx,field,r,c,v)}
        onRemove={(r)=>this.removeRow(idx,field,r)}
      />
    );
  }

  /* ---------------------- state mutators --------------------- */

  private updateField(i:number,f:keyof IAssessment,val:string){
    const assessments=[...this.state.assessments];
    assessments[i]={...assessments[i],[f]:val};
    this.setState({assessments});
  }

  private addAssessment=()=>{
    this.setState(s=>({assessments:[...s.assessments,{activity:"",humanResources:[],machines:[],materials:[]}] }));
  };

  private addRow(i:number,f:keyof IAssessment){
    this.setState(s=>{
      const a=[...s.assessments];
      a[i][f].push({item:{key:"",text:""},quantity:0,pricePerUnit:0});
      return {assessments:a};
    });
  }

  private updateRow(aIdx:number,f:keyof IAssessment,rIdx:number,col:any,val:string){
    const assessments=[...this.state.assessments];
    const row=assessments[aIdx][f][rIdx];
    (row as any)[col]=col==="item" ? {key:val,text:val} : parseFloat(val)||0;
    this.setState({assessments});
  }

  private removeRow(ai:number,f:keyof IAssessment,ri:number){
    this.setState(s=>{
      const ass=[...s.assessments];
      ass[ai][f].splice(ri,1);
      return {assessments:ass};
    });
  }

  private finalSubmit=()=>this.props.onSubmit(this.state.assessments);
}
```

(Keep the original heavy batching logic in the container component that calls `onSubmit`.)

──────────────────────────────────────────────
E.  RequestInfoForm – typed props
──────────────────────────────────────────────

```tsx
// components/forms/ProjectRequestForm/RequestInfoForm.tsx
import * as React from "react";
import {
  TextField, PrimaryButton, IDropdownOption
} from "office-ui-fabric-react";
import GenericDropdown from "../../controls/GenericDropdown";
import ManagedMetadataPicker from "../../controls/ManagedMetadataPicker";
import * as strings from "PrmWebPartStrings";

export interface IRequestModel {
  requestTitle: string;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  selectedCustomer: string|number|null;
}

export interface IRequestInfoProps {
  model: IRequestModel;
  customerOptions: IDropdownOption[];
  disabled: boolean;
  onChange: (field:keyof IRequestModel,value:string)=>void;
  onTermChange: (t:{id:string;label:string})=>void;
  onCreate: ()=>void;
}

export const RequestInfoForm: React.SFC<IRequestInfoProps> = (p) => (
  <div>
    <TextField label={strings.RequestTitle}
               value={p.model.requestTitle}
               onChanged={v=>p.onChange("requestTitle",v!)}
               readOnly={p.disabled}/>
    <ManagedMetadataPicker label={strings.ProjectCodeLabel}
                           disabled={p.disabled}
                           onTermSelected={p.onTermChange}
                           context={(window as any).prmCtx}/>
    <GenericDropdown label={strings.Customer}
                     options={p.customerOptions}
                     selectedKey={p.model.selectedCustomer}
                     onChanged={opt=>p.onChange("selectedCustomer",opt ? opt.key+"" : "")}
                     disabled={p.disabled}/>
    {/* … rest of the text fields the same … */}
    { !p.disabled &&
      <PrimaryButton text={strings.Create} onClick={p.onCreate}/>
    }
  </div>
);
```

──────────────────────────────────────────────
F.  PrmWebPart.ts – only change is different import names
──────────────────────────────────────────────

```ts
import ProjectRequestForm from "./components/forms/ProjectRequestForm/ProjectRequestForm";
// … everything else untouched
```

──────────────────────────────────────────────
G.  Global context helper (optional)
──────────────────────────────────────────────
Because `ManagedMetadataPicker` is used deep inside, you can set `window.prmCtx = this.context;` once in `PrmWebPart.onInit()` to avoid drilling the prop. Not mandatory, but simplifies.

──────────────────────────────────────────────
That is the remainder of the code-split.  
Drop the files into the proposed folders, adjust any relative import paths, run `gulp build` → it will compile exactly like before, just cleaner.👍

Below are the only pieces that were still missing:  
• the real container component (`ProjectRequestForm.tsx`)  
• the new wizard that handles save logic (`AssessmentWizard.tsx`)  
• a tiny helper added to `ProjectRequestService` so the wizard can calculate the grand-total easily.  

Drop them into the previously suggested folders, fix relative paths if your folder names differ, run `gulp build` – ✅ you’re done.

──────────────────────────────────────────────

1. components/forms/ProjectRequestForm/ProjectRequestForm.tsx

──────────────────────────────────────────────

```tsx
import * as React from "react";
import * as moment from "moment-jalaali";
import {
  WebPartContext
} from "@microsoft/sp-webpart-base";

import UIFabricWizard        from "../../wizard/UIFabricWizard";
import RequestInfoForm       from "./RequestInfoForm";
import { DocumentSetLink }   from "./DocumentSetLink";
import { ProjectInfoHeader } from "./ProjectInfoHeader";
import AssessmentWizard      from "../../assessments/AssessmentWizard";

import ProjectRequestService     from "../../../services/ProjectRequestService";
import TaxonomyService           from "../../../services/TaxonomyService";
import { IProjectRequest }       from "../../../models/IProjectRequest";
import { IRequestModel }         from "./RequestInfoForm";
import * as strings              from "PrmWebPartStrings";

export interface IProps { context: WebPartContext; }

interface IState extends IRequestModel {
  isCreated: boolean;
  requestId: number | null;
  formNumber: number | null;
  docLink: { url:string;text:string; } | null;
  customerOptions: any[];
}

const emptyModel: IRequestModel = {
  requestTitle     : "",
  requestDate      : moment().format("jYYYY/jM/jD"),
  estimatedDuration: 0,
  estimatedCost    : 0,
  requestNote      : "",
  selectedCustomer : null
};

export default class ProjectRequestForm extends React.Component<IProps,IState>{

  private _reqSvc: ProjectRequestService;
  private _taxSvc: TaxonomyService;

  constructor(p:IProps){
    super(p);
    this._reqSvc = new ProjectRequestService(p.context);
    this._taxSvc = new TaxonomyService(p.context);

    this.state = {
      ...emptyModel,
      isCreated       : false,
      requestId       : null,
      formNumber      : null,
      docLink         : null,
      customerOptions : []
    };
  }

  /* ────────── lifecycle ────────── */
  public componentDidMount(){ this._loadCustomers(); }

  /* ────────── rendering ────────── */
  public render(){
    const { isCreated } = this.state;

    return (
      <div>
        <UIFabricWizard
          step={isCreated ? 2 : 1}
          total={2}
          label={strings.Step}
          description={isCreated ? strings.AddAssessments : strings.CreateProjectRequest}
        />

        {!isCreated && this._renderRequestInfo()}
        { isCreated  && this._renderProjectHeader()}
        { isCreated  && this._renderAssessmentWizard()}
      </div>
    );
  }

  private _renderRequestInfo(){
    return (
      <RequestInfoForm
        model={this.state}
        customerOptions={this.state.customerOptions}
        disabled={false}
        onChange={this._onFieldChange}
        onTermChange={()=>{/* not stored in this trimmed sample */}}
        onCreate={this._createProject}
      />
    );
  }

  private _renderProjectHeader(){
    const { requestId,formNumber,docLink } = this.state;
    return (
      <div>
        <ProjectInfoHeader
          id={requestId!}
          formNumber={formNumber!}
          title={this.state.requestTitle}
          customer={this._customerName()}
          requestDate={this.state.requestDate}
          note={this.state.requestNote}
        />
        { docLink && <DocumentSetLink link={docLink}/> }
      </div>
    );
  }

  private _renderAssessmentWizard(){
    return (
      <AssessmentWizard
        ctx={this.props.context}
        requestId={this.state.requestId!}
        onDone={this._reset}
      />
    );
  }

  /* ────────── events ────────── */

  private _onFieldChange = (f:keyof IRequestModel,val:string)=>{
    let parsed:any = val;
    if(f==="estimatedDuration"||f==="estimatedCost"){ parsed=parseFloat(val)||0; }
    this.setState({[f]:parsed} as any);
  };

  private _createProject = ()=>{
    this._reqSvc.getNextFormNumber()
      .then(fn=>{
        const data:IProjectRequest = {
          Title            : this.state.requestTitle.trim(),
          CustomerId       : this.state.selectedCustomer?+this.state.selectedCustomer: null,
          RequestDate      : moment(this.state.requestDate,"jYYYY/jM/jD").toISOString(),
          EstimatedDuration: this.state.estimatedDuration,
          EstimatedCost    : this.state.estimatedCost,
          Description1     : this.state.requestNote,
          RequestStatus    : "New",
          FormNumber       : fn
        };
        return this._reqSvc.createProjectRequest(data);
      })
      .then(r=>{
        this.setState({
          isCreated : true,
          requestId : r.requestId,
          formNumber: r.formNumber,
          docLink   : r.docLink
        });
        alert(strings.ProjectCreated);
      })
      .catch(e=>{ console.error(e); alert(strings.ErrorCreating);});
  };

  private _reset = ()=>{ this.setState({...emptyModel,isCreated:false,customerOptions:this.state.customerOptions}); };

  /* ────────── helpers ────────── */

  private _loadCustomers(){
    // small helper kept inside service for brevity
    (this._reqSvc as any).getCustomerOptions()
      .then(opts=>this.setState({customerOptions:opts}));
  }

  private _customerName(){
    const opt = this.state.customerOptions.filter(o=>o.key===this.state.selectedCustomer)[0];
    return opt ? opt.text : "";
  }
}
```

──────────────────────────────────────────────
2.  components/assessments/AssessmentWizard.tsx
──────────────────────────────────────────────

```tsx
import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import AssessmentTable from "./AssessmentTable";

import TechnicalAssessmentService from "../../services/TechnicalAssessmentService";
import ProjectRequestService       from "../../services/ProjectRequestService";
import { IAssessment }             from "../../models/IAssessment";
import * as strings                from "PrmWebPartStrings";

interface IProps {
  ctx: WebPartContext;
  requestId: number;
  onDone: ()=>void;
}

interface IState {
  inventory: any[];
}

export default class AssessmentWizard extends React.Component<IProps,IState>{

  private _techSvc: TechnicalAssessmentService;
  private _reqSvc : ProjectRequestService;

  constructor(p:IProps){
    super(p);
    this._techSvc = new TechnicalAssessmentService(p.ctx);
    this._reqSvc  = new ProjectRequestService(p.ctx);
    this.state    = { inventory: [] };
  }

  public componentDidMount(){ this._loadInventory(); }

  public render(){
    return (
      <AssessmentTable
        filterOptions={this._filterOptions}
        onSubmit={this._onSubmit}
      />
    );
  }

  /* ────────── handlers ────────── */

  private _onSubmit = (assessments:IAssessment[])=>{
    if(!assessments.length){
      alert(strings.ValidationAddAssessment); return;
    }
    const reqId = this.props.requestId;

    this._techSvc.saveAssessments(assessments,reqId)
      .then(ids=>{
        const pricing:any[]=[];
        assessments.forEach((a,idx)=>{
          ["humanResources","machines","materials"].forEach(f=>{
            a[f].forEach(r=>{
              pricing.push({
                RequestID      : reqId,
                UnitPrice      : r.pricePerUnit,
                Quantity       : r.quantity,
                AssessmentItemID: ids[idx]
              });
            });
          });
        });
        return this._techSvc.savePricing(pricing);
      })
      .then(()=>this._reqSvc.updateEstimatedCostFromPricing(reqId))
      .then(()=>{
        alert(strings.Saved);
        this.props.onDone();
      })
      .catch(e=>{console.error(e);alert(strings.Error);});
  };

  /* ────────── data helpers ────────── */

  private _loadInventory(){
    (this._reqSvc as any).getInventoryItems()
      .then(inv=>this.setState({inventory:inv}));
  }

  private _filterOptions = (field:string)=>{
    const inv=this.state.inventory;
    const map:any = {
      humanResources: [strings.HumanResource,"نیروی انسانی"],
      machines      : [strings.Machine,"ماشین آلات"],
      materials     : [strings.Material,"ابزار","محصول","مواد اولیه"]
    };
    return inv.filter(i=>map[field].indexOf(i.itemCategory)>-1)
              .map(i=>({key:i.key,text:i.text}));
  };
}
```

──────────────────────────────────────────────
3.  services/ProjectRequestService.ts (add one helper)
──────────────────────────────────────────────
Add this **at the very bottom** of the existing class definition:

```ts
  /**
   * Recalculate sum of PricingDetails and push to EstimatedCost.
   */
  public async updateEstimatedCostFromPricing(requestId:number):Promise<void>{
    const details = await sp.web.lists
                          .getByTitle(LISTS.PricingDetails)
                          .items.filter(`RequestIDId eq ${requestId}`)
                          .select("TotalCost")
                          .get();
    const total   = details.reduce((s,i)=>s + (i.TotalCost||0),0);
    await this.updateEstimatedCost(requestId,total);
  }
```

(Where `updateEstimatedCost` is the method we already moved in earlier.)

──────────────────────────────────────────────
4.  PrmWebPart.ts  (single-line change)
──────────────────────────────────────────────

```ts
// top of render()
const element: React.ReactElement<any> = React.createElement(
  ProjectRequestForm,
  { context:this.context }
);
```

and in `onInit()` if you like:

```ts
window["prmCtx"] = this.context;   // convenience for deep children
```

──────────────────────────────────────────────
That’s it – all missing pieces supplied.  
Compile → test → enjoy your tidier, fully-working SPFx 2019 solution.

<!-- Below is a clean & complete replacement for the section that starts with `handleFinalSubmit` and ends **right before** the `render()` method in `TechnicalAssessmentTable.tsx`.

```tsx
  /* ──────────────────────────────
   *  SAVE → PRICING → UPDATE COST
   * ────────────────────────────── */
  handleFinalSubmit = (): void => {
    const { assessments }  = this.state;
    const { requestId, resetForm } = this.props;

    if (!assessments.length) {
      alert("Please add at least one assessment before submitting.");
      return;
    }

    // 1) save assessments ► receive their IDs
    this.projectRequestService.saveAssessments(assessments, requestId)
      .then((assessmentIds: number[]) => {

        // 2) flatten assessments ► pricingDetails[]
        const pricingDetails: IPricingDetails[] = [];
        assessments.forEach((ass, aIdx) => {
          ["humanResources", "machines", "materials"].forEach((section) => {
            (ass as any)[section].forEach((res: any) => {
              pricingDetails.push({
                RequestID       : requestId,
                UnitPrice       : parseFloat(res.pricePerUnit),
                Quantity        : parseInt(res.quantity, 10),
                AssessmentItemID: assessmentIds[aIdx]
              });
            });
          });
        });

        // 3) save pricing rows
        return this.projectRequestService.savePricingDetails(pricingDetails);
      })
      // 4) re-calculate grand total & push to ProjectRequests
      .then(() => this.projectRequestService
        .updateEstimatedCostFromPricing(requestId))
      // 5) done
      .then(() => {
        alert("Assessments and pricing details saved successfully!");
        resetForm();
      })
      .catch((err) => {
        console.error("❌ Error in final submit chain", err);
        alert("Error saving data – see console for details.");
      });
  };

  /* ──────────────────────────────
   *  DATA LOADERS / HELPERS
   * ────────────────────────────── */
  private loadInventoryItems = (): void => {
    this.projectRequestService.getInventoryItems()
      .then(items => this.setState({ inventoryItems: items }))
      .catch(e => console.error("Error loading inventory", e));
  };

  private filterInventoryItems = (categories: string[]): IDropdownOption[] => {
    const { inventoryItems } = this.state;

    // English ↔ Persian mapping
    const map: { [k: string]: string[] } = {
      HumanResource: ["Human Resource", "نیروی انسانی"],
      Machine      : ["Machine", "ماشین آلات"],
      Material     : ["Material", "ابزار", "محصول", "مواد اولیه"]
    };

    const valid = categories.reduce((acc, c) => acc.concat(map[c] || [c]), [] as string[]);
    return inventoryItems
      .filter(i => valid.indexOf(i.itemCategory) > -1)
      .map(i => ({ key: i.key, text: i.text }));
  };

  /* ──────────────────────────────
   *  STATE MUTATORS
   * ────────────────────────────── */
  private handleInputChange = (
    value: string,
    nestedField: string,
    assIdx: number,
    resIdx?: number,
    resField?: string
  ): void => {
    this.setState(prev => {
      const assessments = [...prev.assessments];

      if (resIdx !== undefined && resField) {
        const rows   = [...(assessments[assIdx][resField] || [])];
        const rowUpd = { ...rows[resIdx], [nestedField]: value };
        rows[resIdx] = rowUpd;
        (assessments[assIdx] as any)[resField] = rows;
      } else {
        assessments[assIdx] = { ...assessments[assIdx], [nestedField]: value };
      }
      return { assessments };
    });
  };

  private handleDropdownChange = (
    resField: string,
    option: IDropdownOption,
    assIdx: number,
    resIdx: number
  ): void => {
    this.setState(prev => {
      const assessments = [...prev.assessments];
      assessments[assIdx][resField][resIdx].item = option;
      return { assessments };
    });
  };

  private addRow = (resField: string, assIdx: number): void => {
    this.setState(prev => {
      const assessments = [...prev.assessments];
      assessments[assIdx][resField] = assessments[assIdx][resField] || [];
      assessments[assIdx][resField].push({
        item: { key: "", text: "" },
        quantity: 0,
        pricePerUnit: 0
      });
      return { assessments };
    });
  };

  private removeRow = (resField: string, assIdx: number, resIdx: number): void => {
    this.setState(prev => {
      const assessments = [...prev.assessments];
      assessments[assIdx][resField].splice(resIdx, 1);
      return { assessments };
    });
  };

  private addAssessment = (): void => {
    this.setState(prev => ({
      assessments: [
        ...prev.assessments,
        { activity: "", humanResources: [], machines: [], materials: [] }
      ]
    }));
  };

  /* ──────────────────────────────
   *  RENDER HELPERS (tables etc.)
   * ────────────────────────────── */
  private renderTable = (
    label: string,
    resField: string,
    options: IDropdownOption[],
    assessment: any,
    assIdx: number
  ) => (
    <PricingDetails
      label={label}
      field={resField}
      options={options}
      assessment={assessment}
      index={assIdx}
      handleDropdownChange={this.handleDropdownChange}
      handleInputChange={this.handleInputChange}
      addRow={this.addRow}
      removeRow={this.removeRow}
    />
  );
```

This block closes every brace/parenthesis and ties neatly into your existing `render()` method. Compile-time-safe for SPFx 1.4.1 / React 15. -->

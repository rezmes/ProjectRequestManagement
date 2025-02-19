// // PrmWebPart.ts
// import * as React from 'react';
// import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';
// import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import * as strings from 'PrmWebPartStrings';
// import ProjectRequestForm from './components/ProjectRequestForm';
// import { sp } from "@pnp/sp";
// import { IProjectRequestFormProps } from './components/IProjectRequestFormProps';


// export interface IPrmWebPartProps {
//   description: string;
// }

// export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {


//   protected onInit(): Promise<void> {
//     sp.setup({
//       spfxContext: this.context
//     });
//     return super.onInit();
//   }

//   public render(): void {
//     const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(ProjectRequestForm, {
//       spHttpClient: this.context.spHttpClient,
//       siteUrl: this.context.pageContext.web.absoluteUrl,

// termSetId: '5863383a-85c5-4fbd-8114-11ef83bf9175',
//       context: this.context,
//     });

//     ReactDom.render(element, this.domElement);
//   }

//   protected onDispose(): void {
//     ReactDom.unmountComponentAtNode(this.domElement);
//   }

//   protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//     return {
//       pages: [
//         {
//           header: {
//             description: strings.PropertyPaneDescription
//           },
//           groups: [
//             {
//               groupName: strings.BasicGroupName,
//               groupFields: [
//                 PropertyPaneTextField('description', {
//                   label: strings.DescriptionFieldLabel
//                 })
//               ]
//             }
//           ]
//         }
//       ]
//     };
//   }
// }

// PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/ProjectRequestForm';
import { sp } from "@pnp/sp";
import { IProjectRequestFormProps, FormMode } from './components/IProjectRequestFormProps';


export interface IPrmWebPartProps {
  description: string;
  formMode: FormMode; // Add formMode property
  itemId: string; // Add itemId property
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {


  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const itemId = this.properties.itemId ? parseInt(this.properties.itemId, 10) : undefined;
    const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(ProjectRequestForm, {
      spHttpClient: this.context.spHttpClient,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      termSetId: '5863383a-85c5-4fbd-8114-11ef83bf9175',
      context: this.context,
      mode: this.properties.formMode || 'Create', // Default to 'Create' mode if not set
      itemId: itemId, // Pass itemId if available
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
                }),
                PropertyPaneTextField('formMode', {
                  label: 'Form Mode (Create/Display/Edit)'
                }),
                PropertyPaneTextField('itemId', {
                  label: 'Item ID (for Edit/Display)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
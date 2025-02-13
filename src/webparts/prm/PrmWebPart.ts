// PrmWebPart.ts
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
// import * as React from 'react';
// import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';
// import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import * as strings from 'PrmWebPartStrings';
// // import ProjectRequestForm from './components/ProjectRequestForm'; // Comment out or remove ProjectRequestForm import
// import DocSet from './components/DocSet'; // **Import the new DocSetTest component**
// import { IDocSetProps } from './components/IDocSetProps';
// import { sp } from "@pnp/sp";
// // import { IProjectRequestFormProps } from './components/IProjectRequestFormProps'; // You can remove this line as it's not used now

// export interface IPrmWebPartProps {
//     description: string;
// }

// export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {


//     protected onInit(): Promise<void> {
//         sp.setup({
//             spfxContext: this.context
//         });
//         return super.onInit();
//     }

//     public render(): void {
//         // **Render DocSetTest instead of ProjectRequestForm**
//         const element: React.ReactElement<IDocSetProps> = React.createElement(DocSet, {
//             context: this.context,
//         });

//         ReactDom.render(element, this.domElement);
//     }

//     protected onDispose(): void {
//         ReactDom.unmountComponentAtNode(this.domElement);
//     }

//     protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//         return {
//             pages: [
//                 {
//                     header: {
//                         description: strings.PropertyPaneDescription
//                     },
//                     groups: [
//                         {
//                             groupName: strings.BasicGroupName,
//                             groupFields: [
//                                 PropertyPaneTextField('description', {
//                                     label: strings.DescriptionFieldLabel
//                                 })
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         };
//     }
// }
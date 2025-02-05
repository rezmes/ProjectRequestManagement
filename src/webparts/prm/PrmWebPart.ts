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
// import { Version } from '@microsoft/sp-core-library';
// import {
//   IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-webpart-base';
// import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

// import * as React from 'react';
// import * as ReactDom from 'react-dom';
// import RepeatingBlock from './components/RepeatingBlock';
// import { IRepeatingBlockProps } from './components/IRepeatingBlockProps';

// export interface IRepeatingBlockWebPartProps {
//   description: string;
// }

// export default class RepeatingBlockWebPart extends BaseClientSideWebPart<IRepeatingBlockWebPartProps> {

//   public render(): void {
//     const element: React.ReactElement<IRepeatingBlockProps> = React.createElement(
//       RepeatingBlock,
//       {
//         description: this.properties.description
//       }
//     );

//     ReactDom.render(element, this.domElement);
//   }

//   protected onDispose(): void {
//     ReactDom.unmountComponentAtNode(this.domElement);
//   }

//   // protected get dataVersion(): Version {
//   //   return Version.parse('1.0');
//   // }

//   protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//     return {
//       pages: [
//         {
//           header: {
//             description: "Repeating Block Web Part"
//           },
//           groups: [
//             {
//               groupName: "Configuration",
//               groupFields: [
//                 PropertyPaneTextField('description', {
//                   label: "Description"
//                 })
//               ]
//             }
//           ]
//         }
//       ]
//     };
//   }
// }

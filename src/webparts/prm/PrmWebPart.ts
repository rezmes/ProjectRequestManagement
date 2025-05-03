// src\webparts\prm\PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/forms/ProjectRequestsForm/ProjectRequestForm';
import { sp } from "@pnp/sp";
import { IProjectRequestFormProps } from './components/IProjectRequestFormProps';


export interface IPrmWebPartProps {
  description: string;
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {


  protected onInit(): Promise<void> {
    window["prmCtx"] = this.context;   // convenience for deep children
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }
// Removed invalid class member declaration. The element creation is handled in the render() method below.
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


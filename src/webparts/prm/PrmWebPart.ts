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
      siteUrl: this.context.pageContext.web.absoluteUrl
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

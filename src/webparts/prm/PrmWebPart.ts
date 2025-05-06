// src/webparts/prm/PrmWebPart.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import * as strings from 'PrmWebPartStrings';
import ProjectRequestForm from './components/ProjectRequestForm';
import { IProjectRequestFormProps, FormMode } from './components/IProjectRequestFormProps';
import { sp } from "@pnp/sp";

export interface IPrmWebPartProps {
  description: string;
  formMode: string;
  itemId: string;
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

// In PrmWebPart.ts, modify the render method:
public render(): void {
  // Determine the form mode from properties or default to Create
  let formMode = FormMode.Create;
  if (this.properties.formMode) {
    if (this.properties.formMode === "Edit") {
      formMode = FormMode.Edit;
    } else if (this.properties.formMode === "View") {
      formMode = FormMode.View;
    }
  }

  // Try to get itemId from properties or URL query string
  let itemId: number | undefined = undefined;

  // First check properties
  if (this.properties.itemId) {
    itemId = parseInt(this.properties.itemId);
  }
  // Then check URL query string
  else {
    const urlParams = new URLSearchParams(window.location.search);
    const itemIdParam = urlParams.get('itemId');
    if (itemIdParam) {
      itemId = parseInt(itemIdParam);
    }
  }

  const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(
    ProjectRequestForm,
    {
      context: this.context,
      mode: formMode,
      itemId: itemId
    }
  );

  ReactDom.render(element, this.domElement);
}


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore: Inherited property with different implementation
  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                PropertyPaneDropdown('formMode', {
                  label: strings.FormModeFieldLabel,
                  options: [
                    { key: 'Create', text: strings.FormModeCreate },
                    { key: 'Edit', text: strings.FormModeEdit },
                    { key: 'View', text: strings.FormModeView }
                  ]
                }),
                PropertyPaneTextField('itemId', {
                  label: strings.ItemIdFieldLabel,
                  description: strings.ItemIdFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

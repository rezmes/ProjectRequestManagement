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

  public render(): void {
    // Determine the form mode
    let formMode = FormMode.Create; // Default to Create mode
    if (this.properties.formMode) {
      if (this.properties.formMode === "Edit") {
        formMode = FormMode.Edit;
      } else if (this.properties.formMode === "View") {
        formMode = FormMode.View;
      }
    }

    // Get the item ID if in Edit or View mode
    let itemId: number | undefined = undefined;
    if (this.properties.itemId && (formMode === FormMode.Edit || formMode === FormMode.View)) {
      itemId = parseInt(this.properties.itemId);
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

  protected getDataVersion(): Version {
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

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
// src/webparts/prm/PrmWebPart.ts
import ProjectListView, { IProjectListViewProps } from './components/ProjectListView';


export interface IPrmWebPartProps {
  description: string;
  formMode: string;
  itemId: string;
  currentView: string; // 'list' or 'form'
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
    // Determine what to render based on currentView property
    const currentView = this.properties.currentView || 'list';

    if (currentView === 'list') {
      // Render the list view
      const element: React.ReactElement<IProjectListViewProps> = React.createElement(
        ProjectListView,
        {
          context: this.context,
          onCreateNew: () => {
            // Switch to form view in Create mode
            this.properties.currentView = 'form';
            this.properties.formMode = 'Create';
            this.properties.itemId = '';
            this.render();
          },
          onSelectItem: (itemId: number, mode: string) => {
            // Switch to form view in the selected mode
            this.properties.currentView = 'form';
            this.properties.formMode = mode;
            this.properties.itemId = itemId.toString();
            this.render();
          }
        }
      );

      ReactDom.render(element, this.domElement);
    } else {
      // Render the form view (existing code)
      let formMode = FormMode.Create;
      if (this.properties.formMode) {
        if (this.properties.formMode === "Edit") {
          formMode = FormMode.Edit;
        } else if (this.properties.formMode === "View") {
          formMode = FormMode.View;
        }
      }

      let itemId: number = undefined;
      if (this.properties.itemId) {
        itemId = parseInt(this.properties.itemId);
      }

      const element: React.ReactElement<IProjectRequestFormProps> = React.createElement(
        ProjectRequestForm,
        {
          context: this.context,
          mode: formMode,
          itemId: itemId,
          onBack: () => {
            // Switch back to list view
            this.properties.currentView = 'list';
            this.render();
          }
        }
      );

      ReactDom.render(element, this.domElement);
    }
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

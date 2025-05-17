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
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export interface IPrmWebPartProps {
  description: string;
  formMode: string;
  itemId: string;
  currentView: string; // 'list' or 'form'
  commercialGroupName: string; // Add this property
}

export default class PrmWebPart extends BaseClientSideWebPart<IPrmWebPartProps> {
  private isCommercialDept: boolean = false;

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    // Set a default value for commercialGroupName if not provided
    if (!this.properties.commercialGroupName) {
      this.properties.commercialGroupName = "Commercial Department";
    }
      // Check if user is in Commercial Department
      return this.checkUserDepartment().then(isCommercial => {
        this.isCommercialDept = isCommercial;
      });
    });
  }



private checkUserDepartment(): Promise<boolean> {
  const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentUser/groups`;

  return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then((data: any) => {
      // Log the raw response for debugging
      // console.log("Raw API response:", data);

      let groups: any[];
      if (data && data.d && data.d.results) {
        // Handle odata=verbose
        groups = data.d.results;
      } else if (data && data.value) {
        // Handle odata=minimalmetadata
        groups = data.value;
      } else if (Array.isArray(data)) {
        // Handle odata=nometadata (direct array)
        groups = data;
      } else {
        // Handle unexpected or empty response
        console.error("Unexpected or empty response structure:", data);
        return false;
      }

      // console.log("Retrieved user groups (Web Part):", groups);
      // console.log("Expected commercial group (Web Part):", this.properties.commercialGroupName);

      for (let i = 0; i < groups.length; i++) {
        if (!groups[i] || !groups[i].Title) {
          console.warn("Group at index", i, "is missing or has no Title:", groups[i]);
          continue;
        }
        // console.log(
        //   `Comparing group title '${groups[i].Title}' with expected '${this.properties.commercialGroupName}'`
        // );
        if (groups[i].Title.toLowerCase().trim() === this.properties.commercialGroupName.toLowerCase().trim()) {
          console.log("Match found (Web Part):", groups[i].Title);
          return true;
        }
      }
      console.log("No matching group found (Web Part).");
      return false;
    })
    .catch((error) => {
      console.error("Group check failed (Web Part):", error);
      return false;
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
          },
          isCommercialDept: this.isCommercialDept // Pass the department flag
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
          },
          isCommercialDept: this.isCommercialDept, // Pass the department flag
          commercialGroupName: this.properties.commercialGroupName
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
                PropertyPaneTextField('commercialGroupName', {
                  label: 'Commercial Department Group Name',
                  description: 'Enter the name of the SharePoint group that has access to pricing information',
                  value: this.properties.commercialGroupName || 'Commercial Department'
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

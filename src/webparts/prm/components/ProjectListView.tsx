// src/webparts/prm/components/ProjectListView.tsx
import * as React from "react";
import { sp } from "@pnp/sp";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from "office-ui-fabric-react/lib/DetailsList";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import GenericDropdown from "./GenericDropdown"; // Use your custom dropdown
import styles from "./ProjectListView.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IProjectListViewProps {
  context: any;
  onCreateNew: () => void;
  onSelectItem: (itemId: number, mode: string) => void;
}

export interface IProjectListViewState {
  items: any[];
  isLoading: boolean;
  statusFilter: string;
  userDepartment: string;
  isCommercialDept: boolean;
}

export class ProjectListView extends React.Component<
  IProjectListViewProps,
  IProjectListViewState
> {
  constructor(props: IProjectListViewProps) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      statusFilter: "All",
      userDepartment: "",
      isCommercialDept: false,
    };

    // Bind methods
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  public componentDidMount(): void {
    this.getCurrentUserInfo();
    this.loadProjects();
  }

  // src/webparts/prm/components/ProjectListView.tsx
  private getCurrentUserInfo(): void {
    // Get user info directly from the context
    const currentUser = this.props.context.pageContext.user;

    // For demo purposes, we'll just assume the user is in the Commercial Department
    // In a production environment, you would check actual group membership
    this.setState({
      userDepartment: "Commercial Department", // Simplified for demo
      isCommercialDept: true, // Simplified for demo - set to true to show all buttons
    });

    // Note: In a real implementation, you would check group membership using the SharePoint REST API
    // Example of how you might do this (commented out for now):
    /*
  const endpoint = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;

  this.props.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
    .then(response => response.json())
    .then(data => {
      let isCommercial = false;
      if (data && data.value) {
        for (let i = 0; i < data.value.length; i++) {
          if (data.value[i].Title === "Commercial Department") {
            isCommercial = true;
            break;
          }
        }
      }

      this.setState({
        userDepartment: isCommercial ? "Commercial Department" : "Other Department",
        isCommercialDept: isCommercial
      });
    })
    .catch(error => {
      console.error('Error checking group membership:', error);
      this.setState({
        userDepartment: "Unknown Department",
        isCommercialDept: false
      });
    });
  */
  }

  private loadProjects(): void {
    const { statusFilter } = this.state;

    let query = sp.web.lists
      .getByTitle("ProjectRequests")
      .items.select(
        "Id,Title,RequestDate,RequestStatus,FormNumber,EstimatedCost"
      );

    // Apply filters based on status
    if (statusFilter !== "All") {
      query = query.filter(`RequestStatus eq '${statusFilter}'`);
    }

    query
      .get()
      .then((items) => {
        this.setState({
          items,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        this.setState({ isLoading: false });
      });
  }

  private getColumns(): IColumn[] {
    return [
      {
        key: "title",
        name: strings.Title,
        fieldName: "Title",
        minWidth: 100,
        isResizable: true,
      },
      {
        key: "formNumber",
        name: strings.FormNumber,
        fieldName: "FormNumber",
        minWidth: 70,
        isResizable: true,
      },
      {
        key: "requestDate",
        name: strings.RequestDate,
        fieldName: "RequestDate",
        minWidth: 90,
        isResizable: true,
        onRender: (item) => (
          <span>{new Date(item.RequestDate).toLocaleDateString()}</span>
        ),
      },
      {
        key: "status",
        name: strings.Status,
        fieldName: "RequestStatus",
        minWidth: 90,
        isResizable: true,
      },
      {
        key: "actions",
        name: strings.Actions,
        fieldName: "actions",
        minWidth: 150,
        isResizable: true,
        onRender: (item) => this.renderActionButtons(item),
      },
    ];
  }

  private renderActionButtons(item: any): JSX.Element {
    const { isCommercialDept } = this.state;
    const isApproved = item.RequestStatus === "Approved";

    return (
      <div className={styles.actionButtons}>
        <DefaultButton
          text={strings.View}
          onClick={this.handleViewClick.bind(this, item.Id)}
          className={styles.actionButton}
        />

        {!isApproved &&
          (isCommercialDept ||
            item.Department === this.state.userDepartment) && (
            <PrimaryButton
              text={strings.Edit}
              onClick={this.handleEditClick.bind(this, item.Id)}
              className={styles.actionButton}
            />
          )}
      </div>
    );
  }

  private handleViewClick(itemId: number): void {
    this.props.onSelectItem(itemId, "View");
  }

  private handleEditClick(itemId: number): void {
    this.props.onSelectItem(itemId, "Edit");
  }

  private handleStatusFilterChange(option: any): void {
    this.setState({ statusFilter: option.key }, () => {
      this.loadProjects();
    });
  }

  private renderFilters(): JSX.Element {
    const statusOptions = [
      { key: "All", text: strings.AllStatuses },
      { key: "New", text: strings.StatusNew },
      { key: "In Review", text: strings.StatusInReview },
      { key: "Approved", text: strings.StatusApproved },
      { key: "Rejected", text: strings.StatusRejected },
    ];

    return (
      <div className={styles.filtersContainer}>
        <div>
          <GenericDropdown
            label={strings.FilterByStatus}
            options={statusOptions}
            selectedKey={this.state.statusFilter}
            onChanged={this.handleStatusFilterChange}
            placeHolder={strings.SelectStatus}
          />
        </div>

        {this.state.isCommercialDept && (
          <PrimaryButton
            text={strings.CreateNewRequest}
            onClick={this.props.onCreateNew}
            className={styles.newButton}
          />
        )}
      </div>
    );
  }

  public render(): React.ReactElement<IProjectListViewProps> {
    const { items, isLoading } = this.state;

    if (isLoading) {
      return <div>{strings.LoadingProjects}</div>;
    }

    return (
      <div className={styles.projectListView}>
        <h2>{strings.ProjectRequests}</h2>

        {this.renderFilters()}

        <DetailsList
          items={items}
          columns={this.getColumns()}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      </div>
    );
  }
}

export default ProjectListView;

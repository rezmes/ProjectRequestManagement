import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAssessment } from "../components/ITechnicalAssessmentState";

interface ISaveAssessment {
  Activity: string;
  HumanResourcesId: { results: (string | number)[] };
  MachinesId: { results: (string | number)[] };
  MaterialsId: { results: (string | number)[] };
  // Other fields as needed
}

// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<any[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists.getByTitle("ProjectRequests").items.add(requestData);
  }

  public getTechnicalAssessments(requestId: number): Promise<IAssessment[]> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.filter(`RequestID eq ${requestId}`)
      .expand("HumanResources", "Machines", "Materials")
      .select(
        "Activity",
        "HumanResources/Id",
        "HumanResources/Title",
        "Machines/Id",
        "Machines/Title",
        "Materials/Id",
        "Materials/Title"
      )
      .get()
      .then((data) =>
        data.map((item) => ({
          activity: item.Activity,
          humanResources: item.HumanResources
            ? item.HumanResources.map((hr) => ({ key: hr.Id, text: hr.Title }))
            : [],
          machines: item.Machines
            ? item.Machines.map((machine) => ({
                key: machine.Id,
                text: machine.Title,
              }))
            : [],
          materials: item.Materials
            ? item.Materials.map((material) => ({
                key: material.Id,
                text: material.Title,
              }))
            : [],
        }))
      );
  }

  public getDepartmentOptions(): Promise<any[]> {
    return sp.web.lists
      .getByTitle("Departments")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public getInventoryItems(): Promise<IDropdownOptionWithCategory[]> {
    return sp.web.lists
      .getByTitle("InventoryItems")
      .items.select("Id", "Title", "ItemCategory")
      .get()
      .then((data) =>
        data.map((item) => ({
          key: item.Id,
          text: item.Title,
          itemCategory: item.ItemCategory, // Assumes ItemCategory is a text field
        }))
      );
  }
  public saveAssessments(
    assessments: IAssessment[],
    requestId: number
  ): Promise<void> {
    const batch = sp.web.createBatch();

    assessments.forEach((assessment) => {
      const data = {
        Title: assessment.activity,
        RequestID: requestId,
        HumanResourcesId: {
          results: assessment.humanResources.map((hr) => hr.key),
        },
        MachinesId: {
          results: assessment.machines.map((machine) => machine.key),
        },
        MaterialsId: {
          results: assessment.materials.map((material) => material.key),
        },
        // Include other necessary fields
      };
      // Add to batch
      sp.web.lists
        .getByTitle("TechnicalAssessments")
        .items.inBatch(batch)
        .add(data);
    });

    return batch
      .execute()
      .then(() => {
        console.log("Assessments saved successfully");
      })
      .catch((error) => {
        console.error("Error saving assessments", error);
        throw error;
      });
  }
}

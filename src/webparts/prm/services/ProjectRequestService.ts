import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAssessment } from "../components/ITechnicalAssessmentState";

interface ISaveAssessment {
  Activity: string;
  HumanResourceId: { results: (string | number)[] };
  MachineId: { results: (string | number)[] };
  MaterialId: { results: (string | number)[] };
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
    return sp.web.lists.getByTitle("ProjectRequests").items.add(requestData)
      .then((result) => {
        console.log("Create Response:", result); // Log the entire result
        return result.data; // Ensure you're accessing the correct property
      })
      .catch((error) => {
        console.error("Create Error:", error);
        throw error;
      });
  }


  public getTechnicalAssessments(requestId: number): Promise<IAssessment[]> {
    return sp.web.lists
      .getByTitle("TechnicalAssessments")
      .items.filter(`RequestID eq ${requestId}`)
      .expand("HumanResource", "Machine", "Material")
      .select(
        "Activity",
        "HumanResource/Id",
        "HumanResource/Title",
        "Machine/Id",
        "Machine/Title",
        "Material/Id",
        "Material/Title"
      )
      .get()
      .then((data) =>
        data.map((item) => ({
          activity: item.Activity,
          humanResource: item.HumanResource
            ? item.HumanResource.map((hr) => ({ key: hr.Id, text: hr.Title }))
            : [],
          machine: item.Machine
            ? item.Machine.map((machine) => ({
                key: machine.Id,
                text: machine.Title,
              }))
            : [],
          material: item.Material
            ? item.Material.map((material) => ({
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
  // public saveAssessments(
  //   assessments: IAssessment[],
  //   requestId: number
  // ): Promise<void> {
  //   const batch = sp.web.createBatch();

  //   assessments.forEach((assessment) => {
  //     // const data = {
  //     //   Title: assessment.activity,
  //     //   RequestID: requestId,
  //     //   HumanResourceId: {
  //     //     results: assessment.humanResource.map((hr) => hr.key),
  //     //   },
  //     //   MachineId: {
  //     //     results: assessment.machine.map((machine) => machine.key),
  //     //   },
  //     //   MaterialId: {
  //     //     results: assessment.material.map((material) => material.key),
  //     //   },
  //     const data = {
  //       Title: assessment.activity,
  //       RequestIDId: requestId,
  //       HumanResourceId: assessment.humanResource.key, // Single number
  //       MachineId: assessment.machine.key,             // Single number
  //       MaterialId: assessment.material.key,           // Single number
  //       // Include other necessary fields
  //     };


  //     // Add to batch
  //     sp.web.lists
  //       .getByTitle("TechnicalAssessments")
  //       .items.inBatch(batch)
  //       .add(data);
  //   });

  //   return batch
  //     .execute()
  //     .then(() => {
  //       console.log("Assessments saved successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error saving assessments", error);
  //       throw error;
  //     });
  // }
  public saveAssessments(
    assessments: IAssessment[],
    requestId: number
  ): Promise<void> {
    const batch = sp.web.createBatch();

    assessments.forEach((assessment) => {
      const data = {
        Title: assessment.activity,
        RequestIDId: requestId,
        HumanResourceId: assessment.humanResource ? assessment.humanResource.key : null,
        MachineId: assessment.machine ? assessment.machine.key : null,
        MaterialId: assessment.material ? assessment.material.key : null,
        // Include other necessary fields
      };
      console.log("Data to add:", data);
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

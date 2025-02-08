// // ProjectRequestService.ts
// import { sp } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";
// import { IAssessment } from "../components/IAssessment";
// import { IDropdownOption } from "office-ui-fabric-react";

// // Define an interface for inventory items with category
// export interface IDropdownOptionWithCategory {
//   key: string | number;
//   text: string;
//   itemCategory: string;
// }

// export default class ProjectRequestService {
//   public getCustomerOptions(): Promise<IDropdownOption[]> {
//     return sp.web.lists
//       .getByTitle("Customer")
//       .items.get()
//       .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
//   }

//   public createProjectRequest(requestData: any): Promise<any> {
//     return sp.web.lists
//       .getByTitle("ProjectRequests")
//       .items.add(requestData)
//       .then((result) => {
//         console.log("Create Response:", result);
//         return result.data;
//       })
//       .catch((error) => {
//         console.error("Create Error:", error);
//         throw error;
//       });
//   }

//   public getInventoryItems(): Promise<IDropdownOptionWithCategory[]> {
//     return sp.web.lists
//       .getByTitle("InventoryItems")
//       .items.select("Id", "Title", "ItemCategory")
//       .get()
//       .then((data) =>
//         data.map((item) => ({
//           key: item.Id,
//           text: item.Title,
//           itemCategory: item.ItemCategory,
//         }))
//       );
//   }

//   public saveAssessments(
//     assessments: IAssessment[],
//     requestId: number
//   ): Promise<void> {
//     const batch = sp.web.createBatch();

//     assessments.forEach((assessment) => {
//       const data = {
//         Title: assessment.activity || "No Activity",
//         RequestIDId: requestId,
//         HumanResourceId: assessment.humanResource
//           ? assessment.humanResource.key
//           : null,
//         MachineId: assessment.machine ? assessment.machine.key : null,
//         MaterialId: assessment.material ? assessment.material.key : null,
//         // Include other necessary fields
//       };
//       console.log("Data to add:", data);
//       sp.web.lists
//         .getByTitle("TechnicalAssessments")
//         .items.inBatch(batch)
//         .add(data);
//     });

//     return batch
//       .execute()
//       .then(() => {
//         console.log("Assessments saved successfully");
//       })
//       .catch((error) => {
//         console.error("Error saving assessments", error);
//         throw error;
//       });
//   }
// }
// ProjectRequestService.ts
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAssessment, IResource } from "../components/IAssessment";
import { IDropdownOption } from "office-ui-fabric-react";

// Define an interface for inventory items with category
export interface IDropdownOptionWithCategory {
  key: string | number;
  text: string;
  itemCategory: string;
}

export default class ProjectRequestService {
  public getCustomerOptions(): Promise<IDropdownOption[]> {
    return sp.web.lists
      .getByTitle("Customer")
      .items.get()
      .then((data) => data.map((item) => ({ key: item.Id, text: item.Title })));
  }

  public createProjectRequest(requestData: any): Promise<any> {
    return sp.web.lists
      .getByTitle("ProjectRequests")
      .items.add(requestData)
      .then((result) => {
        console.log("Create Response:", result);
        return result.data;
      })
      .catch((error) => {
        console.error("Create Error:", error);
        throw error;
      });
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
          itemCategory: item.ItemCategory,
        }))
      );
  }

  public saveAssessments(
    assessments: IAssessment[],
    requestId: number
  ): Promise<void> {
    const batch = sp.web.createBatch();

    assessments.forEach((assessment) => {
      const createData = (resource: IResource, type: string) => ({
        Title: assessment.activity || "No Activity",
        RequestIDId: requestId,
        [`${type}Id`]: resource.item ? resource.item.key : null,
        [`${type}Quantity`]: resource.quantity,
      });

      assessment.humanResources.forEach((resource) =>
        sp.web.lists
          .getByTitle("TechnicalAssessments")
          .items.inBatch(batch)
          .add(createData(resource, "HumanResource"))
      );

      assessment.machines.forEach((resource) =>
        sp.web.lists
          .getByTitle("TechnicalAssessments")
          .items.inBatch(batch)
          .add(createData(resource, "Machine"))
      );

      assessment.materials.forEach((resource) =>
        sp.web.lists
          .getByTitle("TechnicalAssessments")
          .items.inBatch(batch)
          .add(createData(resource, "Material"))
      );
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

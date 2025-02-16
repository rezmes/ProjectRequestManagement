// import * as React from "react";
// import ProjectRequestService from "../services/ProjectRequestService"; // ✅ Corrected import path
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { Button, PrimaryButton } from "office-ui-fabric-react/lib/Button";

// export interface IDocSetProps {
//   context: WebPartContext;
// }

// interface IDocSetState {
//   message: string;
// }

// class DocSet extends React.Component<IDocSetProps, IDocSetState> {
//   private projectRequestService: ProjectRequestService;

//   constructor(props: IDocSetProps) {
//     super(props);
//     this.state = {
//       message: "",
//     };
//     this.projectRequestService = new ProjectRequestService(this.props.context);
//   }

//   private handleCreateDocumentSet = async () => {
//     this.setState({ message: "Creating Document Set..." }); // Update message

//     try {
//       // **Simplified Document Set Name for testing**
//       const documentSetName = "Test-DocSet-Simple-" + new Date().getTime(); // Unique name
//       const libraryName = "RelatedDocuments"; // **Ensure this is your library name**

//       const documentSetInfo =
//         await this.projectRequestService.createDocumentSet("TEST2");

//       this.setState({
//         message: `Document Set created successfully! URL: ${documentSetInfo.url}`, // Success message
//       });
//       console.log("Document Set created at:", documentSetInfo.url);
//     } catch (error) {
//       this.setState({
//         message: `❌ Error creating Document Set: ${error}`, // Error message
//       });
//       console.error("Fatal error creating Document Set:", error);
//     }
//   };

//   public render(): React.ReactElement<IDocSetProps> {
//     return (
//       <div>
//         <div>
//           <PrimaryButton
//             text="Create Document Set (Test)"
//             onClick={this.handleCreateDocumentSet}
//             // allowDisabledFocus={true} // ✅ Removed allowDisabledFocus - to fix error
//           />
//         </div>
//         <div>
//           <p>{this.state.message}</p> {/* Display status message */}
//         </div>
//       </div>
//     );
//   }
// }

// export default DocSet;

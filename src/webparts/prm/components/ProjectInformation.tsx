// // A CLOUD
// // src/webparts/prm/components/ProjectInformation.tsx
// import * as React from "react";
// import { Link, Icon } from "office-ui-fabric-react";
// import styles from "./ProjectRequestForm.module.scss";
// import * as strings from "PrmWebPartStrings";

// export interface IProjectInformationProps {
//   requestId: number;
//   formNumber: number;
//   requestTitle: string;
//   selectedCustomerName: string;
//   requestDate: string;
//   requestNote: string;
//   documentSetLink: { url: string; text: string } | null;
// }

// const ProjectInformation: React.FC<IProjectInformationProps> = (props) => {
//   const {
//     requestId,
//     formNumber,
//     requestTitle,
//     selectedCustomerName,
//     requestDate,
//     requestNote,
//     documentSetLink,
//   } = props;

//   return (
//     <div>
//       <h3>{strings.ProjectInformation}</h3>
//       <p>
//         <strong>{strings.ProjectID}:</strong> {requestId}
//       </p>
//       <p>
//         <strong>{strings.FormNumber}:</strong> {formNumber}
//       </p>
//       <p>
//         <strong>{strings.Title}:</strong> {requestTitle}
//       </p>
//       <p>
//         <strong>{strings.CustomerName}:</strong> {selectedCustomerName}
//       </p>
//       <p>
//         <strong>{strings.RequestDate}:</strong> {requestDate}
//       </p>
//       <p>
//         <strong>{strings.RequestNote}:</strong> {requestNote}
//       </p>

//       {documentSetLink && (
//         <div className={styles.docSetLink}>
//           <Icon iconName="OpenFolderHorizontal" />
//           <Link href={documentSetLink.url} target="_blank">
//             {documentSetLink.text}
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectInformation;

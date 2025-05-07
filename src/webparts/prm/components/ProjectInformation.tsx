// src/webparts/prm/components/ProjectInformation.tsx
import * as React from "react";
import {
  Link,
  Icon,
  DocumentCard,
  DocumentCardTitle,
} from "office-ui-fabric-react";
import styles from "./ProjectRequestForm.module.scss";
import * as strings from "PrmWebPartStrings";

export interface IProjectInformationProps {
  requestId: number;
  formNumber: number;
  requestTitle: string;
  selectedCustomerName: string;
  requestDate: string;
  requestNote: string;
  documentSetLink: { url: string; text: string } | null;
}

export class ProjectInformation extends React.Component<
  IProjectInformationProps,
  {}
> {
  public render(): React.ReactElement<IProjectInformationProps> {
    const {
      requestId,
      formNumber,
      requestTitle,
      selectedCustomerName,
      requestDate,
      requestNote,
      documentSetLink,
    } = this.props;

    return (
      <DocumentCard className={styles.infoCard}>
        <DocumentCardTitle title={strings.ProjectInformation} />
        <div className={styles.cardContent}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.ProjectID}:</div>
              <div className={styles.infoValue}>{requestId}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.FormNumber}:</div>
              <div className={styles.infoValue}>{formNumber}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.Title}:</div>
              <div className={styles.infoValue}>{requestTitle}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.CustomerName}:</div>
              <div className={styles.infoValue}>{selectedCustomerName}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.RequestDate}:</div>
              <div className={styles.infoValue}>{requestDate}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{strings.RequestNote}:</div>
              <div className={styles.infoValue}>
                <div dangerouslySetInnerHTML={{ __html: requestNote }} />
              </div>
            </div>
          </div>

          {documentSetLink && (
            <div className={styles.docSetLink}>
              <Icon iconName="OpenFolderHorizontal" />
              <Link href={documentSetLink.url} target="_blank">
                {documentSetLink.text}
              </Link>
            </div>
          )}
        </div>
      </DocumentCard>
    );
  }
}

export default ProjectInformation;

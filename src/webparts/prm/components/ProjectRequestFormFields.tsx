// src/webparts/prm/components/ProjectRequestFormFields.tsx (corrected)
import * as React from "react";
import { TextField, IDropdownOption } from "office-ui-fabric-react";
import GenericDropdown from "./GenericDropdown";
import ManagedMetadataPicker from "./ManagedMetadataPicker";
import * as strings from "PrmWebPartStrings";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "./ProjectRequestFormFields.module.scss";

export interface IProjectRequestFormFieldsProps {
  requestTitle: string;
  selectedCustomer: string | number | null;
  requestDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requestNote: string;
  customerOptions: IDropdownOption[];
  onInputChange: (newValue: string, field: string) => void;
  onDropdownChange: (option?: IDropdownOption) => void;
  onTermSelected: (term: { id: string; label: string }) => void;
  context: WebPartContext;
  isReadOnly: boolean;
}

export class ProjectRequestFormFields extends React.Component<
  IProjectRequestFormFieldsProps,
  {}
> {
  public render(): React.ReactElement<IProjectRequestFormFieldsProps> {
    const {
      requestTitle,
      selectedCustomer,
      requestDate,
      estimatedDuration,
      estimatedCost,
      requestNote,
      customerOptions,
      onInputChange,
      onDropdownChange,
      onTermSelected,
      context,
      isReadOnly,
    } = this.props;

    // Find the selected customer text using a traditional loop
    let selectedCustomerText = "";
    for (let i = 0; i < customerOptions.length; i++) {
      if (customerOptions[i].key === selectedCustomer) {
        selectedCustomerText = customerOptions[i].text;
        break;
      }
    }

    return (
      <div>
        {isReadOnly ? (
          <div className={styles.readOnlyForm}>
            <div className={styles.formSection}>
              <div className={styles.formRow}>
                <div className={styles.formLabel}>{strings.RequestTitle}:</div>
                <div className={styles.formValue}>{requestTitle}</div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>{strings.Customer}:</div>
                <div className={styles.formValue}>{selectedCustomerText}</div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>{strings.RequestDate}:</div>
                <div className={styles.formValue}>{requestDate}</div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  {strings.EstimatedDuration}:
                </div>
                <div className={styles.formValue}>{estimatedDuration}</div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>{strings.EstimatedCost}:</div>
                <div className={styles.formValue}>{estimatedCost}</div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>{strings.RequestNote}:</div>
                <div className={styles.formValue}>
                  <div dangerouslySetInnerHTML={{ __html: requestNote }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // For edit mode
          <div className={styles.editForm}>
            <div className={styles.formField}>
              <TextField
                label={strings.RequestTitle}
                value={requestTitle}
                onChanged={(newValue) =>
                  onInputChange(newValue || "", "requestTitle")
                }
                required={true}
              />
            </div>

            <div className={styles.formField}>
              <ManagedMetadataPicker
                label={strings.ProjectCodeLabel}
                onTermSelected={onTermSelected}
                context={context}
                placeHolder="Select Project Code"
              />
            </div>

            <div className={styles.formField}>
              <GenericDropdown
                label={strings.Customer}
                options={customerOptions}
                selectedKey={selectedCustomer}
                onChanged={onDropdownChange}
                placeHolder={strings.SelectCustomer}
                required={true}
              />
            </div>

            <div className={styles.formField}>
              <TextField
                label={strings.RequestDate}
                value={requestDate}
                onChanged={(newValue) =>
                  onInputChange(newValue || "", "requestDate")
                }
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formFieldHalf}>
                <TextField
                  label={strings.EstimatedDuration}
                  value={estimatedDuration.toString()}
                  onChanged={(newValue) =>
                    onInputChange(newValue || "0", "estimatedDuration")
                  }
                  type="number"
                />
              </div>

              <div className={styles.formFieldHalf}>
                <TextField
                  label={strings.EstimatedCost}
                  value={estimatedCost.toString()}
                  onChanged={(newValue) =>
                    onInputChange(newValue || "0", "estimatedCost")
                  }
                  type="number"
                />
              </div>
            </div>

            <div className={styles.formField}>
              <TextField
                label={strings.RequestNote}
                value={requestNote}
                onChanged={(newValue) =>
                  onInputChange(newValue || "", "requestNote")
                }
                multiline
                rows={4}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProjectRequestFormFields;

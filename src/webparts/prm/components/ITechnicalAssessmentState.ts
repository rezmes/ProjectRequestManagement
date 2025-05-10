// src\webparts\prm\components\ITechnicalAssessmentState.ts
import { IAssessment } from './IAssessment';
import { IDropdownOptionWithCategory } from "../services/ProjectRequestService";

export interface ITechnicalAssessmentState {
  assessments: IAssessment[];
  inventoryItems: IDropdownOptionWithCategory[];
  isSubmitting?: boolean; // Add this line
  isCommercialDept?: boolean; // Add this
  isCheckingPermissions?: boolean; // Add this
}

// src/webparts/prm/components/ITechnicalAssessmentProps.ts (updated)
export interface ITechnicalAssessmentProps {
  projectRequestService: any;
  requestId: number;
  resetForm: () => void;
  isReadOnly?: boolean;
}

export interface ITechnicalAssessmentState {
  assessments: Array<{
    title: string;
    department: string;
    manHours: number;
    materials: string;
    machinery: string;
    dependencies: string;
    specialConsiderations: string;
  }>;
}

// ITechnicalAssessmentState.ts
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
  newAssessment: {
    title: string;
    department: string;
    manHours: number;
    materials: string;
    machinery: string;
    dependencies: string;
    specialConsiderations: string;
  };
  departmentOptions: Array<{
    key: string | number;
    text: string;
  }>;
}

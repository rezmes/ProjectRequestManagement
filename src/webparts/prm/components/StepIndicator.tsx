// // A CLOUD
// // src/webparts/prm/components/StepIndicator.tsx
// import * as React from "react";
// import { ProgressIndicator } from "office-ui-fabric-react";
// import styles from "./StepIndicator.module.scss";

// export interface IStepIndicatorProps {
//   currentStep: number;
//   totalSteps: number;
//   stepLabels: string[];
// }

// const StepIndicator: React.FC<IStepIndicatorProps> = (props) => {
//   const { currentStep, totalSteps, stepLabels } = props;

//   // Calculate progress percentage
//   const progressPercentage = (currentStep - 1) / (totalSteps - 1);

//   return (
//     <div className={styles.progressContainer}>
//       <ProgressIndicator
//         label={`${strings.Step} ${currentStep} ${strings.Of} ${totalSteps}`}
//         description={stepLabels[currentStep - 1]}
//         percentComplete={progressPercentage}
//       />
//     </div>
//   );
// };

// export default StepIndicator;

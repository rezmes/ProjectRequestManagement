import * as React from 'react';


interface ErrorBoundaryState {
    hasError: boolean;
  }
  
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error: Error, info: any) {
      console.error("ErrorBoundary caught an error:", error, info);
      this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        return <div style={{ color: "red" }}>Error loading assessments. Please try again later.</div>;
      }
      return this.props.children as React.ReactElement<any>; // Ensure a valid React element is returned
    }
  }
  
  export default ErrorBoundary;



// // ErrorBoundary.tsx
// import * as React from "react";

// interface ErrorBoundaryState {
//   hasError: boolean;
// }

// export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
//   state = { hasError: false };

//   static getDerivedStateFromError(error: any) {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("Error Boundary caught:", error, errorInfo);
//   }

//   render() {
//     return this.state.hasError
//       ? <div className={styles.error}>Error loading component</div>
//       : this.props.children;
//   }
// }
// export default ErrorBoundary
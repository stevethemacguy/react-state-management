/**
 * Copy pasted from the main React documentation. See https://reactjs.org/docs/error-boundaries.html
 */
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This function is called any time an error occurs
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // Use if you want to log the error to an error reporting service
  // componentDidCatch(error, errorInfo) {
  //   // logErrorToMyService(error, errorInfo);
  // }

  render() {
    // If there's an error, render some custom UI
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    // Assuming there' no error, render all child components of the ErrorBoundary (i.e. render normally)
    return this.props.children;
  }
}

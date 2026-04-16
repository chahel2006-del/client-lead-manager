import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRestart = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-error-50 border border-error-100 rounded-[28px] text-center">
          <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center text-error-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Component Error</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-[240px]">
            Something went wrong while rendering this section.
          </p>
          <button 
            onClick={this.handleRestart}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            <RotateCcw size={14} />
            Reset Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component } from "react";

import path from "../../constants/path";

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className="flex h-screen w-full flex-col items-center justify-center">
          <h1 className="text-9xl font-extrabold tracking-widest text-gray-900">
            500
          </h1>
          <div className="absolute rotate-12 rounded bg-primary px-2 text-sm text-white">
            Error!
          </div>
          <button className="mt-5">
            <a
              href={path.home}
              className="active:text-primary-500 group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring"
            >
              <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-primary transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
              <span className="relative block border border-current px-8 py-3">
                <span>Go Home</span>
              </span>
            </a>
          </button>
        </main>
      );
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

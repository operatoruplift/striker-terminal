"use client";
// Last-resort crash guard. If anything inside throws during render, show the
// structured RpcErrorState (JetBrains Mono alert + retry) instead of a blank
// screen. Feed-level RPC errors are handled upstream via feedStatus; this guards
// unexpected render exceptions so the terminal never white-screens.

import * as React from "react";
import { RpcErrorState } from "./components";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-bg px-6 font-display text-fg">
          <div className="w-full max-w-md">
            <RpcErrorState onRetry={this.handleRetry} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

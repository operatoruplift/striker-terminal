"use client";
// Client entry. Loads the provider tree + terminal with ssr:false because the
// wallet adapter and store touch browser-only APIs (window, localStorage). In
// Next 16 ssr:false must live inside a Client Component (this file).

import dynamic from "next/dynamic";

const AppRoot = dynamic(() => import("./Providers").then((m) => m.AppRoot), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-bg font-mono text-xs uppercase tracking-[0.3em] text-muted">
      loading striker terminal
    </div>
  ),
});

export default function TerminalClient() {
  return <AppRoot />;
}

"use client";
// striker-flags: offline inline-SVG flag assets. Zero network calls, demo-safe.
// Each entry is SVG content drawn on a 0 0 60 40 viewBox (3:2). Renders via the
// Flag component; any code not present falls back to a clean code chip.
// Ported verbatim from the prototype (markup unchanged); only module wrapper added.

import * as React from "react";

const FlagAssets: Record<string, React.JSX.Element> = {
  // ---- core demo teams (daily feed + ticker) ----
  USA: (
    <g>
      <rect width="60" height="40" fill="#B22234"></rect>
      <g fill="#fff">
        <rect y="3.08" width="60" height="3.08"></rect>
        <rect y="9.23" width="60" height="3.08"></rect>
        <rect y="15.38" width="60" height="3.08"></rect>
        <rect y="21.54" width="60" height="3.08"></rect>
        <rect y="27.69" width="60" height="3.08"></rect>
        <rect y="33.85" width="60" height="3.08"></rect>
      </g>
      <rect width="25" height="21.54" fill="#3C3B6E"></rect>
      <g fill="#fff">
        <circle cx="4" cy="4" r="1.1"></circle><circle cx="10.5" cy="4" r="1.1"></circle><circle cx="17" cy="4" r="1.1"></circle>
        <circle cx="7.25" cy="8" r="1.1"></circle><circle cx="13.75" cy="8" r="1.1"></circle><circle cx="20.5" cy="8" r="1.1"></circle>
        <circle cx="4" cy="12" r="1.1"></circle><circle cx="10.5" cy="12" r="1.1"></circle><circle cx="17" cy="12" r="1.1"></circle>
        <circle cx="7.25" cy="16" r="1.1"></circle><circle cx="13.75" cy="16" r="1.1"></circle><circle cx="20.5" cy="16" r="1.1"></circle>
      </g>
    </g>
  ),
  AUS: (
    <g>
      <rect width="60" height="40" fill="#00247D"></rect>
      <rect width="26" height="20" fill="#00247D"></rect>
      <path d="M0 0 26 20M26 0 0 20" stroke="#fff" strokeWidth="3"></path>
      <path d="M13 0V20M0 10H26" stroke="#fff" strokeWidth="5"></path>
      <path d="M13 0V20M0 10H26" stroke="#CC142B" strokeWidth="2"></path>
      <path d="M13 23l1.3 4 4.2.1-3.4 2.5 1.3 4-3.4-2.4-3.4 2.4 1.3-4-3.4-2.5 4.2-.1z" fill="#fff"></path>
      <g fill="#fff">
        <circle cx="46" cy="9" r="1.5"></circle><circle cx="52" cy="17" r="1.5"></circle>
        <circle cx="45" cy="24" r="1.5"></circle><circle cx="39" cy="17" r="1.5"></circle>
        <circle cx="48" cy="31" r="1"></circle>
      </g>
    </g>
  ),
  SCO: (
    <g>
      <rect width="60" height="40" fill="#0065BF"></rect>
      <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="7"></path>
    </g>
  ),
  MAR: (
    <g>
      <rect width="60" height="40" fill="#C1272D"></rect>
      <path d="M30 9 36.47 28.9 19.54 16.6 40.46 16.6 23.53 28.9Z" fill="none" stroke="#006233" strokeWidth="1.6" strokeLinejoin="round"></path>
    </g>
  ),
  BRA: (
    <g>
      <rect width="60" height="40" fill="#009C3B"></rect>
      <path d="M30 5 55 20 30 35 5 20Z" fill="#FFDF00"></path>
      <circle cx="30" cy="20" r="8.5" fill="#002776"></circle>
      <path d="M22.5 22.5Q30 17.5 37.5 22.5" stroke="#fff" strokeWidth="1.8" fill="none"></path>
    </g>
  ),
  HAI: (
    <g>
      <rect width="60" height="20" fill="#00209F"></rect>
      <rect y="20" width="60" height="20" fill="#D21034"></rect>
      <rect x="22" y="12" width="16" height="16" fill="#fff"></rect>
      <rect x="28" y="17" width="4" height="8" fill="#006233"></rect>
      <path d="M30 12.5 33 17H27z" fill="#006233"></path>
    </g>
  ),
  TUR: (
    <g>
      <rect width="60" height="40" fill="#E30A17"></rect>
      <circle cx="23" cy="20" r="9" fill="#fff"></circle>
      <circle cx="26" cy="20" r="7.2" fill="#E30A17"></circle>
      <path d="M35.5 16 37.85 23.24 31.7 18.76 39.3 18.76 33.15 23.24Z" fill="#fff"></path>
    </g>
  ),
  PAR: (
    <g>
      <rect width="60" height="13.33" fill="#D52B1E"></rect>
      <rect y="13.33" width="60" height="13.34" fill="#fff"></rect>
      <rect y="26.67" width="60" height="13.33" fill="#0038A8"></rect>
      <circle cx="30" cy="20" r="3.4" fill="#FFDF00" stroke="#006233" strokeWidth="0.8"></circle>
    </g>
  ),
  // ---- ticker + bracket support (simplified) ----
  GER: (<g><rect width="60" height="13.33" fill="#000"></rect><rect y="13.33" width="60" height="13.34" fill="#DD0000"></rect><rect y="26.67" width="60" height="13.33" fill="#FFCE00"></rect></g>),
  FRA: (<g><rect width="20" height="40" fill="#0055A4"></rect><rect x="20" width="20" height="40" fill="#fff"></rect><rect x="40" width="20" height="40" fill="#EF4135"></rect></g>),
  JPN: (<g><rect width="60" height="40" fill="#fff"></rect><circle cx="30" cy="20" r="9" fill="#BC002D"></circle></g>),
  ESP: (<g><rect width="60" height="40" fill="#AA151B"></rect><rect y="10" width="60" height="20" fill="#F1BF00"></rect></g>),
  NED: (<g><rect width="60" height="13.33" fill="#AE1C28"></rect><rect y="13.33" width="60" height="13.34" fill="#fff"></rect><rect y="26.67" width="60" height="13.33" fill="#21468B"></rect></g>),
  BEL: (<g><rect width="20" height="40" fill="#000"></rect><rect x="20" width="20" height="40" fill="#FAE042"></rect><rect x="40" width="20" height="40" fill="#ED2939"></rect></g>),
  POR: (<g><rect width="24" height="40" fill="#006600"></rect><rect x="24" width="36" height="40" fill="#FF0000"></rect><circle cx="24" cy="20" r="6" fill="#FFD700"></circle><circle cx="24" cy="20" r="3" fill="#fff"></circle></g>),
  ARG: (<g><rect width="60" height="13.33" fill="#74ACDF"></rect><rect y="13.33" width="60" height="13.34" fill="#fff"></rect><rect y="26.67" width="60" height="13.33" fill="#74ACDF"></rect><circle cx="30" cy="20" r="4" fill="#F6B40E"></circle></g>),
  MEX: (<g><rect width="20" height="40" fill="#006847"></rect><rect x="20" width="20" height="40" fill="#fff"></rect><rect x="40" width="20" height="40" fill="#CE1126"></rect><circle cx="30" cy="20" r="2.6" fill="#9B6B3E"></circle></g>),
  SEN: (<g><rect width="20" height="40" fill="#00853F"></rect><rect x="20" width="20" height="40" fill="#FDEF42"></rect><rect x="40" width="20" height="40" fill="#E31B23"></rect><path d="M30 14 31.6 18.8 36.6 18.8 32.5 21.8 34.1 26.6 30 23.6 25.9 26.6 27.5 21.8 23.4 18.8 28.4 18.8Z" fill="#00853F"></path></g>),
  CRO: (<g><rect width="60" height="13.33" fill="#FF0000"></rect><rect y="13.33" width="60" height="13.34" fill="#fff"></rect><rect y="26.67" width="60" height="13.33" fill="#171796"></rect><g><rect x="26" y="15" width="3.5" height="3.5" fill="#FF0000"></rect><rect x="29.5" y="15" width="3.5" height="3.5" fill="#fff"></rect><rect x="26" y="18.5" width="3.5" height="3.5" fill="#fff"></rect><rect x="29.5" y="18.5" width="3.5" height="3.5" fill="#FF0000"></rect></g></g>),
  ENG: (<g><rect width="60" height="40" fill="#fff"></rect><path d="M30 0V40M0 20H60" stroke="#CE1124" strokeWidth="6"></path></g>),
  URU: (
    <g>
      <rect width="60" height="40" fill="#fff"></rect>
      <g fill="#0038A8">
        <rect x="24" y="8.9" width="36" height="4.4"></rect>
        <rect x="0" y="17.8" width="60" height="4.4"></rect>
        <rect x="0" y="26.7" width="60" height="4.4"></rect>
        <rect x="0" y="35.6" width="60" height="4.4"></rect>
      </g>
      <rect width="24" height="17.8" fill="#fff"></rect>
      <circle cx="12" cy="8.9" r="4.4" fill="#F6B40E"></circle>
    </g>
  ),
  CUR: (<g><rect width="60" height="40" fill="#002B7F"></rect><rect y="26" width="60" height="5" fill="#F9E814"></rect><path d="M10 8 11 11 14 11 11.5 13 12.5 16 10 14 7.5 16 8.5 13 6 11 9 11Z" fill="#fff"></path><path d="M8 18 8.7 20 10.7 20 9 21.2 9.7 23.2 8 22 6.3 23.2 7 21.2 5.3 20 7.3 20Z" fill="#fff"></path></g>),
};

interface FlagProps {
  code: string;
  className?: string;
}

// Flag: renders the inline SVG, or a clean code chip if the code is unknown.
function Flag({ code, className = "h-4 w-6" }: FlagProps) {
  const art = FlagAssets[code];
  return (
    <span className={"inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-line/10 " + className} aria-label={code}>
      {art ? (
        <svg viewBox="0 0 60 40" className="h-full w-full" preserveAspectRatio="xMidYMid slice">{art}</svg>
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-inset font-mono text-[8px] font-bold text-muted">{code}</span>
      )}
    </span>
  );
}

export { FlagAssets, Flag };

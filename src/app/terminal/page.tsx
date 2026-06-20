import type { Metadata } from "next";
import TerminalClient from "../../app-shell/TerminalClient";

export const metadata: Metadata = {
  title: "Striker Terminal - Trading Desk",
  description: "The live WC26 prediction desk: daily markets, futures bracket, and instant on-chain settlement.",
};

export default function TerminalPage() {
  return <TerminalClient />;
}

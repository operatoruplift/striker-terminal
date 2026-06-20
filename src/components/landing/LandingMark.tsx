// Striker brand mark (ink S + blue soccer panels). tone picks the stroke color
// so it reads on light surfaces (ink) or dark/cinematic surfaces (white).

export function LandingMark({ className = "h-9 w-9", tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  const stroke = tone === "white" ? "#FFFFFF" : "#0F1423";
  const panel = tone === "white" ? "#3B82F6" : "#2563EB";
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-label="Striker Terminal" role="img">
      <path
        d="M33 16.5c0-4-4-6.7-9.4-6.7-6 0-9.9 3-9.9 7.6 0 4.1 3.3 6 8.9 7.3 5.6 1.3 7.4 2.2 7.4 4.6 0 2.6-2.8 4.2-6.6 4.2-4 0-7-1.6-8.2-4.4"
        stroke={stroke} strokeWidth="5.6" strokeLinecap="round"
      ></path>
      <polygon points="0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39" fill={panel} transform="translate(28 15.5)"></polygon>
      <polygon points="0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39" fill={panel} transform="translate(20 32)"></polygon>
    </svg>
  );
}

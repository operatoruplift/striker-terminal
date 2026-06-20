// Video-first cinematic hero backdrop. The video is intentionally unmasked so
// the hero content reads through glass panels instead of a dark tint.

const BG_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4";

export function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src={BG_VIDEO}
      />
    </div>
  );
}

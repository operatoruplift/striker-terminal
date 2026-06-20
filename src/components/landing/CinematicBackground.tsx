// Video-first cinematic hero backdrop with the CSS stadium scene as fallback.

const BG_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4";

export function CinematicBackground() {
  if (BG_VIDEO) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={BG_VIDEO}
        />
        <div className="cine-vignette" />
      </div>
    );
  }
  return (
    <div className="cine" aria-hidden="true">
      <div className="cine-pitch" />
      <div className="cine-beam b1" />
      <div className="cine-beam b2" />
      <div className="cine-beam b3" />
      <div className="cine-grain" />
      <div className="cine-vignette" />
    </div>
  );
}

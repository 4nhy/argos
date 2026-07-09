/** A metallic border that hugs the panel's exact rounded corners — a masked
 *  conic-gradient ring that slowly rotates (silver shimmer), plus a soft glow.
 *  Pure CSS, so it follows border-radius perfectly and costs no WebGL context. */
export default function GraphBorder() {
  return <div aria-hidden className="metal-frame" />;
}

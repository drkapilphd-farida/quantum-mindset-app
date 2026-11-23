// A slowly turning 3D "brain orb" — glowing rings and connected neurons, pure
// SVG + CSS (no 3D library, so it stays light on phones). Decorative only.

const NODES: [number, number][] = [
  [100, 30], [150, 52], [170, 100], [150, 150], [100, 170], [50, 150], [30, 100], [50, 52],
  [100, 72], [128, 100], [100, 128], [72, 100], [100, 100],
];
const LINKS: [number, number][] = [
  [0, 8], [1, 9], [2, 9], [3, 10], [4, 10], [5, 11], [6, 11], [7, 8], [8, 12], [9, 12], [10, 12], [11, 12], [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11],
];

export function NeuralOrb({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <div className={`fx-orb pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="fx-orb-glow" />
      <div className="fx-orb-ring fx-orb-ring-1" />
      <div className="fx-orb-ring fx-orb-ring-2" />
      <div className="fx-orb-ring fx-orb-ring-3" />
      <svg viewBox="0 0 200 200" className="fx-orb-net">
        <defs>
          <radialGradient id="orbCore" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#7ee0d4" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#2b57e8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0a1630" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#orbCore)" />
        {LINKS.map(([a, b]) => {
          const p = NODES[a];
          const q = NODES[b];
          if (p === undefined || q === undefined) return null;
          return <line key={`${a}-${b}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#9fe8de" strokeOpacity="0.45" strokeWidth="0.8" />;
        })}
        {NODES.map(([x, y], i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={i === 12 ? 5 : 3} className="fx-orb-node" style={{ animationDelay: `${(i % 6) * 0.4}s` }} fill={i % 3 === 0 ? "#f6b24e" : i % 3 === 1 ? "#7ee0d4" : "#a9bcff"} />
        ))}
      </svg>
    </div>
  );
}

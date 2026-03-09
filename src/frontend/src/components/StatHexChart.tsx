interface StatHexChartProps {
  stats: {
    strength: number;
    defense: number;
    magic: number;
    power: number;
    scale: number;
    influence: number;
  };
  color: string;
  size?: number;
  showLabels?: boolean;
  label?: string;
}

const STAT_LABELS = ["Strength", "Defense", "Magic", "Power", "Scale", "Fame"];

function hexPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number,
): [number, number] {
  // Start from top (−90°), go clockwise
  const angle = (Math.PI / 3) * index - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function statToFraction(val: number): number {
  // Map -100..+100 to 0..1
  return (Math.max(-100, Math.min(100, val)) + 100) / 200;
}

function polygonPoints(
  cx: number,
  cy: number,
  maxRadius: number,
  fractions: number[],
): string {
  return fractions
    .map((frac, i) => {
      const r = frac * maxRadius;
      const [x, y] = hexPoint(cx, cy, r, i);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function StatHexChart({
  stats,
  color,
  size = 240,
  showLabels = true,
  label,
}: StatHexChartProps) {
  // Extra horizontal padding so diagonal labels (Defense top-right, Fame top-left)
  // never clip. viewBox is wider than `size` by 2 * hPad.
  const hPad = showLabels ? 52 : 0;
  const vPad = showLabels ? 12 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const labelPad = showLabels ? 44 : 10;
  const maxRadius = size / 2 - labelPad;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const statValues = [
    stats.strength,
    stats.defense,
    stats.magic,
    stats.power,
    stats.scale,
    stats.influence,
  ];
  const fractions = statValues.map(statToFraction);

  // Build hex outline points for each grid level
  const hexOutline = (frac: number) =>
    Array.from({ length: 6 }, (_, i) => hexPoint(cx, cy, frac * maxRadius, i))
      .map(([x, y]) => `${x},${y}`)
      .join(" ");

  const filterId = `hex-glow-${color.replace("#", "")}`;

  const svgWidth = size + hPad * 2;
  const svgHeight = (showLabels && label ? size + 22 : size) + vPad * 2;
  const viewBox = `-${hPad} -${vPad} ${svgWidth} ${svgHeight}`;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox}
      aria-label="Stat hexagon chart"
      role="img"
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background hex grid */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={hexOutline(level)}
          fill="none"
          stroke={color}
          strokeWidth={level === 1 ? 1.2 : 0.7}
          strokeOpacity={level === 1 ? 0.3 : 0.15}
          strokeDasharray={level < 1 ? "3,3" : undefined}
        />
      ))}

      {/* Axis lines from center to tip */}
      {STAT_LABELS.map((lbl, i) => {
        const [x, y] = hexPoint(cx, cy, maxRadius, i);
        return (
          <line
            key={lbl}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth={0.8}
            strokeOpacity={0.2}
          />
        );
      })}

      {/* Filled stat polygon (glow layer) */}
      <polygon
        points={polygonPoints(cx, cy, maxRadius, fractions)}
        fill={color}
        fillOpacity={0.08}
        stroke={color}
        strokeWidth={3}
        strokeOpacity={0.4}
        filter={`url(#${filterId})`}
      />

      {/* Filled stat polygon (crisp layer) */}
      <polygon
        points={polygonPoints(cx, cy, maxRadius, fractions)}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth={1.8}
        strokeOpacity={0.9}
      />

      {/* Vertex dots */}
      {fractions.map((frac, i) => {
        const r = frac * maxRadius;
        const [x, y] = hexPoint(cx, cy, r, i);
        return (
          <circle
            key={STAT_LABELS[i]}
            cx={x}
            cy={y}
            r={3.5}
            fill={color}
            fillOpacity={0.9}
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
        );
      })}

      {/* Labels */}
      {showLabels &&
        STAT_LABELS.map((lblText, i) => {
          const [tx, ty] = hexPoint(cx, cy, maxRadius + 24, i);
          const val = statValues[i];
          const anchor =
            Math.abs(tx - cx) < 5 ? "middle" : tx > cx ? "start" : "end";

          return (
            <g key={lblText}>
              <text
                x={tx}
                y={ty - 5}
                textAnchor={anchor}
                fontSize={9}
                fontFamily="system-ui, sans-serif"
                fontWeight="700"
                fill={color}
                fillOpacity={0.7}
                letterSpacing="0.05em"
              >
                {lblText.toUpperCase()}
              </text>
              <text
                x={tx}
                y={ty + 7}
                textAnchor={anchor}
                fontSize={10}
                fontFamily="system-ui, sans-serif"
                fontWeight="900"
                fill={color}
                fillOpacity={1}
              >
                {val > 0 ? `+${val}` : val}
              </text>
            </g>
          );
        })}

      {/* Optional character label */}
      {label && (
        <text
          x={cx}
          y={size + 16}
          textAnchor="middle"
          fontSize={11}
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          fill={color}
          fillOpacity={0.6}
          letterSpacing="0.08em"
        >
          {label.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

export default function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const w = 44, h = 18;
  const min = 0, max = 10, range = max - min;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="inline-block align-middle">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

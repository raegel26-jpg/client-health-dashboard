import { RiskStatus } from "@/data/clients";

const config: Record<RiskStatus, { label: string; bg: string; text: string; dot: string }> = {
  healthy:  { label: "Healthy",  bg: "#f0fdf8", text: "#027a5f", dot: "#02c39a" },
  warning:  { label: "Warning",  bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  "at-risk":{ label: "At Risk",  bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  churned:  { label: "Churned",  bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
};

export default function StatusBadge({ status }: { status: RiskStatus }) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{ background: c.bg, color: c.text, borderColor: c.dot + "55" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

const PRIORITY_LABELS: Record<string, string> = { High: "High", Medium: "Medium", Low: "Low" };

const priorityStyles: Record<string, React.CSSProperties> = {
  High:   { background: "#e6f0f5", color: "#05668d", border: "1px solid #05668d44" },
  Medium: { background: "#e6f4f5", color: "#028090", border: "1px solid #02809044" },
  Low:    { background: "#e6faf5", color: "#02a87f", border: "1px solid #02c39a44" },
};

export function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={priorityStyles[priority]}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

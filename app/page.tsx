"use client";

import { useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import {
  clients, getAtRiskClients, getWarningClients, getHealthyClients, getChurnedClients,
  getTotalARR, getARRAtRisk, getARRWarning, getARRHealthy,
  getAverageHealthScore, getAverageNPS, formatARR, getUpcomingRenewals,
} from "@/data/clients";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";

const C = {
  navy:    "#05668d",
  teal:    "#028090",
  mint:    "#02c39a",
  amber:   "#f59e0b",
  red:     "#ef4444",
  grey:    "#9ca3af",
};

const STATUS_COLORS: Record<string, string> = {
  healthy: C.mint, warning: C.amber, "at-risk": C.red, churned: C.grey,
};

const AVATAR_BG = ["#05668d","#028090","#00a896","#02c39a","#0e7490","#0369a1","#1d4ed8","#4338ca"];
function avatarColor(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
}
function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function ClientAvatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: avatarColor(name) }}>
      {getInitials(name)}
    </div>
  );
}

// ── Section Icons ─────────────────────────────────────────────────────────────
function ImpactIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 9h2v10H5zm4-4h2v14H9zm4 7h2v7h-2zm4-8h2v15h-2z"/>
    </svg>
  );
}
function HealthIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}
function TrendUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  );
}
function PortfolioIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
    </svg>
  );
}
function RenewalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  );
}

// ── Card wrapper with top accent border + hover lift ──────────────────────────
function Card({ children, className = "" }: {
  children: React.ReactNode; className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5 transition-shadow duration-200 hover:shadow-lg ${className}`}

    >
      {children}
    </div>
  );
}

// ── Section header with icon ──────────────────────────────────────────────────
function SectionHeader({ icon, label, color, action }: {
  icon: React.ReactNode; label: string; color: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      {action}
    </div>
  );
}

function BarTailLabel({ x, y, width, height, value, formatter }: {
  x?: number; y?: number; width?: number; height?: number; value?: number | string;
  formatter?: (v: number | string) => string;
}) {
  if (value == null) return null;
  return (
    <text
      x={(x ?? 0) + (width ?? 0) + 5}
      y={(y ?? 0) + (height ?? 0) / 2}
      dominantBaseline="middle"
      fontSize={9}
      fill="#6b7280"
    >
      {formatter ? formatter(value) : value}
    </text>
  );
}

// For 100%-stacked bars: label on Healthy (always non-zero), positioned at right edge
// value = Healthy%, width = pixel width of Healthy segment → fullWidth = width*(100/Healthy%)
function HealthDistEndLabel({ x, y, width, height, value, index }: {
  x?: number; y?: number; width?: number; height?: number; value?: number; index?: number;
}) {
  if (!value || !width) return null;
  const row = healthByCountry[index ?? 0];
  const fullWidth = (width) * 100 / value;
  return (
    <text x={(x ?? 0) + fullWidth + 5} y={(y ?? 0) + (height ?? 0) / 2}
      dominantBaseline="middle" fontSize={9} fill="#6b7280">
      {row?.clientCount}
    </text>
  );
}

// For count-stacked bars: label on High (always non-zero), positioned at right edge
// value = High count, width = pixel width of High segment → fullWidth = width*(total/High)
function PriorityEndLabel({ x, y, width, height, value, index }: {
  x?: number; y?: number; width?: number; height?: number; value?: number; index?: number;
}) {
  if (!value || !width) return null;
  const row = regionChartData[index ?? 0];
  if (!row) return null;
  const fullWidth = (width) * row.total / value;
  return (
    <text x={(x ?? 0) + fullWidth + 5} y={(y ?? 0) + (height ?? 0) / 2}
      dominantBaseline="middle" fontSize={9} fill="#6b7280">
      {row.total}
    </text>
  );
}

function MeetingStatusBadge({ status }: { status: "scheduled" | "scheduling" | "not-scheduled" }) {
  const cfg = {
    "scheduled":     { label: "Meeting Scheduled",    bg: "#e2e8f0", color: "#1e293b", dot: "#475569" },
    "scheduling":    { label: "Scheduling Meeting",   bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "not-scheduled": { label: "No Meeting Scheduled", bg: "#f8fafc", color: "#94a3b8", dot: "#cbd5e1" },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

const healthDistribution = [
  { name: "Healthy", value: clients.filter(c => c.riskStatus === "healthy").length,  color: C.mint  },
  { name: "Warning", value: clients.filter(c => c.riskStatus === "warning").length,  color: C.amber },
  { name: "At Risk", value: clients.filter(c => c.riskStatus === "at-risk").length,  color: C.red   },
  { name: "Churned", value: clients.filter(c => c.riskStatus === "churned").length,  color: C.grey  },
];

const sortedForStrip = [...clients].sort((a, b) => {
  const o: Record<string, number> = { healthy: 0, warning: 1, "at-risk": 2, churned: 3 };
  return o[a.riskStatus] - o[b.riskStatus];
});

const COUNTRY_SHORT: Record<string, string> = {
  "United States": "US", "United Kingdom": "UK", "Australia": "AU",
  "Singapore": "SG", "Canada": "CA", "Germany": "DE", "Malaysia": "MY", "Philippines": "PH",
};

const regionChartData = Array.from(new Set(clients.map(c => c.country)))
  .map(country => {
    const High   = clients.filter(c => c.country === country && c.priority === "High").length;
    const Medium = clients.filter(c => c.country === country && c.priority === "Medium").length;
    const Low    = clients.filter(c => c.country === country && c.priority === "Low").length;
    return { country: COUNTRY_SHORT[country] ?? country, High, Medium, Low, total: High + Medium + Low };
  })
  .sort((a, b) => b.total - a.total);

const arrByCountry = Array.from(new Set(clients.map(c => c.country)))
  .map(country => ({
    country: COUNTRY_SHORT[country] ?? country,
    arr: clients.filter(c => c.country === country).reduce((s, c) => s + c.arr, 0),
  }))
  .sort((a, b) => b.arr - a.arr);

const healthByCountry = Array.from(new Set(clients.map(c => c.country)))
  .map(country => {
    const cc = clients.filter(c => c.country === country);
    const clientCount = cc.length;
    const statuses = ["healthy", "warning", "at-risk", "churned"] as const;
    const keys     = ["Healthy", "Warning", "At Risk", "Churned"] as const;
    // Largest remainder method — guarantees sum = 100
    const exact  = statuses.map(s => cc.filter(c => c.riskStatus === s).length / clientCount * 100);
    const floors = exact.map(Math.floor);
    const rem    = 100 - floors.reduce((a, b) => a + b, 0);
    exact
      .map((e, i) => ({ i, r: e - floors[i] }))
      .sort((a, b) => b.r - a.r)
      .slice(0, rem)
      .forEach(({ i }) => floors[i]++);
    return {
      country: COUNTRY_SHORT[country] ?? country,
      clientCount,
      ...Object.fromEntries(keys.map((k, i) => [k, floors[i]])),
    } as { country: string; clientCount: number; Healthy: number; Warning: number; "At Risk": number; Churned: number };
  })
  .sort((a, b) => b.Healthy - a.Healthy);

const top5Industries = Object.entries(
  clients.reduce((acc, c) => { acc[c.industry] = (acc[c.industry] || 0) + 1; return acc; }, {} as Record<string, number>)
).sort(([, a], [, b]) => b - a).slice(0, 5);

export default function ExecutiveDashboard() {
  const totalARR   = getTotalARR();
  const arrAtRisk  = getARRAtRisk();
  const arrWarning = getARRWarning();
  const arrHealthy = getARRHealthy();
  const avgScore   = getAverageHealthScore();
  const avgNPS     = getAverageNPS();

  const atRisk  = getAtRiskClients();
  const warning = getWarningClients();
  const healthy = getHealthyClients();
  const churned = getChurnedClients();

  const engagementCoverage = Math.round(
    (clients.filter(c => c.coverageCompleteness.recentEngagement).length / clients.length) * 100
  );
  const p1 = clients.filter(c => c.priority === "High");
  const p1Healthy = p1.filter(c => c.riskStatus === "healthy").length;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const topHealthy = [...healthy].sort((a, b) => b.healthScore - a.healthScore).slice(0, 5);
  const topAtRisk  = [...atRisk].sort((a, b) => b.arr - a.arr).slice(0, 6);
  const upcomingRenewals = getUpcomingRenewals(90);

  const arrTiers = [
    { label: "Healthy", value: arrHealthy, color: C.mint  },
    { label: "Warning", value: arrWarning, color: C.amber },
    { label: "At Risk", value: arrAtRisk,  color: C.red   },
  ];

  const statusPills = [
    { label: "Healthy",  count: healthy.length,  color: C.mint,  bg: "#f0fdf8", href: "/clients?filter=healthy"  },
    { label: "Warning",  count: warning.length,  color: C.amber, bg: "#fffbeb", href: "/clients?filter=warning"  },
    { label: "At Risk",  count: atRisk.length,   color: C.red,   bg: "#fef2f2", href: "/clients?filter=at-risk"  },
    { label: "Churned",  count: churned.length,  color: C.grey,  bg: "#f3f4f6", href: "/clients?filter=churned"  },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Portfolio snapshot — {clients.length} clients · Updated March 27, 2026
        </p>
      </div>

      {/* ── Status pills ──────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {statusPills.map(p => (
          <Link
            key={p.label}
            href={p.href}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all hover:shadow-sm"
            style={{ background: p.bg, color: p.color, borderColor: p.color + "40" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.count} {p.label}
          </Link>
        ))}
      </div>

      {/* ── Portfolio health strip ────────────────────────────────────────── */}
      <div>
        <div className="relative flex items-end gap-px" style={{ height: 12 }}>
          {sortedForStrip.map((c, idx) => {
            const isHovered = hoveredId === c.id;
            const isFirst = idx === 0;
            const isLast = idx === sortedForStrip.length - 1;
            return (
              <div
                key={c.id}
                className="relative"
                style={{ width: `${100 / clients.length}%`, height: 12 }}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isHovered && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white rounded-md whitespace-nowrap z-20 pointer-events-none"
                    style={{ fontSize: 11, padding: "4px 10px" }}
                  >
                    {c.name}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2"
                      style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #111827" }}
                    />
                  </div>
                )}
                <Link
                  href={`/clients/${c.id}`}
                  className="block h-full"
                  style={{
                    background: STATUS_COLORS[c.riskStatus],
                    borderRadius: isFirst ? "999px 0 0 999px" : isLast ? "0 999px 999px 0" : 0,
                  }}
                />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Each bar represents one client, sorted by health status
        </p>
      </div>

      {/* ── Top row: 3 cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Business Impact */}
        <Card>
          <SectionHeader
            icon={<ImpactIcon />}
            label="Business Impact"
            color={C.navy}
          />

          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Total ARR Managed</p>
            <p className="text-5xl font-bold text-gray-900 tracking-tight">{formatARR(totalARR)}</p>
            <p className="text-xs text-gray-400 mt-1">{clients.length} active clients</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">ARR by Health Tier</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-px">
              {arrTiers.map(t => (
                <div key={t.label} style={{ width: `${(t.value / totalARR) * 100}%`, background: t.color }} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">ARR Secure</p>
              <p className="text-lg font-bold" style={{ color: C.mint }}>{formatARR(arrHealthy)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ARR in Warning</p>
              <p className="text-lg font-bold text-amber-500">{formatARR(arrWarning)}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: C.red }}>ARR at Risk</p>
              <p className="text-lg font-bold" style={{ color: C.red }}>{formatARR(arrAtRisk)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{Math.round((arrAtRisk / totalARR) * 100)}% of portfolio</p>
            </div>
          </div>

          {/* ARR by Country */}
          <div className="flex flex-col flex-1 min-h-0">
            <p className="text-xs text-gray-500 font-medium mb-1">ARR by Country</p>
            <div className="flex-1 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={arrByCountry} margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatARR(v)} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={30} interval={0} />
                  <PieTooltip formatter={(v: number) => [formatARR(v), "ARR"]} contentStyle={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="arr" fill="#4b5563" radius={[0, 3, 3, 0]}>
                    <LabelList dataKey="arr" content={(props: any) => <BarTailLabel {...props} formatter={(v: any) => formatARR(v as number)} />} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Portfolio Summary */}
        <Card>
          <SectionHeader icon={<PortfolioIcon />} label="Portfolio Summary" color={C.navy} />

          {/* Priority breakdown */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">By Priority</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "High",   count: clients.filter(c => c.priority === "High").length,   color: C.navy  },
                { label: "Medium", count: clients.filter(c => c.priority === "Medium").length, color: C.teal  },
                { label: "Low",    count: clients.filter(c => c.priority === "Low").length,    color: C.mint  },
              ].map(p => (
                <div key={p.label} className="rounded-lg p-2.5 bg-gray-50 text-center">
                  <p className="text-xl font-bold text-gray-900">{p.count}</p>
                  <p className="text-xs mt-0.5" style={{ color: p.color }}>{p.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 industries */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Top Industries</p>
            <div className="space-y-1.5">
              {top5Industries.map(([industry, count]) => (
                <div key={industry} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 flex-1 truncate">{industry}</span>
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${(count / clients.length) * 100}%`, background: C.teal }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority by country */}
          <div className="flex flex-col flex-1 min-h-0">
            <p className="text-xs text-gray-500 font-medium mb-1">Priority by Country</p>
            <div className="flex-1 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={regionChartData} margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={30} interval={0} />
                  <PieTooltip contentStyle={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="High"   stackId="a" fill={C.navy}>
                    <LabelList dataKey="High" content={(props: any) => <PriorityEndLabel {...props} />} />
                  </Bar>
                  <Bar dataKey="Medium" stackId="a" fill={C.teal}  />
                  <Bar dataKey="Low"    stackId="a" fill={C.mint}  radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Client Health */}
        <Card>
          <SectionHeader icon={<HealthIcon />} label="Client Health" color={C.teal} />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Health Score</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{avgScore}</p>
              <p className="text-xs text-gray-400 mt-1">out of 100</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Portfolio NPS</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{avgNPS}</p>
              <p className="text-xs text-gray-400 mt-1">out of 10</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Eng. Coverage</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{engagementCoverage}%</p>
              <p className="text-xs text-gray-400 mt-1">engaged last 30d</p>
            </div>
          </div>

          <div className="flex items-center gap-6 my-3">
            <PieChart width={80} height={80}>
              <Pie data={healthDistribution} cx={37} cy={37} innerRadius={22} outerRadius={38} paddingAngle={2} dataKey="value">
                {healthDistribution.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <PieTooltip
                formatter={(value: number) => [`${Math.round((value / clients.length) * 100)}%`]}
                contentStyle={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }}
              />
            </PieChart>
            <div className="flex flex-col gap-2.5 flex-1">
              {healthDistribution.map(tier => (
                <div key={tier.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                  <span className="text-xs text-gray-500 w-14">{tier.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1">
                    <div className="h-1 rounded-full" style={{ width: `${(tier.value / clients.length) * 100}%`, background: tier.color }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-6 text-right">{tier.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health by Country */}
          <div className="flex flex-col flex-1 min-h-0 pt-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Health Score Distribution by Country</p>
            <div className="flex-1 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={healthByCountry} margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={30} interval={0} />
                  <PieTooltip formatter={(v: number, name: string) => [`${v}%`, name]} contentStyle={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="Healthy"  stackId="a" fill={C.mint}>
                    <LabelList dataKey="Healthy" content={(props: any) => <HealthDistEndLabel {...props} />} />
                  </Bar>
                  <Bar dataKey="Warning"  stackId="a" fill={C.amber} />
                  <Bar dataKey="At Risk"  stackId="a" fill={C.red}   />
                  <Bar dataKey="Churned"  stackId="a" fill={C.grey}  radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

      </div>

      {/* ── Bottom row: 2 cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Going Well */}
        <Card>
          <SectionHeader
            icon={<TrendUpIcon />}
            label="What's Going Well"
            color={C.mint}
            action={
              <Link href="/clients?filter=healthy" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                View all →
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-3" style={{ background: "#f0fdf8" }}>
              <p className="text-xs font-medium mb-0.5" style={{ color: C.teal }}>Healthy</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-gray-900">{healthy.length}</p>
                <p className="text-xs text-gray-400">clients</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{formatARR(arrHealthy)} ARR</p>
            </div>
            <div className="rounded-lg p-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Avg Score (Healthy)</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(healthy.reduce((s, c) => s + c.healthScore, 0) / healthy.length)}
                </p>
                <p className="text-xs text-gray-400">/ 100</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">health score</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Top Performing Clients</p>
            <div className="space-y-1">
              {topHealthy.map(client => (
                <Link key={client.id} href={`/clients/${client.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderLeft: `3px solid ${C.mint}` }}
                >
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={client.name} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.industry} · {client.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={client.priority} />
                    <span className="text-sm font-bold" style={{ color: C.mint }}>{client.healthScore}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        {/* Needs Attention */}
        <Card>
          <SectionHeader
            icon={<AlertIcon />}
            label="Needs Attention"
            color={C.red}
            action={
              <Link href="/clients?filter=at-risk" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                View all →
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-3 bg-red-50">
              <p className="text-xs font-medium text-red-600">At Risk</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-2xl font-bold text-red-700">{atRisk.length}</p>
                <p className="text-xs text-gray-400">clients</p>
              </div>
              <p className="text-xs text-red-400 mt-0.5">{formatARR(arrAtRisk)} at risk</p>
            </div>
            <div className="rounded-lg p-3 bg-amber-50">
              <p className="text-xs font-medium text-amber-600">Warning</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-2xl font-bold text-amber-700">{warning.length}</p>
                <p className="text-xs text-gray-400">clients</p>
              </div>
              <p className="text-xs text-amber-400 mt-0.5">{formatARR(arrWarning)} exposed</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Highest ARR at Risk</p>
            <div className="space-y-1">
              {topAtRisk.map(client => (
                <Link key={client.id} href={`/clients/${client.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderLeft: "3px solid #ef4444" }}
                >
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={client.name} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[260px]">
                        {client.riskFlags[0] ?? "At risk"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <PriorityBadge priority={client.priority} />
                    <span className="text-sm font-semibold text-gray-700">{formatARR(client.arr)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>

      </div>

      {/* ── Upcoming Renewals ─────────────────────────────────────────────── */}
      <Card>
        <SectionHeader
          icon={<RenewalIcon />}
          label="Upcoming Renewals"
          color={C.navy}
          action={<span className="text-xs text-gray-400">{upcomingRenewals.length} in next 90 days</span>}
        />
        {upcomingRenewals.length === 0 ? (
          <p className="text-sm text-gray-400">No renewals in the next 90 days.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {upcomingRenewals.slice(0, 8).map(client => {
              const daysUntil = Math.ceil(
                (new Date(client.renewalDate).getTime() - new Date("2026-03-27").getTime()) / 86400000
              );
              const urgency = daysUntil <= 30 ? C.red : daysUntil <= 60 ? C.amber : C.grey;
              return (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={client.name} size={28} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400">{formatARR(client.arr)} ARR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <MeetingStatusBadge status={client.renewalMeetingStatus} />
                    <StatusBadge status={client.riskStatus} />
                    <div className="text-right w-16">
                      <p className="text-sm font-semibold" style={{ color: urgency }}>{daysUntil}d</p>
                      <p className="text-xs text-gray-400">
                        {new Date(client.renewalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

    </div>
  );
}

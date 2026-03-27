"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getClient, formatARR, EngagementType, QualitativeFeedback } from "@/data/clients";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import HealthScoreRing from "@/components/HealthScoreRing";

const engagementTypeConfig: Record<EngagementType, { label: string; bg: string; text: string }> = {
  workshop: { label: "Workshop",      bg: "#eef0fb", text: "#05668d" },
  consult:  { label: "1:1 Consult",   bg: "#e6f6f8", text: "#028090" },
  talk:     { label: "Talk / Webinar",bg: "#e6faf7", text: "#00a896" },
  cadence:  { label: "Cadence Call",  bg: "#f3f4f6", text: "#4b5563" },
  report:   { label: "Report",        bg: "#f0fdf8", text: "#027a5f" },
  contract: { label: "Contract",      bg: "#faf5ff", text: "#7c3aed" },
  kickoff:  { label: "Kick-off",      bg: "#fff7ed", text: "#c2410c" },
};

function CheckItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          met ? "bg-emerald-100" : "bg-red-100"
        }`}
      >
        <span className={`text-xs font-bold ${met ? "text-emerald-600" : "text-red-500"}`}>
          {met ? "✓" : "✗"}
        </span>
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function ScoreBar({ label, value, weight, rawLabel }: { label: string; value: number; weight: string; rawLabel?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{label}</span>
          {rawLabel && <span className="text-xs text-gray-400">({rawLabel})</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{weight} weight</span>
          <span className="text-xs font-semibold text-gray-900">{value.toFixed(1)}</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ background: "#374151", width: `${(value / parseFloat(weight)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ClientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = getClient(id);

  if (!client) notFound();

  const npsChartData = client.npsHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
    nps: entry.score,
  }));

  const TODAY_REF = new Date("2026-03-27");
  const recencyDays = Math.floor((TODAY_REF.getTime() - new Date(client.lastEngagement).getTime()) / 86400000);
  const latestEngType = client.engagements[0]?.type;
  const latestEngLabel = latestEngType ? engagementTypeConfig[latestEngType]?.label : undefined;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/clients" className="hover:text-gray-600 transition-colors">
          Clients
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{client.name}</span>
      </div>

      {/* Client Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Identity + Health Ring */}
          <div>
            {/* Logo + name row */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold select-none flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #f0fdf8 0%, #e6f4f5 100%)", color: "#028090" }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <PriorityBadge priority={client.priority} />
                  <StatusBadge status={client.riskStatus} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-1.5">
              <Link
                href={`/clients?industry=${encodeURIComponent(client.industry)}`}
                className="hover:text-gray-800 hover:underline transition-colors"
              >
                {client.industry}
              </Link>
              <span>·</span>
              <Link
                href={`/clients?country=${encodeURIComponent(client.country)}`}
                className="hover:text-gray-800 hover:underline transition-colors"
              >
                {client.country}
              </Link>
              <span>·</span>
              <span className="font-semibold text-gray-700">{formatARR(client.arr)} ARR</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <span>Account Manager: <span className="font-medium text-gray-600">{client.accountManager}</span></span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <HealthScoreRing score={client.healthScore} size={88} />
              <div className="rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3 space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Contract</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-xs text-gray-500">Start date</span>
                  <span className="text-xs font-medium text-gray-800">
                    {new Date(client.contractStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-xs text-gray-500">Contract length</span>
                  <span className="text-xs font-medium text-gray-800">
                    {Math.max(1, Math.round((new Date(client.renewalDate).getTime() - new Date(client.contractStartDate).getTime()) / (365.25 * 86400000)))} yr
                  </span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-xs text-gray-500">Days to renewal</span>
                  <span className="text-xs font-medium" style={{
                    color: Math.ceil((new Date(client.renewalDate).getTime() - new Date("2026-03-27").getTime()) / 86400000) <= 30
                      ? "#ef4444" : Math.ceil((new Date(client.renewalDate).getTime() - new Date("2026-03-27").getTime()) / 86400000) <= 60
                      ? "#f59e0b" : "#374151"
                  }}>
                    {Math.ceil((new Date(client.renewalDate).getTime() - new Date("2026-03-27").getTime()) / 86400000)}d
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Coverage Completeness */}
          <div className="lg:border-l lg:border-gray-100 lg:pl-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Coverage Completeness</p>
            <div className="space-y-3">
              <CheckItem label="Recent engagement (30d)" met={client.coverageCompleteness.recentEngagement} />
              <CheckItem label="Cadence meeting fulfilled" met={client.coverageCompleteness.cadenceMet} />
              <CheckItem label="Reporting delivered" met={client.coverageCompleteness.reportingDelivered} />
            </div>
          </div>

          {/* Column 3: Risk Explanation */}
          <div className="lg:border-l lg:border-gray-100 lg:pl-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Risk Explanation</p>
            {client.riskFlags.length === 0 ? (
              <p className="text-sm text-gray-400">No active risk flags.</p>
            ) : (
              <div className="space-y-2">
                {client.riskFlags.map((flag) => (
                  <div key={flag} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-600">{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engagement Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Engagement Timeline</h2>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100" />
              <div className="space-y-4">
                {client.engagements.map((eng, i) => {
                  const config = engagementTypeConfig[eng.type];
                  return (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-300 flex-shrink-0 mt-0.5 z-10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">{eng.label}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: config.bg, color: config.text }}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(eng.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {eng.notes && <p className="text-xs text-gray-500 mt-1">{eng.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* NPS Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-sm font-semibold text-gray-900">NPS History</h2>
              <span className="text-2xl font-bold text-gray-900 ml-1">{client.npsScore}</span>
              <span className="text-xs text-gray-400">/ 10 current</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Left: line chart */}
              <div>
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={npsChartData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={20}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nps"
                      stroke="#028090"
                      strokeWidth={2}
                      dot={{ fill: "#028090", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Right: NPS feedback entries */}
              <div className="space-y-3 overflow-y-auto max-h-[130px]">
                {client.npsHistory.filter(e => e.feedback).reverse().map((entry, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-3 border-t border-gray-100" : ""}>
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(entry.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      {" · "}NPS {entry.score}
                    </p>
                    <p className="text-xs text-gray-600 italic">&quot;{entry.feedback}&quot;</p>
                  </div>
                ))}
                {client.npsHistory.every(e => !e.feedback) && (
                  <p className="text-xs text-gray-400">No NPS feedback recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Ad-hoc Qualitative Feedback</h2>
            {client.qualitativeFeedback.length === 0 ? (
              <p className="text-sm text-gray-400">No feedback recorded.</p>
            ) : (
              <div className="space-y-4">
                {client.qualitativeFeedback.map((fb: QualitativeFeedback, idx: number) => (
                  <div key={idx} className={idx > 0 ? "pt-4 border-t border-gray-100" : ""}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{fb.author}</span>
                        <span className="text-xs text-gray-400"> · {fb.role}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(fb.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic">&quot;{fb.content}&quot;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Health Score Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Health Score Breakdown</h2>
            <div className="space-y-4">
              <ScoreBar
                label="NPS Score"
                value={client.scoreBreakdown.npsComponent}
                weight="40%"
                rawLabel={`${client.npsScore}/10`}
              />
              <ScoreBar
                label="Engagement Recency"
                value={client.scoreBreakdown.recencyComponent}
                weight="25%"
                rawLabel={`${recencyDays}d ago`}
              />
              <ScoreBar
                label="Engagement Frequency"
                value={client.scoreBreakdown.frequencyComponent}
                weight="20%"
                rawLabel={`${client.engagementFrequency} / 90d`}
              />
              <ScoreBar
                label="Engagement Quality"
                value={client.scoreBreakdown.qualityComponent}
                weight="15%"
                rawLabel={latestEngLabel}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Composite Health Score</span>
              <span className="text-lg font-bold text-gray-900">{client.healthScore} / 100</span>
            </div>
          </div>

          {/* Engagement Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Engagement Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last engagement</span>
                <span className="text-gray-900 font-medium">
                  {new Date(client.lastEngagement).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Engagements (90d)</span>
                <span className="text-gray-900 font-medium">{client.engagementFrequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total on record</span>
                <span className="text-gray-900 font-medium">{client.engagements.length}</span>
              </div>
            </div>
          </div>

          {/* Operational Signals */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Operational Signals</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Cadence Meetings
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected</span>
                    <span className="text-gray-900 font-medium capitalize">
                      {client.operationalSignals.cadenceExpected}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last meeting</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(client.operationalSignals.cadenceLastMeeting).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Reporting
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900 font-medium capitalize">
                      {client.operationalSignals.reportingType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last delivered</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(client.operationalSignals.reportingLastDelivered).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next expected</span>
                    <span
                      className={`font-medium ${
                        new Date(client.operationalSignals.reportingNextExpected) < new Date()
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {new Date(client.operationalSignals.reportingNextExpected).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

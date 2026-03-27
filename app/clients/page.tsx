"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { clients, formatARR, RiskStatus, Priority, Client } from "@/data/clients";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import Sparkline from "@/components/Sparkline";

type SortKey = "name" | "healthScore" | "arr" | "lastEngagement" | "npsScore" | "engagementFrequency";
type SortDir = "asc" | "desc";

const STATUS_COLORS: Record<RiskStatus, string> = {
  healthy:  "#02c39a",
  warning:  "#f59e0b",
  "at-risk":"#ef4444",
  churned:  "#9ca3af",
};

const ACCOUNT_MANAGERS = Array.from(new Set(clients.map(c => c.accountManager))).sort();

function getInitials(name: string) { return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
const AVATAR_BG = ["#05668d","#028090","#00a896","#02c39a","#0e7490","#0369a1","#1d4ed8","#4338ca"];
function avatarColor(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
}

function getTrend(client: Client): "up" | "down" | "flat" {
  if (client.npsHistory.length < 2) return "flat";
  const first = client.npsHistory[0].score;
  const last  = client.npsHistory[client.npsHistory.length - 1].score;
  return last > first ? "up" : last < first ? "down" : "flat";
}

function TrendArrow({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")   return <span className="text-xs font-bold" style={{ color: "#02c39a" }}>↑</span>;
  if (trend === "down") return <span className="text-xs font-bold text-red-500">↓</span>;
  return <span className="text-xs text-gray-300">→</span>;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  formatLabel?: (val: string) => string;
}

function MultiSelect({ label, options, selected, onChange, formatLabel }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(val: string) {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  }

  const displayLabel =
    selected.length === 0 ? label :
    selected.length === 1 ? (formatLabel ? formatLabel(selected[0]) : selected[0]) :
    `${selected.length} selected`;

  const isActive = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border rounded-lg pl-3 pr-2.5 py-2 text-sm focus:outline-none whitespace-nowrap ${
          isActive
            ? "border-[#028090] bg-[#f0faf8] text-[#028090] font-medium"
            : "border-gray-200 bg-white text-gray-700"
        }`}
      >
        {displayLabel}
        <span className="text-xs opacity-60">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[170px] py-1">
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="accent-[#028090] w-3.5 h-3.5 flex-shrink-0"
              />
              {formatLabel ? formatLabel(opt) : opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_OPTS = ["healthy", "warning", "at-risk", "churned"];
const STATUS_LABELS: Record<string, string> = { healthy: "Healthy", warning: "Warning", "at-risk": "At Risk", churned: "Churned" };
const PRIORITY_OPTS = ["High", "Medium", "Low"];

function ClientsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search,         setSearch]         = useState("");
  const [filterStatus,   setFilterStatus]   = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterIndustry, setFilterIndustry] = useState<string[]>([]);
  const [filterCountry,  setFilterCountry]  = useState<string[]>([]);
  const [filterAM,       setFilterAM]       = useState<string[]>([]);
  const [sortKey,        setSortKey]        = useState<SortKey>("healthScore");
  const [sortDir,        setSortDir]        = useState<SortDir>("asc");

  useEffect(() => {
    const f        = searchParams.get("filter");
    const industry = searchParams.get("industry");
    const country  = searchParams.get("country");
    if (f === "at-risk" || f === "healthy" || f === "churned" || f === "warning")
      setFilterStatus([f]);
    if (industry) setFilterIndustry([industry]);
    if (country)  setFilterCountry([country]);
  }, [searchParams]);

  const industries = useMemo(
    () => Array.from(new Set(clients.map(c => c.industry))).sort(),
    []
  );
  const countries = useMemo(
    () => Array.from(new Set(clients.map(c => c.country))).sort(),
    []
  );

  const sorted = useMemo(() => {
    return [...clients]
      .filter(c => {
        if (filterStatus.length   > 0 && !filterStatus.includes(c.riskStatus))     return false;
        if (filterPriority.length > 0 && !filterPriority.includes(c.priority))     return false;
        if (filterIndustry.length > 0 && !filterIndustry.includes(c.industry))     return false;
        if (filterCountry.length  > 0 && !filterCountry.includes(c.country))       return false;
        if (filterAM.length       > 0 && !filterAM.includes(c.accountManager))     return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (typeof av === "string" && typeof bv === "string")
          return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
      });
  }, [search, filterStatus, filterPriority, filterIndustry, filterCountry, filterAM, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "healthScore" ? "asc" : "desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1" style={{ color: "#028090" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const thClass = "text-left text-xs font-medium text-gray-400 px-4 py-3 cursor-pointer select-none hover:text-gray-600 whitespace-nowrap";
  const hasFilters = filterStatus.length > 0 || filterPriority.length > 0 || filterIndustry.length > 0 || filterCountry.length > 0 || filterAM.length > 0 || !!search;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500 mt-1">{clients.length} active clients across all regions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white w-full sm:w-52"
        />
        <MultiSelect
          label="All Statuses"
          options={STATUS_OPTS}
          selected={filterStatus}
          onChange={setFilterStatus}
          formatLabel={v => STATUS_LABELS[v] ?? v}
        />
        <MultiSelect
          label="All Priorities"
          options={PRIORITY_OPTS}
          selected={filterPriority}
          onChange={setFilterPriority}
        />
        <MultiSelect
          label="All Industries"
          options={industries}
          selected={filterIndustry}
          onChange={setFilterIndustry}
        />
        <MultiSelect
          label="All Countries"
          options={countries}
          selected={filterCountry}
          onChange={setFilterCountry}
        />
        <MultiSelect
          label="All Account Managers"
          options={ACCOUNT_MANAGERS}
          selected={filterAM}
          onChange={setFilterAM}
        />
        {hasFilters && (
          <button
            onClick={() => { setFilterStatus([]); setFilterPriority([]); setFilterIndustry([]); setFilterCountry([]); setFilterAM([]); setSearch(""); }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{sorted.length} clients</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-1 p-0" />
                <th className={thClass} onClick={() => handleSort("name")}>Client <SortIcon col="name" /></th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">Priority</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">Industry</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">Country</th>
                <th className={thClass} onClick={() => handleSort("arr")}>ARR <SortIcon col="arr" /></th>
                <th className={thClass} onClick={() => handleSort("healthScore")}>Health <SortIcon col="healthScore" /></th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">Status</th>
                <th className={thClass} onClick={() => handleSort("lastEngagement")}>Last Exec Touchpoint <SortIcon col="lastEngagement" /></th>
                <th className={thClass} onClick={() => handleSort("engagementFrequency")}>Touchpoints (90d) <SortIcon col="engagementFrequency" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-gray-400 py-12 text-sm">
                    No clients match your filters.
                  </td>
                </tr>
              )}
              {sorted.map((client, i) => {
                const trend = getTrend(client);
                return (
                  <tr
                    key={client.id}
                    className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${i < sorted.length - 1 ? "border-b border-gray-50" : ""}`}
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    <td className="p-0 w-0.5" style={{ background: STATUS_COLORS[client.riskStatus] }} />

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: avatarColor(client.name) }}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{client.name}</span>
                          <p className="text-xs text-gray-400">{client.accountManager}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3"><PriorityBadge priority={client.priority} /></td>
                    <td className="px-4 py-3 text-gray-600">{client.industry}</td>
                    <td className="px-4 py-3 text-gray-600">{client.country}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatARR(client.arr)}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: STATUS_COLORS[client.riskStatus] }}>
                          {client.healthScore}
                        </span>
                        <div className="w-14 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{
                            width: `${client.healthScore}%`,
                            background: STATUS_COLORS[client.riskStatus],
                          }} />
                        </div>
                        <TrendArrow trend={trend} />
                      </div>
                    </td>

                    <td className="px-4 py-3"><StatusBadge status={client.riskStatus} /></td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(client.lastEngagement).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{client.engagementFrequency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  return <Suspense><ClientsTable /></Suspense>;
}

"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption { label: string; value: string; }

interface Props {
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

export default function MultiSelect({ options, selected, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  }

  const label = selected.length === 0
    ? placeholder
    : selected.length === 1
    ? options.find(o => o.value === selected[0])?.label ?? selected[0]
    : `${selected.length} selected`;

  const active = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border rounded-lg pl-3 pr-8 py-2 text-sm bg-white text-left min-w-36 relative transition-colors"
        style={{
          borderColor: active ? "#028090" : "#e5e7eb",
          color: active ? "#028090" : "#374151",
          background: active ? "#f0fafa" : "white",
        }}
      >
        {active && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#028090" }} />}
        <span className="truncate">{label}</span>
        <span className="pointer-events-none absolute right-2.5 text-gray-400 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-48 py-1.5">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                style={{ accentColor: "#028090" }}
                className="w-3.5 h-3.5 rounded"
              />
              {opt.label}
            </label>
          ))}
          {active && (
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

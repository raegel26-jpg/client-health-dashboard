"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Clients",  href: "/clients" },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 min-w-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#05668d" }} className="flex-shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="#05668d" />
              <path d="M7 15l3-4 3 3 3-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-semibold text-gray-900 tracking-tight truncate">
              Client Intelligence Hub
            </span>
            <span className="hidden sm:inline text-[10px] text-gray-300 ml-2 flex-shrink-0">A project by @raegelnotrachel</span>
          </div>
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="px-4 py-2 text-sm rounded-md font-medium transition-colors"
                style={
                  isActive(tab.href)
                    ? { background: "#05668d", color: "#fff" }
                    : { color: "#6b7280" }
                }
                onMouseEnter={(e) => {
                  if (!isActive(tab.href)) {
                    e.currentTarget.style.background = "#f0faf8";
                    e.currentTarget.style.color = "#028090";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(tab.href)) {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

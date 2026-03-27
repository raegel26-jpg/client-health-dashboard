export type EngagementType = "workshop" | "consult" | "talk" | "cadence" | "report" | "contract" | "kickoff";
export type Priority = "High" | "Medium" | "Low";
export type RiskStatus = "healthy" | "warning" | "at-risk" | "churned";
export type CompanyType = "SME" | "GLC" | "MNC" | "Startup";

export interface Engagement {
  date: string;
  type: EngagementType;
  label: string;
  notes?: string;
}

export interface NpsEntry {
  date: string;
  score: number;
  feedback?: string;
}

export interface OperationalSignals {
  cadenceExpected: "monthly" | "quarterly";
  cadenceLastMeeting: string;
  reportingType: "monthly" | "quarterly";
  reportingLastDelivered: string;
  reportingNextExpected: string;
}

export type RenewalMeetingStatus = "scheduled" | "scheduling" | "not-scheduled";

export interface QualitativeFeedback {
  date: string;
  author: string;
  role: string;
  content: string;
}

export interface Client {
  id: string;
  name: string;
  priority: Priority;
  industry: string;
  country: string;
  companyType: CompanyType;
  arr: number;
  accountManager: string;
  healthScore: number;
  riskStatus: RiskStatus;
  riskFlags: string[];
  lastEngagement: string;
  engagementFrequency: number;
  npsScore: number;
  npsHistory: NpsEntry[];
  engagements: Engagement[];
  operationalSignals: OperationalSignals;
  contractStartDate: string;
  renewalDate: string;
  renewalMeetingStatus: RenewalMeetingStatus;
  qualitativeFeedback: QualitativeFeedback[];
  coverageCompleteness: {
    recentEngagement: boolean;
    cadenceMet: boolean;
    reportingDelivered: boolean;
  };
  scoreBreakdown: {
    npsComponent: number;
    recencyComponent: number;
    frequencyComponent: number;
    qualityComponent: number;
  };
}

// ─── Base Company Data ────────────────────────────────────────────────────────
// 0-19: P1 | 20-54: P2 | 55-99: P3
// P1 healthy: 0-9, warning: 10-14, at-risk: 15-19
// P2 healthy: 20-34, warning: 35-46, at-risk: 47-54
// P3 healthy: 55-76, warning: 77-89, at-risk: 90-99

const BASE_COMPANIES = [
  // P1 — 20 clients
  { name: "Acme Corp",          industry: "Technology",         country: "United States"  },
  { name: "Luminary",           industry: "Retail",             country: "United States"  },
  { name: "Apex Systems",       industry: "Technology",         country: "United States"  },
  { name: "CloudBridge",        industry: "Technology",         country: "United Kingdom" },
  { name: "NexGen Tech",        industry: "Technology",         country: "Australia"      },
  { name: "WealthPoint",        industry: "Financial Services", country: "United States"  },
  { name: "AssetBridge",        industry: "Financial Services", country: "Singapore"      },
  { name: "Prisma Analytics",   industry: "Technology",         country: "United States"  },
  { name: "MarketEdge",         industry: "Retail",             country: "United States"  },
  { name: "IntelliBase",        industry: "Technology",         country: "United States"  },
  { name: "Elevate Group",      industry: "Healthcare",         country: "United States"  },
  { name: "CarePath",           industry: "Healthcare",         country: "United States"  },
  { name: "Retail Nexus",       industry: "Retail",             country: "United Kingdom" },
  { name: "CareStream",         industry: "Healthcare",         country: "Germany"        },
  { name: "FundForge",          industry: "Financial Services", country: "Australia"      },
  { name: "BrightWave",         industry: "Retail",             country: "United Kingdom" },
  { name: "Insight Co",         industry: "Healthcare",         country: "Australia"      },
  { name: "CapitalFlow",        industry: "Financial Services", country: "Singapore"      },
  { name: "MedCore",            industry: "Healthcare",         country: "Canada"         },
  { name: "ShopStream",         industry: "Retail",             country: "Singapore"      },
  // P2 — 35 clients
  { name: "Cascade Partners",   industry: "Financial Services", country: "Singapore"      },
  { name: "DataSync",           industry: "Technology",         country: "Australia"      },
  { name: "Junction Labs",      industry: "Technology",         country: "United States"  },
  { name: "Horizon Ventures",   industry: "Financial Services", country: "Singapore"      },
  { name: "Keystone Group",     industry: "Consulting",         country: "United Kingdom" },
  { name: "Frontier Analytics", industry: "Consulting",         country: "Malaysia"       },
  { name: "StratEdge",          industry: "Consulting",         country: "United States"  },
  { name: "HealthBridge",       industry: "Healthcare",         country: "Australia"      },
  { name: "MindBridge",         industry: "Consulting",         country: "United Kingdom" },
  { name: "TechVault",          industry: "Technology",         country: "United States"  },
  { name: "ByteFlow",           industry: "Technology",         country: "Canada"         },
  { name: "RiskWise",           industry: "Financial Services", country: "Singapore"      },
  { name: "BrandPeak",          industry: "Retail",             country: "Philippines"    },
  { name: "EduBridge",          industry: "Education",          country: "Malaysia"       },
  { name: "PeakConsult",        industry: "Consulting",         country: "United States"  },
  { name: "VitalEdge",          industry: "Healthcare",         country: "Australia"      },
  { name: "MoneyStream",        industry: "Financial Services", country: "United Kingdom" },
  { name: "TradeWind",          industry: "Retail",             country: "United States"  },
  { name: "LogiPath",           industry: "Logistics",          country: "Singapore"      },
  { name: "MediaPulse",         industry: "Media",              country: "United States"  },
  { name: "PropStream",         industry: "Real Estate",        country: "Australia"      },
  { name: "CoreLogic",          industry: "Technology",         country: "United States"  },
  { name: "DeepDive Advisory",  industry: "Consulting",         country: "United Kingdom" },
  { name: "ChainLink Retail",   industry: "Retail",             country: "Germany"        },
  { name: "BioSync",            industry: "Healthcare",         country: "United States"  },
  { name: "FreightEdge",        industry: "Logistics",          country: "Australia"      },
  { name: "LearnPath",          industry: "Education",          country: "Philippines"    },
  { name: "EstateCore",         industry: "Real Estate",        country: "United States"  },
  { name: "DataPulse",          industry: "Technology",         country: "Singapore"      },
  { name: "StreamEdge",         industry: "Media",              country: "United Kingdom" },
  { name: "GrowthPoint",        industry: "Consulting",         country: "United States"  },
  { name: "SupplyChainPro",     industry: "Logistics",          country: "Malaysia"       },
  { name: "ClinicalPath",       industry: "Healthcare",         country: "Canada"         },
  { name: "FirmBase",           industry: "Consulting",         country: "Australia"      },
  { name: "GlobalPath",         industry: "Retail",             country: "Philippines"    },
  // P3 — 45 clients
  { name: "Synapse Digital",    industry: "Technology",         country: "Philippines"    },
  { name: "TrustVault",         industry: "Financial Services", country: "Malaysia"       },
  { name: "IronWorks",          industry: "Manufacturing",      country: "United States"  },
  { name: "GridCore",           industry: "Technology",         country: "Australia"      },
  { name: "SkillStream",        industry: "Education",          country: "United Kingdom" },
  { name: "SteelPath",          industry: "Manufacturing",      country: "Germany"        },
  { name: "HyperStack",         industry: "Technology",         country: "United States"  },
  { name: "ThinkPoint",         industry: "Consulting",         country: "Singapore"      },
  { name: "LandEdge",           industry: "Real Estate",        country: "Australia"      },
  { name: "PrecisionMake",      industry: "Manufacturing",      country: "United States"  },
  { name: "ContentFlow",        industry: "Media",              country: "Philippines"    },
  { name: "ShipStream",         industry: "Logistics",          country: "Singapore"      },
  { name: "KnowledgeCore",      industry: "Education",          country: "Malaysia"       },
  { name: "PropertyPath",       industry: "Real Estate",        country: "United Kingdom" },
  { name: "EdgeNet",            industry: "Technology",         country: "Canada"         },
  { name: "ForgeEdge",          industry: "Manufacturing",      country: "United States"  },
  { name: "SignalPath",         industry: "Media",              country: "Australia"      },
  { name: "AcademyBridge",      industry: "Education",          country: "Philippines"    },
  { name: "BuildPoint",         industry: "Real Estate",        country: "United States"  },
  { name: "AlphaFund",          industry: "Financial Services", country: "Singapore"      },
  { name: "MachineCore",        industry: "Manufacturing",      country: "Germany"        },
  { name: "VideoStream",        industry: "Media",              country: "United States"  },
  { name: "DegreePath",         industry: "Education",          country: "United Kingdom" },
  { name: "GroundWork",         industry: "Real Estate",        country: "Australia"      },
  { name: "FusionWorks",        industry: "Technology",         country: "Philippines"    },
  { name: "BroadcastCore",      industry: "Media",              country: "United States"  },
  { name: "CargoCore",          industry: "Logistics",          country: "Malaysia"       },
  { name: "InvestRealty",       industry: "Real Estate",        country: "United States"  },
  { name: "BioForge",           industry: "Healthcare",         country: "Australia"      },
  { name: "PixelBridge",        industry: "Media",              country: "United Kingdom" },
  { name: "TrackPoint",         industry: "Logistics",          country: "Singapore"      },
  { name: "EliteConsult",       industry: "Consulting",         country: "United States"  },
  { name: "MoveStream",         industry: "Logistics",          country: "Philippines"    },
  { name: "ExcelLearn",         industry: "Education",          country: "Malaysia"       },
  { name: "HarbourProp",        industry: "Real Estate",        country: "Singapore"      },
  { name: "JadeFinance",        industry: "Financial Services", country: "United States"  },
  { name: "ClassFlow",          industry: "Education",          country: "Australia"      },
  { name: "PackagePath",        industry: "Logistics",          country: "United Kingdom" },
  { name: "WaveCore",           industry: "Media",              country: "United States"  },
  { name: "RouteForge",         industry: "Logistics",          country: "Malaysia"       },
  { name: "ZenithMedia",        industry: "Media",              country: "Singapore"      },
  { name: "DriveForge",         industry: "Manufacturing",      country: "United States"  },
  { name: "CastPoint",          industry: "Manufacturing",      country: "Australia"      },
  { name: "FactoryLine",        industry: "Manufacturing",      country: "United Kingdom" },
  { name: "HighGround",         industry: "Consulting",         country: "United States"  },
];

function generateCompanyType(i: number, priority: Priority): CompanyType {
  if (priority === "High") {
    const t: CompanyType[] = ["MNC", "MNC", "GLC", "MNC", "MNC", "GLC", "MNC", "MNC", "GLC", "MNC"];
    return t[i % t.length];
  }
  if (priority === "Medium") {
    const t: CompanyType[] = ["MNC", "SME", "GLC", "MNC", "SME", "Startup", "SME", "MNC", "SME", "GLC", "MNC", "SME", "Startup", "SME", "MNC"];
    return t[(i - 20) % t.length];
  }
  const t: CompanyType[] = ["SME", "Startup", "SME", "SME", "Startup", "GLC", "SME", "Startup", "SME", "MNC", "Startup", "SME", "SME", "Startup", "SME"];
  return t[(i - 55) % t.length];
}

const ACCOUNT_MANAGERS = [
  "Sarah Chen", "Marcus Webb", "Priya Nair", "James Okafor",
  "Elena Russo", "David Park", "Aisha Patel", "Tom Brennan", "Rachel Kim",
];

// ─── Generator Helpers ────────────────────────────────────────────────────────

const TODAY = new Date("2026-03-27");

function daysAgo(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function daysFromNow(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getPriority(i: number): Priority {
  if (i < 20) return "High";
  if (i < 55) return "Medium";
  return "Low";
}

type HealthTier = "healthy" | "warning" | "at-risk";

function getAssignedTier(i: number): HealthTier {
  if (i < 10) return "healthy";   // P1 healthy
  if (i < 15) return "warning";   // P1 warning
  if (i < 20) return "at-risk";   // P1 at-risk
  if (i < 35) return "healthy";   // P2 healthy
  if (i < 47) return "warning";   // P2 warning
  if (i < 55) return "at-risk";   // P2 at-risk
  if (i < 77) return "healthy";   // P3 healthy
  if (i < 90) return "warning";   // P3 warning
  return "at-risk";               // P3 at-risk
}

function generateNPS(i: number, tier: HealthTier): number {
  if (tier === "healthy") return [9, 10, 9, 8, 9, 10, 8, 9, 8, 9, 9, 8, 10, 9, 8][i % 15];
  if (tier === "warning") return [7, 6, 7, 8, 6, 7, 7, 6, 8, 7, 6, 7][i % 12];
  return [5, 4, 6, 5, 4, 5, 6, 4, 5, 6][i % 10];
}

function generateRecencyDays(i: number, tier: HealthTier): number {
  if (tier === "healthy") return 5 + (i * 3 % 24);
  if (tier === "warning") return 32 + (i * 3 % 22);
  return 63 + (i * 4 % 32);
}

function generateFrequency(i: number, tier: HealthTier): number {
  if (tier === "healthy") return 3 + (i % 5);
  if (tier === "warning") return 1 + (i % 2);
  return i % 2;
}

const QUALITY_SCORES: Record<EngagementType, number> = {
  workshop: 100, consult: 80, talk: 50, cadence: 40, report: 20, contract: 0, kickoff: 0,
};

function generateLatestEngType(i: number, tier: HealthTier): EngagementType {
  if (tier === "healthy") {
    const t: EngagementType[] = ["workshop", "consult", "workshop", "consult", "consult"];
    return t[i % t.length];
  }
  if (tier === "warning") {
    const t: EngagementType[] = ["talk", "cadence", "talk", "consult", "cadence"];
    return t[i % t.length];
  }
  const t: EngagementType[] = ["cadence", "report", "cadence", "talk", "report"];
  return t[i % t.length];
}

function computeScoreBreakdown(nps: number, recencyDays: number, freq: number, engType: EngagementType) {
  const npsComponent    = (nps >= 9 ? 100 : nps >= 7 ? 70 : 30) * 0.4;
  const recencyComponent = (recencyDays <= 30 ? 100 : recencyDays <= 60 ? 70 : 30) * 0.25;
  const freqComponent    = (freq >= 3 ? 100 : freq >= 1 ? 70 : 20) * 0.2;
  const qualityComponent = QUALITY_SCORES[engType] * 0.15;
  return { npsComponent, recencyComponent, freqComponent, qualityComponent };
}

const POSITIVE_FEEDBACK = [
  "Excellent partnership.", "Consistently delivering value.", "Strong support.",
  "Great strategic alignment.", "Best vendor relationship we have.", "Highly responsive team.",
];
const NEUTRAL_FEEDBACK = [
  "Good but could be more consistent.", "Meeting expectations.", "Solid relationship.",
  "Value is there, need more touchpoints.", "Generally positive experience.",
];
const NEGATIVE_FEEDBACK = [
  "Need more proactive support.", "Feeling underserved.", "Disappointed with follow-through.",
  "Lack of engagement from the team.", "Not seeing enough value.", "Expect more from this partnership.",
];

// 4 half-year entries spanning 2 years: H1 2024 (~630d), H2 2024 (~450d), H1 2025 (~270d), H2 2025 (~90d)
const NPS_HALF_YEARS = [630, 450, 270, 90] as const;

function generateNPSHistory(nps: number, tier: HealthTier, i: number): NpsEntry[] {
  if (tier === "healthy") {
    return [
      { date: daysAgo(NPS_HALF_YEARS[0]), score: Math.max(6, nps - 2) },
      { date: daysAgo(NPS_HALF_YEARS[1]), score: Math.max(7, nps - 1) },
      { date: daysAgo(NPS_HALF_YEARS[2]), score: nps },
      { date: daysAgo(NPS_HALF_YEARS[3]), score: nps, feedback: POSITIVE_FEEDBACK[i % POSITIVE_FEEDBACK.length] },
    ];
  }
  if (tier === "warning") {
    return [
      { date: daysAgo(NPS_HALF_YEARS[0]), score: Math.min(10, nps + 3) },
      { date: daysAgo(NPS_HALF_YEARS[1]), score: Math.min(10, nps + 2) },
      { date: daysAgo(NPS_HALF_YEARS[2]), score: Math.min(10, nps + 1) },
      { date: daysAgo(NPS_HALF_YEARS[3]), score: nps, feedback: NEUTRAL_FEEDBACK[i % NEUTRAL_FEEDBACK.length] },
    ];
  }
  return [
    { date: daysAgo(NPS_HALF_YEARS[0]), score: Math.min(10, nps + 4) },
    { date: daysAgo(NPS_HALF_YEARS[1]), score: Math.min(10, nps + 3) },
    { date: daysAgo(NPS_HALF_YEARS[2]), score: Math.min(10, nps + 1) },
    { date: daysAgo(NPS_HALF_YEARS[3]), score: nps, feedback: NEGATIVE_FEEDBACK[i % NEGATIVE_FEEDBACK.length] },
  ];
}

const ENG_LABELS: Record<EngagementType, string[]> = {
  workshop: ["Strategy Workshop", "Leadership Workshop", "Team Workshop", "Exec Workshop"],
  consult:  ["1:1 Strategy Consult", "Executive Advisory", "Advisory Session", "Leadership Consult"],
  talk:     ["Industry Webinar", "Conference Talk", "Panel Discussion", "Thought Leadership Talk"],
  cadence:  ["Monthly Cadence Call", "Quarterly Cadence Call", "Check-in Call", "Leadership Update"],
  report:   ["Monthly Report Delivered", "Quarterly Report Delivered", "Performance Review"],
  contract: ["Contract Signed"],
  kickoff:  ["Client Kick-off & Launch"],
};

function generateEngagements(recencyDays: number, freq: number, i: number, tier: HealthTier, contractStartDate: string): Engagement[] {
  const latestType = generateLatestEngType(i, tier);
  const engs: Engagement[] = [];

  engs.push({
    date: daysAgo(recencyDays),
    type: latestType,
    label: ENG_LABELS[latestType][i % ENG_LABELS[latestType].length],
  });

  const allTypes: EngagementType[] = ["consult", "cadence", "talk", "workshop", "report"];
  const gap = freq > 1 ? Math.floor(80 / freq) : 45;
  for (let j = 1; j < Math.min(freq, 5); j++) {
    const type = allTypes[(i + j) % allTypes.length];
    engs.push({
      date: daysAgo(recencyDays + j * gap),
      type,
      label: ENG_LABELS[type][j % ENG_LABELS[type].length],
    });
  }

  // One older entry for context
  const olderType: EngagementType = i % 2 === 0 ? "report" : "cadence";
  engs.push({
    date: daysAgo(recencyDays + 95 + (i % 20)),
    type: olderType,
    label: ENG_LABELS[olderType][0],
  });

  // Contract start + kick-off are always the two oldest entries
  const kickoffDate = new Date(contractStartDate);
  kickoffDate.setDate(kickoffDate.getDate() + 14);
  engs.push({ date: contractStartDate, type: "contract", label: "Contract Signed" });
  engs.push({ date: kickoffDate.toISOString().split("T")[0], type: "kickoff", label: "Client Kick-off & Launch" });

  return engs.sort((a, b) => b.date.localeCompare(a.date));
}

function generateOperationalSignals(recencyDays: number, tier: HealthTier, i: number): OperationalSignals {
  const cadenceExpected: "monthly" | "quarterly" = i % 3 === 0 ? "quarterly" : "monthly";
  const reportingType: "monthly" | "quarterly" = i % 4 === 0 ? "quarterly" : "monthly";
  const reportingInterval = reportingType === "monthly" ? 30 : 90;

  let cadenceLastDays: number;
  let reportingLastDays: number;

  if (tier === "healthy") {
    cadenceLastDays = recencyDays + (i % 8);
    reportingLastDays = 18 + (i % 12);
  } else if (tier === "warning") {
    cadenceLastDays = recencyDays + 8 + (i % 15);
    reportingLastDays = 38 + (i % 20);
  } else {
    cadenceLastDays = recencyDays + 20 + (i % 25);
    reportingLastDays = 95 + (i % 35);
  }

  // Next expected = last delivered date + interval
  const lastDelivered = new Date(TODAY);
  lastDelivered.setDate(lastDelivered.getDate() - reportingLastDays);
  const nextExpected = new Date(lastDelivered);
  nextExpected.setDate(nextExpected.getDate() + reportingInterval);

  return {
    cadenceExpected,
    cadenceLastMeeting: daysAgo(cadenceLastDays),
    reportingType,
    reportingLastDelivered: daysAgo(reportingLastDays),
    reportingNextExpected: nextExpected.toISOString().split("T")[0],
  };
}

function computeCoverage(
  recencyDays: number,
  opSig: OperationalSignals
): Client["coverageCompleteness"] {
  const cadenceInterval = opSig.cadenceExpected === "monthly" ? 35 : 100;
  const cadenceDaysSince = Math.floor(
    (TODAY.getTime() - new Date(opSig.cadenceLastMeeting).getTime()) / 86400000
  );
  const reportingOverdue = new Date(opSig.reportingNextExpected) < TODAY;

  return {
    recentEngagement: recencyDays <= 30,
    cadenceMet: cadenceDaysSince <= cadenceInterval,
    reportingDelivered: !reportingOverdue,
  };
}

function generateRiskFlags(
  recencyDays: number,
  nps: number,
  freq: number,
  priority: Priority,
  coverage: Client["coverageCompleteness"],
  npsHistory: NpsEntry[]
): string[] {
  const flags: string[] = [];

  if (recencyDays > 60) {
    flags.push(`No engagement in ${recencyDays}+ days`);
  }

  if (nps <= 5) {
    flags.push("NPS score critically low");
  }

  const oldest = npsHistory[0]?.score ?? nps;
  if (oldest - nps >= 2) {
    flags.push(`NPS dropped ${oldest - nps} points`);
  }

  if (priority === "High" && freq <= 1) {
    flags.push("High-priority client with low engagement");
  }

  if (freq === 0) {
    flags.push("Zero engagements in 90 days");
  }

  if (!coverage.cadenceMet) {
    flags.push("Missing cadence meeting");
  }

  if (!coverage.reportingDelivered) {
    flags.push("Reporting overdue");
  }

  return flags;
}

const QUAL_AUTHORS = [
  { role: "Chief Executive Officer" },
  { role: "Chief Technology Officer" },
  { role: "VP of Marketing" },
  { role: "Head of Operations" },
  { role: "Chief Financial Officer" },
];

const QUAL_POSITIVE = [
  "The team has been incredibly responsive this quarter. Every question we've raised has been addressed quickly and thoughtfully.",
  "We've seen a measurable impact on our pipeline since working together. The strategic advice has been spot-on.",
  "Really impressed with the depth of expertise. The workshop last month was exactly what our leadership needed.",
  "Our team feels well-supported. The regular check-ins make a big difference to our confidence in the partnership.",
  "The reporting is always thorough and on time. It's become a key input into our quarterly planning.",
];

const QUAL_NEUTRAL = [
  "Things are generally positive, but we'd like to see more proactive communication between our scheduled calls.",
  "The content delivered has been solid. We'd value more tailored recommendations for our specific sector.",
  "Relationship is working, though response times on ad-hoc queries could be faster.",
  "Good partnership overall. Looking for more strategic depth as we move into the next phase of growth.",
  "Happy with the fundamentals. More senior-level engagement would strengthen the relationship further.",
];

const QUAL_NEGATIVE = [
  "We've felt a bit under-served lately. The last few deliverables missed the mark in terms of depth.",
  "Frankly, we expected more proactivity. We're often the ones chasing for updates.",
  "The team seems stretched. Quality of advice has dipped and we're reassessing value for next renewal.",
  "We've had a rough few months with this partnership. The lack of follow-through is a concern.",
  "Not seeing enough value relative to investment. We need to have a serious conversation before the next cycle.",
];

function generateQualitativeFeedback(tier: HealthTier, i: number): QualitativeFeedback[] {
  const pool = tier === "healthy" ? QUAL_POSITIVE : tier === "warning" ? QUAL_NEUTRAL : QUAL_NEGATIVE;
  const entries: QualitativeFeedback[] = [];
  const count = 2 + (i % 2); // 2 or 3 entries
  for (let j = 0; j < count; j++) {
    const daysBack = 20 + j * 55 + (i % 30);
    const authorIdx = (i + j * 2) % QUAL_AUTHORS.length;
    entries.push({
      date: daysAgo(daysBack),
      author: "Client Contact",
      role: QUAL_AUTHORS[authorIdx].role,
      content: pool[(i + j) % pool.length],
    });
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

function generateRenewalMeetingStatus(i: number, tier: HealthTier): RenewalMeetingStatus {
  if (tier === "healthy") return i % 7 === 0 ? "scheduling" : "scheduled";
  if (tier === "warning") return i % 4 === 0 ? "scheduled" : "scheduling";
  return i % 5 === 0 ? "scheduling" : "not-scheduled";
}

function generateContractStartDate(i: number): string {
  // 1–3 years ago, spread deterministically
  const daysBack = 365 + (i * 47 % 730);
  return daysAgo(daysBack);
}

function generateRenewalDate(i: number): string {
  // Spread renewals across the next 12 months deterministically
  const daysOut = 30 + (i * 13 % 335);
  return daysFromNow(daysOut);
}

function generateARR(i: number, priority: Priority): number {
  if (priority === "High")   return 150000 + (i % 10) * 25000;
  if (priority === "Medium") return 60000  + ((i - 20) % 10) * 9000;
  return 20000 + ((i - 55) % 10) * 5000;
}

// ─── Client Generator ─────────────────────────────────────────────────────────

function generateClient(
  base: { name: string; industry: string; country: string },
  i: number
): Client {
  const priority = getPriority(i);
  const tier = getAssignedTier(i);

  const nps = generateNPS(i, tier);
  const recencyDays = generateRecencyDays(i, tier);
  const freq = generateFrequency(i, tier);
  const latestEngType = generateLatestEngType(i, tier);

  const breakdown = computeScoreBreakdown(nps, recencyDays, freq, latestEngType);
  const healthScore = Math.round(
    breakdown.npsComponent + breakdown.recencyComponent +
    breakdown.freqComponent + breakdown.qualityComponent
  );
  // Indices 95-99 are churned — no engagement in 120+ days, officially lost
  const riskStatus: RiskStatus = i >= 95 ? "churned"
    : healthScore >= 70 ? "healthy"
    : healthScore >= 50 ? "warning"
    : "at-risk";

  const npsHistory = generateNPSHistory(nps, tier, i);
  const operationalSignals = generateOperationalSignals(recencyDays, tier, i);
  const coverage = computeCoverage(recencyDays, operationalSignals);
  const contractStartDate = generateContractStartDate(i);
  const engagements = generateEngagements(recencyDays, freq, i, tier, contractStartDate);
  const riskFlags = generateRiskFlags(recencyDays, nps, freq, priority, coverage, npsHistory);

  return {
    id: toId(base.name),
    name: base.name,
    priority,
    industry: base.industry,
    country: base.country,
    arr: generateARR(i, priority),
    companyType: generateCompanyType(i, priority),
    accountManager: ACCOUNT_MANAGERS[i % ACCOUNT_MANAGERS.length],
    healthScore,
    riskStatus,
    riskFlags,
    lastEngagement: daysAgo(recencyDays),
    engagementFrequency: freq,
    npsScore: nps,
    npsHistory,
    engagements,
    operationalSignals,
    contractStartDate,
    renewalDate: generateRenewalDate(i),
    renewalMeetingStatus: generateRenewalMeetingStatus(i, tier),
    qualitativeFeedback: generateQualitativeFeedback(tier, i),
    coverageCompleteness: coverage,
    scoreBreakdown: {
      npsComponent: breakdown.npsComponent,
      recencyComponent: breakdown.recencyComponent,
      frequencyComponent: breakdown.freqComponent,
      qualityComponent: breakdown.qualityComponent,
    },
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const clients: Client[] = BASE_COMPANIES.map(generateClient);

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getAtRiskClients(): Client[] {
  return clients.filter((c) => c.riskStatus === "at-risk");
}

export function getWarningClients(): Client[] {
  return clients.filter((c) => c.riskStatus === "warning");
}

export function getHealthyClients(): Client[] {
  return clients.filter((c) => c.riskStatus === "healthy");
}

export function getChurnedClients(): Client[] {
  return clients.filter((c) => c.riskStatus === "churned");
}

export function getTotalARR(): number {
  return clients.reduce((s, c) => s + c.arr, 0);
}

export function getARRAtRisk(): number {
  return getAtRiskClients().reduce((s, c) => s + c.arr, 0);
}

export function getARRWarning(): number {
  return getWarningClients().reduce((s, c) => s + c.arr, 0);
}

export function getARRHealthy(): number {
  return getHealthyClients().reduce((s, c) => s + c.arr, 0);
}

export function getAverageHealthScore(): number {
  return Math.round(clients.reduce((s, c) => s + c.healthScore, 0) / clients.length);
}

export function getAverageNPS(): number {
  return Math.round((clients.reduce((s, c) => s + c.npsScore, 0) / clients.length) * 10) / 10;
}

export function formatARR(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function getUpcomingRenewals(days = 90): Client[] {
  const cutoff = new Date(TODAY);
  cutoff.setDate(cutoff.getDate() + days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const todayStr  = TODAY.toISOString().split("T")[0];
  return clients
    .filter(c => c.riskStatus !== "churned" && c.renewalDate >= todayStr && c.renewalDate <= cutoffStr)
    .sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
}

# Client Intelligence Dashboard — Product Spec (V1)

## 1. Product Overview

The Client Intelligence Dashboard is an internal data product designed to provide leadership and customer success teams with clear, actionable visibility into client health, engagement, retention risk, and business impact.

The system consolidates fragmented client data (engagements, feedback, revenue, and operational signals) into a unified interface that enables proactive decision-making and prioritization.

---

## 2. Objective

Enable leadership to quickly assess overall client health, identify at-risk accounts, understand the business impact of client risk, and take proactive action using engagement and feedback data.

---

## 3. Target Users

### Primary User:
- Head of Customer Success / Client Strategy

### Secondary Users:
- Account Managers / Client Success Managers
- Leadership (CEO, Founders)

---

## 4. Problem Statements

1. Client data (engagements, feedback, NPS) is fragmented across multiple sources.
2. There is no standardized way to measure or define client health.
3. At-risk clients are identified too late, leading to reactive rather than proactive management.
4. Leadership lacks visibility into whether high-priority (P1) clients are receiving sufficient value and engagement.
5. Operational signals (cadence meetings, reporting consistency) are not easily trackable or visible.
6. The business impact (revenue at risk) of unhealthy clients is not visible alongside health signals.

---

## 5. Core Questions the Product Must Answer

1. Which clients are at risk right now?
2. What is the total revenue at risk from unhealthy clients?
3. When was the last meaningful engagement with each client?
4. Are high-priority (P1) clients being engaged sufficiently?
5. How is client satisfaction (NPS) trending over time?
6. What types of engagements are being delivered, and is the mix effective?
7. Which clients are receiving high vs low value?
8. Are operational commitments (cadence meetings, reporting) being fulfilled?

---

## 6. Product Structure (3-Level Information Architecture)

### Level 1: Executive Dashboard (Strategic View)

Goal: Provide a high-level snapshot of overall client health and business impact within 5–10 seconds.

**Business Impact Metrics (top of page):**
- Total ARR Under Management
- ARR at Risk (sum of ARR for all at-risk clients)
- ARR by Health Tier (healthy / warning / at-risk breakdown)

**Client Health Metrics:**
- Average Client Health Score
- Number and % of At-Risk Clients
- % of Healthy vs Warning vs At-Risk Clients
- % of P1 Clients in Healthy vs At-Risk categories
- Engagement Coverage (e.g. % of clients engaged in last 30 days)
- NPS Trend (aggregated)

Characteristics:
- Clean, minimal, high-signal
- Designed for leadership decision-making
- Revenue and health shown as complementary lenses — not conflated

---

### Level 2: Segment / Drill-Down View

Goal: Identify patterns and isolate problem areas across client segments.

Access:
- Clicking on summary cards (e.g. "At-Risk Clients")
- Applying filters (industry, country, priority)

Key Features:
- Filterable and sortable client table
- Columns include:
  - Client Name
  - ARR
  - Priority
  - Health Score
  - Risk Flags
  - Last Engagement Date
  - NPS Score
  - Engagement Frequency

Use Cases:
- Sort by ARR to triage highest-value at-risk clients first
- Identify trends by industry, region, or priority tier
- Compare engagement and satisfaction across segments

---

### Level 3: Client Profile (Operational Deep Dive)

Goal: Provide a complete view of an individual client to support action and decision-making.

Sections:

#### Client Overview
- Client Name
- ARR
- Priority (P1 / P2 / P3)
- Industry / Country

#### Health Summary
- Health Score
- Risk Status
- Explanation of score (drivers of health/risk)

#### Engagement Timeline
- Chronological list of engagements
- Type (workshop, 1:1 consult, talk, etc.)
- Frequency trends

#### NPS & Feedback
- Historical NPS scores
- Trend over time
- Qualitative feedback (if available)

#### Operational Signals
- Cadence Meetings:
  - Expected cadence (monthly, quarterly)
  - Last meeting date
- Reporting:
  - Reporting type (monthly / quarterly)
  - Last report delivered
  - Next expected report

#### Coverage Completeness
- Checklist-style indicators:
  - Recent engagement (Y/N)
  - Cadence meeting fulfilled (Y/N)
  - Reporting delivered (Y/N)

#### Risk Explanation
- Clear explanation of why the client is flagged (e.g. low engagement, declining NPS)

---

## 7. Core Metrics & Logic

### Client Health Score (Composite Metric)

The Client Health Score is a weighted metric combining satisfaction and engagement signals.

> Note: ARR is intentionally excluded from the health score. Revenue influences prioritization and urgency, not the health signal itself. A small client with excellent engagement is genuinely healthy.

Components:
- NPS Score (40%)
- Engagement Recency (25%)
- Engagement Frequency (20%)
- Engagement Quality / Depth (15%)

Example Calculation:
Health Score =
(NPS × 0.4) +
(Recency × 0.25) +
(Frequency × 0.2) +
(Quality × 0.15)

---

### Metric Definitions

#### NPS Score
- 9–10 → 100
- 7–8 → 70
- 0–6 → 30

#### Engagement Recency
- ≤ 30 days → 100
- 31–60 days → 70
- > 60 days → 30

#### Engagement Frequency (last 90 days)
- ≥ 3 engagements → 100
- 1–2 engagements → 70
- 0 engagements → 20

#### Engagement Quality
- Workshop / deep program → 100
- 1:1 consultation → 80
- Talk / webinar → 50

---

## 8. Risk Detection System (Critical Layer)

In addition to the Health Score, the system uses rule-based risk flags.

### Risk Conditions:
- No engagement in > 60 days
- Significant NPS drop (e.g. > 15 points)
- High-priority (P1) client with low engagement
- Missing expected cadence meeting
- Missing expected reporting

### Output:
- Clients flagged as "At Risk"
- Visual indicators (e.g. red badges)
- Clear explanation of risk drivers
- ARR at risk surfaced on the Executive Dashboard

---

## 9. Key Design Principles

1. **Progressive Disclosure**
   - High-level summary first, details on demand

2. **Actionability**
   - Every metric should lead to a decision or action

3. **Clarity over Complexity**
   - Avoid overloading the dashboard with unnecessary data

4. **Trust & Transparency**
   - Clearly explain how scores are derived

5. **Dual Lens: Health + Impact**
   - Client health and revenue are shown as complementary views, not conflated. Health measures quality of relationship; ARR measures the business stakes.

---

## 10. Success Criteria

The product is successful if:

- Users can identify at-risk clients within 10 seconds
- Users can immediately see the ARR exposure of at-risk clients
- Users can quickly understand engagement and satisfaction status
- Users are able to take clear next actions based on insights
- Leadership gains visibility into client health at both macro and micro levels

---

## 11. Scope (V1)

### Included:
- Client Health Score
- Risk Flag System
- Engagement Tracking
- NPS Tracking
- ARR per client (used for business impact metrics, not health score)
- ARR at Risk (Executive Dashboard)
- ARR breakdown by health tier (Executive Dashboard)
- ARR as a sortable column in the client table
- 3-Level Dashboard Structure
- Basic filtering (priority, industry, country)

### Not Included (Future Iterations):
- Predictive modeling
- Automated recommendations
- Advanced AI insights
- Renewal date tracking
- Churn probability scoring

---

## 12. Positioning

This product is not just a dashboard.

It is a Client Intelligence System designed to:
- Standardize how client health is measured
- Surface the business impact of client risk (ARR exposure)
- Enable proactive client management
- Bridge strategy (leadership) and execution (CS teams)

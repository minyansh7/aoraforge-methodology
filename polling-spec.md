# AORA polling specification

The full specification of how AORA measures AI search citation visibility, the cadence of polling, the pre-registration discipline that makes refund triggers binary, and how the four-checkin trajectory separates "the work landed" from "the index hadn't crawled yet."

## 1. The unit of measurement

A measurement is always a `(query, platform, check-in-day)` tuple, never a query alone or a brand alone.

```
measurement = {
  query: string,           // Pre-registered at Day 0; locked
  platform: enum,          // ChatGPT | Perplexity | GoogleAIO | Brave
  checkinDay: 7 | 14 | 21 | 30,
  polls: number,           // Calibrated; typically 30–80 per (query, platform, day)
  citedCount: number,      // How many polls returned the brand by name
  rate: number,            // citedCount / polls (point estimate)
  ci90: { lower, upper },  // Wilson 90% CI; see wilson_ci.ts
}
```

Reports never aggregate beyond the platform level. A single "AI citation rate" across four platforms hides exactly the differential information the customer needs (which platform to fix, which fix moves which platform).

## 2. Pre-registration

### What gets pre-registered

At the Day-0 kickoff call, the customer and AORA jointly agree on:

1. **15 target queries.** Mix typical: 4 brand-adjacent, 6 buyer-intent geo, 5 educational/comparison.
2. **2 named competitors.** For head-to-head measurement.
3. **The brand-name match rules.** Exact match, or with permitted variations (e.g., "Solarpro" matches "Solarpro Sydney" but not "Solar Pro" if the customer chooses tighter rules).
4. **The "cited" definition.** Either "brand mentioned by name in the answer paragraph" (default) or "brand mentioned anywhere in the response including footnotes" (looser).

These four items go into a service-agreement appendix signed by both parties.

### Why pre-registration matters

Without it, a vendor running a citation audit can pick which queries to report (cherry-pick the ones the brand happens to win on), which competitors to compare against (avoid the strongest), and what counts as "cited" (broaden the definition retroactively). Each of those moves makes the audit a marketing artifact, not a measurement.

The convention mirrors **clinical trial pre-registration** (ClinicalTrials.gov, [ICMJE 2007](https://www.icmje.org/recommendations/browse/publishing-and-editorial-issues/clinical-trial-registration.html)): an outcome is meaningful only when the goalposts can't move after the trial begins.

### Locked queries are a finding too

If a pre-registered query turns out to be unwinnable — no platform will cite anyone for it, including the strongest competitor — that is itself a finding. It tells the customer: *the AI doesn't see this question as having a brand-named answer; market it differently.* It is **not** permission to silently swap in an easier query mid-engagement.

## 3. Polling cadence and calibration

### How many polls per (query, platform) pair?

Each `(query, platform, check-in-day)` cell is polled enough times to bound a Wilson 90% CI to a useful width. Useful = the interval doesn't span both "is cited" and "isn't cited" verdicts.

Rule of thumb:
- Expected `p` near 0 or 1 → **30 polls** suffices (interval narrow there)
- Expected `p` near 0.5 → **60–80 polls** to keep interval width <30 percentage points
- Critical comparisons (head-to-head with competitor) → **120 polls**

For a Citation Pack with 15 queries × 4 platforms × 4 check-ins = 240 cells, total polling ranges 7,200–28,800 individual queries depending on calibration. Cost is in seconds and pennies — the rigor is the moat.

### Live retrieval vs. cached retrieval

Each platform is polled via its public-facing API or web interface, *not* via a cached snapshot. This is non-trivial:

| Platform | Polling method |
|---|---|
| ChatGPT | OpenAI API (`gpt-4o`) with `web_search` tool enabled |
| Perplexity | Perplexity API (`sonar-pro`) — live web retrieval |
| Google AI Overviews | Headless browser scrape of Google SERP with `udm=14` (AI mode) — Google has no public AIO API |
| Brave | Brave Search API — also covers Claude indirectly, since Anthropic's `web_search` tool routes through Brave (no separate Claude crawl index). Polling Brave is the substrate-correct way to measure what Claude can cite. |

Each query is sent fresh on each poll. No caching, no deduplication. The platform's own infrastructure decides what to surface, and we measure what the user would see.

### Citation parsing

Citation extraction is a deterministic post-processing step:

1. Send the query.
2. Receive the response (full text + any structured citation list).
3. Run the brand-name regex (case-insensitive, with the agreed match rules from pre-registration).
4. Mark as `cited=true` if the regex matches *anywhere* the customer agreed counts (paragraph default, or full response if looser rule chosen).
5. Log the raw response, the timestamp, the platform version (when available), and the parsing decision.

Logs are provided to the customer at Day-45 verification. The customer can re-run the regex against the logs and reach the same verdict — that's what makes the refund condition "binary, code-determined, no negotiation."

## 4. Four-checkin trajectory

Polling at Day 7, 14, 21, and 30 (relative to thread/asset publication) — never just at the end of the window.

### Why four

A single end-of-window measurement can't tell apart:

| Pattern | Day-7 | Day-14 | Day-21 | Day-30 | Verdict |
|---|---|---|---|---|---|
| Compounding | 0.20 | 0.45 | 0.65 | 0.70 | Work effective; will likely continue gaining |
| Decaying | 0.70 | 0.60 | 0.40 | 0.25 | Work landed but newer competitor content overtaking; refresh |
| Lagging | 0.00 | 0.00 | 0.05 | 0.30 | Index hadn't caught up; Day-60 follow-up will likely show higher |
| Flat zero | 0.00 | 0.00 | 0.00 | 0.00 | Engineering didn't work for this platform — or platform doesn't cite this query class |
| Spike-decay | 0.00 | 0.50 | 0.10 | 0.05 | Brief boost then displaced; usually means a dominant source was indexed and re-displaced |

A single Day-30 reading collapses all five to one number and loses every diagnostic signal.

### Different platforms update on different cadences

| Platform | Refresh model |
|---|---|
| Perplexity | Essentially real-time live retrieval |
| Brave | Continuous crawl; near-real-time. Also the substrate behind Claude's `web_search`. |
| Google AIO | Roughly weekly model refresh; SERP cache shorter |
| ChatGPT | Training cuts + `web_search` retrieval; lag varies by model release |

A "Day-30 audit" arrived at by polling each platform once on Day 30 sees four different layers of staleness mashed into one number. The four-checkin trajectory makes the refresh-cadence variance visible in the data itself.

## 5. The Day-45 verification + refund trigger

The Citation Pack ships in 14 days. The customer publishes the threads/seeds on Days 0–14 (their cadence; AORA delivers all assets by Day 14). Polling check-ins happen at Day 7, 14, 21, 30 *post-publication of each individual thread*. The Day-45 verification poll is the last formal measurement.

### The refund condition

```
refund = (count of pre-registered queries with at least one cited brand thread on any platform at Day-45) < 5
```

- 5 or more pre-registered queries with a citation → no refund (success threshold)
- Fewer than 5 → full refund, no partial, no negotiation

The polling logs and citation parser are provided to the customer. The verdict is reproducible by anyone reading the logs.

### Why this design

- **Binary**: removes negotiation. Either the count is ≥5 or it isn't.
- **Code-determined**: removes vendor judgement. The parser is deterministic.
- **Pre-registered**: removes goalpost-movement. The 15 queries were locked at Day 0.
- **Conservative threshold**: 5 of 15 = 33%. A strong Citation Pack typically lands 8–12 of 15. The 5 threshold is "minimum acceptable to show the methodology worked," not "stretch goal."

## 6. What this spec does not cover

- **Lift attribution**: did inbound leads/sales increase? AORA does not promise lead lift; the refund trigger is on citation visibility, which is the leading indicator. Lead/revenue attribution requires a different measurement framework that depends on the customer's CRM and conversion infrastructure.
- **Long-tail durability**: do citations persist beyond Day 45? Empirically yes for ~12 months on most platforms before re-evaluation, but no formal guarantee. Customers who want continuous monitoring can re-run the Snapshot Audit at 60–90-day cadence.
- **Cross-platform negative interactions**: optimizing for ChatGPT (long Wikipedia-style content) sometimes weakens Perplexity (which prefers terse forum-style answers). The platform-independence section discusses this.

## 7. Versioning

This spec is versioned with the repo. Material changes to the polling cadence, refund trigger, or pre-registration discipline are committed with `BREAKING:` prefix. Customers on existing engagements ship under the spec version active at their kickoff date.

Current version: `v1.0` (2026-05-08).

## References

See [`references.md`](./references.md). Key citations: Wilson (1927), Brown/Cai/DasGupta (2001), SparkToro/Gumshoe (2025), ICMJE (2007).

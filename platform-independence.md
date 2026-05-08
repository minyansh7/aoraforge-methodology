# Platform independence — why one number isn't enough

ChatGPT, Perplexity, Google AI Overviews, and Claude are four different systems. They use different retrieval pipelines, different ranking models, different freshness models, and apply different rules for what they cite. **Aggregating them into one "AI citation rate" hides exactly the information you need.**

## The same brand, four different rates

Real polling output on a head-to-head Sydney solar query, brand redacted:

```
Query: "best solar installer Sydney with battery and warranty"
Polls: 60 per platform

ChatGPT      37/60 = 61.7% [49.0%, 73.0%]
Perplexity   12/60 = 20.0% [11.6%, 31.7%]
Google AIO   54/60 = 90.0% [80.1%, 95.4%]
Claude       28/60 = 46.7% [34.5%, 59.2%]
─────────────────────────────────────────
Naive aggregate: 131/240 = 54.6%
```

The aggregate of 54.6% is **wrong in every useful sense**. It implies the brand has medium visibility across AI search broadly. The truth is: the brand owns Google AIO, is competitive on ChatGPT, is invisible on Perplexity, and is mid-pack on Claude. Each of those is a different product strategy, a different content-investment decision, and a different competitor set.

## What each platform rewards

| Platform | Pulls from | What moves the needle | What hurts you |
|---|---|---|---|
| **Perplexity** | Live web search; Reddit and Quora heavily weighted; recency favored | Long Reddit threads (1,500+ words), Quora answers with operator-voice depth, news coverage in the past 30 days | Stale content; corporate-tone marketing pages; sites blocked by Perplexity's crawler |
| **ChatGPT** | Training data + `web_search` tool retrieval | Long-form expert content on the customer's own domain, Wikipedia mentions, schema.org `Article` + `FAQPage` markup, methodology essays, .edu/.gov citations | Thin pages; orphaned content; sites with no schema |
| **Google AI Overviews** | Google Search index + featured-snippet selection logic; some retrieval-augmented generation | Schema markup (especially `LocalBusiness`, `FAQPage`, `Product`), FAQ pages, Bing/IndexNow cross-listing, structured comparison tables | Unstructured prose; sites without schema; pages Google doesn't already rank well |
| **Claude** | Training data + `web_search` tool (routes through Brave Search) | Brave-friendly content (long-form, methodology-heavy), structured data, GitHub repos, technical write-ups, methodology essays with citations | Brave-blocked or low-Brave-rank content; thin pages |
| **Brave** *(sanity layer)* | Independent web crawl | Same as Claude (Claude routes through it) | Sites Brave hasn't crawled well; Brave-blocked content |

Brave is reported as a 5th column in Snapshot Audits, but doesn't count toward the four-platform measurement. Its purpose: when Claude under-cites, Brave tells you whether it's Claude's ranking model or the substrate.

## Why fixes don't transfer cleanly

This matters operationally because **fixing one platform sometimes weakens another.**

- Optimizing for ChatGPT (long Wikipedia-style methodology content on your domain) can weaken Perplexity (which prefers Reddit-voice, terse, first-person operator content).
- Optimizing for Google AIO (heavy schema + FAQ pages) doesn't transfer to Perplexity (which mostly ignores schema in favor of forum content).
- Optimizing for Claude (long-form technical content with citations) often *does* compound with ChatGPT — they share enough retrieval pattern that the same essay can lift both.

A monolithic AI search optimization strategy that ignores per-platform weighting is worse than no strategy: it spends real content effort on the wrong levers and reports a single number that hides the misallocation.

## The kit-level summary is a navigation aid

In AORA reports, the kit-level (cross-platform) summary is provided **only as a navigation aid** — a way to find which queries to drill into. The substantive measurement is always per-platform. If you read an AORA report and remember only one number per query, you're reading it wrong.

## What to do with this in practice

When choosing between investments:

1. **Pull the per-platform breakdown** for your top 5 queries.
2. **Find the platform with the largest gap** between you and your strongest competitor.
3. **Match the platform to the lever** using the table above.
4. **Don't optimize for the kit-level number**; you'll spread investment thin across four very different fights.

This is what the Pro Audit roadmap does in writing. The Citation Pack does it in execution.

## See also

- [`polling-spec.md`](./polling-spec.md) — full polling cadence + pre-registration spec
- [`wilson_ci.ts`](./wilson_ci.ts) — the math behind every interval reported above
- [`references.md`](./references.md) — academic references on platform-independent measurement

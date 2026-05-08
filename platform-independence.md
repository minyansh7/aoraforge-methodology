# Platform independence — why one number isn't enough

ChatGPT, Perplexity, Google AI Overviews, and Brave Search are four different systems. They use different retrieval pipelines, different ranking models, different freshness models, and apply different rules for what they cite. **Aggregating them into one "AI citation rate" hides exactly the information you need.**

> **A note on Claude:** Anthropic's Claude doesn't have its own crawl index. Its `web_search` tool routes through Brave Search. Polling Claude directly would just be polling Brave with Anthropic's prompt-template wrapped around it — same substrate, extra noise. AORA polls **Brave directly**: it's the substrate-correct measurement that covers what Claude can cite, without paying for the wrapper.

## The same brand, four different rates

Real polling output on a head-to-head Sydney solar query, brand redacted:

```
Query: "best solar installer Sydney with battery and warranty"
Polls: 60 per platform

ChatGPT      37/60 = 61.7% [49.0%, 73.0%]
Perplexity   12/60 = 20.0% [11.6%, 31.7%]
Google AIO   54/60 = 90.0% [80.1%, 95.4%]
Brave        28/60 = 46.7% [34.5%, 59.2%]
─────────────────────────────────────────
Naive aggregate: 131/240 = 54.6%
```

The aggregate of 54.6% is **wrong in every useful sense**. It implies the brand has medium visibility across AI search broadly. The truth is: the brand owns Google AIO, is competitive on ChatGPT, is invisible on Perplexity, and is mid-pack on Brave (which means mid-pack for Claude users too). Each is a different content-investment decision.

## What each platform rewards

| Platform | Pulls from | What moves the needle | What hurts you |
|---|---|---|---|
| **Perplexity** | Live web search; Reddit and Quora heavily weighted; recency favored | Long Reddit threads (1,500+ words), Quora answers with operator-voice depth, news coverage in the past 30 days | Stale content; corporate-tone marketing pages; sites blocked by Perplexity's crawler |
| **ChatGPT** | Training data + `web_search` tool retrieval | Long-form expert content on the customer's own domain, Wikipedia mentions, schema.org `Article` + `FAQPage` markup, methodology essays, .edu/.gov citations | Thin pages; orphaned content; sites with no schema |
| **Google AI Overviews** | Google Search index + featured-snippet selection logic; some retrieval-augmented generation | Schema markup (especially `LocalBusiness`, `FAQPage`, `Product`), FAQ pages, Bing/IndexNow cross-listing, structured comparison tables | Unstructured prose; sites without schema; pages Google doesn't already rank well |
| **Brave Search** | Independent web crawl with its own ranking model. Also the substrate Anthropic's Claude `web_search` tool routes through, so polling Brave covers Claude indirectly. | Long-form, methodology-heavy content, structured data, GitHub repos, technical write-ups, methodology essays with citations | Brave-blocked or low-Brave-rank content; thin pages |

## Why fixes don't transfer cleanly

This matters operationally because **fixing one platform sometimes weakens another.**

- Optimizing for ChatGPT (long Wikipedia-style methodology content on your domain) can weaken Perplexity (which prefers Reddit-voice, terse, first-person operator content).
- Optimizing for Google AIO (heavy schema + FAQ pages) doesn't transfer to Perplexity (which mostly ignores schema in favor of forum content).
- Optimizing for Brave (long-form technical content with citations) often *does* compound with ChatGPT — they share enough retrieval pattern that the same essay can lift both. Bonus: lifting Brave also lifts what Claude users see.

A monolithic AI search optimization strategy that ignores per-platform weighting is worse than no strategy: it spends real content effort on the wrong levers and reports a single number that hides the misallocation.

## Why Brave, in detail

Brave Search is included as a first-class platform (not a sanity check) for two reasons:

1. **Direct user reach.** Brave Search has a non-trivial direct user base, especially among privacy-conscious / technical buyers. It's not just a substrate — people use it.
2. **Claude's `web_search` substrate.** Anthropic doesn't operate a crawler. When a Claude user invokes the `web_search` tool, the underlying retrieval is Brave's. So whatever is cited on Brave is what Claude has available to cite. Polling Brave covers both Brave-direct users and Claude users with one set of polls. Cheaper and more honest than polling Claude separately.

This gives the customer a true four-platform picture without the artifact of double-counting Brave-substrate retrieval under both "Brave" and "Claude" columns.

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

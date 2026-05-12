# Platform independence — why one number isn't enough

ChatGPT, Perplexity, Google AI Overviews, and Brave Search are four different systems. They use different retrieval pipelines, different ranking models, different freshness models, and apply different rules for what they cite. **Aggregating them into one "AI citation rate" hides exactly the information you need.**

> **A note on Claude:** AORAFORGE reports Brave as Brave. Because Anthropic documents Claude web search as a tool-mediated web retrieval path and Brave documents an independent search API/index, AORAFORGE treats Brave visibility as the cleanest Claude-adjacent substrate signal. That is an operational proxy, not a claim that Brave results and Claude answers are identical. Customers who need Claude end-user behavior can add direct Claude polling.

## The same brand, four different rates

Synthetic polling output on a head-to-head fictional Lumenford workspace query:

```
Query: "best modular desk studio Lumenford with delivery and warranty"
Polls: 60 per platform

ChatGPT      37/60 = 61.7% [51.1%, 71.3%]
Perplexity   12/60 = 20.0% [12.9%, 29.7%]
Google AIO   54/60 = 90.0% [81.8%, 94.7%]
Brave        28/60 = 46.7% [36.4%, 57.2%]
─────────────────────────────────────────
Naive aggregate: 131/240 = 54.6%
```

The aggregate of 54.6% is **wrong in every useful sense**. It implies the brand has medium visibility across AI search broadly. The truth is: the brand owns Google AIO, is competitive on ChatGPT, is weak on Perplexity, and is mid-pack on Brave. Each is a different content-investment decision.

## What each platform rewards

| Platform | Pulls from | What moves the needle | What hurts you |
|---|---|---|---|
| **Perplexity** | Live web search; Reddit and Quora heavily weighted; recency favored | Long Reddit threads (1,500+ words), Quora answers with operator-voice depth, news coverage in the past 30 days | Stale content; corporate-tone marketing pages; sites blocked by Perplexity's crawler |
| **ChatGPT** | Training data + `web_search` tool retrieval | Long-form expert content on the customer's own domain, Wikipedia mentions, schema.org `Article` + `FAQPage` markup, methodology essays, .edu/.gov citations | Thin pages; orphaned content; sites with no schema |
| **Google AI Overviews** | Google Search index + featured-snippet selection logic; some retrieval-augmented generation | Schema markup (especially `LocalBusiness`, `FAQPage`, `Product`), FAQ pages, Bing/IndexNow cross-listing, structured comparison tables | Unstructured prose; sites without schema; pages Google doesn't already rank well |
| **Brave Search** | Independent web crawl with its own ranking model; used as AORAFORGE's Claude-adjacent retrieval proxy where Claude web search depends on Brave-provided results | Long-form, methodology-heavy content, structured data, GitHub repos, technical write-ups, methodology essays with citations | Brave-blocked or low-Brave-rank content; thin pages |

## Why fixes don't transfer cleanly

This matters operationally because **fixing one platform sometimes weakens another.**

- Optimizing for ChatGPT (long Wikipedia-style methodology content on your domain) can weaken Perplexity (which prefers Reddit-voice, terse, first-person operator content).
- Optimizing for Google AIO (heavy schema + FAQ pages) doesn't transfer to Perplexity (which mostly ignores schema in favor of forum content).
- Optimizing for Brave (long-form technical content with citations) often *does* compound with ChatGPT. In AORAFORGE reports, it also improves the Claude-adjacent retrieval proxy, while direct Claude user behavior remains a separately pollable question.

A monolithic AI search optimization strategy that ignores per-platform weighting is worse than no strategy: it spends real content effort on the wrong levers and reports a single number that hides the misallocation.

## Why Brave, in detail

Brave Search is included as a first-class platform (not a sanity check) for two reasons:

1. **Direct user reach.** Brave Search has a non-trivial direct user base, especially among privacy-conscious / technical buyers. It's not just a substrate — people use it.
2. **Claude-adjacent retrieval signal.** AORAFORGE uses Brave as a retrieval proxy for Claude-adjacent web-search visibility where Claude depends on Brave-provided results. Brave polling isolates the search substrate; direct Claude polling can still be added when the question is "what does Claude answer after prompt shaping?"

This gives the customer a four-platform picture without double-counting Brave retrieval under both "Brave" and "Claude" columns.

## The kit-level summary is a navigation aid

In AORAFORGE reports, the kit-level (cross-platform) summary is provided **only as a navigation aid** — a way to find which queries to drill into. The substantive measurement is always per-platform. If you read an AORAFORGE report and remember only one number per query, you're reading it wrong.

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

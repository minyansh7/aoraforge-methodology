# Aoraforge Methodology

Open methodology for measuring AI search citation visibility — across **ChatGPT, Perplexity, Google AI Overviews, and Claude**.

This repo is the public record of how [AORAFORGE](https://aoraforge.com) measures whether a brand is cited in AI search responses, what statistical rigor we apply, and how a customer (or a third-party reviewer) can replicate every claim we make.

If you've read AORAFORGE's site and wondered *"is this just marketing or is the methodology real?"* — this repo is the answer. Everything we do statistically is here.

## What's inside

| File | Purpose |
|---|---|
| [`wilson_ci.ts`](./wilson_ci.ts) | Runnable Wilson 90% confidence interval calculator with worked examples |
| [`polling-spec.md`](./polling-spec.md) | Full specification: polling cadence, query pre-registration, refund-trigger logic, four-checkin trajectory |
| [`platform-independence.md`](./platform-independence.md) | Why ChatGPT/Perplexity/Google AI Overviews/Brave must be measured independently — what each rewards |
| [`schema/polling-output.schema.json`](./schema/polling-output.schema.json) | JSON Schema for polling outputs |
| [`examples/sample-queries.csv`](./examples/sample-queries.csv) | Example 15-query pre-registration set (fictional Lumenford workspace studio) |
| [`examples/sample-output.json`](./examples/sample-output.json) | Synthetic/anonymized polling output: per-platform citation rate + Wilson 90% CI |
| [`references.md`](./references.md) | Academic citations: Wilson (1927), Brown/Cai/DasGupta (2001), and others |
| [`glossary.md`](./glossary.md) | Canonical terms used across AORAFORGE methodology and reports |
| [`FAQ.md`](./FAQ.md) | Buyer and reviewer questions about confidence intervals, examples, and platform claims |

## Five core principles

### 1. Repeated polling, not one-shot audits

Ask ChatGPT the same question twice and you'll get a different list of named sources almost every time. A 2025 study by **SparkToro and Gumshoe** found high variance in AI brand recommendations across repeated prompts and participants; see [`references.md`](./references.md) for the direct source link and caveats.

A single audit measurement is below the noise floor. We poll each `(query, platform)` pair enough times to bound a real interval, then report that interval — not a single number.

### 2. Wilson 90% confidence intervals on every rate

When you have a binary outcome ("brand cited or not") across `n` polls with `k` successes, the **Wilson score interval** ([Wilson 1927](https://www.jstor.org/stable/2276774)) gives a tight, well-calibrated bound that doesn't over-claim certainty when `n` is small.

We report two-sided 90% confidence intervals (`z = 1.645`) because:
- 95% intervals are needlessly wide for marketing measurement
- 90% is the same threshold A/B testing platforms (Optimizely, GrowthBook) default to for non-critical decisions
- Wilson outperforms the naive Wald interval at small `n`, and remains well-calibrated up to `n = 10,000+` ([Brown, Cai, DasGupta 2001](https://projecteuclid.org/journals/statistical-science/volume-16/issue-2/Interval-Estimation-for-a-Binomial-Proportion/10.1214/ss/1009213286.full))

See `wilson_ci.ts` for the implementation. Run it with `bun wilson_ci.ts` to see worked examples.

### 3. Four-platform independence

AORAFORGE reports each platform separately, with its own confidence interval. **Aggregating to a single rate hides the gap.**

A brand might be cited 70% on Perplexity, 30% on Google AI Overviews, 50% on ChatGPT, and 60% on Brave — for the same query. The aggregate is meaningless. The per-platform breakdown tells you which fix moves which platform.

| Platform | Pulls from | What moves the needle |
|---|---|---|
| **Perplexity** | Live web search + Reddit/Quora heavily weighted | Long Reddit threads, Quora answers, recent freshness |
| **ChatGPT** | Training data + `web_search` retrieval | Long-form expert content, schema.org markup, Wikipedia mentions |
| **Google AI Overviews** | Google Search index + featured-snippet logic | Schema markup, FAQ pages, Bing/IndexNow cross-listing |
| **Brave Search** | Independent web crawl + ranking | Brave-friendly content, structured data, methodology essays. AORAFORGE treats Brave as a Claude-adjacent retrieval proxy where Claude web search depends on Brave-provided results, but reports Brave as its own platform. |

> **Why Brave, not Claude directly?** Anthropic documents Claude web search as a web-search tool, while Brave documents an independent search API and index. AORAFORGE's operational assumption is that Brave visibility is the cleanest substrate signal for Claude-adjacent retrieval. We therefore report Brave directly and avoid double-counting a separate Claude column unless a customer explicitly asks for Claude end-user polling.

### 4. Four-checkin trajectory

A single end-of-window measurement can't separate "the work landed" from "the index hadn't crawled yet."

We poll each engineered thread at **Day 7, 14, 21, and 30**. The trajectory tells you which:
- **Compounding** — `0.20 → 0.45 → 0.65 → 0.70` — work is gaining authority
- **Decaying** — `0.70 → 0.60 → 0.40 → 0.25` — newer competitor content overtaking; refresh schedule
- **Lagging** — `0.00 → 0.00 → 0.05 → 0.30` — platform hadn't caught up yet; Day-60 follow-up will likely show higher

Three patterns, three different findings. Aggregating to a single number loses all of it.

### 5. Pre-registered queries + binary refund triggers

A guarantee the vendor decides whether they met is not a guarantee. A measurement where the vendor picks what to measure is not a measurement. The standard is: **lock the goalposts before the kick.**

AORAFORGE's $2,799 AI Search Citation Pack ships with two locks:

- **Lock 1** — the 15 target queries are agreed at the Day-0 kickoff and never silently swapped mid-engagement
- **Lock 2** — the refund trigger is binary: fewer than 5 of 15 pre-registered queries showing at least one cited brand thread by Day 45 → full refund. No partial refunds. No clawbacks. The polling logs are provided to the customer; the citation parser is deterministic.

This mirrors how clinical trials report endpoints. The result is meaningful only if the goalposts can't move after the trial begins.

See `polling-spec.md` for the formal spec.

## Replication

```bash
git clone https://github.com/minyansh7/aoraforge-methodology
cd aoraforge-methodology
bun install
bun wilson_ci.ts        # Worked examples + edge cases
bun run validate        # Links, schema, sample output intervals
```

Reading order:
1. `polling-spec.md` — what we measure and how
2. `wilson_ci.ts` — the math, runnable
3. `platform-independence.md` — why one number isn't enough
4. `examples/` — what the data actually looks like
5. `references.md` — academic foundations
6. `llms.txt` — AI-readable repo map and trust boundaries

## License

[MIT](./LICENSE) — copy, fork, audit, replicate. Better methodology should win.

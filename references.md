# References

Academic and industry references used in this methodology repo.

## Statistical foundations

**Wilson, E.B. (1927).** Probable Inference, the Law of Succession, and Statistical Inference. *Journal of the American Statistical Association* 22(158): 209-212. [JSTOR](https://www.jstor.org/stable/2276774). Retrieved 2026-05-12.
The original derivation of the Wilson score interval.

**Brown, L.D., Cai, T.T., DasGupta, A. (2001).** Interval Estimation for a Binomial Proportion. *Statistical Science* 16(2): 101-117. [Project Euclid](https://projecteuclid.org/journals/statistical-science/volume-16/issue-2/Interval-Estimation-for-a-Binomial-Proportion/10.1214/ss/1009213286.full). Retrieved 2026-05-12.
Comparative study of binomial-proportion intervals (Wald, Wilson, Agresti-Coull, Jeffreys, exact). Wilson recommended for `n` from small to ~10,000+; remains well-calibrated near boundaries.

**Agresti, A., Coull, B.A. (1998).** Approximate is Better than "Exact" for Interval Estimation of Binomial Proportions. *The American Statistician* 52(2): 119-126.
Why the naive Wald interval is badly miscalibrated near `p=0` and `p=1`.

## Pre-registration discipline

**International Committee of Medical Journal Editors (ICMJE) (2007).** Clinical trial registration: a statement from the International Committee of Medical Journal Editors. [icmje.org](https://www.icmje.org/recommendations/browse/publishing-and-editorial-issues/clinical-trial-registration.html). Retrieved 2026-05-12.
The convention AORAFORGE mirrors for query and refund-trigger pre-registration. Goalposts locked before measurement; result is meaningful only when locks hold.

**Nosek, B.A., Ebersole, C.R., DeHaven, A.C., Mellor, D.T. (2018).** The preregistration revolution. *PNAS* 115(11): 2600–2606.
Why pre-registration matters in any inferential measurement, not just trials.

## AI search citation behavior

**SparkToro + Gumshoe (2025).** *New Research: AIs Are Highly Inconsistent When Recommending Brands or Products; Marketers Should Take Care When Tracking AI Visibility.* [SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/). Retrieved 2026-05-12.
AORAFORGE cites this as the empirical basis for repeated polling. The exact figures in public copy should follow the source text; methodology claims here rely on the broad finding that repeated AI brand recommendations are highly variable.

**SparkToro (2024).** *2024 Zero-Click Search Study.* [SparkToro](https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-360-clicks-go-to-the-open-web-in-the-eu-its-374/). Retrieved 2026-05-12.
Background on click-through erosion that makes AI search citation visibility commercially load-bearing.

## Platform-specific behavior

The platform-independence reasoning draws on first-party documentation plus observed crawl/retrieval behavior. Where behavior is inferred, AORAFORGE labels it as observed or operational rather than first-party documented.

- **OpenAI** — Web search tool documentation. [OpenAI docs](https://platform.openai.com/docs/guides/tools-web-search). Retrieved status checked 2026-05-12; site may challenge automated requests.
- **Brave Search** — public Search API documentation. [Brave Search API docs](https://api-dashboard.search.brave.com/app/documentation/web-search/get-started). Retrieved 2026-05-12.
- **Anthropic** — web search tool documentation. [Anthropic docs](https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/web-search-tool). Retrieved 2026-05-12. AORAFORGE uses Brave as a Claude-adjacent retrieval proxy where Claude depends on Brave-provided results; it does not claim Brave output and Claude output are identical.
- **Perplexity** — search/API documentation. [Perplexity docs](https://docs.perplexity.ai/docs/search/quickstart). Retrieved 2026-05-12. Weighting toward Reddit/Quora is observed empirically, not officially documented.
- **Google** — AI Overviews product documentation. [Google Search Help](https://support.google.com/websearch/answer/14901683). Retrieved 2026-05-12. Selection logic is not fully public; AORAFORGE treats platform-specific ranking claims as observed behavior.

Where platform behavior is inferred rather than documented, polls drive the model — not vice versa.

## Industry conventions referenced

**Optimizely / GrowthBook documentation.** A/B testing tools commonly support or discuss 90% confidence/significance conventions for non-critical decisions. [Optimizely stats engine docs](https://docs.developers.optimizely.com/feature-experimentation/docs/stats-engine) and [GrowthBook statistics docs](https://docs.growthbook.io/statistics/overview). Retrieved 2026-05-12. Cited as industry context, not as a universal standard.

**FiveThirtyEight election forecasting (2008–present).** Public-facing example of reporting probabilities with explicit confidence bounds. Convention AORAFORGE mirrors: never report a single number without an interval next to it.

## Updates

Material additions or revisions to references commit with a `refs:` prefix. If you spot a missing or stale citation, open an issue or PR.

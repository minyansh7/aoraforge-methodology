# References

Academic and industry references used in this methodology repo.

## Statistical foundations

**Wilson, E.B. (1927).** Probable Inference, the Law of Succession, and Statistical Inference. *Journal of the American Statistical Association* 22(158): 209–212. [JSTOR](https://www.jstor.org/stable/2276774).
The original derivation of the Wilson score interval.

**Brown, L.D., Cai, T.T., DasGupta, A. (2001).** Interval Estimation for a Binomial Proportion. *Statistical Science* 16(2): 101–117. [Project Euclid](https://projecteuclid.org/journals/statistical-science/volume-16/issue-2/Interval-Estimation-for-a-Binomial-Proportion/10.1214/ss/1009213286.full).
Comparative study of binomial-proportion intervals (Wald, Wilson, Agresti-Coull, Jeffreys, exact). Wilson recommended for `n` from small to ~10,000+; remains well-calibrated near boundaries.

**Agresti, A., Coull, B.A. (1998).** Approximate is Better than "Exact" for Interval Estimation of Binomial Proportions. *The American Statistician* 52(2): 119–126.
Why the naive Wald interval is badly miscalibrated near `p=0` and `p=1`.

## Pre-registration discipline

**International Committee of Medical Journal Editors (ICMJE) (2007).** Clinical trial registration: a statement from the International Committee of Medical Journal Editors. [icmje.org](https://www.icmje.org/recommendations/browse/publishing-and-editorial-issues/clinical-trial-registration.html).
The convention AORA mirrors for query and refund-trigger pre-registration. Goalposts locked before measurement; result is meaningful only when locks hold.

**Nosek, B.A., Ebersole, C.R., DeHaven, A.C., Mellor, D.T. (2018).** The preregistration revolution. *PNAS* 115(11): 2600–2606.
Why pre-registration matters in any inferential measurement, not just trials.

## AI search citation behavior

**SparkToro + Gumshoe (2025).** *AI Search Brand Visibility Study.* 2,961 prompt-tests across 600 volunteers. Key finding: AI search returns the same brand list <1% of the time when asked the same question twice; rank order matches on ~1 in 1,000 runs. [Search "SparkToro AI search brand visibility 2025" — full report on sparktoro.com.]
The empirical foundation for AORA's repeated-polling methodology. A single audit measurement is below the noise floor.

**Pew Research Center (2024).** *More than half of Google searches end without a click.* [pewresearch.org](https://www.pewresearch.org).
Background on the click-through erosion that makes AI search citation visibility commercially load-bearing.

## Platform-specific behavior

The platform-independence reasoning draws on first-party documentation and observed crawl/retrieval behavior:

- **OpenAI** — `gpt-4o` model card and `web_search` tool documentation
- **Anthropic** — `claude-sonnet-4-5` model card; `web_search` tool ([Anthropic docs on `web_search`](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/web-search-tool)) routes through Brave
- **Perplexity** — `sonar-pro` API; weighting toward Reddit/Quora is observed empirically, not officially documented
- **Google** — AI Overviews surface from `udm=14` mode; selection logic blended from featured-snippet and retrieval-augmented generation. No public spec; behavior inferred from large-N observation.

Where platform behavior is inferred rather than documented, polls drive the model — not vice versa.

## Industry conventions referenced

**Optimizely / GrowthBook documentation.** A/B testing platforms commonly default to 90% confidence for non-critical decisions. Cited as the convention behind AORA's choice of 90% (vs. 95%).

**FiveThirtyEight election forecasting (2008–present).** Public-facing example of reporting probabilities with explicit confidence bounds. Convention AORA mirrors: never report a single number without an interval next to it.

## Updates

Material additions or revisions to references commit with a `refs:` prefix. If you spot a missing or stale citation, open an issue or PR.

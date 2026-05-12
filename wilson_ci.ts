#!/usr/bin/env bun
/**
 * Wilson 90% confidence interval for a binomial proportion.
 *
 * Reference:
 *   Wilson, E.B. (1927). Probable Inference, the Law of Succession, and
 *   Statistical Inference. Journal of the American Statistical Association
 *   22(158): 209–212. https://www.jstor.org/stable/2276774
 *
 *   Brown, L.D., Cai, T.T., DasGupta, A. (2001). Interval Estimation for a
 *   Binomial Proportion. Statistical Science 16(2): 101–117.
 *
 * Why Wilson:
 *   At small n (which AI-search polling usually has — 30–500 polls per
 *   query/platform pair), the naive Wald interval (p̂ ± z·√(p̂(1−p̂)/n)) is
 *   badly miscalibrated, especially near p=0 and p=1. Wilson stays
 *   well-calibrated across the full [0,1] range and degrades gracefully.
 *
 * Why 90% (two-sided z = 1.645):
 *   Industry default for non-critical A/B testing decisions (Optimizely,
 *   GrowthBook). 95% intervals are wider than needed for marketing
 *   measurement and reduce the *useful* signal — wide intervals look like
 *   noise when they're really just over-cautious.
 */

export interface WilsonInterval {
  /** Maximum-likelihood estimate of the proportion (k/n). */
  p: number;
  /** Lower bound of the 90% confidence interval. */
  lower: number;
  /** Upper bound of the 90% confidence interval. */
  upper: number;
  /** Width of the interval (upper - lower). Useful for "is this stable?" decisions. */
  width: number;
  /** Number of trials. */
  n: number;
  /** Number of successes. */
  k: number;
}

/**
 * Compute the Wilson score interval for a binomial proportion.
 *
 * @param successes  Count of polls in which the brand was cited (k).
 * @param trials     Total number of polls for the (query, platform) pair (n).
 * @param confidence Confidence level (default 0.90 → z = 1.645).
 *                   Pass 0.95 for 95% (z = 1.96), 0.99 for 99% (z = 2.576).
 */
export function wilsonInterval(
  successes: number,
  trials: number,
  confidence: number = 0.9,
): WilsonInterval {
  if (trials <= 0) throw new Error("trials must be > 0");
  if (successes < 0 || successes > trials)
    throw new Error("successes must be in [0, trials]");

  const z = zForConfidence(confidence);
  const n = trials;
  const k = successes;
  const p = k / n;

  // Wilson score interval — see Brown/Cai/DasGupta 2001 §2.1.
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const halfWidth = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;

  const lower = Math.max(0, center - halfWidth);
  const upper = Math.min(1, center + halfWidth);

  return { p, lower, upper, width: upper - lower, n, k };
}

/**
 * Two-tailed z-score for a given confidence level.
 * Closed-form for the few we actually use; faster + dependency-free.
 */
function zForConfidence(confidence: number): number {
  // Common cases hardcoded; otherwise use rational approximation.
  if (Math.abs(confidence - 0.9) < 1e-9) return 1.6448536269514722;
  if (Math.abs(confidence - 0.95) < 1e-9) return 1.959963984540054;
  if (Math.abs(confidence - 0.99) < 1e-9) return 2.5758293035489004;
  // Beasley-Springer-Moro inverse normal approximation.
  return invNormalCdf(1 - (1 - confidence) / 2);
}

/** Beasley-Springer-Moro inverse normal CDF. Accurate to ~1e-9 in the tails. */
function invNormalCdf(p: number): number {
  // Coefficients from Acklam's algorithm.
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
        q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

/**
 * Format a Wilson interval as the canonical AORAFORGE report string.
 * e.g. "12/30 = 40.0% [25.6%, 55.9%]"
 */
export function formatInterval(ci: WilsonInterval): string {
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  return `${ci.k}/${ci.n} = ${pct(ci.p)} [${pct(ci.lower)}, ${pct(ci.upper)}]`;
}

// ─────────────────────────────────────────────────────────────────────────
// Worked examples — run with: bun wilson_ci.ts
// ─────────────────────────────────────────────────────────────────────────
if (import.meta.main) {
  console.log("Wilson 90% CI — worked examples");
  console.log("─".repeat(60));

  const examples = [
    {
      label: "Stable winner — narrow interval, high p",
      k: 27,
      n: 30,
      note: "Cited 27 of 30 times on Perplexity for 'best modular desk studio Lumenford'.",
    },
    {
      label: "Stable loser — narrow interval, low p",
      k: 1,
      n: 30,
      note: "Cited 1 of 30 times. Reliably invisible.",
    },
    {
      label: "Contested — wide interval, ambiguous",
      k: 12,
      n: 30,
      note: "Cited 12 of 30. AI is undecided; engineering work has runway.",
    },
    {
      label: "Tiny sample — Wilson handles edge gracefully",
      k: 2,
      n: 5,
      note: "5 polls is below recommended; Wilson still bounds correctly.",
    },
    {
      label: "Boundary — k=0",
      k: 0,
      n: 30,
      note: "Wilson keeps lower bound at 0 (no negative probabilities).",
    },
    {
      label: "Boundary — k=n",
      k: 30,
      n: 30,
      note: "Wilson keeps upper bound at 1.",
    },
    {
      label: "Larger sample — interval tightens",
      k: 120,
      n: 300,
      note: "Same p̂ as the contested case, 10× n. Interval ~3× narrower.",
    },
  ];

  for (const ex of examples) {
    const ci = wilsonInterval(ex.k, ex.n);
    console.log(`\n${ex.label}`);
    console.log(`  ${formatInterval(ci)}`);
    console.log(`  Width: ${(ci.width * 100).toFixed(1)} percentage points`);
    console.log(`  ${ex.note}`);
  }

  // Demonstrate why Wald fails near boundaries.
  console.log("\n" + "─".repeat(60));
  console.log("Why Wilson, not Wald — near p̂=0:");
  const k = 0,
    n = 30;
  const p_hat = k / n;
  const z = 1.645;
  const waldHalf = z * Math.sqrt((p_hat * (1 - p_hat)) / n);
  console.log(
    `  Wald (naive):    ${(p_hat * 100).toFixed(1)}% ± ${(waldHalf * 100).toFixed(1)}pp → [${(Math.max(0, p_hat - waldHalf) * 100).toFixed(1)}%, ${(Math.min(1, p_hat + waldHalf) * 100).toFixed(1)}%]`,
  );
  console.log(
    `  Wilson:          ${formatInterval(wilsonInterval(k, n))}`,
  );
  console.log(
    `  Wald collapses to a degenerate point [0%, 0%]; Wilson honestly reports the upper uncertainty.`,
  );
}

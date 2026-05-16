# FAQ

## Are the examples real customer data?

The public examples are labeled. `synthetic` means documentation-only, `anonymized-real` means real polling with identifying details removed, and `customer-approved-public` means a customer approved the data for publication.

## Why use 90% confidence intervals?

AORAFORGE reports two-sided 90% Wilson confidence intervals because this is a measurement product for marketing decisions, not a medical or safety-critical trial. The interval is still explicit, reproducible, and less overconfident than a point estimate.

## Why Wilson instead of a simple plus/minus margin?

The simple Wald interval fails badly near 0% and 100%, which are common in citation visibility. Wilson stays bounded and better calibrated at the sample sizes used in polling.

## Why not report one AI visibility score?

One score hides the action. A brand can be strong in Google AI Overviews and weak in Perplexity for the same query. AORAFORGE may show a summary to help readers navigate, but the measurement claim is always per-platform.

## Does Brave equal Claude?

No. Brave is treated as a Claude-adjacent retrieval proxy where Claude web search depends on Brave-provided results, but Claude can still add its own prompt and answer behavior. Customers who need end-user Claude behavior can add a separate Claude polling column.

## Can a query be swapped if it performs badly?

No. Locked queries are a finding too. If no platform cites any brand for a pre-registered query, the result says something useful about the market and the wording of that query.

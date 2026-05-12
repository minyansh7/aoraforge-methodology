import sampleOutput from "../examples/sample-output.json" with { type: "json" };
import schema from "../schema/polling-output.schema.json" with { type: "json" };
import { readFileSync } from "node:fs";
import { wilsonInterval } from "../wilson_ci";

type Json = Record<string, unknown>;

const errors: string[] = [];

function requireField(obj: Json, field: string, path: string): unknown {
  if (!(field in obj)) errors.push(`${path} is missing required field ${field}`);
  return obj[field];
}

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assert(condition: boolean, message: string): void {
  if (!condition) errors.push(message);
}

assert(sampleOutput.$schema === schema.$id, "sample-output.json $schema does not match schema $id");

for (const field of schema.required as string[]) {
  requireField(sampleOutput as Json, field, "sample-output.json");
}

assert(
  ["synthetic", "anonymized-real", "customer-approved-public"].includes(
    String(sampleOutput.example_status),
  ),
  "example_status must label the public/private boundary",
);

const platforms = new Set(sampleOutput.platforms as string[]);
const queries = sampleOutput.queries;
assert(Array.isArray(queries) && queries.length > 0, "queries must be a non-empty array");

const sampleQueriesCsv = readFileSync(new URL("../examples/sample-queries.csv", import.meta.url), "utf8");
const [csvHeader, ...csvRows] = sampleQueriesCsv.trim().split("\n");
assert(
  csvHeader === "id,query,intent_class,locked_at,example_status,notes",
  "sample-queries.csv must include the example_status boundary label",
);
for (const [index, row] of csvRows.entries()) {
  assert(row.includes(",synthetic,"), `sample-queries.csv row ${index + 2} must be labeled synthetic`);
}

if (Array.isArray(queries)) {
  for (const query of queries) {
    if (!isObject(query)) {
      errors.push("query entries must be objects");
      continue;
    }

    const queryId = String(query.id);
    const results = query.results;
    assert(isObject(results), `${queryId}.results must be an object`);
    if (!isObject(results)) continue;

    for (const [platform, result] of Object.entries(results)) {
      assert(platforms.has(platform), `${queryId}.${platform} is not listed in platforms`);
      if (!isObject(result)) {
        errors.push(`${queryId}.${platform} result must be an object`);
        continue;
      }

      const checkins = result.checkins;
      assert(Array.isArray(checkins) && checkins.length > 0, `${queryId}.${platform}.checkins missing`);
      if (!Array.isArray(checkins)) continue;

      for (const checkin of checkins) {
        if (!isObject(checkin)) {
          errors.push(`${queryId}.${platform}.checkin must be an object`);
          continue;
        }

        const path = `${queryId}.${platform}.day${checkin.day}`;
        const polls = Number(checkin.polls);
        const cited = Number(checkin.cited);
        assert(Number.isInteger(polls) && polls > 0, `${path}.polls must be a positive integer`);
        assert(Number.isInteger(cited) && cited >= 0 && cited <= polls, `${path}.cited out of range`);
        if (!Number.isInteger(polls) || !Number.isInteger(cited) || cited > polls) continue;

        const ci = wilsonInterval(cited, polls);
        assert(Math.abs(Number(checkin.rate) - ci.p) < 0.001, `${path}.rate does not match cited/polls`);
        assert(
          Math.abs(Number(checkin.ci90_lower) - ci.lower) < 0.001,
          `${path}.ci90_lower does not match wilson_ci.ts`,
        );
        assert(
          Math.abs(Number(checkin.ci90_upper) - ci.upper) < 0.001,
          `${path}.ci90_upper does not match wilson_ci.ts`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Example output validates against required fields and Wilson intervals.");

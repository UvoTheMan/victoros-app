// ============================================================
// WEEK 16 — BigQuery: Cloud Data Warehousing
// Days 76–80 | 28 September – 2 October 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK16 = [

  // ============================================================
  // DAY 76 — BigQuery Fundamentals: Projects, Datasets, Tables
  // ============================================================
  {
    id: "W16D1", week: 16, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-28",
    type: "lesson",
    topic: "BigQuery Fundamentals: Projects, Datasets, Tables & Querying Public Data",
    duration: "2–3 hours",

    objectives: [
      "Navigate the BigQuery console and create a dataset",
      "Query public BigQuery datasets using standard SQL",
      "Explain what makes BigQuery's architecture different from PostgreSQL",
      "Identify the key syntax differences between BigQuery SQL and PostgreSQL",
    ],

    introduction: `
Everything you've learned about SQL since Week 9 transfers
directly here — BigQuery is SQL-native, and most of your PostgreSQL
knowledge applies immediately. What's new is the ARCHITECTURE
underneath: BigQuery is Google's fully managed, serverless data
warehouse, built to scale from a handful of rows to trillions
without you ever touching infrastructure. This is genuinely one of
the most important tools in modern data engineering, and you can
practice everything this week for free — BigQuery's free tier
(1TB of queries/month, forever) covers everything you'll do here.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital System's Central Research Warehouse, Not the Ward's Live Chart System"

PostgreSQL (Weeks 9-13) is like a single hospital's live patient
record system — fast for individual transactions, built for one
operational unit. BigQuery is like a national health research
warehouse aggregating de-identified records from THOUSANDS of
hospitals — not built for "update this one patient's allergy
right now," but exceptionally good at "find every patient across
5 years and 200 hospitals matching this complex pattern." Same
underlying SQL skills, fundamentally different scale and purpose.
    `,

    explanation: `
KEY ARCHITECTURAL DIFFERENCES FROM POSTGRESQL
===================================================
SERVERLESS    : no instances to provision, patch, or scale — you
                 just run queries, Google handles all infrastructure
COLUMNAR STORAGE : data is stored COLUMN by column, not row by row
                 — this makes "scan this one column across billions
                 of rows" dramatically faster than a row-store like
                 PostgreSQL, at the cost of being worse for single-
                 row lookups (which OLTP systems like PostgreSQL
                 handle far better)
AUTO-SCALING   : the same query syntax works whether the table has
                 100 rows or 100 billion — BigQuery scales compute
                 behind the scenes automatically

GCP HIERARCHY: PROJECT -> DATASET -> TABLE
================================================
Project   : your top-level GCP project (from Week 15)
Dataset   : a named collection of tables (similar to a "schema" in
            PostgreSQL terms)
Table     : the actual structured data, same concept as PostgreSQL

CREATE SCHEMA hospital_warehouse;   -- PostgreSQL equivalent concept
-- In BigQuery, you create a DATASET instead, via console or:
bq mk --dataset victoros_hospital_de:hospital_warehouse

QUERYING A PUBLIC DATASET
==============================
BigQuery hosts terabytes of free public datasets. Try this
directly in the BigQuery console's query editor:

SELECT
  name,
  COUNT(*) AS births
FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
WHERE state = 'CA'
GROUP BY name
ORDER BY births DESC
LIMIT 10;

Note the backtick-quoted, fully-qualified table reference:
\`project.dataset.table\` — this is BigQuery's standard way of
referencing tables, and you'll use this pattern constantly.

KEY SQL SYNTAX DIFFERENCES FROM POSTGRESQL
================================================
- Table references use backticks and the full project.dataset.table
  path, not just a bare table name
- String concatenation: CONCAT(a, b) works in both, but BigQuery
  also supports a || b
- Date functions differ slightly: BigQuery uses DATE_DIFF(),
  DATE_ADD() with explicit INTERVAL units like PostgreSQL, but with
  some different function names (e.g. EXTRACT works the same way
  in both, which is reassuring)
- No native UPDATE/DELETE performance characteristics like an OLTP
  database — BigQuery supports them syntactically, but they're not
  designed for high-frequency row-level changes the way PostgreSQL is
- LIMIT works the same; ORDER BY, GROUP BY, window functions, CTEs
  (everything from Weeks 10-11) all work essentially identically

UNDERSTANDING THE FREE TIER
================================
1 TB of query processing per month — free, forever, no credit card
charge as long as you stay under this
10 GB of storage — free, forever
Practicing with public datasets and your own modest project data
this week will not incur any cost.
    `,

    clinicalConnection: `
Querying bigquery-public-data.usa_names across a century of
names mirrors exactly the kind of large-scale epidemiological
research query a public health researcher might run — "show me
trends across millions of records over decades" — a fundamentally
different task from a single hospital's day-to-day patient lookup,
and exactly the workload BigQuery's architecture is purpose-built
for.
    `,

    example: `
-- All run directly in the BigQuery console query editor —
-- no setup beyond having a GCP project from Week 15

-- 1. Query a public dataset directly
SELECT
  name,
  gender,
  SUM(number) AS total_births
FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
WHERE state = 'NY'
GROUP BY name, gender
ORDER BY total_births DESC
LIMIT 10;

-- 2. Create your own dataset (via bq CLI)
-- bq mk --dataset victoros-hospital-de:hospital_warehouse

-- 3. Create a simple table inside your new dataset
CREATE TABLE \`victoros-hospital-de.hospital_warehouse.departments\` (
  department_id INT64,
  name STRING
);

INSERT INTO \`victoros-hospital-de.hospital_warehouse.departments\`
VALUES (1, 'Cardiology'), (2, 'Endocrinology');

SELECT * FROM \`victoros-hospital-de.hospital_warehouse.departments\`;

-- 4. A window function, identical syntax to PostgreSQL (Week 10)
SELECT
  name,
  total_births,
  RANK() OVER (ORDER BY total_births DESC) AS popularity_rank
FROM (
  SELECT name, SUM(number) AS total_births
  FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
  WHERE state = 'CA'
  GROUP BY name
)
LIMIT 10;
    `,

    commonMistakes: [
      "Forgetting the backtick-quoted, fully-qualified project.dataset.table reference, which is required syntax in BigQuery unlike PostgreSQL's bare table names.",
      "Expecting row-level UPDATE/DELETE performance comparable to PostgreSQL — BigQuery is architecturally optimised for large analytical scans, not frequent small transactional changes.",
      "Running a query against a truly massive public dataset without first checking estimated bytes processed (shown in the console before running), potentially consuming a meaningful chunk of the free monthly quota unnecessarily.",
      "Assuming a dataset is the same thing as a project — a dataset is a collection of tables WITHIN a project, one level down in the hierarchy.",
    ],

    exercises: [
      "Query the bigquery-public-data.usa_names public dataset to find the most popular name in your own state/region equivalent for the most recent year available.",
      "Create your own dataset and a simple 2-column table inside it, insert a few rows, and query them back.",
      "Rewrite one of your Week 10 PostgreSQL window function queries to run against a BigQuery public dataset instead, confirming the syntax transfers with minimal changes.",
      "Before running a query against a large public table, check the console's estimated bytes processed indicator, and write down what you observed.",
    ],

    resources: [
      {
        objective: "Get querying BigQuery within minutes",
        items: [
          { title: "Google Cloud — BigQuery Quickstart: Query a Public Dataset", url: "https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-console", type: "official tutorial", note: "Gets you running real queries in under 5 minutes — start here today." },
          { title: "DataCamp — BigQuery Tutorial for Beginners (Free Article)", url: "https://www.datacamp.com/tutorial/beginners-guide-to-bigquery", type: "article", note: "Written by a data engineer with a 10+ petabyte BigQuery background — read in full before the hands-on labs." },
        ],
      },
      {
        objective: "Practice hands-on in a real GCP environment",
        items: [
          { title: "Google Cloud Skills Boost — BigQuery for Data Analysts (Quest)", url: "https://www.cloudskillsboost.google/paths/1", type: "interactive labs", note: "Continue or start this quest — 5 hands-on labs in a real (not simulated) GCP environment." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 77 — Loading Data into BigQuery
  // ============================================================
  {
    id: "W16D2", week: 16, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-29",
    type: "lesson",
    topic: "Loading Data into BigQuery: From GCS, CSV & Python",
    duration: "2–3 hours",

    objectives: [
      "Load data into BigQuery from a GCS bucket",
      "Load data directly from a local CSV via the console and CLI",
      "Use Python (google-cloud-bigquery and pandas-gbq) to load DataFrames",
      "Choose appropriate schema definition and load strategies",
    ],

    introduction: `
Yesterday you queried data that was already there. Today closes
the loop with your Week 15 data lake — moving data FROM the GCS
processed/ zone INTO BigQuery, exactly the ELT pattern you read
about in Week 13 (load raw/clean data first, transform with SQL
inside the warehouse after). This is the real, practical bridge
between everything you've built so far and a genuine cloud data
warehouse.
    `,

    mentalModel: `
MENTAL MODEL — "Moving From the Receiving Dock to the Pharmacy Shelves"

Continuing Week 15's analogy: today is the actual physical
transfer from the receiving dock (GCS) onto the pharmacy's
organised shelving (BigQuery tables) — the moment unstructured
inventory becomes properly catalogued, queryable stock. Just like
a real pharmacy receiving process, you can load in bulk batches
(from GCS) or add items individually (from a local file or script)
depending on the situation.
    `,

    explanation: `
LOADING FROM GCS (THE STANDARD PRODUCTION PATTERN)
========================================================
bq load \\
    --source_format=PARQUET \\
    victoros_hospital_de:hospital_warehouse.patients \\
    gs://victoros-hospital-raw-data/processed/patients/2026-09-29/clean_patients.parquet

For CSV sources, BigQuery can auto-detect the schema, though
explicitly defining it is more reliable for production use:

bq load \\
    --source_format=CSV \\
    --autodetect \\
    victoros_hospital_de:hospital_warehouse.lab_results \\
    gs://victoros-hospital-raw-data/processed/lab_results/2026-09-29/*.csv

LOADING FROM A LOCAL FILE
==============================
bq load \\
    --source_format=CSV \\
    --skip_leading_rows=1 \\
    victoros_hospital_de:hospital_warehouse.departments \\
    ./departments.csv \\
    department_id:INTEGER,name:STRING

LOADING FROM PYTHON WITH google-cloud-bigquery
====================================================
pip install google-cloud-bigquery

from google.cloud import bigquery

client = bigquery.Client()

job_config = bigquery.LoadJobConfig(
    source_format=bigquery.SourceFormat.PARQUET,
    write_disposition="WRITE_APPEND",   # or WRITE_TRUNCATE for full refresh
)

uri = "gs://victoros-hospital-raw-data/processed/patients/2026-09-29/clean_patients.parquet"
table_id = "victoros-hospital-de.hospital_warehouse.patients"

load_job = client.load_table_from_uri(uri, table_id, job_config=job_config)
load_job.result()     # waits for the job to complete
print(f"Loaded {load_job.output_rows} rows into {table_id}")

write_disposition CONTROLS THE LOAD BEHAVIOUR:
WRITE_APPEND    : add new rows to existing data (incremental)
WRITE_TRUNCATE  : replace all existing data (full refresh, Week 13's term)
WRITE_EMPTY     : only load if the table is currently empty, error otherwise

LOADING A PANDAS DATAFRAME DIRECTLY (pandas-gbq)
======================================================
pip install pandas-gbq

import pandas as pd

df = pd.read_parquet("clean_patients.parquet")
df.to_gbq(
    destination_table="hospital_warehouse.patients",
    project_id="victoros-hospital-de",
    if_exists="append",     # 'append', 'replace', or 'fail' — same vocabulary as Week 12's to_sql()
)

This is the most direct continuation of your Week 12 pandas-to-
database pattern, just targeting BigQuery instead of PostgreSQL —
the mental model and even the if_exists vocabulary transfers almost
exactly.

DEFINING SCHEMAS EXPLICITLY (RECOMMENDED FOR PRODUCTION)
==============================================================
schema = [
    bigquery.SchemaField("patient_id", "INTEGER"),
    bigquery.SchemaField("full_name", "STRING"),
    bigquery.SchemaField("date_of_birth", "DATE"),
]
job_config = bigquery.LoadJobConfig(schema=schema, source_format=bigquery.SourceFormat.CSV)

Auto-detection is convenient for exploration, but explicit schemas
prevent surprises (e.g. a column accidentally inferred as STRING
when it should be INTEGER) in a production pipeline.
    `,

    clinicalConnection: `
write_disposition="WRITE_APPEND" for incrementally loading new
lab results, versus "WRITE_TRUNCATE" for a small reference table
like departments that should always exactly match a single source
of truth, mirrors exactly the same incremental-vs-full-refresh
decision from Week 13 — the same engineering judgment applies
regardless of whether the destination is PostgreSQL or BigQuery.
    `,

    example: `
import os
from google.cloud import bigquery
import pandas as pd

PROJECT_ID = "victoros-hospital-de"
DATASET_ID = "hospital_warehouse"


def load_parquet_from_gcs(table_name: str, gcs_uri: str, mode: str = "WRITE_APPEND") -> None:
    '''Load a Parquet file from GCS into a BigQuery table.'''
    client = bigquery.Client(project=PROJECT_ID)
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{table_name}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.PARQUET,
        write_disposition=mode,
    )
    load_job = client.load_table_from_uri(gcs_uri, table_id, job_config=job_config)
    load_job.result()
    print(f"Loaded {load_job.output_rows} rows into {table_id}")


def load_dataframe_directly(table_name: str, df: pd.DataFrame, mode: str = "append") -> None:
    '''Load a pandas DataFrame directly into BigQuery using pandas-gbq.'''
    df.to_gbq(
        destination_table=f"{DATASET_ID}.{table_name}",
        project_id=PROJECT_ID,
        if_exists=mode,
    )
    print(f"Loaded {len(df)} rows into {table_name} via pandas-gbq")


if __name__ == "__main__":
    today = "2026-09-29"
    gcs_path = f"gs://victoros-hospital-raw-data/processed/patients/{today}/clean_patients.parquet"
    load_parquet_from_gcs("patients", gcs_path)

    departments_df = pd.DataFrame({
        "department_id": [1, 2],
        "name": ["Cardiology", "Endocrinology"],
    })
    load_dataframe_directly("departments", departments_df, mode="replace")
    `,

    commonMistakes: [
      "Using WRITE_TRUNCATE on a large incrementally-growing table out of habit, accidentally wiping historical data that should have been appended to instead.",
      "Relying on schema auto-detection in a production pipeline and being surprised when a column's inferred type changes between loads due to a data quality issue in the source.",
      "Forgetting to call load_job.result(), which makes the load run asynchronously without your script actually waiting for it to finish before proceeding to query the 'loaded' data.",
      "Confusing pandas-gbq's if_exists vocabulary ('append'/'replace'/'fail', lowercase) with google-cloud-bigquery's write_disposition vocabulary ('WRITE_APPEND'/'WRITE_TRUNCATE', uppercase with prefix) — they're different APIs with different conventions.",
    ],

    exercises: [
      "Load a Parquet file from your Week 15 GCS processed/ zone into a new BigQuery table using the bq CLI or google-cloud-bigquery.",
      "Load the same data again using WRITE_APPEND, then query the table to confirm the row count doubled, demonstrating the append behaviour clearly.",
      "Use pandas-gbq's to_gbq() to load a small DataFrame you create directly in Python, with if_exists='replace'.",
      "Define an explicit schema for one load instead of relying on auto-detection, and confirm the resulting table's column types match exactly what you specified.",
    ],

    resources: [
      {
        objective: "Master loading data into BigQuery from multiple sources",
        items: [
          { title: "Google Cloud — BigQuery Documentation: Loading Data", url: "https://cloud.google.com/bigquery/docs/loading-data", type: "reference", note: "Official reference covering all load source types and write dispositions." },
          { title: "DataTalks.Club Zoomcamp — Module 3: Data Warehouse (BigQuery)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/03-data-warehouse", type: "video + hands-on lab", note: "Your primary hands-on resource this week — follow its loading examples directly." },
        ],
      },
      {
        objective: "Use pandas-gbq for direct DataFrame loading",
        items: [
          { title: "pandas-gbq official documentation", url: "https://googleapis.dev/python/pandas-gbq/latest/index.html", type: "reference", note: "Official reference for to_gbq() and read_gbq() functions." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 78 — Partitioning & Clustering for Cost and Performance
  // ============================================================
  {
    id: "W16D3", week: 16, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-30",
    type: "lesson",
    topic: "Partitioning & Clustering: Optimising BigQuery Cost and Performance",
    duration: "2–3 hours",

    objectives: [
      "Create date-partitioned tables and explain why partitioning saves cost",
      "Apply clustering to optimise filtered query performance",
      "Read query execution details to understand bytes processed and billed",
      "Combine partitioning and clustering appropriately for a realistic table",
    ],

    introduction: `
BigQuery bills primarily by BYTES PROCESSED per query, not by
time running a server — which means a poorly designed table can
make every single query unnecessarily expensive, scanning far more
data than needed. Partitioning and clustering are BigQuery's two
core tools for avoiding this, conceptually similar to indexing in
PostgreSQL (Week 10-11), but working completely differently under
the hood due to BigQuery's columnar, distributed architecture.
    `,

    mentalModel: `
MENTAL MODEL — "Filing by Year, Then Alphabetising Within Each Year"

Partitioning is like a hospital records archive organised into
separate physical rooms BY YEAR — searching for "records from
March 2024" only requires opening the 2024 room, never touching
any other year's room at all. Clustering is the further
alphabetisation WITHIN each year's room — once you're in the 2024
room, records are also sorted by patient surname, so finding
"Okafor" doesn't require scanning every folder in the room, just
the relevant section.
    `,

    explanation: `
PARTITIONING — SPLITTING A TABLE BY DATE (MOST COMMON)
============================================================
CREATE TABLE \`victoros-hospital-de.hospital_warehouse.lab_results\`
(
  patient_id INT64,
  test_name STRING,
  result_value NUMERIC,
  result_date DATE
)
PARTITION BY result_date;

Once partitioned, a query filtering on result_date only scans the
relevant partition(s), not the entire table:

SELECT * FROM \`victoros-hospital-de.hospital_warehouse.lab_results\`
WHERE result_date = '2026-09-30';
-- Only scans the 2026-09-30 partition, dramatically reducing
-- bytes processed (and therefore cost) compared to scanning the
-- entire table's history.

A table with years of daily data, partitioned by date, can turn a
multi-terabyte full-table scan into a tiny single-day scan for a
query that only needs one day's data — this is frequently the
single biggest cost optimisation available in BigQuery.

CLUSTERING — SORTING WITHIN PARTITIONS
============================================
CREATE TABLE \`victoros-hospital-de.hospital_warehouse.lab_results\`
(
  patient_id INT64,
  test_name STRING,
  result_value NUMERIC,
  result_date DATE
)
PARTITION BY result_date
CLUSTER BY patient_id, test_name;

Clustering physically sorts data within each partition by the
specified columns, so a query filtering on patient_id or
test_name (in addition to the date partition filter) scans even
less data:

SELECT * FROM \`victoros-hospital-de.hospital_warehouse.lab_results\`
WHERE result_date = '2026-09-30' AND patient_id = 42;
-- Benefits from BOTH the date partition pruning AND clustering
-- on patient_id within that partition

Cluster column ORDER matters, similar to composite indexes in
PostgreSQL (Week 9) — list the most frequently filtered column first.

CHECKING BYTES PROCESSED BEFORE RUNNING A QUERY
====================================================
The BigQuery console shows an ESTIMATED bytes-processed figure
before you click "Run" — always check this for large tables,
exactly the discipline of checking EXPLAIN ANALYZE before assuming
a query is efficient (Week 10-11's habit, applied here).

-- Or programmatically with a dry run:
from google.cloud import bigquery
client = bigquery.Client()
job_config = bigquery.QueryJobConfig(dry_run=True, use_query_cache=False)
query_job = client.query("SELECT * FROM \`project.dataset.table\`", job_config=job_config)
print(f"This query will process {query_job.total_bytes_processed} bytes")

WHEN PARTITIONING AND CLUSTERING DON'T HELP
=================================================
- Tables small enough that a full scan is already cheap/fast —
  the overhead of partition management isn't worth it
- Queries that don't filter on the partition or cluster columns at
  all gain no benefit, the same way an unused index helps nothing
- Over-partitioning (e.g. by exact timestamp instead of date) can
  create too many tiny partitions, which has its own overhead
    `,

    clinicalConnection: `
Partitioning lab_results by date is exactly like a hospital
archiving records by year so that pulling "everyone tested last
Tuesday" never requires physically searching through a decade of
unrelated records — and clustering by patient_id within each day
is the further alphabetised sub-organisation that makes finding
one specific patient's results within that day's batch close to
instant rather than a manual search through every result from
that date.
    `,

    example: `
-- Creating a properly partitioned and clustered table, then
-- comparing query cost before and after

-- 1. Create the optimised table
CREATE TABLE \`victoros-hospital-de.hospital_warehouse.lab_results\`
(
  patient_id INT64,
  test_name STRING,
  result_value NUMERIC,
  result_date DATE
)
PARTITION BY result_date
CLUSTER BY patient_id, test_name;

-- 2. Load a year of synthetic lab result data (via Python/bq load,
--    as covered yesterday)

-- 3. Compare a date-filtered query's bytes processed against an
--    equivalent UNPARTITIONED table holding the same data
SELECT *
FROM \`victoros-hospital-de.hospital_warehouse.lab_results\`
WHERE result_date = '2026-09-30' AND patient_id = 42;
-- Check "bytes processed" in the console's query validator before
-- running — note this figure

-- 4. Run the dry-run check programmatically
from google.cloud import bigquery

client = bigquery.Client()
query = """
    SELECT * FROM \`victoros-hospital-de.hospital_warehouse.lab_results\`
    WHERE result_date = '2026-09-30' AND patient_id = 42
"""
job_config = bigquery.QueryJobConfig(dry_run=True)
job = client.query(query, job_config=job_config)
print(f"Estimated bytes processed: {job.total_bytes_processed}")
    `,

    commonMistakes: [
      "Partitioning by an overly granular value (like exact timestamp) instead of DATE, creating excessive numbers of tiny partitions with their own management overhead.",
      "Forgetting that partitioning only helps queries that actually FILTER on the partition column — a query without a WHERE clause on result_date scans every partition regardless.",
      "Clustering on columns that are rarely or never used in WHERE clauses, providing no real benefit while still incurring minor write overhead.",
      "Never checking estimated bytes processed before running a query against a genuinely large table, potentially consuming a meaningful chunk of the free monthly quota unnecessarily.",
    ],

    exercises: [
      "Create a partitioned and clustered version of one of your hospital tables, choosing sensible partition and cluster columns based on likely query patterns.",
      "Load a reasonably sized synthetic dataset into it (at least a few thousand rows spanning multiple dates).",
      "Run the same logical query against both a partitioned/clustered version and an unpartitioned version of the table, and compare estimated bytes processed for each.",
      "Write 2-3 sentences explaining, in your own words, when partitioning would NOT meaningfully help a given table.",
    ],

    resources: [
      {
        objective: "Master partitioning and clustering concepts and syntax",
        items: [
          { title: "Google Cloud — Introduction to Partitioned Tables", url: "https://cloud.google.com/bigquery/docs/partitioned-tables", type: "reference", note: "Official reference covering partition types and best practices." },
          { title: "Google Cloud — Clustered Tables", url: "https://cloud.google.com/bigquery/docs/clustered-tables", type: "reference", note: "Official reference for clustering syntax and column ordering guidance." },
        ],
      },
      {
        objective: "Practice cost-aware query design hands-on",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 3: Data Warehouse (BigQuery)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/03-data-warehouse", type: "video + hands-on lab", note: "Covers partitioning, clustering, and cost management in detail with hands-on exercises — your primary resource today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 79 — BigQuery from Python & Materialised Views
  // ============================================================
  {
    id: "W16D4", week: 16, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-01",
    type: "lesson",
    topic: "BigQuery from Python, Materialised Views & Cost Monitoring",
    duration: "2–3 hours",

    objectives: [
      "Run parameterised queries against BigQuery from Python",
      "Create and use materialised views in BigQuery",
      "Set up basic cost monitoring and budget alerts",
      "Combine everything into a reusable BigQuery query helper module",
    ],

    introduction: `
Today rounds out your BigQuery fundamentals before tomorrow's
dashboard project: querying programmatically from Python (rather
than just the console), BigQuery's own materialised view feature
(extending the Week 11 PostgreSQL concept to the cloud warehouse
context), and setting up basic guardrails so you never get
surprised by unexpected cost — even on the free tier, it's worth
building this habit now for when you work with paid GCP environments.
    `,

    mentalModel: `
MENTAL MODEL — "The Standing Morning Report vs Calling for a Fresh One Each Time"

A materialised view is like a hospital's standing morning report
— pre-compiled once, available instantly to read all day, refreshed
on a set schedule rather than re-compiled fresh every single time
someone wants to check it. Cost monitoring and budget alerts are
your equivalent of a spending threshold alert on a hospital
department's purchasing card — not preventing spend entirely, but
ensuring nobody is surprised by it after the fact.
    `,

    explanation: `
PARAMETERISED QUERIES FROM PYTHON
=======================================
from google.cloud import bigquery

client = bigquery.Client()

def get_patients_by_department(department_id: int):
    query = """
        SELECT full_name, date_of_birth
        FROM \`victoros-hospital-de.hospital_warehouse.patients\`
        WHERE department_id = @dept_id
        ORDER BY full_name
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("dept_id", "INT64", department_id)
        ]
    )
    return client.query(query, job_config=job_config).to_dataframe()

df = get_patients_by_department(2)
print(df)

Named parameters (@dept_id) protect against SQL injection exactly
like psycopg2's %s and SQLAlchemy's :name parameters did in
Weeks 12-13 — the same security principle, a different syntax.

to_dataframe() RETURNS RESULTS DIRECTLY AS PANDAS
=======================================================
Every BigQuery query result can convert straight into a pandas
DataFrame with .to_dataframe() — this is the most common pattern
for analysis-oriented BigQuery work in Python, connecting directly
back to everything you know from Phase 1's numpy/pandas work and
Week 12's SQLAlchemy patterns.

MATERIALISED VIEWS IN BIGQUERY
===================================
CREATE MATERIALIZED VIEW \`victoros-hospital-de.hospital_warehouse.daily_prescription_summary\`
AS
SELECT
  prescribed_date,
  COUNT(*) AS total_prescriptions,
  AVG(dose_mg) AS avg_dose
FROM \`victoros-hospital-de.hospital_warehouse.prescriptions\`
GROUP BY prescribed_date;

BigQuery automatically and incrementally keeps materialised views
up to date as the underlying table changes — unlike PostgreSQL's
manual REFRESH MATERIALIZED VIEW (Week 11), BigQuery handles
refresh automatically, trading a small amount of additional storage
and background compute for always-current results without any
explicit refresh step in your pipeline.

SETTING UP BUDGET ALERTS
=============================
Billing -> Budgets & Alerts -> Create Budget

Set a small budget (e.g. $1) with alert thresholds at 50%, 90%,
and 100% — for a learning project, this is mostly a habit-building
exercise since you're operating well within the free tier, but
it's the exact discipline you'll need the moment you (or a future
employer) operate at a scale where costs are real.

A REUSABLE QUERY HELPER MODULE
===================================
# bq_client.py
from google.cloud import bigquery
import pandas as pd

class BigQueryHelper:
    def __init__(self, project_id: str):
        self.client = bigquery.Client(project=project_id)

    def query_to_df(self, query: str, params: list = None) -> pd.DataFrame:
        job_config = bigquery.QueryJobConfig(query_parameters=params or [])
        return self.client.query(query, job_config=job_config).to_dataframe()

    def estimate_cost(self, query: str) -> int:
        job_config = bigquery.QueryJobConfig(dry_run=True)
        job = self.client.query(query, job_config=job_config)
        return job.total_bytes_processed

bq = BigQueryHelper("victoros-hospital-de")
df = bq.query_to_df("SELECT * FROM \`victoros-hospital-de.hospital_warehouse.departments\`")
    `,

    clinicalConnection: `
A materialised view automatically staying current as new
prescriptions are added mirrors exactly the kind of standing
clinical dashboard a department head would want — always reflecting
the latest data the moment they check it, without anyone needing to
remember to manually refresh a report each morning before reviewing
it.
    `,

    example: `
from google.cloud import bigquery
import pandas as pd

PROJECT_ID = "victoros-hospital-de"


class BigQueryHelper:
    '''Reusable helper for parameterised queries and cost estimation.'''

    def __init__(self, project_id: str):
        self.client = bigquery.Client(project=project_id)

    def query_to_df(self, query: str, params: list = None) -> pd.DataFrame:
        job_config = bigquery.QueryJobConfig(query_parameters=params or [])
        return self.client.query(query, job_config=job_config).to_dataframe()

    def estimate_bytes(self, query: str) -> int:
        job_config = bigquery.QueryJobConfig(dry_run=True)
        job = self.client.query(query, job_config=job_config)
        return job.total_bytes_processed


def get_department_summary(bq: BigQueryHelper, department_id: int) -> pd.DataFrame:
    query = """
        SELECT d.name, COUNT(p.patient_id) AS patient_count
        FROM \`victoros-hospital-de.hospital_warehouse.departments\` d
        LEFT JOIN \`victoros-hospital-de.hospital_warehouse.patients\` p
            ON d.department_id = p.department_id
        WHERE d.department_id = @dept_id
        GROUP BY d.name
    """
    params = [bigquery.ScalarQueryParameter("dept_id", "INT64", department_id)]
    return bq.query_to_df(query, params)


if __name__ == "__main__":
    bq = BigQueryHelper(PROJECT_ID)

    estimate = bq.estimate_bytes(
        "SELECT * FROM \`victoros-hospital-de.hospital_warehouse.patients\`"
    )
    print(f"Estimated bytes for full scan: {estimate}")

    summary = get_department_summary(bq, 1)
    print(summary)
    `,

    commonMistakes: [
      "Building SQL queries with Python f-strings instead of BigQuery's named parameters, reintroducing the SQL injection risk Week 12 specifically taught you to avoid.",
      "Forgetting that BigQuery materialised views handle refresh automatically, and writing unnecessary manual refresh logic that PostgreSQL required but BigQuery doesn't.",
      "Never setting up even a minimal budget alert, then being caught off guard later when working with larger, non-free-tier workloads.",
      "Calling .to_dataframe() on an enormous result set without first considering whether the full result actually needs to live in local memory — for huge results, processing in BigQuery via SQL is usually more efficient than pulling everything into pandas first.",
    ],

    exercises: [
      "Write a parameterised query function using bigquery.ScalarQueryParameter and confirm it returns correct, safely-parameterised results.",
      "Create a materialised view summarising one of your hospital tables, then insert a new row into the underlying table and confirm the materialised view updates automatically.",
      "Set up a small budget alert in the GCP console with at least 2 threshold levels.",
      "Build the BigQueryHelper class from the example, then use it to estimate bytes processed for 3 different queries of varying complexity before running them.",
    ],

    resources: [
      {
        objective: "Use BigQuery from Python effectively",
        items: [
          { title: "Google Cloud — BigQuery Client Libraries (Python)", url: "https://cloud.google.com/bigquery/docs/reference/libraries", type: "reference", note: "Official reference for google-cloud-bigquery, including parameterised queries." },
        ],
      },
      {
        objective: "Understand BigQuery materialised views",
        items: [
          { title: "Google Cloud — Introduction to Materialized Views", url: "https://cloud.google.com/bigquery/docs/materialized-views-intro", type: "reference", note: "Official reference covering automatic refresh behaviour and use cases." },
        ],
      },
      {
        objective: "Set up cost monitoring and budgets",
        items: [
          { title: "Google Cloud — Create, Edit, or Delete Budgets and Budget Alerts", url: "https://cloud.google.com/billing/docs/how-to/budgets", type: "reference", note: "Official walkthrough for setting up budget alerts on your project." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 80 — Week 16 Project: BigQuery Analytics Dashboard
  // ============================================================
  {
    id: "W16D5", week: 16, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-02",
    type: "project",
    topic: "Project: BigQuery Analytics Dashboard",
    duration: "3–4 hours",

    objectives: [
      "Load a complete dataset into a properly designed BigQuery warehouse",
      "Apply partitioning, clustering, and a materialised view appropriately",
      "Connect Looker Studio to BigQuery and build a working dashboard",
      "Produce a fully cloud-deployed, portfolio-ready analytics deliverable",
    ],

    introduction: `
This week's project is the most externally impressive deliverable
in Phase 2 so far: a real, live, cloud-hosted dashboard that
anyone with the link can view — built on the full warehouse design
skills from this week. This is exactly the kind of artifact you
can screenshot, share a live link to, and discuss confidently in
an interview.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital Board's Live Performance Dashboard"

This project's end result is like the screen in a hospital
boardroom showing live occupancy, department performance, and
trend lines — built on a properly architected data warehouse
underneath, refreshed automatically, viewable by stakeholders
without needing to understand or touch the underlying SQL at all.
That's exactly the gap between "I can write SQL queries" and "I
can deliver a finished analytics product," and this project closes it.
    `,

    explanation: `
PROJECT BRIEF
================
Build "Hospital BigQuery Analytics Dashboard" with these components:

1. WAREHOUSE DESIGN
   - Migrate your hospital schema (patients, departments,
     prescriptions, lab_results, patient_allergies) into BigQuery
   - Partition lab_results and prescriptions by their date column
   - Cluster both by patient_id
   - Load realistic synthetic data spanning at least 3 months

2. MATERIALISED VIEW
   - Create at least 1 materialised view providing a genuinely
     useful summary (e.g. daily department prescription counts,
     or weekly lab result averages by test type)

3. ANALYTICAL QUERIES
   - Write at least 4 queries answering real questions, reusing
     techniques from Weeks 10-11 (window functions, CTEs) adapted
     to BigQuery syntax
   - Document the estimated bytes processed for each, demonstrating
     cost-awareness

4. PYTHON INTEGRATION
   - A small Python script using google-cloud-bigquery that runs at
     least 2 of your analytical queries and prints/exports the
     results, demonstrating programmatic access alongside the
     console-based work

5. LOOKER STUDIO DASHBOARD (FREE)
   - Connect Looker Studio (lookerstudio.google.com, free) directly
     to your BigQuery project
   - Build at least 3 visualisations: one trend over time (e.g.
     prescriptions per day), one breakdown by category (e.g. by
     department), and one summary metric/scorecard
   - Make the dashboard viewable via a shareable link

DELIVERABLE
==============
1. SQL scripts: schema creation (with partitioning/clustering),
   the materialised view, and all analytical queries
2. The Python integration script
3. A link to the live, shared Looker Studio dashboard
4. README.md: warehouse design decisions, cost considerations, and
   a screenshot of the dashboard alongside the live link
5. Push the SQL/Python portion to GitHub; include the dashboard
   link prominently in the README
    `,

    clinicalConnection: `
A live, shareable hospital performance dashboard — prescriptions
trending over time, broken down by department, with headline
summary metrics — is precisely the kind of artifact real hospital
administrators and quality teams rely on for ongoing decision-
making, built on exactly the partitioned, clustered, materialised-
view-backed warehouse architecture you practiced this week.
    `,

    example: `
-- Example warehouse setup fragment for the project

CREATE TABLE \`victoros-hospital-de.hospital_warehouse.prescriptions\`
(
  prescription_id INT64,
  patient_id INT64,
  drug_name STRING,
  dose_mg NUMERIC,
  prescribed_date DATE
)
PARTITION BY prescribed_date
CLUSTER BY patient_id;

CREATE MATERIALIZED VIEW \`victoros-hospital-de.hospital_warehouse.daily_department_summary\`
AS
SELECT
  d.name AS department,
  pr.prescribed_date,
  COUNT(*) AS total_prescriptions
FROM \`victoros-hospital-de.hospital_warehouse.prescriptions\` pr
JOIN \`victoros-hospital-de.hospital_warehouse.patients\` p
    ON pr.patient_id = p.patient_id
JOIN \`victoros-hospital-de.hospital_warehouse.departments\` d
    ON p.department_id = d.department_id
GROUP BY d.name, pr.prescribed_date;

-- Example analytical query (Week 10-11 window function, BigQuery syntax)
SELECT
  department,
  prescribed_date,
  total_prescriptions,
  SUM(total_prescriptions) OVER (
    PARTITION BY department
    ORDER BY prescribed_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM \`victoros-hospital-de.hospital_warehouse.daily_department_summary\`
ORDER BY department, prescribed_date;

# Python integration script fragment
from google.cloud import bigquery

client = bigquery.Client(project="victoros-hospital-de")
df = client.query("""
    SELECT department, SUM(total_prescriptions) AS total
    FROM \`victoros-hospital-de.hospital_warehouse.daily_department_summary\`
    GROUP BY department
    ORDER BY total DESC
""").to_dataframe()
print(df)
    `,

    commonMistakes: [
      "Forgetting to actually set the Looker Studio dashboard's sharing permissions to be viewable via link, leaving reviewers unable to access it.",
      "Building visualisations on raw tables instead of the materialised view, missing the chance to demonstrate that the warehouse design and the dashboard are actually connected.",
      "Skipping the bytes-processed documentation for the analytical queries, missing the chance to demonstrate cost-awareness as part of the deliverable.",
      "Using unrealistic, obviously fake synthetic data (e.g. perfectly uniform values with no natural variation), making the resulting dashboard look unconvincing as a portfolio piece.",
    ],

    exercises: [
      "Build the complete partitioned, clustered warehouse schema and load at least 3 months of realistic synthetic data.",
      "Create the materialised view and confirm it updates correctly as you add new underlying data.",
      "Write and run the 4 required analytical queries, documenting bytes processed for each.",
      "Connect Looker Studio to BigQuery, build the 3 required visualisations, set sharing to link-viewable, and add the live link to your README.",
    ],

    resources: [
      {
        objective: "Connect and build dashboards in Looker Studio",
        items: [
          { title: "Looker Studio — Official Help Center", url: "https://support.google.com/looker-studio/", type: "reference", note: "Official guide for connecting a BigQuery data source and building charts." },
          { title: "Google Cloud Skills Boost — BigQuery for Data Analysts (Quest)", url: "https://www.cloudskillsboost.google/paths/1", type: "interactive labs", note: "Includes a lab specifically on building dashboards from BigQuery data." },
        ],
      },
      {
        objective: "Reference partitioning, clustering, and materialised views together",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 3: Data Warehouse (BigQuery)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/03-data-warehouse", type: "video + hands-on lab", note: "Your primary reference — replicate its warehouse design patterns in your own project." },
        ],
      },
      {
        objective: "Write a strong project README with a live dashboard link",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure, with a prominent dashboard link near the top." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK16 };
}

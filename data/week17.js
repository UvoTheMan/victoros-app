// ============================================================
// WEEK 17 — dbt + BigQuery Data Warehouse
// Days 81–85 | 5–9 October 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK17 = [

  // ============================================================
  // DAY 81 — Star Schema Fundamentals & dbt Setup
  // ============================================================
  {
    id: "W17D1", week: 17, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-05",
    type: "lesson",
    topic: "Star Schema & Dimensional Modelling Fundamentals; dbt + BigQuery Setup",
    duration: "2–3 hours",

    objectives: [
      "Distinguish fact tables from dimension tables and define a table's grain precisely",
      "Explain Slowly Changing Dimensions (SCD) Type 1 and Type 2",
      "Install dbt Core and connect it to your BigQuery project",
      "Run your first dbt model successfully end to end",
    ],

    introduction: `
Before touching dbt's mechanics, you need the modelling theory
dbt is built around — the Kimball Method (star schema), the
dominant approach for analytics warehouses since the 1990s and
still standard in 2026. Every dbt project you build, including
this week's, implements a star schema. Understanding fact vs
dimension tables FIRST makes every dbt convention you'll see today
(the stg_/int_/fct_/dim_ naming pattern) make immediate sense
instead of feeling like arbitrary jargon.
    `,

    mentalModel: `
MENTAL MODEL — "The Lab Order (Fact) vs the Patient and Test Catalogue (Dimensions)"

A FACT table records MEASURABLE EVENTS — each lab order placed,
each prescription filled, each admission. A DIMENSION table holds
DESCRIPTIVE CONTEXT about the things involved in those events —
who the patient is, what the test catalogue entry means, what date
it happened on. You wouldn't repeat a patient's full demographic
profile on every single lab order row — you store it ONCE in a
patient dimension, and the fact table just references it by ID.
This is exactly why star schema is fast: dimensions are
relatively small and rarely change; fact tables are huge and
append constantly, and queries join the (small) dimensions to the
(huge) facts efficiently.
    `,

    explanation: `
FACT TABLES VS DIMENSION TABLES
====================================
FACT TABLE   : measurable events — orders, lab results, prescriptions,
               admissions. Mostly foreign keys + numeric measures.
DIMENSION TABLE : descriptive context — patients, departments, drugs,
               dates. Mostly descriptive text attributes.

fct_prescriptions
  prescription_id, patient_key, drug_key, date_key, dose_mg

dim_patients
  patient_key, full_name, date_of_birth, gender

dim_drugs
  drug_key, drug_name, drug_class

dim_date
  date_key, full_date, day_of_week, month, year, is_weekday

GRAIN — THE SINGLE MOST IMPORTANT MODELLING DECISION
===========================================================
"Grain" means precisely defining what ONE ROW in a fact table
represents. "One row per prescription" is a clear grain. "One row
per patient per day, summarising all their prescriptions" is a
DIFFERENT grain. Mixing grains within one fact table (some rows
representing single events, others representing summaries) is one
of the most common, most damaging dimensional modelling mistakes
— always define and document the grain explicitly before building
a fact table.

THE DATE DIMENSION — EVERY WAREHOUSE NEEDS ONE
====================================================
dim_date
  date_key, full_date, day_of_week, day_name, month, month_name,
  quarter, year, is_weekday, is_holiday

Rather than recalculating "what day of the week was this" or "was
this a holiday" in every single query, a pre-built date dimension
lets you simply JOIN to it — a small, one-time investment that
pays off in every analytical query going forward.

SURROGATE KEYS VS NATURAL KEYS
===================================
A NATURAL key is a real-world identifier (a patient's national ID
number, a drug's NDC code). A SURROGATE key is an artificial,
warehouse-generated integer (patient_key = 1, 2, 3...) used purely
for joining within the warehouse. Surrogate keys are preferred in
dimensional models because they're stable even if the natural key
changes format, gets reused, or has data quality issues —
dbt-generated surrogate keys are extremely common, and you'll
build one this week.

SLOWLY CHANGING DIMENSIONS (SCD) — TRACKING CHANGE OVER TIME
===================================================================
SCD Type 1 : OVERWRITE the old value — no history kept. Fine when
             history genuinely doesn't matter (e.g. correcting a
             typo in a patient's name).

SCD Type 2 : KEEP HISTORY — insert a new row with a new surrogate
             key when an attribute changes, and mark old/new rows
             with valid_from/valid_to dates and an is_current flag.
             Essential when you need to know "what did this look
             like AT THE TIME of a past event" — e.g. a patient's
             department assignment at the time of a specific
             historical prescription, even if they've since moved
             departments.

SCD Type 2 is the more common, more powerful pattern in real
analytics warehouses, and dbt's snapshot feature (covered later
this week) implements it directly.

INSTALLING DBT AND CONNECTING TO BIGQUERY
===============================================
pip install dbt-core dbt-bigquery

dbt init hospital_analytics
-- Follow the prompts: choose bigquery as the connection type,
-- point it to your GCP project and dataset from Weeks 15-16

cd hospital_analytics
dbt debug
-- Confirms the connection works before you build anything

YOUR FIRST DBT MODEL
=========================
-- models/example/my_first_model.sql
SELECT
  patient_id,
  full_name,
  date_of_birth
FROM \`victoros-hospital-de.hospital_warehouse.patients\`
WHERE date_of_birth IS NOT NULL

dbt run
-- This SQL file becomes an actual BigQuery VIEW (by default)
-- named my_first_model — dbt handles the CREATE VIEW boilerplate
-- entirely; you only ever write the SELECT statement.
    `,

    clinicalConnection: `
A patient dimension table with an SCD Type 2 pattern is exactly
how you'd want to track a patient's department or primary
physician over time for accurate historical reporting — "which
department was this patient under when this specific lab result
was recorded" needs the value AS IT WAS THEN, not as it is today,
which is precisely the gap SCD Type 2 closes that a simple
overwrite (Type 1) cannot.
    `,

    example: `
-- Conceptual star schema for the hospital warehouse, built across
-- this week using dbt models

-- dim_patients (dimension)
CREATE TABLE dim_patients (
  patient_key INT64,        -- surrogate key
  patient_id INT64,          -- natural key from source system
  full_name STRING,
  date_of_birth DATE,
  valid_from DATE,            -- SCD Type 2 tracking
  valid_to DATE,
  is_current BOOL
);

-- dim_date (dimension)
CREATE TABLE dim_date (
  date_key INT64,
  full_date DATE,
  day_of_week STRING,
  month STRING,
  year INT64,
  is_weekday BOOL
);

-- fct_prescriptions (fact, grain = one row per prescription)
CREATE TABLE fct_prescriptions (
  prescription_id INT64,
  patient_key INT64,          -- references dim_patients
  date_key INT64,              -- references dim_date
  drug_name STRING,
  dose_mg NUMERIC
);

-- A typical star schema query: join the small dimensions to the
-- large fact table
SELECT
  p.full_name,
  d.full_date,
  f.drug_name,
  f.dose_mg
FROM fct_prescriptions f
JOIN dim_patients p ON f.patient_key = p.patient_key AND p.is_current = TRUE
JOIN dim_date d ON f.date_key = d.date_key
WHERE d.year = 2026;
    `,

    commonMistakes: [
      "Mixing grains within one fact table (some rows per-event, others pre-aggregated), making the table's meaning ambiguous and queries unreliable.",
      "Using natural keys (like a national ID) directly as join keys throughout the warehouse instead of generating stable surrogate keys, creating fragility if the natural key format ever changes.",
      "Defaulting to SCD Type 1 (overwrite) for attributes where historical accuracy actually matters, silently losing the ability to answer 'what was true at the time' questions.",
      "Skipping dbt debug after dbt init and discovering connection problems only once you try to run a real model.",
    ],

    exercises: [
      "Sketch (on paper or in a markdown file) a star schema for your hospital data: identify which existing tables are facts versus dimensions, and define the grain of each fact table explicitly in one sentence.",
      "Identify one attribute in your schema where SCD Type 2 would genuinely matter, and explain why in 2-3 sentences.",
      "Install dbt Core and dbt-bigquery, run dbt init, and confirm dbt debug reports a successful connection to your Week 15-16 BigQuery project.",
      "Create and run your first dbt model — a simple SELECT against one of your existing BigQuery tables — and confirm the resulting view appears in BigQuery.",
    ],

    resources: [
      {
        objective: "Build the foundational mental model of star schema before touching dbt",
        items: [
          { title: "Datadef.io — Dimensional Modeling: The Definitive Guide", url: "https://datadef.io/guides/en/dimensional-modeling", type: "article", note: "The most complete free guide to dimensional modelling — read fully before continuing, about 90 minutes." },
          { title: "YouTube — BI Data Modeling: Star Schema, Snowflake & Galaxy Explained", url: "https://www.youtube.com/watch?v=TtxfKIe0HuQ", type: "video", note: "~30 min visual explanation — watch this first, before the articles, to build the visual model." },
        ],
      },
      {
        objective: "Get dbt connected to BigQuery and running your first model",
        items: [
          { title: "dbt Official Docs — Quickstart for BigQuery", url: "https://docs.getdbt.com/quickstarts/bigquery", type: "official tutorial", note: "Do this today before starting dbt Fundamentals — connects dbt to BigQuery and runs your first model in under 2 hours." },
          { title: "dbt Learn — dbt Fundamentals (Official Free Course)", url: "https://learn.getdbt.com/courses/dbt-fundamentals", type: "official free course", note: "Your primary resource for the whole week — start it today, genuinely as comprehensive as any paid course." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 82 — dbt Project Structure, Sources & Staging Models
  // ============================================================
  {
    id: "W17D2", week: 17, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-06",
    type: "lesson",
    topic: "dbt Project Structure: sources.yml, Staging Models & the ref() Function",
    duration: "2–3 hours",

    objectives: [
      "Declare raw BigQuery tables as dbt sources",
      "Build staging models that clean and standardise raw source data",
      "Use the ref() function to chain models with managed dependencies",
      "Understand the lineage DAG dbt builds automatically from ref()",
    ],

    introduction: `
Today is where dbt's real value becomes concrete: instead of raw
SQL scripts scattered in files with unclear dependencies, every
transformation becomes a named, version-controlled MODEL, and dbt
automatically tracks exactly which models depend on which others.
This connects directly to Week 13's manual extract/transform/load
separation — dbt formalises and automates that same discipline,
but entirely in SQL, inside the warehouse (the ELT pattern from
Week 13's ETL vs ELT discussion).
    `,

    mentalModel: `
MENTAL MODEL — "The Lab Pipeline With Labelled, Trackable Specimens"

A sources.yml declaration is like formally registering "this
specific lab analyser is an official, trusted input to our
pipeline" — not just any data, but a DECLARED, documented source.
A staging model is the first cleaning step every specimen goes
through, standardised the same way every time, BEFORE any further
analysis happens. ref() is like attaching a tracking label to
each specimen so that if the raw analyser is ever swapped out,
every downstream step that referenced it through the label
updates automatically — you never have to hunt down and manually
fix hardcoded references scattered everywhere.
    `,

    explanation: `
DECLARING SOURCES
=====================
-- models/staging/sources.yml
version: 2

sources:
  - name: hospital_warehouse
    database: victoros-hospital-de
    schema: hospital_warehouse
    tables:
      - name: patients
      - name: prescriptions
      - name: lab_results
      - name: departments

This tells dbt exactly which raw BigQuery tables are valid inputs
— a single declared, documented entry point rather than scattered
hardcoded table references throughout your SQL.

REFERENCING A SOURCE IN A MODEL
====================================
-- models/staging/stg_patients.sql
SELECT
  patient_id,
  TRIM(full_name) AS full_name,
  date_of_birth,
  department_id
FROM {{ source('hospital_warehouse', 'patients') }}
WHERE full_name IS NOT NULL

{{ source(...) }} is Jinja templating (dbt is built on top of
Jinja, a Python templating engine) — at run time, dbt replaces
this with the actual fully-qualified BigQuery table reference.

STAGING MODELS — THE FIRST CLEANING LAYER
================================================
Staging models (prefixed stg_) do LIGHT cleaning only: renaming,
basic type casting, simple filtering — directly continuing Week
13's transform-step patterns, just expressed in SQL instead of
pandas:

-- models/staging/stg_prescriptions.sql
SELECT
  prescription_id,
  patient_id,
  TRIM(drug_name) AS drug_name,
  CAST(dose_mg AS NUMERIC) AS dose_mg,
  prescribed_date
FROM {{ source('hospital_warehouse', 'prescriptions') }}
WHERE dose_mg > 0

THE ref() FUNCTION — CHAINING MODELS SAFELY
==================================================
-- models/intermediate/int_patient_prescriptions.sql
SELECT
  p.patient_id,
  p.full_name,
  pr.drug_name,
  pr.dose_mg,
  pr.prescribed_date
FROM {{ ref('stg_patients') }} p
JOIN {{ ref('stg_prescriptions') }} pr
  ON p.patient_id = pr.patient_id

NEVER reference another model's raw table name directly — always
use ref(). This is what lets dbt automatically determine the
correct RUN ORDER (stg_patients and stg_prescriptions must run
before int_patient_prescriptions) and build the lineage graph.

THE LINEAGE DAG
===================
dbt docs generate
dbt docs serve

This generates an interactive website showing every model, its
columns, its description, and — critically — a visual DAG showing
exactly which models feed into which others, built automatically
from your ref() calls. This is genuinely one of dbt's most valuable
features: instant, always-accurate documentation of your entire
transformation pipeline's dependencies.

RUNNING YOUR MODELS
========================
dbt run                      -- runs all models, in dependency order
dbt run --select stg_patients -- runs just one specific model
dbt run --select +int_patient_prescriptions
                               -- runs a model AND everything it depends on
    `,

    clinicalConnection: `
The ref() dependency pattern mirrors exactly how a hospital's lab
results system should reference "the current verified patient
record" rather than a frozen, potentially-stale copy — if the
patient record gets corrected upstream, everything downstream
that properly REFERENCES it (rather than copying it) reflects the
correction automatically, the same way dbt's lineage propagates
changes through the dependency chain.
    `,

    example: `
-- Complete mini staging layer for the hospital warehouse

-- models/staging/sources.yml
version: 2
sources:
  - name: hospital_warehouse
    database: victoros-hospital-de
    schema: hospital_warehouse
    tables:
      - name: patients
      - name: prescriptions
      - name: departments

-- models/staging/stg_patients.sql
SELECT
  patient_id,
  TRIM(full_name) AS full_name,
  date_of_birth,
  department_id
FROM {{ source('hospital_warehouse', 'patients') }}
WHERE full_name IS NOT NULL

-- models/staging/stg_prescriptions.sql
SELECT
  prescription_id,
  patient_id,
  TRIM(drug_name) AS drug_name,
  CAST(dose_mg AS NUMERIC) AS dose_mg,
  prescribed_date
FROM {{ source('hospital_warehouse', 'prescriptions') }}
WHERE dose_mg > 0

-- models/staging/stg_departments.sql
SELECT
  department_id,
  TRIM(name) AS department_name
FROM {{ source('hospital_warehouse', 'departments') }}

-- models/intermediate/int_patient_department.sql
SELECT
  p.patient_id,
  p.full_name,
  d.department_name
FROM {{ ref('stg_patients') }} p
JOIN {{ ref('stg_departments') }} d
  ON p.department_id = d.department_id

-- Run everything in correct dependency order automatically
-- dbt run
    `,

    commonMistakes: [
      "Referencing a raw BigQuery table name directly in a downstream model instead of using ref(), breaking dbt's ability to determine correct run order and build accurate lineage.",
      "Putting heavy transformation logic (complex joins, aggregations) into staging models, when staging should stay lightweight — save heavier logic for intermediate and mart models.",
      "Forgetting to declare a table in sources.yml before trying to reference it with source(), causing a compilation error.",
      "Running dbt run without first checking dbt docs generate's lineage graph to confirm the dependency structure actually matches your mental model of the pipeline.",
    ],

    exercises: [
      "Declare at least 3 of your hospital tables in a sources.yml file.",
      "Build staging models (stg_) for each, applying only light cleaning (trimming, casting, simple filtering).",
      "Build one intermediate model that joins 2 staging models together using ref().",
      "Run dbt docs generate and dbt docs serve, and explore the generated lineage DAG to confirm it matches your intended dependency structure.",
    ],

    resources: [
      {
        objective: "Master sources, staging models, and ref() through the official course",
        items: [
          { title: "dbt Learn — dbt Fundamentals (Official Free Course)", url: "https://learn.getdbt.com/courses/dbt-fundamentals", type: "official free course", note: "Continue this course — covers sources, staging, and ref() in dedicated modules today." },
          { title: "dbt Official Docs — Sources", url: "https://docs.getdbt.com/docs/build/sources", type: "reference", note: "Official reference for declaring and using sources." },
        ],
      },
      {
        objective: "See dbt + BigQuery in a complete real pipeline context",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 4: Analytics Engineering (dbt)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/04-analytics-engineering", type: "video + hands-on lab", note: "Shows dbt with BigQuery in a complete pipeline context, not in isolation — work through this alongside the official course." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 83 — Materialisations & Intermediate Models
  // ============================================================
  {
    id: "W17D3", week: 17, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-07",
    type: "lesson",
    topic: "Materialisations: View, Table, Incremental & Ephemeral",
    duration: "2–3 hours",

    objectives: [
      "Choose the appropriate materialisation strategy for different model types",
      "Configure materialisations at the model and project level",
      "Build an incremental model that loads only new/changed records",
      "Understand the cost and performance tradeoffs of each materialisation",
    ],

    introduction: `
Every dbt model needs to become something real in BigQuery — but
HOW it becomes real is a choice with real performance and cost
implications, directly connecting back to Week 13's incremental-
vs-full-refresh decision and Week 16's bytes-processed cost
awareness. Today you learn dbt's 4 materialisation strategies and
build your first incremental model — the dbt-native way of
implementing exactly the pattern you built manually in Python
during Week 13.
    `,

    mentalModel: `
MENTAL MODEL — "Printing a Fresh Report vs Keeping a Running Ledger"

A VIEW materialisation is like asking for a fresh report
calculated on demand every time someone looks — always current,
but recalculated (and re-billed) every single read. A TABLE
materialisation is like printing that report once and filing it —
fast to read repeatedly, but stale until explicitly reprinted. An
INCREMENTAL materialisation is like a running ledger that only
adds new entries each time, never starting over from scratch —
the most efficient choice for large, continuously growing fact
tables.
    `,

    explanation: `
THE 4 MATERIALISATION TYPES
================================
VIEW (the default)
  Creates a BigQuery VIEW — no data is actually stored, the query
  re-runs every time it's read. Good for lightweight staging
  models that are cheap to compute and don't need to be fast to
  query repeatedly.

TABLE
  Creates an actual BigQuery TABLE — data is computed once at
  dbt run time and stored. Good for models that are expensive to
  compute but read frequently — paying the compute cost once
  instead of on every read.

INCREMENTAL
  Like TABLE, but on subsequent runs only processes NEW or CHANGED
  rows, appending/merging rather than rebuilding from scratch.
  Essential for large fact tables that grow continuously — directly
  analogous to Week 13's incremental loading pattern, but
  implemented natively in dbt+SQL.

EPHEMERAL
  Not materialised as a database object at all — inlined directly
  into the SQL of whatever model references it, like a CTE. Useful
  for small, reusable logic fragments that don't need their own
  queryable table or view.

SETTING MATERIALISATION
============================
-- Per-model, in the SQL file itself:
{{ config(materialized='table') }}

SELECT ...

-- Or project-wide defaults, in dbt_project.yml:
models:
  hospital_analytics:
    staging:
      +materialized: view
    intermediate:
      +materialized: ephemeral
    marts:
      +materialized: table

A common convention: staging = view (cheap, lightweight),
intermediate = ephemeral (inlined, no need for a standalone
object), marts = table or incremental (the final, frequently-
queried analytical layer).

BUILDING AN INCREMENTAL MODEL
==================================
-- models/marts/fct_prescriptions.sql
{{
  config(
    materialized='incremental',
    unique_key='prescription_id'
  )
}}

SELECT
  prescription_id,
  patient_id,
  drug_name,
  dose_mg,
  prescribed_date
FROM {{ ref('stg_prescriptions') }}

{% if is_incremental() %}
  WHERE prescribed_date > (SELECT MAX(prescribed_date) FROM {{ this }})
{% endif %}

{% if is_incremental() %} ... {% endif %} is Jinja conditional
logic: this WHERE clause only applies on subsequent runs (not the
very first build), and {{ this }} refers to the model's own
already-built table — directly implementing the "check the
destination's latest timestamp" pattern from Week 13, but dbt
handles the bookkeeping for you.

unique_key ENABLES MERGE-STYLE UPSERTS
============================================
Setting unique_key tells dbt to MERGE (upsert) incoming rows
rather than just appending — if a row with that key already
exists, it's updated; otherwise inserted. This is dbt's built-in
equivalent of the ON CONFLICT upsert pattern from Week 12-13.
    `,

    clinicalConnection: `
Choosing TABLE materialisation for a frequently-viewed department
summary dashboard, but INCREMENTAL for the underlying
ever-growing prescriptions fact table, mirrors exactly the
distinction between a small reference list (departments rarely
change, recompute cheaply) and a continuously growing transactional
log (prescriptions accumulate daily and must never be fully
reprocessed every single run) — the same engineering judgment from
Week 13, now expressed as a one-line dbt configuration choice.
    `,

    example: `
-- staging model, default view materialisation (cheap, no config needed)
-- models/staging/stg_prescriptions.sql
SELECT
  prescription_id,
  patient_id,
  TRIM(drug_name) AS drug_name,
  CAST(dose_mg AS NUMERIC) AS dose_mg,
  prescribed_date
FROM {{ source('hospital_warehouse', 'prescriptions') }}

-- mart model, incremental materialisation for the large fact table
-- models/marts/fct_prescriptions.sql
{{
  config(
    materialized='incremental',
    unique_key='prescription_id'
  )
}}

SELECT
  prescription_id,
  patient_id,
  drug_name,
  dose_mg,
  prescribed_date
FROM {{ ref('stg_prescriptions') }}

{% if is_incremental() %}
  WHERE prescribed_date > (SELECT MAX(prescribed_date) FROM {{ this }})
{% endif %}

-- A small, cheap reference table, explicit TABLE materialisation
-- models/marts/dim_departments.sql
{{ config(materialized='table') }}

SELECT department_id, TRIM(name) AS department_name
FROM {{ source('hospital_warehouse', 'departments') }}

-- Build, then re-run to observe incremental behaviour
-- dbt run --full-refresh    (forces a complete rebuild, ignoring incremental logic)
-- dbt run                    (subsequent runs, only new rows processed)
    `,

    commonMistakes: [
      "Using TABLE materialisation for every model 'to be safe,' incurring unnecessary full recomputation cost for models that would have been fine and cheaper as views.",
      "Building an incremental model without a unique_key, causing duplicate rows to accumulate on each run instead of proper merge/upsert behaviour.",
      "Forgetting the is_incremental() Jinja guard, causing the WHERE clause to apply even on the very first full build, which can incorrectly skip historical data that should have been included.",
      "Never running --full-refresh after a significant logic change to an incremental model, leaving it in an inconsistent state that mixes old and new logic across different rows.",
    ],

    exercises: [
      "Convert one of your existing models to use explicit table materialisation via config(), and confirm the resulting BigQuery object is a table, not a view.",
      "Build an incremental model with a unique_key on one of your fact-like tables (prescriptions or lab_results), using the is_incremental() Jinja pattern.",
      "Run the incremental model once, add new source rows, run it again, and confirm only the new rows were processed (check row counts before/after).",
      "Set project-wide materialisation defaults in dbt_project.yml following the staging=view / intermediate=ephemeral / marts=table convention.",
    ],

    resources: [
      {
        objective: "Master materialisation strategies through the official course",
        items: [
          { title: "dbt Learn — dbt Fundamentals (Official Free Course)", url: "https://learn.getdbt.com/courses/dbt-fundamentals", type: "official free course", note: "Continue — covers materialisations in dedicated modules with hands-on exercises." },
          { title: "dbt Official Docs — Materializations", url: "https://docs.getdbt.com/docs/build/materializations", type: "reference", note: "Official reference for all 4 materialisation types and their configuration options." },
        ],
      },
      {
        objective: "Build incremental models correctly",
        items: [
          { title: "dbt Official Docs — Incremental Models", url: "https://docs.getdbt.com/docs/build/incremental-models", type: "reference", note: "Official reference covering is_incremental(), unique_key, and merge strategies in depth." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 84 — Testing, Documentation & Marts
  // ============================================================
  {
    id: "W17D4", week: 17, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-08",
    type: "lesson",
    topic: "dbt Testing, Documentation & Building Marts (fct_ + dim_)",
    duration: "2–3 hours",

    objectives: [
      "Apply built-in dbt tests: not_null, unique, accepted_values, relationships",
      "Write a custom singular test for business-specific logic",
      "Document models and columns with description fields",
      "Build final mart-layer fact and dimension models for consumption",
    ],

    introduction: `
This is the day dbt's "tested, documented, trustworthy" promise
from the very start of the week becomes real and verifiable. Every
model you've built so far works — but "works" and "verified
correct, automatically, every time you run it" are different
things. Today closes that gap, and you'll finish by building the
actual fct_/dim_ mart models — the final, analyst-facing layer of
your star schema.
    `,

    mentalModel: `
MENTAL MODEL — "The Automated Quality Control Checklist, Not a One-Time Inspection"

dbt tests are like an automated quality control checklist that
runs on EVERY batch, not a one-time manual inspection when the
pipeline was first built. "No null patient IDs," "every drug_name
must come from an approved list," "every patient_key in the fact
table must exist in the patient dimension" — these checks run
automatically every single time you run dbt, catching data quality
regressions the moment they appear rather than discovering them
weeks later in a stakeholder's wrong-looking report.
    `,

    explanation: `
BUILT-IN GENERIC TESTS
==========================
-- models/marts/schema.yml
version: 2

models:
  - name: fct_prescriptions
    columns:
      - name: prescription_id
        tests:
          - unique
          - not_null
      - name: patient_key
        tests:
          - not_null
          - relationships:
              to: ref('dim_patients')
              field: patient_key

  - name: dim_patients
    columns:
      - name: patient_key
        tests:
          - unique
          - not_null
      - name: gender
        tests:
          - accepted_values:
              values: ['M', 'F', 'Other', 'Unknown']

not_null         : column must never be NULL
unique           : column must contain no duplicate values
accepted_values   : column must only contain values from a defined list
relationships     : every value must exist in a referenced model
                     (dbt's equivalent of a foreign key constraint check)

RUNNING TESTS
=================
dbt test                       -- runs every defined test
dbt test --select fct_prescriptions   -- tests just one model
dbt build                       -- runs models AND tests together, in
                                    dependency order, stopping downstream
                                    builds if an upstream test fails

CUSTOM SINGULAR TESTS
==========================
For business logic generic tests can't express:

-- tests/assert_no_negative_doses.sql
SELECT *
FROM {{ ref('fct_prescriptions') }}
WHERE dose_mg <= 0

A singular test is just a SQL query that should return ZERO ROWS
if everything is correct — if it returns any rows, the test fails,
and those rows ARE the actual failing records, immediately useful
for debugging.

DOCUMENTATION
=================
models:
  - name: fct_prescriptions
    description: "One row per prescription event. Grain: one row per prescription_id."
    columns:
      - name: dose_mg
        description: "Prescribed dose in milligrams. Always positive — see assert_no_negative_doses test."

dbt docs generate
dbt docs serve

These description fields populate the auto-generated documentation
site alongside the lineage DAG from Day 2 — every model and column
self-documents directly from the YAML, staying in sync with the
code by construction rather than drifting out of date like a
separate wiki page would.

BUILDING THE FINAL MART MODELS
====================================
-- models/marts/dim_patients.sql
{{ config(materialized='table') }}

SELECT
  ROW_NUMBER() OVER (ORDER BY patient_id) AS patient_key,
  patient_id,
  full_name,
  date_of_birth
FROM {{ ref('stg_patients') }}

-- models/marts/fct_prescriptions.sql
{{ config(materialized='incremental', unique_key='prescription_id') }}

SELECT
  pr.prescription_id,
  dp.patient_key,
  pr.drug_name,
  pr.dose_mg,
  pr.prescribed_date
FROM {{ ref('stg_prescriptions') }} pr
JOIN {{ ref('dim_patients') }} dp ON pr.patient_id = dp.patient_id

{% if is_incremental() %}
  WHERE pr.prescribed_date > (SELECT MAX(prescribed_date) FROM {{ this }})
{% endif %}

Note ROW_NUMBER() OVER (ORDER BY patient_id) generating a clean
surrogate key — directly applying Day 1's surrogate-key concept,
implemented with a window function from Week 10.
    `,

    clinicalConnection: `
A relationships test confirming every patient_key in
fct_prescriptions actually exists in dim_patients is the automated
data-quality equivalent of a hospital's billing system rejecting
a charge entry that references a patient ID nobody can find in the
master patient index — catching the inconsistency immediately and
automatically, rather than discovering a broken reference weeks
later during a financial reconciliation.
    `,

    example: `
-- Complete mini mart layer with tests and documentation

-- models/marts/schema.yml
version: 2

models:
  - name: dim_patients
    description: "One row per unique patient. Surrogate key: patient_key."
    columns:
      - name: patient_key
        description: "Warehouse-generated surrogate key."
        tests: [unique, not_null]
      - name: patient_id
        description: "Natural key from the source system."
        tests: [not_null]

  - name: fct_prescriptions
    description: "One row per prescription event. Grain: one row per prescription_id."
    columns:
      - name: prescription_id
        tests: [unique, not_null]
      - name: patient_key
        tests:
          - not_null
          - relationships:
              to: ref('dim_patients')
              field: patient_key
      - name: dose_mg
        description: "Prescribed dose in milligrams. Always positive."

-- tests/assert_no_negative_doses.sql (custom singular test)
SELECT * FROM {{ ref('fct_prescriptions') }} WHERE dose_mg <= 0

-- models/marts/dim_patients.sql
{{ config(materialized='table') }}
SELECT
  ROW_NUMBER() OVER (ORDER BY patient_id) AS patient_key,
  patient_id,
  full_name,
  date_of_birth
FROM {{ ref('stg_patients') }}

-- Build everything and run all tests together
-- dbt build
-- dbt docs generate && dbt docs serve
    `,

    commonMistakes: [
      "Adding tests only as an afterthought at the very end of a project instead of writing them alongside each model as it's built, missing the chance to catch issues immediately during development.",
      "Using a generic relationships test where a more specific custom singular test would actually express the real business rule more precisely.",
      "Writing description fields that just restate the column name, adding no real information for someone reading the generated documentation later.",
      "Forgetting that a failed test on an upstream model, when using dbt build, will skip downstream models that depend on it — and not realising why those downstream models 'didn't run' on a build with test failures.",
    ],

    exercises: [
      "Add not_null and unique tests to the primary key column of every model you've built this week.",
      "Add a relationships test ensuring a foreign-key-style column in a fact model correctly references its dimension model.",
      "Write one custom singular test expressing a real business rule (e.g. no negative doses, no future-dated prescriptions) and confirm it correctly catches a deliberately bad row you insert for testing.",
      "Add description fields to at least 3 models and 5 columns, then run dbt docs generate and dbt docs serve to view the result.",
    ],

    resources: [
      {
        objective: "Master dbt testing through the official course and docs",
        items: [
          { title: "dbt Learn — dbt Fundamentals (Official Free Course)", url: "https://learn.getdbt.com/courses/dbt-fundamentals", type: "official free course", note: "Finish this course today — covers testing and documentation in dedicated modules." },
          { title: "dbt Official Docs — Data Tests", url: "https://docs.getdbt.com/docs/build/data-tests", type: "reference", note: "Official reference for all built-in generic tests and custom singular tests." },
        ],
      },
      {
        objective: "Explore advanced testing with dbt-expectations",
        items: [
          { title: "dbt Learn — Advanced dbt (Official Free Course)", url: "https://learn.getdbt.com/", type: "official free course", note: "Start this if time allows — covers the dbt-expectations package (50+ additional tests) and advanced patterns." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 85 — Week 17 Project: dbt Transform Raw → Analytics Layer
  // ============================================================
  {
    id: "W17D5", week: 17, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-09",
    type: "project",
    topic: "Project: dbt Project — Transform Raw → Analytics Layer",
    duration: "4–6 hours",

    objectives: [
      "Build a complete dbt project implementing a full star schema",
      "Apply staging, intermediate, and mart layers with appropriate materialisations",
      "Write a comprehensive test suite covering keys and business rules",
      "Generate and review full project documentation",
    ],

    introduction: `
This week's project brings the entire dbt + star schema arc
together: your raw BigQuery tables (Week 16) get transformed,
tested, and documented into a genuine analytics-ready star schema,
exactly the deliverable that defines the "analytics engineer" role
specifically — one of the fastest-growing, most in-demand titles
in the modern data stack you've been building toward all of
Phase 2.
    `,

    mentalModel: `
MENTAL MODEL — "From Raw Hospital Records to a Published Research Dataset"

This project's arc — raw operational tables in, tested and
documented analytics tables out — mirrors exactly the process of
turning a hospital's messy operational records into a clean,
de-identified, well-documented research dataset ready for analysis:
every field defined, every relationship verified, every
transformation step traceable, suitable for someone who wasn't
involved in building it to trust and use confidently.
    `,

    explanation: `
PROJECT BRIEF
================
Build "Hospital Analytics Warehouse" as a complete dbt project:

1. SOURCES
   - Declare all relevant raw tables (patients, prescriptions,
     lab_results, departments) in sources.yml

2. STAGING LAYER (stg_)
   - One staging model per source table, light cleaning only,
     default view materialisation

3. INTERMEDIATE LAYER (int_)
   - At least 1 intermediate model combining 2+ staging models,
     ephemeral materialisation

4. MART LAYER (fct_ / dim_)
   - At least 2 dimension models (e.g. dim_patients, dim_departments)
     with generated surrogate keys, table materialisation
   - At least 1 fact model (e.g. fct_prescriptions) at a clearly
     defined grain, incremental materialisation with a unique_key

5. TESTING
   - not_null and unique tests on every primary/surrogate key
   - At least 1 relationships test connecting a fact to a dimension
   - At least 1 custom singular test expressing a real business rule

6. DOCUMENTATION
   - description fields on every model and at least 3 key columns
     per model
   - Generated and reviewed via dbt docs generate / dbt docs serve

7. VERIFICATION
   - dbt build runs successfully end to end with all tests passing
   - Query the final mart tables directly in BigQuery to confirm
     the star schema joins correctly and produces sensible results

DELIVERABLE
==============
1. The complete dbt project (models/, tests/, dbt_project.yml,
   sources.yml, schema.yml files)
2. A screenshot or export of the dbt docs lineage DAG
3. README.md: project structure, star schema design (grain
   definitions for each fact table), and how to run it
4. Push to GitHub, ideally as a new dedicated repo given dbt
   projects have their own standard structure
    `,

    clinicalConnection: `
This project is structurally identical to what a hospital's
analytics or research informatics team would build to support
ongoing quality reporting and research — transforming raw,
operational EHR-adjacent tables into a tested, documented,
trustworthy analytical layer that clinicians, administrators, or
researchers can query confidently without needing to understand
or re-verify the underlying transformation logic themselves.
    `,

    example: `
-- Example final project structure (abbreviated)

hospital_analytics/
├── dbt_project.yml
├── models/
│   ├── staging/
│   │   ├── sources.yml
│   │   ├── stg_patients.sql
│   │   ├── stg_prescriptions.sql
│   │   ├── stg_lab_results.sql
│   │   └── stg_departments.sql
│   ├── intermediate/
│   │   └── int_patient_department.sql
│   └── marts/
│       ├── schema.yml
│       ├── dim_patients.sql
│       ├── dim_departments.sql
│       └── fct_prescriptions.sql
└── tests/
    └── assert_no_negative_doses.sql

-- models/marts/fct_prescriptions.sql (grain: one row per prescription)
{{ config(materialized='incremental', unique_key='prescription_id') }}

SELECT
  pr.prescription_id,
  dp.patient_key,
  pr.drug_name,
  pr.dose_mg,
  pr.prescribed_date
FROM {{ ref('stg_prescriptions') }} pr
JOIN {{ ref('dim_patients') }} dp ON pr.patient_id = dp.patient_id

{% if is_incremental() %}
  WHERE pr.prescribed_date > (SELECT MAX(prescribed_date) FROM {{ this }})
{% endif %}

-- Verification query, run directly in BigQuery after dbt build
SELECT
  d.department_name,
  COUNT(*) AS total_prescriptions
FROM fct_prescriptions f
JOIN dim_patients p ON f.patient_key = p.patient_key
JOIN dim_departments d ON p.department_id = d.department_id
GROUP BY d.department_name
ORDER BY total_prescriptions DESC;
    `,

    commonMistakes: [
      "Building mart models that reference raw source tables directly instead of going through the staging -> intermediate -> mart chain via ref(), losing the lineage benefits the whole structure exists to provide.",
      "Defining a fact table's grain inconsistently with what the actual SQL produces (e.g. accidentally introducing row duplication through a join), undermining the entire star schema's reliability.",
      "Treating documentation as optional polish rather than a graded deliverable component — the brief explicitly requires it, and it's genuinely valuable for anyone reviewing the project.",
      "Skipping the final BigQuery verification query and trusting dbt build's green checkmarks alone as proof the star schema actually answers real questions correctly.",
    ],

    exercises: [
      "Build the complete staging layer for all 4 source tables.",
      "Build the intermediate and mart layers per the brief, with correct materialisations and a clearly defined fact table grain.",
      "Write and pass the complete test suite (key tests, relationships test, custom singular test) via dbt build.",
      "Generate and review the documentation site, then run a verification query directly in BigQuery and write the README.",
    ],

    resources: [
      {
        objective: "Reference the complete dbt + BigQuery workflow for this capstone",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 4: Analytics Engineering (dbt)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/04-analytics-engineering", type: "video + hands-on lab", note: "Follow its complete project example closely — directly applicable to this capstone's structure." },
          { title: "dbt Learn — Advanced dbt (Official Free Course)", url: "https://learn.getdbt.com/", type: "official free course", note: "Reference for incremental models, testing, and documentation patterns used throughout this project." },
        ],
      },
      {
        objective: "Validate the star schema design against best practices",
        items: [
          { title: "Kimball Group — Dimensional Modelling Techniques", url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/", type: "reference", note: "Re-check your grain definitions and dimension design against the original canonical reference before finalising." },
        ],
      },
      {
        objective: "Write a strong project README",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure, with a dedicated section explaining each fact table's grain." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK17 };
}
